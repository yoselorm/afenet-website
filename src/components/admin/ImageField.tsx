"use client";

import { useRef, useState } from "react";

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

// Image picker: uploads the chosen file and keeps its URL in a hidden input (or reports it via onChange)
export default function ImageField({
  name,
  label,
  value: initial = "",
  onChange,
  help,
}: {
  name?: string;
  label: string;
  value?: string;
  onChange?: (url: string) => void;
  help?: string;
}) {
  const [value, setValue] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const update = (url: string) => {
    setValue(url);
    onChange?.(url);
  };

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      update(await uploadImage(file));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="mb-3">
      <label className="form-label">{label}</label>
      <div className="image-field">
        <div className="image-field-preview">
          {value ? <img src={value} alt="" /> : <i className="fa-regular fa-image"></i>}
        </div>
        <div className="flex-grow-1">
          <div className="d-flex gap-2 flex-wrap mb-2">
            <button type="button" className="btn btn-outline-primary btn-sm" disabled={busy} onClick={() => fileRef.current?.click()}>
              {busy ? "Uploading…" : value ? "Change image" : "Upload image"}
            </button>
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
          {error && <div className="text-danger small mt-1">{error}</div>}
        </div>
      </div>
      <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => handleFile(e.target.files?.[0])} />
      {name && <input type="hidden" name={name} value={value} />}
    </div>
  );
}
