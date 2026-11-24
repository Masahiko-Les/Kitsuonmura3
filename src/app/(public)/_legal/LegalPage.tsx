// 利用規約・プライバシーポリシーの共通の形（見出しつきの条文と、運営者・連絡先）
import Link from "next/link";
import { Header } from "@/components/Header";
import s from "@/components/ui.module.css";
import { CONTACT_EMAIL, OPERATOR_NAME, POLICY_DATE } from "@/lib/metadata";

export type Clause = { heading: string; body: (string | string[])[] };

export function LegalPage({ title, intro, clauses }: { title: string; intro: string; clauses: Clause[] }) {
  return (
    <>
      <Header kind="back" href="/" title={title} />
      <main className={s.main}>
        <div className={s.stack}>
          <h1 className={s.h1}>{title}</h1>
          <p className={s.small}>{intro}</p>
        </div>
        {clauses.map((c, i) => (
          <section key={c.heading} className={s.section} aria-labelledby={`c${i}`}>
            <h2 id={`c${i}`} className={s.h2} style={{ fontSize: 16 }}>
              {i + 1}. {c.heading}
            </h2>
            {c.body.map((b, j) =>
              Array.isArray(b) ? (
                <ul key={j} className={`${s.list} ${s.small}`}>
                  {b.map((li) => (
                    <li key={li}>{li}</li>
                  ))}
                </ul>
              ) : (
                <p key={j} className={s.small} style={{ lineHeight: 1.9 }}>
                  {b}
                </p>
              ),
            )}
          </section>
        ))}
        <OperatorBox />
        <p className={`${s.small} ${s.muted}`}>{POLICY_DATE} 制定</p>
        <nav className={s.tags} aria-label="関連するページ" style={{ justifyContent: "center", gap: 16 }}>
          <Link href="/terms" className={s.headerLink}>
            利用規約
          </Link>
          <Link href="/privacy" className={s.headerLink}>
            プライバシーポリシー
          </Link>
          <Link href="/about" className={s.headerLink}>
            吃音村について
          </Link>
        </nav>
      </main>
    </>
  );
}

export function OperatorBox() {
  return (
    <div className={s.note}>
      <dl className={s.dl} style={{ gap: 6 }}>
        <div>
          <dt>運営者</dt>
          <dd>{OPERATOR_NAME}</dd>
        </div>
        <div>
          <dt>お問い合わせ</dt>
          <dd>
            <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: "var(--brand)", textDecoration: "underline", overflowWrap: "anywhere" }}>
              {CONTACT_EMAIL}
            </a>
          </dd>
        </div>
      </dl>
    </div>
  );
}
