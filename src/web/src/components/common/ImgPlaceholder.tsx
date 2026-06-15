import { useMemo } from "react";

function ImgPlaceholder({
  seed,
  className,
}: {
  seed: string;
  className: string;
}) {
  const avatar = useMemo(() => {
    const url = new URL("https://api.dicebear.com/9.x/initials/svg");
    url.searchParams.set("seed", seed);
    url.searchParams.set("size", "128");
    return url.href;
  }, [seed]);

  return <img src={avatar} alt={seed} className={className} />;
}

export { ImgPlaceholder };
