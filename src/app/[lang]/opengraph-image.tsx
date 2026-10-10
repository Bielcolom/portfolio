import { card, cardAlt } from "../og/card";

export { contentType, generateStaticParams, size } from "../og/card";
export const alt = cardAlt("home");

export default function OpengraphImage({ params }: { params: Promise<{ lang: string }> }) {
  return card(params, "home");
}
