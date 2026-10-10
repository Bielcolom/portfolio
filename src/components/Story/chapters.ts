/** How many chapters the pinned experience story holds; the particles share it */
export const CHAPTER_COUNT = 4;

/** Half-width of each crossing, in story progress: the shape morphs inside it */
const CROSSING = 0.07;

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/**
 * Story progress (0 to 1 across the pinned scroll) to a chapter position:
 * whole numbers while a chapter holds, fractions while the next one forms.
 */
export function chapterFloat(progress: number) {
  let position = 0;
  for (let i = 1; i < CHAPTER_COUNT; i++) {
    position += smoothstep(i / CHAPTER_COUNT - CROSSING, i / CHAPTER_COUNT + CROSSING, progress);
  }
  return position;
}

/** The chapter whose text is showing: it swaps at the middle of each morph */
export const activeChapter = (progress: number) => Math.round(chapterFloat(progress));

/** Story progress at the middle of a chapter's hold, for jumping to it */
export const chapterAnchor = (index: number) => (index + 0.5) / CHAPTER_COUNT;
