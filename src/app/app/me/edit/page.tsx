import type { Metadata } from "next";
import { EditProfile } from "./EditProfile";

// 住民限定エリアはブラウザ側で描画するため、即時ナビゲーションの検証対象外
export const instant = false;
export const metadata: Metadata = { title: "住民票を書く" };

export default function Page() {
  return <EditProfile />;
}
