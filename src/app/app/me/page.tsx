import type { Metadata } from "next";
import { MeView } from "./MeView";

// 住民限定エリアはブラウザ側で描画するため、即時ナビゲーションの検証対象外
export const instant = false;
export const metadata: Metadata = { title: "自分" };

export default function Page() {
  return <MeView />;
}
