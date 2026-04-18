import type { IChapter } from "@on-library/shared";
import { NavLink } from "react-router";

function CardChapter({ chapter }: { chapter: IChapter }) {
  return (
    <NavLink to={`/chapter/${chapter.id}`} className="block">
      <div className="bg-surface border-[var(--color-border)/0.06] rounded-xl overflow-hidden p-4 flex gap-2 hover:border-[var(--color-border)/0.12] transition-all duration-200">
        <div className="w-1/4">
          <img src={chapter.series?.pictureUrl} alt={chapter.series?.title} className="rounded-xl w-full h-auto object-cover" />
        </div>
        <div className="w-3/4 flex flex-col">
          <p className="text-[22px] font-normal leading-[1.15] tracking-[0] text-foreground">{chapter.series?.title}</p>
          <p className="text-[18px] font-normal leading-[1.15] tracking-[0.2] text-foreground">{chapter.title}</p>
          <span className="text-[14px] font-medium leading-[1.14] tracking-[0.2] text-medium-gray">{chapter.series?.category?.name}</span>
        </div>
      </div>
    </NavLink>
  );
}

export { CardChapter };