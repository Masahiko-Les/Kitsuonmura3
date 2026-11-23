// ver2 の上部。ロゴと右側のリンク、または戻るリンクとページ名
import Link from "next/link";
import s from "../ver2.module.css";

type Props =
  | { kind?: "logo"; right?: { href: string; label: string } }
  | { kind: "back"; href: string; title: string };

export function Header(props: Props) {
  if (props.kind === "back") {
    return (
      <header className={s.header}>
        <Link href={props.href} className={s.back}>
          ← 戻る
        </Link>
        <h1 className={s.pageTitle}>{props.title}</h1>
        <span style={{ width: 48 }} />
      </header>
    );
  }
  return (
    <header className={s.header}>
      <Link href="/ver2" className={s.logo}>
        吃音村
      </Link>
      {props.right && (
        <Link href={props.right.href} className={s.headerLink}>
          {props.right.label}
        </Link>
      )}
    </header>
  );
}
