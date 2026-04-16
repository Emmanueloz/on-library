import type { ITags } from "@on-library/shared";

function ChipTag({ tag }: { tag: ITags }) {
  return (
    <span className="bg-gray-500 text-white capitalize p-1 rounded-sm">
      {tag.name}
    </span>
  );
}

export { ChipTag };
