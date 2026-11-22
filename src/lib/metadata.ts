// 公開ページ用の title / description / OGP をまとめて作る。
// Next.js のメタデータは浅いマージなので、openGraph はページごとに丸ごと組み立てる。
import type { Metadata } from "next";

export const SITE_NAME = "吃音村";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://kitsuonmura.com";

type Options = {
  /** ページ名。省略するとサイト既定のタイトルになる */
  title?: string;
  description: string;
  /** "/about" のようなパス */
  path: string;
};

export function publicMetadata({ title, description, path }: Options): Metadata {
  const ogTitle = title ? `${title}｜${SITE_NAME}` : SITE_NAME;
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "ja_JP",
      siteName: SITE_NAME,
      url: path,
      title: ogTitle,
      description,
    },
    twitter: {
      card: "summary",
      title: ogTitle,
      description,
    },
  };
}
