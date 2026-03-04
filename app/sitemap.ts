import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: "https://hiremind.io",
            lastModified: new Date(),
        },
        {
            url: "https://hiremind.io/create-interview",
            lastModified: new Date(),
        },
        {
            url: "https://hiremind.io/dashboard",
            lastModified: new Date(),
        },
        {
            url: "https://hiremind.io",
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 1,
          }
    ];
}