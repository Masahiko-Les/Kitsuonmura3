// robots.txt。住民限定エリアはクロールさせない（各ページにも noindex を付けている）。
// ログイン・登録画面は noindex のメタタグで検索結果から外す（クロールを止めるとメタタグが読まれないため）
import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/metadata";

const RESIDENT_PATHS = ["/home", "/residents", "/meeting", "/library", "/me", "/admin"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: RESIDENT_PATHS },
    sitemap: new URL("/sitemap.xml", SITE_URL).toString(),
  };
}
