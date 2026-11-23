// 読み込み中・エラーの短い表示
import s from "./ui.module.css";

export function Loading({ text = "読み込んでいます…" }: { text?: string }) {
  return (
    <p className={`${s.small} ${s.muted}`} role="status">
      {text}
    </p>
  );
}

export function LoadError({ what }: { what: string }) {
  return (
    <p className={s.error} role="alert">
      {what}を読み込めませんでした。時間をおいて、もう一度お試しください。
    </p>
  );
}
