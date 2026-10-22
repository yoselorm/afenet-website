"use client";

import { useRef, useState } from "react";

export async function uploadImage(file: File): Promise<string> {
  const body = new FormData();
  body.append("file", file);
  const res = await fetch("/api/admin/upload", { method: "POST", body });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Upload failed");
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
