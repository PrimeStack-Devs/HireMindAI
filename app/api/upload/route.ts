import { uploadImage, uploadPdfAsImage } from "@/lib/cloudinary.config";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json({ error: "No file received" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const mimeType = file.type;
    const base64 = `data:${mimeType};base64,${buffer.toString("base64")}`;

    // ✅ PDF
    if (mimeType === "application/pdf") {
      const pdfUpload = await uploadPdfAsImage(base64, file.name);

      // ✅ 100% correct preview image URL (page 1 PNG)
      const previewImageUrl = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/pg_1,f_png/v${pdfUpload.version}/${pdfUpload.public_id}.png`;

      // console.log("PDF URL:", pdfUpload.secure_url);
      // console.log("PREVIEW IMAGE URL:", previewImageUrl);

      return NextResponse.json({
        result: previewImageUrl, // ✅ always image
        pdfUrl: pdfUpload.secure_url, // optional
        previewImageUrl,
        type: "pdf",
      });
    }

    // ✅ Image
    const imageUrl = await uploadImage(base64);

    return NextResponse.json({
      result: imageUrl,
      previewImageUrl: imageUrl,
      type: "image",
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
