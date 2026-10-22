"use client";

import { useRef, useState } from "react";
import ImageCropper from "./ImageCropper";
import { toast } from "./Toaster";

// Photos are shrunk in the browser before upload: hosts like Vercel reject requests over ~4.5 MB,
// and the server would resize them to this width anyway
const MAX_WIDTH = 2400;
const SHRINK_TYPES = ["image/jpeg", "image/png", "image/webp"];

async function shrink(file: File): Promise<File> {
  if (!SHRINK_TYPES.includes(file.type)) return file;
  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) return file;
  if (bitmap.width <= MAX_WIDTH && file.size < 1_500_000) return file;

  const scale = Math.min(1, MAX_WIDTH / bitmap.width);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  // PNGs may have transparency (logos), so they stay PNG; photos become JPEG
  const type = file.type === "image/png" ? "image/png" : "image/jpeg";
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, 0.85));
  if (!blob) return file;
  const name = file.name.replace(/\.\w+$/, type === "image/png" ? ".png" : ".jpg");
  return new File([blob], name, { type });
}

export async function uploadImage(original: File): Promise<string> {
  const file = await shrink(original);
  const body = new FormData();
  body.append("file", file);
  const res = await fetch("/api/admin/upload", { method: "POST", body });
  const data = await res.json().catch(() => ({}));
  if (res.status === 413) throw new Error("This image is too large. Please use a smaller file.");
  if (!res.ok) throw new Error(data.error || `Upload failed (error ${res.status})`);
  return data.url;
}

// Image picker. When `aspect` is given (the shape of the space on the website), new and existing
// photos open in a crop editor first. The final URL is kept in a hidden input (or sent to onChange).
export default function ImageField({
  name,
  label,
  value: initial = "",
  onChange,
  help,
  aspect,
}: {
  name?: string;
  label: string;
  value?: string;
  onChange?: (url: string) => void;
  help?: string;
  aspect?: number;
}) {
  const [value, setValue] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [cropPng, setCropPng] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const update = (url: string) => {
    setValue(url);
    onChange?.(url);
  };

  async function upload(file: File) {
    setBusy(true);
    setError("");
    try {
      update(await uploadImage(file));
      toast("Image uploaded. Remember to save.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  async function handleFile(file: File | undefined) {
    if (!file) return;
    // Copy the file into memory before clearing the picker; some browsers release the original
    const copy = new File([await file.arrayBuffer()], file.name, { type: file.type });
    if (fileRef.current) fileRef.current.value = "";
    // Photos go through the crop editor; GIFs and SVGs (animations, logos) are uploaded as they are
    if (aspect && SHRINK_TYPES.includes(copy.type)) {
      setCropPng(copy.type === "image/png");
      setCropSrc(URL.createObjectURL(copy));
    } else upload(copy);
  }

  function closeCropper() {
    if (cropSrc?.startsWith("blob:")) URL.revokeObjectURL(cropSrc);
    setCropSrc(null);
  }

  const canRecrop = aspect && value && !/\.(svg|gif)(\?|$)/i.test(value);

  return (
    <div className="mb-3">
      <label className="form-label">{label}</label>
      <div className="image-field">
        <div className="image-field-preview" style={aspect ? { aspectRatio: aspect, width: aspect >= 1 ? 160 : 96 } : undefined}>
          {value ? <img src={value} alt="" style={aspect ? { objectFit: "cover" } : undefined} /> : <i className="fa-regular fa-image"></i>}
        </div>
        <div className="flex-grow-1">
          <div className="d-flex gap-2 flex-wrap mb-2">
            <button type="button" className="btn btn-outline-primary btn-sm" disabled={busy} onClick={() => fileRef.current?.click()}>
              {busy ? "Uploading…" : value ? "Change image" : "Upload image"}
            </button>
            {canRecrop && (
              <button type="button" className="btn btn-outline-primary btn-sm" disabled={busy} onClick={() => {
                  setCropPng(/\.png(\?|$)/i.test(value));
                  setCropSrc(value);
                }}>
                <i className="fa-solid fa-crop-simple me-1"></i> Adjust
              </button>
            )}
            {value && (
              <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => update("")}>
                Remove
              </button>
            )}
          </div>
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="…or paste an image URL"
            value={value}
            onChange={(e) => update(e.target.value)}
          />
          {help && <div className="form-text">{help}</div>}
          {error && <div className="alert alert-danger py-2 px-3 mt-2 mb-0 small">{error}</div>}
        </div>
      </div>
      <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => handleFile(e.target.files?.[0])} />
      {name && <input type="hidden" name={name} value={value} />}
      {cropSrc && aspect && (
        <ImageCropper
          src={cropSrc}
          aspect={aspect}
          keepTransparency={cropPng}
          onCancel={closeCropper}
          onDone={async (file) => {
            closeCropper();
            await upload(file);
          }}
        />
      )}
    </div>
  );
}
