// 吃音村について（理念・参加は任意・村の約束）。文言は PRODUCT_SPEC.md / SECURITY_AND_DATA.md から
import Link from "next/link";
import { Header } from "@/components/Header";
import { publicMetadata } from "@/lib/metadata";
import s from "@/components/ui.module.css";
import { OperatorBox } from "../_legal/LegalPage";

export const metadata = publicMetadata({
  title: "吃音村について",
  description: "吃音村がなぜあるのか、参加のしかた、村の約束について。",
  path: "/about",
});

export default function About() {
  return (
    <>
      <Header kind="back" href="/" title="吃音村について" />
      <main className={s.main}>
        <section className={s.section}>
          <h2 className={s.h2}>なぜこの村があるのか</h2>
          <p className={s.prose}>
            ここは、吃音者の、吃音者による、吃音者のための小さなコミュニティです。吃音を抱えながら生きてきた人たちが集まり、文字だけで交流し、互いに支え合います。
            いちばん届けたいのは、「吃音を抱えているのは自分一人ではない」という感覚です。
          </p>
        </section>
        <section className={s.section}>
          <h2 className={s.h2}>参加のしかたは自由です</h2>
          <p className={s.prose}>
            たくさん語っても、何も語らずに過ごしてもかまいません。住民票の項目も、ニックネーム以外はすべて任意です。
          </p>
        </section>
        <section className={s.section}>
          <h2 className={s.h2}>村の約束</h2>
          <ul className={s.list}>
            <li>集会には返信やアドバイスはありません。村人たちが文章で語り、みんなの語りを読み合うための場です。</li>
            <li>反応の数を競うことはしません。</li>
            <li>村で読んだ住民の語りを、村の外に持ち出さないでください。</li>
            <li>吃音の治療や改善を約束する場所ではありません。医療の相談は専門の窓口へ。</li>
          </ul>
        </section>
        <p className={s.small}>
          くわしくは
          <Link href="/terms" className={s.headerLink}>
            利用規約
          </Link>
          と
          <Link href="/privacy" className={s.headerLink}>
            プライバシーポリシー
          </Link>
          をご覧ください。
        </p>
        <OperatorBox />
      </main>
    </>
  );
}
