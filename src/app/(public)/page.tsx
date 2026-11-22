import Link from "next/link";
import { BookIcon, CardIcon, MapIcon, TalkIcon } from "@/components/icons";
import { VillageIllustration } from "@/components/VillageIllustration";
import { publicMetadata } from "@/lib/metadata";

export const metadata = publicMetadata({
  description:
    "吃音者の、吃音者による、吃音者のための小さな村。吃音を抱えながら生きてきた人たちが集まり、互いの存在を感じ、苦労を語り、支え合うオンライン自助グループです。",
  path: "/",
});

// 公開トップ（試作品の V.public）
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
          <p className="muted">
            吃音を抱えながら生きてきた人たちが集まり、互いの存在を感じ、苦労を語り、支え合う場所です。
          </p>
        </div>
        <Link href="/welcome" className="btn block">
          はじめて村を訪れる
        </Link>
        <Link href="/login" className="btn ghost block">
          住民の方はこちら
        </Link>

        <h2 className="sec">吃音村でできること</h2>
        <div className="card">
          <div className="feature">
            <span className="ic">
              <CardIcon />
            </span>
            <div>
              <b>住民票</b>
              <p className="small muted">同じ苦労を抱えながら生きている人たちの人生と、吃音史を読めます。</p>
            </div>
          </div>
          <div className="feature">
            <span className="ic">
              <TalkIcon />
            </span>
            <div>
              <b>毎月の集会</b>
              <p className="small muted">毎月のテーマについて、言いっぱなし・聞きっぱなしで語り合います。</p>
            </div>
          </div>
          <div className="feature">
            <span className="ic">
              <BookIcon />
            </span>
            <div>
              <b>図書館</b>
              <p className="small muted">苦しいときに支えになった本と、その物語が並ぶ本棚です。</p>
            </div>
          </div>
        </div>

        <h2 className="sec">登録しなくても読めます</h2>
        <Link href="/guide" className="card">
          <div className="feature">
            <span className="ic">
              <MapIcon />
            </span>
            <div>
              <b>吃音情報ガイド</b>
              <p className="small muted">全国の言友会や自助グループ、相談先、研究機関の情報をまとめています。</p>
            </div>
          </div>
        </Link>
        <Link href="/about" className="card">
          <b>吃音村について</b>
          <p className="small muted">この村が大切にしていること</p>
        </Link>
      </div>
    </>
  );
}
