// 公開エリア（ログイン不要・検索エンジンに公開）。下部タブは出さない
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <main className="screen">{children}</main>;
}
