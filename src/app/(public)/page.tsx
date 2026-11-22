import Link from "next/link";
import { VillageIllustration } from "@/components/VillageIllustration";

// 公開トップ。中身は第2段階で試作品どおりに作る（今は村のイラストと入口のみ）
export default function PublicTop() {
  return (
    <>
      <VillageIllustration />
      <div className="pad">
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <h1 className="pub-h">吃音村</h1>
          <p className="display" style={{ fontSize: 17, lineHeight: 1.8 }}>
            吃音者の、吃音者による、吃音者のための小さな村。
          </p>
        </div>
        <Link href="/home" className="btn block">
          （開発用）住民限定エリアの下部タブを確認する
        </Link>
      </div>
    </>
  );
}
