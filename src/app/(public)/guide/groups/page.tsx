// 自助グループを地域から探す。団体ごとのページや県別ページは、個別に確かめてから作る
import { GROUP_LIST_URL, GUIDE_GROUPS } from "@content/guide";
import s from "@/components/ui.module.css";
import { GroupFinder } from "../_components/GroupFinder";
import { GuidePageView, guideMetadata } from "../_components/GuidePageView";
import { ExternalLink } from "../_components/parts";

export const metadata = guideMetadata("groups");

export default function GuideGroups() {
  return (
    <GuidePageView slug="groups">
      <section className={s.section} aria-labelledby="by-area">
        <h2 id="by-area" className={s.h2}>
          地域から探す
        </h2>
        <p className={`${s.small} ${s.muted}`}>
          地域は、全国言友会連絡協議会の加盟団体一覧の区分です。団体の所在地（都道府県）を示すものではありません。
          連絡するときは、一覧のページから各団体の最新の情報を確かめてください。
        </p>
        <ExternalLink href={GROUP_LIST_URL}>全国言友会連絡協議会・加盟団体一覧</ExternalLink>
        <GroupFinder groups={GUIDE_GROUPS} />
      </section>
    </GuidePageView>
  );
}
