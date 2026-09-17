interface BookmarkButtonProps {
  bookmarked: boolean;
  onToggle: () => void;
}

function BookmarkButton({ bookmarked, onToggle }: BookmarkButtonProps) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
      className={`absolute top-2 left-2 z-30 p-2 rounded-full bg-stone-950/70 border border-border backdrop-blur-sm transition-opacity ${
        bookmarked
          ? "opacity-100 text-primary"
          : "opacity-0 group-hover:opacity-100 text-medium-gray hover:text-white"
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={bookmarked ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        className="w-4 h-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
        />
      </svg>
    </button>
  );
}

export { BookmarkButton };
