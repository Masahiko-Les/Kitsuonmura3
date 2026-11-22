import Link from "next/link";
import { GUIDE } from "@content/guide";
import { ChevIcon } from "@/components/icons";
import { TopBar } from "@/components/TopBar";
import { publicMetadata } from "@/lib/metadata";

export const metadata = publicMetadata({
  title: "吃音情報ガイド",
  description:
    "全国の言友会や吃音の自助グループ、医療・相談窓口、子どもの吃音と保護者向けの情報、学会・研究機関を、どんな人に向いているかと一緒にまとめています。",
  path: "/guide",
});

// 吃音情報ガイドの一覧。カテゴリごとに掲載先の名前を見せ、詳しくはカテゴリページで読む
export default function GuidePage() {
  return (
    <>
      <TopBar title="吃音情報ガイド" back />
      <div className="pad">
        <p>吃音に関する団体や相談先を、どんな人に向いているかと一緒にまとめています。このページは登録しなくても読めます。</p>
        <p className="note">掲載内容は、各団体の公式情報で確認しながら順次更新しています。情報源と最終確認日は各項目に記載します。</p>
        <div className="list">
          {GUIDE.map((c) => (
            <Link key={c.slug} href={`/guide/${c.slug}`} className="card">
              <div className="archive-row">
                <h2 className="display" style={{ fontSize: 17 }}>
                  {c.name}
                </h2>
                <ChevIcon />
              </div>
              <p className="small muted">{c.description}</p>
              <ul className="small" style={{ margin: 0, paddingLeft: "1.2em", lineHeight: 1.8 }}>
                {c.items.map((it) => (
                  <li key={it.name}>{it.name}</li>
                ))}
              </ul>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
