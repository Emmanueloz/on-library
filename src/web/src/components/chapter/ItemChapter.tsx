import type { IChapter } from "@on-library/shared";
import { NavLink } from "react-router";

function ItemChapter({ chapter }: { chapter: IChapter }) {
  return (
    <div className="bg-surface border-[var(--color-border)/0.06] rounded-lg p-4 flex items-center hover:border-[var(--color-border)/0.12] transition-all duration-200">
      <NavLink to={`/chapter/${chapter.id}`} className="flex items-center gap-4 w-full">
        <div className="bg-primary/20 text-primary w-10 h-10 flex items-center justify-center rounded-sm">
          <span className="text-[14px] font-medium">{chapter.number}</span>
        </div>
        <p className="text-[18px] font-normal leading-[1.15] tracking-[0.2] text-foreground">{chapter.title}</p>
      </NavLink>
      <div className="text-[12px] font-medium text-dim-gray">unread</div>
    </div>
  );
}

export { ItemChapter };