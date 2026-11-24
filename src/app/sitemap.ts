// sitemap.xml。公開ページだけを載せる（住民限定の /app は載せない）
import type { MetadataRoute } from "next";
import { GUIDE_PAGES } from "@content/guide";
import { SITE_URL } from "@/lib/metadata";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: { path: string; priority: number }[] = [
    { path: "/", priority: 1 },
    { path: "/guide", priority: 0.9 },
    // 吃音情報まとめページの各ページ。書籍は準備中なので載せない
    ...GUIDE_PAGES.filter((p) => p.slug !== "books").map((p) => ({ path: `/guide/${p.slug}`, priority: 0.8 })),
    { path: "/about", priority: 0.7 },
    { path: "/terms", priority: 0.3 },
    { path: "/privacy", priority: 0.3 },
  ];
  return pages.map(({ path, priority }) => ({
    url: new URL(path, SITE_URL).toString(),
    changeFrequency: "monthly",
    priority,
  }));
}
