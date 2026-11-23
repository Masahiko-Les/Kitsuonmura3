"use client";

// 住民限定エリアの入口。未ログインなら /login へ（自分でログアウトしたときは公開トップへ）、メール未確認なら /verify-email へ移動させる。
// 画面を隠すだけでデータは守れないので、データそのものは firestore.rules で守っている。
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { Loading } from "./Status";
import s from "./ui.module.css";

export function AuthGate({ children }: { children: ReactNode }) {
  const { loading, user, isResident, loggedOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    if (!user) router.replace(loggedOut ? "/" : `/login?next=${encodeURIComponent(pathname)}`);
    else if (!isResident) router.replace("/verify-email");
  }, [loading, user, isResident, loggedOut, pathname, router]);

  if (loading || !isResident) {
    return (
      <main className={s.main}>
        <Loading />
      </main>
    );
  }
  return <>{children}</>;
}
