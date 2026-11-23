import type { Metadata } from "next";
import { Compose } from "./Compose";

// 住民限定エリアはブラウザ側で描画するため、即時ナビゲーションの検証対象外
export const instant = false;
export const metadata: Metadata = { title: "語る" };

export default function Page() {
  return <Compose />;
}
