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
      const pdfUrl = await uploadPdfAsImage(base64, file.name);

      // ✅ This will now work perfectly
      const previewImageUrl = pdfUrl.replace(
        "/upload/",
        "/upload/pg_1,f_png/"
      );

      console.log("PDF URL:", pdfUrl);
      console.log("PREVIEW URL:", previewImageUrl);

      return NextResponse.json({
        result: pdfUrl,
        pdfUrl,
        previewImageUrl,
        type: "pdf",
      });
    }

    // ✅ Image
    const imageUrl = await uploadImage(base64);

    return NextResponse.json({
      result: imageUrl,
      type: "image",
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
