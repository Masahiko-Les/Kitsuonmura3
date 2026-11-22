import { TopBar } from "@/components/TopBar";
import { publicMetadata } from "@/lib/metadata";

export const metadata = publicMetadata({
  title: "吃音村について",
  description:
    "吃音を抱えているのは、自分一人ではない。吃音村は、吃音を抱えて生きる人たちが互いの存在を知り、苦労を語り、他者の人生に触れ、希望を見いだしていく場所です。",
  path: "/about",
});

// 吃音村について（試作品の V.about）
export default function AboutPage() {
  return (
    <>
      <TopBar title="吃音村について" back />
      <div className="pad">
        <h2 className="display" style={{ fontSize: 22 }}>
          吃音を抱えているのは、自分一人ではない。
        </h2>
        <p className="prose" style={{ fontSize: 15 }}>
          {`吃音村は、吃音を抱えて生きる人たちが、互いの存在を知り、自分の苦労を語り、他者の人生に触れ、希望を見いだしていく場所です。

吃音を治すことだけを目指すのではなく、吃音を抱えながらも、自分の人生を豊かにしていくことを大切にします。

自分が経験してきた苦労が、別の誰かの支えになる。先人たちが残した語りや読書体験が、後から来る当事者に希望を届ける。住民一人ひとりの人生が、少しずつ村の財産になっていきます。`}
        </p>
        <p className="note">吃音村は医療機関ではなく、治療効果を保証するサービスでもありません。</p>
      </div>
    </>
  );
}
