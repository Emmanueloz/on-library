import type { ISeries } from "@on-library/shared";
import { NavLink } from "react-router";
import { ChipTag } from "../tags/ChipTag";

function CardSerie({ serie }: { serie: ISeries }) {
  return (
    <NavLink to={`/serie/${serie.id}`} className="flex gap-2">
      <div className="w-2/5">
        <img src={serie.pictureUrl} alt={serie.title} />
      </div>
      <div className="w-3/5 flex flex-col gap-2">
        <p>{serie.title}</p>
        <p>{serie.author}</p>
        <span>{serie.category?.name}</span>
        <div className="flex gap-2">
          {serie.tagsOnSeries?.map((t) => (
            <ChipTag key={t.idTag} tag={t.tag} />
          ))}
        </div>
      </div>
    </NavLink>
  );
}

export { CardSerie };
