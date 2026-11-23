// 書き手・住民の表示（頭文字の丸、ニックネーム、年代・職業）
import Link from "next/link";
import s from "./ui.module.css";

type Props = {
  uid: string;
  nickname: string;
  ageGroup?: string;
  job?: string;
  /** 日付など、右に添える一言 */
  note?: string;
  isMe?: boolean;
  /** 住民票へのリンクにするか */
  link?: boolean;
};

export function Who({ uid, nickname, ageGroup, job, note, isMe = false, link = true }: Props) {
  const body = (
    <>
      <span className={s.avatar} aria-hidden="true">
        {[...(nickname || "?")][0]}
      </span>
      <div>
        <div className={s.name}>
          {nickname}
          {isMe && "（あなた）"}
        </div>
        <div className={s.meta}>
          {ageGroup && ageGroup !== "答えない" && <span>{ageGroup}</span>}
          {job && <span>{job}</span>}
          {note && <span>{note}</span>}
        </div>
      </div>
    </>
  );
  return link ? (
    <Link href={`/app/residents/${uid}`} className={s.who}>
      {body}
    </Link>
  ) : (
    <div className={s.who}>{body}</div>
  );
}
