// 書き手の表示（頭文字の丸、ニックネーム、年代・職業）
import Link from "next/link";
import type { Resident } from "../_data/demo";
import s from "../ver2.module.css";

export function Who({ resident: r, link = true }: { resident: Resident; link?: boolean }) {
  const body = (
    <>
      <span className={s.avatar} aria-hidden="true">
        {[...r.nickname][0]}
      </span>
      <div>
        <div className={s.name}>{r.nickname}</div>
        <div className={s.meta}>
          {r.age_band && <span>{r.age_band}</span>}
          {r.occupation && <span>{r.occupation}</span>}
        </div>
      </div>
    </>
  );
  return link ? (
    <Link href={`/ver2/app/residents/${r.id}`} className={s.who}>
      {body}
    </Link>
  ) : (
    <div className={s.who}>{body}</div>
  );
}
