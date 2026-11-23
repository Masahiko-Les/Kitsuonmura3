// 吃音村のイラスト（水彩画の静止画）。公開トップ、オープニング、ホームで使う
import Image from "next/image";
import village from "@/assets/village.jpg";

type Props = {
  /** ページの最初に見える位置に置くとき true（先に読み込む） */
  preload?: boolean;
};

export function VillageIllustration({ preload = false }: Props) {
  return (
    <div className="hero">
      <Image
        src={village}
        alt="山と海に囲まれた小さな村。港には船が並び、旅人が村へ続く道を歩いている水彩画"
        placeholder="blur"
        preload={preload}
        sizes="(max-width: 480px) 100vw, 480px"
        style={{ display: "block", width: "100%", height: "auto" }}
      />
    </div>
  );
}
