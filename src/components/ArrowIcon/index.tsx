/** Diagonal arrow for links that leave the page */
const ArrowIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 16 16"
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M5 3.5h7.5V11M12.5 3.5 3.5 12.5" />
  </svg>
);

export default ArrowIcon;
