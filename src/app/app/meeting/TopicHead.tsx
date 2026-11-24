// 集会のテーマの見出し
import s from "@/components/ui.module.css";
import { formatThemeMonth } from "@/lib/format";
import type { Theme } from "@/lib/types";

export function TopicHead({ theme }: { theme: Theme }) {
  return (
    <div className={s.cardMuted}>
      <span className={s.cardLabel}>{formatThemeMonth(theme.month)}の集会</span>
      <h1 className={s.cardTitle} style={{ margin: 0 }}>
        {theme.title}
      </h1>
      {theme.description && <p className={s.small}>{theme.description}</p>}
    </div>
  );
}

export const MEETING_NOTE = "村人たちが文章で語り、みんなの語りをじっくり読み合うための場です。コメントやアドバイスはつきません。";
