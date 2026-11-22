import { notFound } from "next/navigation";
import { GUIDE, findGuideCategory } from "@content/guide";
import { GuideItemView } from "@/components/guide/GuideItemView";
import { TopBar } from "@/components/TopBar";
import { publicMetadata } from "@/lib/metadata";

export function generateStaticParams() {
  return GUIDE.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/guide/[category]">) {
  const { category } = await params;
  const c = findGuideCategory(category);
  if (!c) return {};
  return publicMetadata({
    title: `${c.name}｜吃音情報ガイド`,
    description: c.description,
    path: `/guide/${c.slug}`,
  });
}

// カテゴリ別ページ
export default async function GuideCategoryPage({ params }: PageProps<"/guide/[category]">) {
  const { category } = await params;
  const c = findGuideCategory(category);
  if (!c) notFound();
  return (
    <>
      <TopBar title={c.name} back fallbackHref="/guide" />
      <div className="pad">
        <p>{c.description}</p>
        <div className="card">
          {c.items.map((it) => (
            <GuideItemView key={it.name} item={it} />
          ))}
        </div>
      </div>
    </>
  );
}
