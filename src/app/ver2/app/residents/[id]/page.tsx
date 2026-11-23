// 住民票の詳細と吃音史
import { notFound } from "next/navigation";
import { Header } from "../../../_components/Header";
import { Reaction } from "../../../_components/Reaction";
import { Who } from "../../../_components/Who";
import { RESIDENTS, findResident } from "../../../_data/demo";
import s from "../../../ver2.module.css";

export function generateStaticParams() {
  return RESIDENTS.map((r) => ({ id: r.id }));
}

export default async function ResidentPage({ params }: PageProps<"/ver2/app/residents/[id]">) {
  const { id } = await params;
  const r = findResident(id);
  if (!r) notFound();
  return (
    <>
      <Header kind="back" href="/ver2/app/residents" title="住民票" />
      <main className={`${s.main} ${s.withNav}`}>
        <Who resident={r} link={false} />
        <p className={s.lead}>{r.intro}</p>
        <div className={s.tags}>
          {r.tags.map((t) => (
            <span key={t} className={s.tag}>
              {t}
            </span>
          ))}
        </div>
        <section className={s.section}>
          <h2 className={s.h2}>吃音史</h2>
          <article className={s.card}>
            <p className={s.prose}>{r.history}</p>
            <Reaction />
          </article>
        </section>
      </main>
    </>
  );
}
