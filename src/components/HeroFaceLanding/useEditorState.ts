import { useDeferredValue, useEffect, useState } from "react";
import { EditorView, MenuItem, MenuItemBase } from "./data";

interface EditorState {
  editorView: EditorView;
  selectedIdx: number;
  activeItem: MenuItem | null;
  query: string;
  filteredItems: MenuItem[];
  handleType: (ch: string) => void;
  handleCommand: (cmd: string) => void;
  openMenu: () => void;
  openItem: (idx: number) => void;
  backToMenu: () => void;
  closeEditor: () => void;
}

/**
 * Manages the code-overlay editor state machine.
 * Accepts the full localized item list and handles filtering, selection, and navigation internally.
 */
const useEditorState = (replayKey: number, allItems: MenuItem[]): EditorState => {
  const [editorView, setEditorView] = useState<EditorView>("closed");
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [activeItem, setActiveItem] = useState<MenuItem | null>(null);
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  const filteredItems = allItems.filter((item) => {
    const needle = deferredQuery.trim().toLowerCase();
    if (!needle) return true;
    return [item.id, item.label, item.desc].join(" ").toLowerCase().includes(needle);
  });
  const safeIdx = filteredItems[selectedIdx] ? selectedIdx : 0;

  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      setEditorView("closed");
      setSelectedIdx(0);
      setActiveItem(null);
      setQuery("");
    });
    return () => window.cancelAnimationFrame(id);
  }, [replayKey]);

  const closeEditor = () => {
    setEditorView("closed");
    setActiveItem(null);
    setSelectedIdx(0);
    setQuery("");
  };

  const handleType = (ch: string) => {
    if (!ch.trim() && ch !== " ") return;
    if (editorView !== "menu") {
      setEditorView("menu");
      setActiveItem(null);
    }
    setQuery((prev) => prev + ch.toLowerCase());
    setSelectedIdx(0);
  };

  const handleCommand = (cmd: string) => {
    if (editorView === "closed") {
      if (cmd === "enter" || cmd === "arrowdown" || cmd === "arrowup") {
        setEditorView("menu");
        setSelectedIdx(0);
      }
      return;
    }

    if (editorView === "menu") {
      if (cmd === "arrowdown" && filteredItems.length > 0) {
        setSelectedIdx((i) => (i + 1) % filteredItems.length);
      } else if (cmd === "arrowup" && filteredItems.length > 0) {
        setSelectedIdx((i) => (i - 1 + filteredItems.length) % filteredItems.length);
      } else if (cmd === "enter") {
        const item = filteredItems[safeIdx];
        if (!item) return;
        setActiveItem(item);
        setEditorView("viewing");
      } else if (cmd === "esc") {
        closeEditor();
      } else if (cmd === "backspace") {
        setQuery((prev) => prev.slice(0, -1));
        setSelectedIdx(0);
      }
      return;
    }

    // viewing
    if (cmd === "enter" || cmd === "arrowleft") {
      setEditorView("menu");
      setActiveItem(null);
    } else if (cmd === "esc") {
      closeEditor();
    } else if (cmd === "backspace") {
      setEditorView("menu");
      setActiveItem(null);
      setQuery((prev) => prev.slice(0, -1));
      setSelectedIdx(0);
    } else if (cmd === "arrowdown" && filteredItems.length > 0) {
      const next = (selectedIdx + 1) % filteredItems.length;
      setSelectedIdx(next);
      setActiveItem(filteredItems[next]);
    } else if (cmd === "arrowup" && filteredItems.length > 0) {
      const prev = (selectedIdx - 1 + filteredItems.length) % filteredItems.length;
      setSelectedIdx(prev);
      setActiveItem(filteredItems[prev]);
    }
  };

  const openMenu = () => {
    if (editorView === "closed") {
      setEditorView("menu");
      setSelectedIdx(0);
    }
  };

  const openItem = (idx: number) => {
    setSelectedIdx(idx);
    setActiveItem(filteredItems[idx] ?? null);
    setEditorView("viewing");
  };

  const backToMenu = () => {
    setEditorView("menu");
    setActiveItem(null);
  };

  return {
    editorView,
    selectedIdx: safeIdx,
    activeItem,
    query,
    filteredItems,
    handleType,
    handleCommand,
    openMenu,
    openItem,
    backToMenu,
    closeEditor,
  };
};

export default useEditorState;
