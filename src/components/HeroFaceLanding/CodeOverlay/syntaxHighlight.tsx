import { ReactNode } from "react";

const COLOR_MAP: Record<string, string> = {
  kw: "#c277ff",
  str: "#7ee08a",
  num: "#ffb86b",
  sym: "#9aa0aa",
  id: "#dfe3ea",
  ws: "#dfe3ea",
};

const KEYWORDS = ["const", "let", "var", "import", "from", "export", "function", "return", "if", "else", "new"];

export function syntaxHighlight(line: string): ReactNode {
  if (!line) return <span>&nbsp;</span>;
  if (line.trimStart().startsWith("//")) {
    return <span style={{ color: "#5a606b", fontStyle: "italic" }}>{line}</span>;
  }

  const regex = /("[^"]*"|'[^']*'|\b(?:const|let|var|import|from|export|function|return|if|else|new)\b|\b\d+\b|[a-zA-Z_$][a-zA-Z0-9_$]*|[^\w\s])/g;
  const tokens: { t: string; v: string }[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(line)) !== null) {
    if (m.index > last) tokens.push({ t: "ws", v: line.slice(last, m.index) });
    const v = m[0];
    if (v.startsWith('"') || v.startsWith("'")) tokens.push({ t: "str", v });
    else if (KEYWORDS.includes(v)) tokens.push({ t: "kw", v });
    else if (/^\d+$/.test(v)) tokens.push({ t: "num", v });
    else if (/^[a-zA-Z_$]/.test(v)) tokens.push({ t: "id", v });
    else tokens.push({ t: "sym", v });
    last = m.index + v.length;
  }
  if (last < line.length) tokens.push({ t: "ws", v: line.slice(last) });

  return (
    <>
      {tokens.map((tok, i) => (
        <span key={i} style={{ color: COLOR_MAP[tok.t] }}>{tok.v}</span>
      ))}
    </>
  );
}
