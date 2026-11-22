"use client";

// 住民限定エリアの下部タブ（ホーム／住民票／集会／図書館／自分）
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType, SVGProps } from "react";
import { BookIcon, CardIcon, HomeIcon, MeIcon, TalkIcon } from "./icons";
import styles from "./BottomNav.module.css";

type Tab = {
  href: string;
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  /** このタブを選択中として扱うパスの先頭 */
  match: string[];
};

// 情報ガイド・吃音村については試作品と同じく「自分」タブ扱い
const TABS: Tab[] = [
  { href: "/home", label: "ホーム", Icon: HomeIcon, match: ["/home"] },
  { href: "/residents", label: "住民票", Icon: CardIcon, match: ["/residents"] },
  { href: "/meeting", label: "集会", Icon: TalkIcon, match: ["/meeting"] },
  { href: "/library", label: "図書館", Icon: BookIcon, match: ["/library"] },
  { href: "/me", label: "自分", Icon: MeIcon, match: ["/me"] },
];

function isActive(pathname: string, prefixes: string[]) {
  return prefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className={styles.nav} aria-label="メインメニュー">
      {TABS.map(({ href, label, Icon, match }) => {
        const on = isActive(pathname, match);
        return (
          <Link key={href} href={href} className={on ? styles.on : undefined} aria-current={on ? "page" : undefined}>
            <Icon />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
