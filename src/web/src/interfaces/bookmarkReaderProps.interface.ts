export interface BookmarkReaderProps {
  canBookmark?: boolean;
  bookmarkedPages?: Set<number>;
  onToggleBookmark?: (page: number) => void;
  jumpTarget?: { page: number; at: number } | null;
}
