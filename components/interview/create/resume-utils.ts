export type ResumeExtractorData = {
  candidateName?: string;
  skills?: string;
  topic?: string;
  difficulty?: string;
  mode?: string;
};

export async function uploadAndExtractResume(file: File) {
  const isImage = file.type.startsWith("image/");
  const isPdf = file.type === "application/pdf";

  if (!isImage && !isPdf) {
    throw new Error("Only Image or PDF resume is allowed");
  }

  const formData = new FormData();
  formData.append("image", file);

  const uploadResponse = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const uploadJson = await uploadResponse.json();
  const uploadedUrl = uploadJson.previewImageUrl || uploadJson.result;

  if (!uploadedUrl) {
    throw new Error("Upload failed");
  }

  const extractorResponse = await fetch("/api/resume-extractor", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: { url: uploadedUrl },
            },
          ],
        },
      ],
    }),
  });

  const raw = await extractorResponse.text();

  let aiData: ResumeExtractorData | null = null;
  try {
    aiData = JSON.parse(raw);
  } catch {
    throw new Error("Resume analysis failed (invalid JSON response)");
  }

  if (aiData && "error" in aiData) {
    throw new Error((aiData as { error?: string }).error || "Resume analysis failed");
  }

  return {
    aiData: aiData || {},
    resumeUrl: uploadedUrl as string,
    uploadedType: uploadJson.type as string | undefined,
  };
}
