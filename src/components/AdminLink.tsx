"use client";

// 管理者にだけ、自分ページのメニューに管理画面への入口を出す
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { ChevIcon } from "./icons";

export function AdminLink() {
  const { user } = useAuth();
  const [admin, setAdmin] = useState<{ uid: string; admin: boolean } | null>(null);
  useEffect(() => {
    if (!user) return;
    let alive = true;
    user.getIdTokenResult().then(
      (r) => alive && setAdmin({ uid: user.uid, admin: r.claims.admin === true }),
      () => {},
    );
    return () => {
      alive = false;
    };
  }, [user]);
  if (!admin?.admin || admin.uid !== user?.uid) return null;
  return (
    <Link href="/admin/themes">
      集会テーマの管理
      <ChevIcon />
    </Link>
  );
}
