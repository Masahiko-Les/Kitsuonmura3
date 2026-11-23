// 吃音村について（理念・参加は任意・村の約束）。文言は PRODUCT_SPEC.md / SECURITY_AND_DATA.md から
import { Header } from "../_components/Header";
import s from "../ver2.module.css";

export const metadata = { title: "吃音村について" };

export default function About() {
  return (
    <>
      <Header kind="back" href="/ver2" title="吃音村について" />
      <main className={s.main}>
        <section className={s.section}>
          <h2 className={s.h2}>なぜこの村があるのか</h2>
          <p className={s.prose}>
            吃音者の、吃音者による、吃音者のためのオンライン自助コミュニティです。
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
            <li>集会には返信やアドバイスはありません。語りっぱなし、聴きっぱなしの場です。</li>
            <li>反応の数を競うことはしません。</li>
            <li>村で読んだ住民の語りを、村の外に持ち出さないでください。</li>
            <li>吃音の治療や改善を約束する場所ではありません。医療の相談は専門の窓口へ。</li>
          </ul>
        </section>
        <p className={s.note}>
          この「村の約束」は試作の文案です。利用規約・プライバシーポリシーは本番公開の前に整えます。
        </p>
      </main>
    </>
  );
}
