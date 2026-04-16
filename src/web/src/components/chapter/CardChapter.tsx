import type { IChapter } from "@on-library/shared";
import { NavLink } from "react-router";

function CardChapter({ chapter }: { chapter: IChapter }) {
  return (
    <NavLink to={`/chapter/${chapter.id}`} className="flex gap-2 ">
      <div className="w-1/4">
        <img src={chapter.series?.pictureUrl} alt={chapter.series?.title} />
      </div>
      <div className="w-3/4">
        <p className="text-2xl">{chapter.series?.title}</p>
        <p className="text-1xl">{chapter.title}</p>
        <span className="text-1xs">{chapter.series?.category?.name}</span>
      </div>
    </NavLink>
  );
}

export { CardChapter };
