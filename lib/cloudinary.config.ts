import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImage = async (file: string) => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: "AiInterviewer",
      resource_type: "image",
    });
    return result.secure_url;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Image upload failed");
  }
};

// ✅ Upload PDF so Cloudinary stores it and we can transform it to PNG
export const uploadPdfAsImage = async (base64: string, fileName?: string) => {
  const publicId = fileName
    ? fileName.replace(/\.[^/.]+$/, "")
    : undefined;

  const res = await cloudinary.uploader.upload(base64, {
    resource_type: "image",
    folder: "AiInterviewer/resumes",
    public_id: publicId,
    format: "pdf",
  });

  return {
    secure_url: res.secure_url,
    public_id: res.public_id,
    version: res.version,
  };
};
