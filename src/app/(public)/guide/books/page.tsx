import { GuidePageView, guideMetadata } from "../_components/GuidePageView";

export const metadata = guideMetadata("books");

export default function GuideBooks() {
  return <GuidePageView slug="books" />;
}
