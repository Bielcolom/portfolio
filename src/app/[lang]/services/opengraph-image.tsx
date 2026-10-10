import { card, cardAlt } from "../../og/card";

export { contentType, generateStaticParams, size } from "../../og/card";
export const alt = cardAlt("services");

export default function OpengraphImage({ params }: { params: Promise<{ lang: string }> }) {
  return card(params, "services");
}
