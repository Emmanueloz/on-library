import type { ISeries } from "@on-library/shared";
import { NavLink } from "react-router";

function SeriesRow({ series }: { series: ISeries[] }) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
      {series.map((s) => (
        <NavLink
          key={s.id}
          to={`/serie/${s.id}`}
          className="shrink-0 w-32 snap-start group"
        >
          <div className="w-32 h-44 rounded-xl overflow-hidden mb-2 bg-surface border border-[rgba(255,255,255,0.06)] group-hover:border-[rgba(255,255,255,0.12)] transition-all duration-200">
            <img
              src={s.pictureUrl}
              alt={s.title}
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-[12px] font-semibold leading-[1.33] tracking-[0.2px] text-foreground line-clamp-2">
            {s.title}
          </p>
          <p className="text-[10px] font-medium tracking-[0.2px] text-dim-gray mt-0.5">
            {s.author}
          </p>
        </NavLink>
      ))}
    </div>
  );
}

export { SeriesRow };
