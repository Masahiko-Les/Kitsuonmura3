import { GuidePageView, guideMetadata } from "../_components/GuidePageView";

export const metadata = guideMetadata("about");

export default function GuideAbout() {
  return <GuidePageView slug="about" />;
}
