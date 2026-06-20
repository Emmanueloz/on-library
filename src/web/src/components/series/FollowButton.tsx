interface FollowButtonProps {
  isFollowing: boolean;
  isLoading: boolean;
  onToggle: () => void;
  className?: string;
}

function FollowButton({ isFollowing, isLoading, onToggle, className = "" }: FollowButtonProps) {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle();
      }}
      disabled={isLoading}
      className={`px-3 py-1.5 text-xs font-semibold border rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${isFollowing
          ? "bg-primary/20 text-primary border-primary/30 hover:bg-primary/30"
          : "text-foreground border-[var(--color-border)/0.1] hover:opacity-60"
        } ${className}`}
    >
      {isLoading ? "..." : isFollowing ? "Following" : "+ Follow"}
    </button>
  );
}

export { FollowButton };