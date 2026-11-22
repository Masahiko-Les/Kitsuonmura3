// 情報ガイドの1項目。URL・情報源・最終確認日が空欄でも崩れないようにする
import type { GuideItem } from "@content/guide";
import { formatIsoDate } from "@/lib/format";
import styles from "./GuideItemView.module.css";

export function GuideItemView({ item }: { item: GuideItem }) {
  return (
    <div className={styles.item}>
      <div className={styles.head}>
        <h3 className={styles.name}>{item.name}</h3>
        {item.type && <span className="chip">{item.type}</span>}
      </div>
      <p className="small">{item.description}</p>
      {item.suitedFor && (
        <p className="small">
          <span className="muted">向いている人：</span>
          {item.suitedFor}
        </p>
      )}
      {item.url && (
        <a className={`small ${styles.link}`} href={item.url} target="_blank" rel="noopener noreferrer">
          公式サイトを開く
        </a>
      )}
      <div className="meta">
        <span>情報源：{item.source || "確認中"}</span>
        <span>最終確認日：{item.checkedAt ? formatIsoDate(item.checkedAt) : "未確認"}</span>
      </div>
    </div>
  );
}
