"use client";

// 自助グループの団体名を、加盟団体一覧の地域区分で絞り込む。
// JavaScript が動かなくても、最初からすべての地域が並んで読める
import { useState } from "react";
import { AREAS, type GuideGroup } from "@content/guide";
import s from "@/components/ui.module.css";
import { formatIsoDate } from "@/lib/format";
import g from "./guide.module.css";

export function GroupFinder({ groups }: { groups: GuideGroup[] }) {
  const [area, setArea] = useState<string | null>(null);
  const shown = area ? AREAS.filter((a) => a === area) : AREAS;
  return (
    <div className={s.stack}>
      <div className={g.chips} role="group" aria-label="地域で絞り込む">
        {[null, ...AREAS].map((a) => (
          <button key={a ?? "all"} type="button" className={g.chip} aria-pressed={area === a} onClick={() => setArea(a)}>
            {a ?? "すべての地域"}
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        {area ? `${area}の団体を表示しています` : "すべての地域の団体を表示しています"}
      </p>
      {shown.map((a) => {
        const list = groups.filter((x) => x.area === a);
        return (
          <section key={a} className={s.section} aria-labelledby={`area-${a}`}>
            <h3 id={`area-${a}`} className={s.h2} style={{ fontSize: 15 }}>
              {a}（{list.length}団体）
            </h3>
            <ul className={g.groupList}>
              {list.map((x) => (
                <GroupItem key={x.name} x={x} />
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

export function GroupItem({ x }: { x: GuideGroup }) {
  const unverified = [
    !x.meeting_schedule_verified && "活動日",
    !x.contact_details_verified && "連絡先",
    !x.individual_site_verified && "団体のサイト",
  ].filter(Boolean);
  return (
    <li>
      <span className={g.groupName}>{x.name}</span>
      <span className={`${s.small} ${s.muted}`}>
        {x.public_label}（{formatIsoDate(x.source_checked_on)}確認）
        {unverified.length > 0 && `。${unverified.join("・")}は未確認です`}
      </span>
    </li>
  );
}
