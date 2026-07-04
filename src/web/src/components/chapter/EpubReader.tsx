import { useState, useRef, useCallback } from "react";
import {
  ReactReader,
  ReactReaderStyle,
  type IReactReaderStyle,
} from "react-reader";
import type { Rendition } from "epubjs";

const BG = "#07080a";
const FG = "#f9f9f9";
const SURFACE = "#101111";
const MEDIUM_GRAY = "#9c9c9d";

const readerStyles: IReactReaderStyle = {
  ...ReactReaderStyle,
  arrow: { ...ReactReaderStyle.arrow, color: FG },
  arrowHover: { ...ReactReaderStyle.arrowHover, color: "#FF6363" },
  readerArea: {
    ...ReactReaderStyle.readerArea,
    backgroundColor: BG,
    transition: undefined,
  },
  titleArea: { ...ReactReaderStyle.titleArea, color: MEDIUM_GRAY },
  tocArea: { ...ReactReaderStyle.tocArea, background: SURFACE },
  tocButtonExpanded: {
    ...ReactReaderStyle.tocButtonExpanded,
    background: SURFACE,
  },
  tocButtonBar: { ...ReactReaderStyle.tocButtonBar, background: FG },
  tocButton: { ...ReactReaderStyle.tocButton, color: FG },
};

function updateTheme(rendition: Rendition) {
  rendition.themes.override("color", FG);
  rendition.themes.override("background", BG);
  rendition.themes.override("a", "#FF6363");
}

interface EpubReaderProps {
  url: string;
}

function EpubReader({ url }: EpubReaderProps) {
  const [location, setLocation] = useState<string | number | null>(null);
  const renditionRef = useRef<Rendition | null>(null);

  const handleLocationChanged = useCallback((loc: string) => {
    setLocation(loc);
  }, []);

  return (
    <div className="w-full h-[calc(100vh-56px)]">
      <ReactReader
        url={url}
        location={location}
        locationChanged={handleLocationChanged}
        readerStyles={readerStyles}
        getRendition={(rendition) => {
          renditionRef.current = rendition;
          updateTheme(rendition);
        }}
      />
    </div>
  );
}

export { EpubReader };
