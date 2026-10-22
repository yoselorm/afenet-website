"use client";

import { useState } from "react";
import Cropper, { type Area } from "react-easy-crop";

const MAX_WIDTH = 2400;
// PNG files are much larger than JPEG; cut-outs are shown small, so they don't need to be wide
const MAX_PNG_WIDTH = 1200;

// Pop-up editor: the frame has the same shape as the space on the website, and the
// person drags / zooms to choose which part of the photo shows there.
export default function ImageCropper({
  src,
  aspect,
  keepTransparency = false,
  onCancel,
  onDone,
}: {
  src: string;
  aspect: number;
  /** Output PNG instead of JPEG, so cut-out images keep their transparent background */
  keepTransparency?: boolean;
  onCancel: () => void;
  onDone: (file: File) => void;
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [area, setArea] = useState<Area | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function save() {
    if (!area) return;
    setBusy(true);
    setError("");
    try {
      onDone(await cropToFile(src, area, keepTransparency));
    } catch {
      setError("Couldn't prepare this image. Please upload the original file again.");
      setBusy(false);
    }
  }

  return (
    <div className="cropper-backdrop" role="dialog" aria-modal="true" aria-label="Adjust image">
      <div className="cropper-dialog">
        <div className="cropper-header">
          <h2 className="h5 m-0">Adjust image</h2>
          <span className="text-muted small">Drag to move · scroll or use the slider to zoom</span>
        </div>
        <div className="cropper-area">
          <Cropper
            image={src}
            crop={crop}
            zoom={zoom}
            maxZoom={4}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={(_, pixels) => setArea(pixels)}
          />
        </div>
        <div className="cropper-footer">
          <div className="d-flex align-items-center gap-2 flex-grow-1">
            <i className="fa-solid fa-magnifying-glass-minus text-muted"></i>
            <input
              type="range"
              className="form-range"
              min={1}
              max={4}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              aria-label="Zoom"
            />
            <i className="fa-solid fa-magnifying-glass-plus text-muted"></i>
          </div>
          {error && <div className="text-danger small w-100">{error}</div>}
          <div className="d-flex gap-2">
            <button type="button" className="btn btn-light" onClick={onCancel} disabled={busy}>
              Cancel
            </button>
            <button type="button" className="btn btn-primary" onClick={save} disabled={busy || !area}>
              {busy ? "Uploading…" : "Use this image"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

async function cropToFile(src: string, area: Area, png: boolean): Promise<File> {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

  const scale = Math.min(1, (png ? MAX_PNG_WIDTH : MAX_WIDTH) / area.width);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(area.width * scale);
  canvas.height = Math.round(area.height * scale);
  canvas
    .getContext("2d")!
    .drawImage(image, area.x, area.y, area.width, area.height, 0, 0, canvas.width, canvas.height);

  const type = png ? "image/png" : "image/jpeg";
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, 0.88));
  if (!blob) throw new Error("Canvas export failed");
  return new File([blob], png ? "cropped.png" : "cropped.jpg", { type });
}
