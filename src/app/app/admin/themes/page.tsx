import type { Metadata } from "next";
import { ThemesAdmin } from "./ThemesAdmin";

// 住民限定エリアはブラウザ側で描画するため、即時ナビゲーションの検証対象外
export const instant = false;
export const metadata: Metadata = { title: "集会テーマの管理" };

export default function Page() {
  return <ThemesAdmin />;
}
