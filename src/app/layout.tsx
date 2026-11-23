import type { Metadata, Viewport } from "next";
import { Zen_Old_Mincho } from "next/font/google";
import { ToastProvider } from "@/components/Toast";
import { AuthProvider } from "@/lib/auth/AuthProvider";
import { ALLOW_INDEXING, SITE_URL } from "@/lib/metadata";
import "./globals.css";

// ロゴと大見出しだけ明朝。本文は端末のゴシック体（DESIGN_SYSTEM.md）。
// 日本語フォントはサブセットのプリロードができないため preload: false にする
const zenOldMincho = Zen_Old_Mincho({
  weight: ["500", "700"],
  subsets: ["latin"],
  variable: "--font-zen-old-mincho",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "吃音村｜吃音を抱えているのは、あなた一人ではない。",
    template: "%s｜吃音村",
  },
  // 本番ドメインをつなぐまではサイト全体を検索結果に出さない（NEXT_PUBLIC_ALLOW_INDEXING）
  ...(ALLOW_INDEXING ? {} : { robots: { index: false, follow: false } }),
  description:
    "吃音者の、吃音者による、吃音者のためのオンライン自助コミュニティ。声を出さなくても、言葉を交わせる。互いの人生に触れ、支え合える場所です。",
};

export const viewport: Viewport = {
  themeColor: "#FAF9F5",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ja" className={zenOldMincho.variable}>
      <body>
        <AuthProvider>
          <ToastProvider>
            <div className="app">{children}</div>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
