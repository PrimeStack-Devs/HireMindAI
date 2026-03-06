import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    const base = "https://hiremind.io";
    return [
        {
            url: base,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 1,
        },
        {
            url: `${base}/roadmap`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.9,
        },
        {
            url: `${base}/find-job`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.8,
        }
    ];
}