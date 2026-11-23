import type { Metadata } from "next";
import { NewBook } from "./NewBook";

// 住民限定エリアはブラウザ側で描画するため、即時ナビゲーションの検証対象外
export const instant = false;
export const metadata: Metadata = { title: "本の物語を残す" };

export default function Page() {
  return <NewBook />;
}
