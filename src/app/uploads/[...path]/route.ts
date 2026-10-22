import { readFile } from "node:fs/promises";
import path from "node:path";
import { UPLOAD_DIR, contentTypeFor } from "@/lib/uploads";

// Serves files uploaded through the dashboard
export async function GET(_request: Request, { params }: RouteContext<"/uploads/[...path]">) {
  const segments = (await params).path;
  const filePath = path.join(UPLOAD_DIR, ...segments);

  // Block "../" tricks that try to read files outside the uploads folder
  if (!filePath.startsWith(UPLOAD_DIR + path.sep)) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const data = await readFile(filePath);
    return new Response(data, {
      headers: {
        "Content-Type": contentTypeFor(filePath),
        "Cache-Control": "public, max-age=31536000, immutable",
        // Stops scripts inside uploaded SVGs from running
        "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
