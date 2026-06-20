interface ChapterReadCheckboxProps {
  isRead: boolean;
  onToggle?: (isRead: boolean) => void;
}

function ChapterReadCheckbox({ isRead, onToggle }: ChapterReadCheckboxProps) {
  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(`onTogle`);
    
    onToggle?.(!isRead);
  };

  return (
    <button
      onClick={handleToggle}
      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
        isRead
          ? "bg-primary border-primary"
          : "border-dim-gray hover:border-primary/50"
      }`}
      title={isRead ? "Mark as unread" : "Mark as read"}
    >
      {isRead && (
        <span className="text-white text-xs">✓</span>
      )}
    </button>
  );
}

export { ChapterReadCheckbox };