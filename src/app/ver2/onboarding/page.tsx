// 登録後の案内。住民票はニックネーム以外すべて任意で、あとから書ける
import Link from "next/link";
import { Header } from "../_components/Header";
import s from "../ver2.module.css";

export const metadata = { title: "住民票について" };

export default function Onboarding() {
  return (
    <>
      <Header />
      <main className={s.main}>
        <div className={s.stack}>
          <h1 className={s.h1}>住民票をつくりませんか</h1>
          <p className={s.lead}>
            住民票は、あなたのことを村の住民に伝えるページです。ニックネーム以外はすべて任意で、吃音史はあとから書けます。
          </p>
          <p className={s.lead}>書かずに過ごすのも、ひとつの参加のしかたです。</p>
        </div>
        <div className={s.stack}>
          <Link href="/ver2/app/me/edit" className={s.btn}>
            住民票を書く
          </Link>
          <Link href="/ver2/app" className={s.btnGhost}>
            あとで書く（村に入る）
          </Link>
        </div>
      </main>
    </>
  );
}
