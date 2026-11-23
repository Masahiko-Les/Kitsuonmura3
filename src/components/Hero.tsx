// 海辺の村のイラスト（角丸）。トップ・歓迎・ホームで使う
import Image from "next/image";
import village from "@/assets/village.jpg";
import s from "./ui.module.css";

export function Hero({ preload = false }: { preload?: boolean }) {
  return (
    <div className={s.hero}>
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
