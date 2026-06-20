import type { IChapter } from "@on-library/shared";
import { NavLink } from "react-router";
import { ChapterReadCheckbox } from "./ChapterReadCheckbox";

interface ItemChapterProps {
  chapter: IChapter;
  isRead?: boolean;
  showReadStatus?: boolean;
  onToggleRead?: (isRead: boolean) => void;
}

function ItemChapter({ chapter, isRead = false, showReadStatus = false, onToggleRead }: ItemChapterProps) {
  return (
    <div className="bg-surface border-[var(--color-border)/0.06] rounded-lg p-4 flex items-center hover:border-[var(--color-border)/0.12] transition-all duration-200">
      <NavLink to={`/chapter/${chapter.id}`} className="flex items-center gap-4 flex-1">
        <div className={`w-10 h-10 flex items-center justify-center rounded-sm ${
          isRead ? "bg-primary/20 text-primary" : "bg-primary/20 text-primary"
        }`}>
          <span className="text-[14px] font-medium">{chapter.number}</span>
        </div>
        <p className="text-[18px] font-normal leading-[1.15] tracking-[0.2] text-foreground">{chapter.title}</p>
      </NavLink>
      {showReadStatus && (
        <div className="flex items-center gap-3">
          {chapter.id && (
            <ChapterReadCheckbox
              isRead={isRead}
              onToggle={onToggleRead}
            />
          )}
          <span className={`text-[12px] font-medium ${isRead ? "text-primary" : "text-dim-gray"}`}>
            {isRead ? "Read" : "Unread"}
          </span>
        </div>
      )}
    </div>
  );
}

export { ItemChapter };