// 管理者のカスタムクレーム（admin: true）を付ける・外すスクリプト。
//
//   npm run set-admin -- you@example.com            # 管理者にする
//   npm run set-admin -- you@example.com --remove   # 管理者から外す
//
// 認証情報：Firebase コンソール →「プロジェクトの設定」→「サービス アカウント」で鍵（JSON）を作り、
//   GOOGLE_APPLICATION_CREDENTIALS=/path/to/key.json を指定して実行する。鍵は git に入れないこと。
// Emulator に対して実行するときは FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099 を指定する。
// 反映されるのは、その人が次に ID トークンを取り直したとき（管理画面を開き直すと取り直す）。
import { applicationDefault, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

async function main() {
  const args = process.argv.slice(2);
  const email = args.find((a) => !a.startsWith("--"));
  const remove = args.includes("--remove");
  if (!email) {
    console.error("使い方: npm run set-admin -- <メールアドレス> [--remove]");
    process.exit(1);
  }
  const emulator = !!process.env.FIREBASE_AUTH_EMULATOR_HOST;
  const projectId = process.env.GCLOUD_PROJECT ?? process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "kitsuonmura3";
  initializeApp(emulator ? { projectId } : { credential: applicationDefault(), projectId });

  const auth = getAuth();
  const user = await auth.getUserByEmail(email);
  const claims = { ...(user.customClaims ?? {}) };
  if (remove) delete claims.admin;
  else claims.admin = true;
  await auth.setCustomUserClaims(user.uid, claims);
  console.log(`${email}（${user.uid}）を管理者${remove ? "から外しました" : "にしました"}。`);
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
