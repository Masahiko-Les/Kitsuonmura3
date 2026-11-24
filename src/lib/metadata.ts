// 公開ページ用の title / description / OGP をまとめて作る。
// Next.js のメタデータは浅いマージなので、openGraph はページごとに丸ごと組み立てる。
import type { Metadata } from "next";

export const SITE_NAME = "吃音村";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://kitsuonmura.com";

/**
 * 検索エンジンに載せてよいか。本番ドメインをつなぐまでは false にしておき、
 * *.vercel.app などの仮のアドレスが検索結果に出ないようにする。
 */
export const ALLOW_INDEXING = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";

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

/** 運営者（利用規約・プライバシーポリシー・問い合わせ先に出す） */
export const OPERATOR_NAME = "ミリエル";
export const CONTACT_EMAIL = "myriel.jp@gmail.com";
/** 利用規約・プライバシーポリシーの制定日 */
export const POLICY_DATE = "2026年11月24日";
