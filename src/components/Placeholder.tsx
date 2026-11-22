// 未実装の画面に一時的に置く表示。各段階で本来の画面に置き換える
import { TopBar } from "./TopBar";

export function Placeholder({ title, stage, back = false }: { title: string; stage: number; back?: boolean }) {
  return (
    <>
      <TopBar title={title} back={back} />
      <div className="pad">
        <p className="note">この画面は第{stage}段階で実装します。</p>
      </div>
    </>
  );
}
