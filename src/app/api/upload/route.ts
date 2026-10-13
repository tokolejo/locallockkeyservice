import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { createClient, requireAdminUser } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    try {
      await requireAdminUser();
    } catch {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Admin session required to upload files" },
        { status: 401 }
      );
    }

    const supabase = await createClient();
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file uploaded" },
        { status: 400 }
      );
    }

    // Validate type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: "Only image files (JPEG, PNG, WebP, GIF, AVIF) are allowed" },
        { status: 400 }
      );
    }

    // Size limit (10MB)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, message: "File exceeds 10MB limit" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize file name
    const ext = path.extname(file.name) || ".jpg";
    const baseName = path
      .basename(file.name, ext)
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "-")
      .slice(0, 40);
    const fileName = `img-${Date.now()}-${baseName}${ext}`;

    // 1. Upload to Supabase Storage in production
    if (supabase) {
      const bucketName = "gallery";
      const storagePath = `uploads/${fileName}`;

      const { data: uploadData, error: storageError } = await supabase.storage
        .from(bucketName)
        .upload(storagePath, buffer, {
          contentType: file.type,
          upsert: true,
        });

      if (!storageError && uploadData) {
        const { data: publicUrlData } = supabase.storage
          .from(bucketName)
          .getPublicUrl(storagePath);

        return NextResponse.json({
          success: true,
          url: publicUrlData.publicUrl,
          fileName,
        });
      }

      if (storageError) {
        console.warn("Notice: Supabase Storage upload error, falling back to local disk if available:", storageError.message);
      }
    }

    // 2. Local filesystem fallback for development environments
    try {
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, buffer);

      const publicUrl = `/uploads/${fileName}`;

      return NextResponse.json({
        success: true,
        url: publicUrl,
        fileName,
      });
    } catch (fsErr: any) {
      console.error("Local disk upload failed (read-only environment):", fsErr);
      return NextResponse.json(
        {
          success: false,
          message: "Storage upload failed. Please ensure the Supabase Storage 'gallery' bucket is created and public in your Supabase project.",
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to upload image" },
      { status: 500 }
    );
  }
}
