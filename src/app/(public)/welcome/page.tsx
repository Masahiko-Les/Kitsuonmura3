import { publicMetadata } from "@/lib/metadata";
import { Opening } from "./Opening";

export const metadata = publicMetadata({
  title: "ようこそ、吃音村へ",
  description:
    "ここは、吃音を抱えながら生きる人たちの小さな村です。あなたと同じように、さまざまな苦労を抱えながら生きている人たちがいます。私たちは、あなたを歓迎します。",
  path: "/welcome",
});

export default function WelcomePage() {
  return <Opening />;
}
