import "server-only";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { put } from "@vercel/blob";

// Where dashboard uploads are stored:
// - Vercel Blob when BLOB_READ_WRITE_TOKEN is set (Vercel's servers have no permanent disk)
// - otherwise the local uploads/ folder, served by src/app/uploads/[...path]/route.ts
//   (local development, or a normal server such as a GoDaddy VPS)
export const UPLOAD_DIR = path.join(process.cwd(), "uploads");

export const IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/svg+xml": ".svg",
};

export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

export function contentTypeFor(file: string) {
  const ext = path.extname(file).toLowerCase();
  const match = Object.entries(IMAGE_TYPES).find(([, e]) => e === ext || (ext === ".jpeg" && e === ".jpg"));
  return match?.[0] ?? "application/octet-stream";
}

// Saves a file and returns the URL to use in <img src>
export async function storeFile(relativePath: string, data: Buffer, contentType: string) {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`uploads/${relativePath}`, data, { access: "public", contentType, addRandomSuffix: false });
    return blob.url;
  }

  // Vercel's servers can't keep files, so uploads there must go to Blob
  if (process.env.VERCEL) {
    throw new Error(
      "Image storage isn't connected. In Vercel, connect a Public Blob store to this project " +
        "(it adds BLOB_READ_WRITE_TOKEN), then redeploy.",
    );
  }

  const filePath = path.join(UPLOAD_DIR, relativePath);
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, data);
  return `/uploads/${relativePath}`;
}
