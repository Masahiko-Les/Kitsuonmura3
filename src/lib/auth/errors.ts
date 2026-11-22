// Firebase Authentication のエラーを、利用者に伝わる日本語にする
export function authErrorMessage(e: unknown) {
  const code = typeof e === "object" && e && "code" in e ? String((e as { code: unknown }).code) : "";
  switch (code) {
    case "auth/email-already-in-use":
      return "このメールアドレスは、すでに住民票が作られています。ログインしてください。";
    case "auth/invalid-email":
      return "メールアドレスの形式が正しくありません。";
    case "auth/weak-password":
    case "auth/password-does-not-meet-requirements":
      return "パスワードは8文字以上にしてください。";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "メールアドレスまたはパスワードが違います。";
    case "auth/too-many-requests":
      return "試行回数が多すぎます。しばらく時間をおいてから、もう一度お試しください。";
    case "auth/network-request-failed":
      return "通信できませんでした。インターネット接続を確認してください。";
    case "auth/operation-not-allowed":
      return "現在、登録とログインを受け付けていません。（管理者向け：メール／パスワード認証が有効になっていません）";
    default:
      return "うまくいきませんでした。時間をおいて、もう一度お試しください。";
  }
}
