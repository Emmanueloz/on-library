import type { ViewMode } from "../hooks/useConfig";
import type { BookmarkReaderProps } from "./bookmarkReaderProps.interface";

export interface PdfReaderProps extends BookmarkReaderProps {
  url: string;
  viewMode: ViewMode;
}
