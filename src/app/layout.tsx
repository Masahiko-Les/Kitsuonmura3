import type { Metadata, Viewport } from "next";
import { Zen_Kaku_Gothic_New, Zen_Old_Mincho } from "next/font/google";
import { ToastProvider } from "@/components/Toast";
import { AuthProvider } from "@/lib/auth/AuthProvider";
import { ALLOW_INDEXING, SITE_URL } from "@/lib/metadata";
import "./globals.css";

// 日本語フォントはサブセットのプリロードができないため preload: false にする
const zenOldMincho = Zen_Old_Mincho({
  weight: ["500", "700"],
  subsets: ["latin"],
  variable: "--font-zen-old-mincho",
  display: "swap",
  preload: false,
});

const zenKakuGothicNew = Zen_Kaku_Gothic_New({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-zen-kaku-gothic-new",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "吃音村｜吃音を抱えて生きる人たちのオンライン自助グループ",
    template: "%s｜吃音村",
  },
  // 本番ドメインをつなぐまではサイト全体を検索結果に出さない（NEXT_PUBLIC_ALLOW_INDEXING）
  ...(ALLOW_INDEXING ? {} : { robots: { index: false, follow: false } }),
  description:
    "吃音者の、吃音者による、吃音者のための小さな村。吃音を抱えながら生きてきた人たちが集まり、互いの存在を感じ、苦労を語り、支え合うオンライン自助グループです。",
};

export const viewport: Viewport = {
  themeColor: "#FAF7F0",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ja" className={`${zenOldMincho.variable} ${zenKakuGothicNew.variable}`}>
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
