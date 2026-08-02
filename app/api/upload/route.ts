import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    // 1. Verify Admin Session
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2. Extract files
    const formData = await req.formData();
    const rawFiles = formData.getAll("files") as File[];
    const singleFile = formData.get("file") as File | null;

    const filesToUpload: File[] = [...rawFiles];
    if (singleFile && !filesToUpload.includes(singleFile)) {
      filesToUpload.push(singleFile);
    }

    if (filesToUpload.length === 0) {
      return NextResponse.json(
        { success: false, message: "No file provided" },
        { status: 400 }
      );
    }

    // 3. Upload using Streams (Bypasses Base64 overhead & increases timeout)
    const uploadPromises = filesToUpload.map(async (file) => {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      return new Promise<string>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "portfolio_cms",
            resource_type: "auto", // Handles images and raw/audio files automatically
            timeout: 120000,       // Increased timeout to 120 seconds (2 minutes)
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result?.secure_url as string);
            }
          }
        );

        // Pipe the buffer into Cloudinary
        uploadStream.end(buffer);
      });
    });

    const uploadedUrls = await Promise.all(uploadPromises);

    // 4. Return success response
    return NextResponse.json(
      {
        success: true,
        url: uploadedUrls[0],
        urls: uploadedUrls,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to upload file" },
      { status: 500 }
    );
  }
}