import { randomUUID } from "node:crypto";
import sharp from "sharp";
import { getCurrentUser } from "@/lib/auth";
import { IMAGE_TYPES, MAX_UPLOAD_BYTES, storeFile } from "@/lib/uploads";

// Image upload used by the dashboard. Returns { url } for the saved file.
export async function POST(request: Request) {
  if (!(await getCurrentUser())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return Response.json({ error: "No file received" }, { status: 400 });
  }
  const ext = IMAGE_TYPES[file.type];
  if (!ext) {
    return Response.json({ error: "Only JPG, PNG, WEBP, GIF or SVG images are allowed" }, { status: 400 });
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return Response.json({ error: "Image must be smaller than 8 MB" }, { status: 400 });
  }

  const month = new Date().toISOString().slice(0, 7); // e.g. 2026-10
  const data = await optimise(Buffer.from(await file.arrayBuffer()), file.type);
  const url = await storeFile(`${month}/${randomUUID()}${ext}`, data, file.type);

  return Response.json({ url });
}

// Large photos straight from a camera are shrunk so pages stay fast. GIF and SVG are kept as-is.
const MAX_WIDTH = 2400;

async function optimise(input: Buffer, type: string) {
  if (!["image/jpeg", "image/png", "image/webp"].includes(type)) return input;
  const image = sharp(input).rotate(); // apply the camera's orientation
  const { width = 0 } = await image.metadata();
  if (width > MAX_WIDTH) image.resize({ width: MAX_WIDTH });
  if (type === "image/jpeg") return image.jpeg({ quality: 82, mozjpeg: true }).toBuffer();
  if (type === "image/webp") return image.webp({ quality: 82 }).toBuffer();
  return image.png({ compressionLevel: 9 }).toBuffer();
}
