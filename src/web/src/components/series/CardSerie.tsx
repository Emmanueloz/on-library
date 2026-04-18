import type { ISeries } from "@on-library/shared";
import { NavLink } from "react-router";
import { ChipTag } from "../tags/ChipTag";

function CardSerie({ serie }: { serie: ISeries }) {
  return (
    <NavLink to={`/serie/${serie.id}`} className="block">
      <div className="bg-surface border-[var(--color-border)/0.06] rounded-2xl p-4 flex gap-4 hover:border-[var(--color-border)/0.12] transition-all duration-200">
        <div className="shrink-0 w-30">
          <img src={serie.pictureUrl} alt={serie.title} className="rounded-xl w-full h-auto object-cover" />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-[22px] font-normal leading-[1.15] tracking-[0] text-foreground">{serie.title}</p>
          <p className="text-[16px] font-medium leading-[1.6] tracking-[0.2] text-foreground">{serie.author}</p>
          <span className="text-[14px] font-medium leading-[1.14] tracking-[0.2] text-medium-gray">{serie.category?.name}</span>
          <div className="flex flex-wrap gap-2">
            {serie.tagsOnSeries?.map((t) => (
              <ChipTag key={t.idTag} tag={t.tag} />
            ))}
          </div>
        </div>
      </div>
    </NavLink>
  );
}

export { CardSerie };