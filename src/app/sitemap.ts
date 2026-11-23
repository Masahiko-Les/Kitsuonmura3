// sitemap.xml。公開エリアのページだけを載せる（住民限定エリアは載せない）
import type { MetadataRoute } from "next";
import { GUIDE } from "@content/guide";
import { SITE_URL } from "@/lib/metadata";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: { path: string; priority: number }[] = [
    { path: "/", priority: 1 },
    { path: "/about", priority: 0.8 },
    { path: "/guide", priority: 0.8 },
    ...GUIDE.map((c) => ({ path: `/guide/${c.slug}`, priority: 0.7 })),
  ];
  return pages.map(({ path, priority }) => ({
    url: new URL(path, SITE_URL).toString(),
    changeFrequency: "monthly",
    priority,
  }));
}
