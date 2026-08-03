import { useDeferredValue, useState } from "react";
import { MenuItem } from "./data";

interface IndexState {
  selectedIdx: number;
  query: string;
  filteredItems: MenuItem[];
  handleType: (ch: string) => void;
  handleCommand: (cmd: string) => void;
  openItem: (idx: number) => void;
}

/**
 * State for the screen index: filtering, selection and keyboard navigation.
 * `onOpen` fires when an item is chosen (enter / click) — the parent decides
 * what opening means (scrolling to the matching page section).
 */
const useEditorState = (
  allItems: MenuItem[],
  onOpen: (item: MenuItem) => void,
): IndexState => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  const filteredItems = allItems.filter((item) => {
    const needle = deferredQuery.trim().toLowerCase();
    if (!needle) return true;
    return [item.id, item.label, item.desc].join(" ").toLowerCase().includes(needle);
  });
  const safeIdx = filteredItems[selectedIdx] ? selectedIdx : 0;

  const handleType = (ch: string) => {
    if (!ch.trim() && ch !== " ") return;
    setQuery((prev) => prev + ch.toLowerCase());
    setSelectedIdx(0);
  };

  const handleCommand = (cmd: string) => {
    if (cmd === "arrowdown" && filteredItems.length > 0) {
      setSelectedIdx((i) => (i + 1) % filteredItems.length);
    } else if (cmd === "arrowup" && filteredItems.length > 0) {
      setSelectedIdx((i) => (i - 1 + filteredItems.length) % filteredItems.length);
    } else if (cmd === "enter") {
      const item = filteredItems[safeIdx];
      if (item) onOpen(item);
    } else if (cmd === "backspace") {
      setQuery((prev) => prev.slice(0, -1));
      setSelectedIdx(0);
    } else if (cmd === "esc") {
      setQuery("");
      setSelectedIdx(0);
    }
  };

  const openItem = (idx: number) => {
    const item = filteredItems[idx];
    if (!item) return;
    setSelectedIdx(idx);
    onOpen(item);
  };

  return {
    selectedIdx: safeIdx,
    query,
    filteredItems,
    handleType,
    handleCommand,
    openItem,
  };
};

export default useEditorState;
