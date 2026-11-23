import type { Metadata } from "next";
import { MeetingView } from "./MeetingView";

// 住民限定エリアはブラウザ側で描画するため、即時ナビゲーションの検証対象外
export const instant = false;
export const metadata: Metadata = { title: "集会" };

export default function Page() {
  return <MeetingView />;
}
