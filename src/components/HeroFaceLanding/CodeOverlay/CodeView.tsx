import { MenuItem } from "../data";
import { syntaxHighlight } from "./syntaxHighlight";
import styles from "./codeOverlay.module.scss";

interface Props {
  item: MenuItem | null;
  isMobile?: boolean;
}

const CodeView = ({ item, isMobile }: Props) => {
  if (!item) return null;
  const lines = item.code.split("\n").map(l => isMobile ? l.trimStart() : l);
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
