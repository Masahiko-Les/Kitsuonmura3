"use client";

// 会員エリアの下部タブ（ホーム／住民票／集会／図書館／自分）
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookIcon, CardIcon, HomeIcon, MeIcon, TalkIcon } from "@/components/icons";
import s from "../ver2.module.css";

const TABS = [
  { href: "/ver2/app", label: "ホーム", Icon: HomeIcon, exact: true },
  { href: "/ver2/app/residents", label: "住民票", Icon: CardIcon },
  { href: "/ver2/app/meeting", label: "集会", Icon: TalkIcon },
  { href: "/ver2/app/library", label: "図書館", Icon: BookIcon },
  { href: "/ver2/app/me", label: "自分", Icon: MeIcon },
];

export function BottomNav() {
  const path = usePathname();
  return (
    <nav className={s.nav} aria-label="村の中">
      {TABS.map(({ href, label, Icon, exact }) => {
        const on = exact ? path === href : path === href || path.startsWith(`${href}/`);
        return (
          <Link key={href} href={href} className={on ? s.navOn : s.navItem} aria-current={on ? "page" : undefined}>
            <Icon />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
