import { MenuItem } from "../data";
import { syntaxHighlight } from "./syntaxHighlight";
import styles from "./codeOverlay.module.scss";

interface Props {
  item: MenuItem | null;
}

const CodeView = ({ item }: Props) => {
  if (!item) return null;
  const lines = item.code.split("\n").map(l => l.replace(/:\s{2,}/g, ": "));
  return (
    <div className={styles.codeView}>
      <div className={styles.lineNumbers}>
        {lines.map((_, i) => <div key={i}>{i + 1}</div>)}
      </div>
      <div className={styles.codeBody}>
        {lines.map((line, i) => (
          <div key={i}>{syntaxHighlight(line)}</div>
        ))}
      </div>
    </div>
  );
};

export default CodeView;
