// 住民票の一覧（自分以外の住民）
import Link from "next/link";
import { Header } from "../../_components/Header";
import { Who } from "../../_components/Who";
import { RESIDENTS } from "../../_data/demo";
import s from "../../ver2.module.css";

export const metadata = { title: "住民票" };

export default function Residents() {
  return (
    <>
      <Header />
      <main className={`${s.main} ${s.withNav}`}>
        <h1 className={s.h2}>住民票</h1>
        <div className={s.stack}>
          {RESIDENTS.map((r) => (
            <Link key={r.id} href={`/ver2/app/residents/${r.id}`} className={s.card}>
              <Who resident={r} link={false} />
              <p className={s.small}>{r.intro}</p>
              <div className={s.tags}>
                {r.tags.map((t) => (
                  <span key={t} className={s.tag}>
                    {t}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
