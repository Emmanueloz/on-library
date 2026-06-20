import type { IChapter } from "@on-library/shared";
import { NavLink } from "react-router";

function CardChapter({ chapter }: { chapter: IChapter }) {
  return (
    <div className="relative group h-80 rounded-2xl overflow-hidden">
      <img
        src={chapter.series?.pictureUrl}
        alt={chapter.series?.title}
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-4 transition-opacity duration-200 group-hover:opacity-0">
        <p className="text-[16px] font-semibold leading-[1.4] tracking-[0.2px] text-foreground">
          {chapter.title}
        </p>
        <p className="text-[14px] font-medium leading-[1.14] tracking-[0.2px] text-light-gray">
          {chapter.series?.title}
        </p>
      </div>

      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-4 p-4">
        <NavLink
          to={`/serie/${chapter.idSeries}`}
          className="px-6 py-3 text-sm font-semibold text-foreground border border-[rgba(255,255,255,0.2)] rounded-full hover:bg-white/10 transition-all duration-200 tracking-[0.3px]"
        >
          Ir a la Serie
        </NavLink>

        <div className="text-center">
          <p className="text-[12px] font-semibold tracking-[0.3px] text-primary mb-1">
            CAP. {chapter.number}
          </p>
          <p className="text-[14px] font-medium text-light-gray mb-2">
            "{chapter.title}"
          </p>
          <NavLink
            to={`/chapter/${chapter.id}`}
            className="text-[13px] font-semibold text-accent-blue hover:underline tracking-[0.3px]"
          >
            → LEER AHORA
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export { CardChapter };
