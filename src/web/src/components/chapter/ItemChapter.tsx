import type { IChapter } from "@on-library/shared";
import { NavLink } from "react-router";

function ItemChapter({ chapter }: { chapter: IChapter }) {
  return (
    <div key={chapter.id} className="hover:bg-gray-200 rounded-4xl">
      <NavLink
        to={`/chapter/${chapter.id}`}
        className="flex p-4 justify-between items-center"
      >
        <div className="flex gap-4 items-center">
          <div className="bg-gray-700 w-12 h-12 rounded-full flex justify-center items-center">
            <span className="text-white">{chapter.number}</span>
          </div>
          <p className="text-xl">{chapter.title}</p>
        </div>
        <div>
          <span>unread</span>
        </div>
      </NavLink>
    </div>
  );
}

export { ItemChapter };
