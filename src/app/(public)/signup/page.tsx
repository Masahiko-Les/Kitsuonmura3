import type { Metadata } from "next";
import { TopBar } from "@/components/TopBar";
import { SignupForm } from "./SignupForm";

export const metadata: Metadata = { title: "住民票をつくる", robots: { index: false } };

// 新規登録（試作品の V.register）
export default function SignupPage() {
  return (
    <>
      <TopBar title="住民票をつくる" back />
      <div className="pad">
        <p>まずは、呼び名と年代だけで大丈夫です。吃音のことや吃音史は、あとからいつでも書き足せます。</p>
        <SignupForm />
      </div>
    </>
  );
}
