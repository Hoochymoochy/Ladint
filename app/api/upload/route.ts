import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const IMAGE_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/gif",
]);

const PDF_TYPES = new Set(["application/pdf"]);

const MAX_BYTES = 10 * 1024 * 1024; // 10MB

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const kind = String(formData.get("kind") || "image");

    if (!(file instanceof File)) {
      return NextResponse.json({ success: false, error: "No file uploaded." }, { status: 400 });
    }

    const allowed = kind === "pdf" ? PDF_TYPES : IMAGE_TYPES;
    if (!allowed.has(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error:
            kind === "pdf"
              ? "Only PDF files are allowed."
              : "Only PNG, JPG, WEBP, or GIF images are allowed.",
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { success: false, error: "File must be 10MB or smaller." },
        { status: 400 }
      );
    }

    const ext =
      kind === "pdf"
        ? "pdf"
        : file.name.split(".").pop()?.toLowerCase() || "png";
    const filename = `${randomUUID()}.${ext}`;
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(uploadsDir, filename), buffer);

    return NextResponse.json({
      success: true,
      url: `/uploads/${filename}`,
    });
  } catch (error: any) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
