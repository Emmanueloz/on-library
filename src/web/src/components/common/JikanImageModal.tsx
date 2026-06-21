import { useState } from "react";
import { useJikanSearch } from "../../hooks/useJikanSearch";

interface JikanImageModalProps {
  onClose: () => void;
  onSelect: (imageUrl: string) => void;
  initialQuery?: string;
}

function JikanImageModal({
  onClose,
  onSelect,
  initialQuery,
}: JikanImageModalProps) {
  const {
    search: searchJikan,
    images,
    isLoading: isSearching,
    clearImages,
  } = useJikanSearch();

  const [query, setQuery] = useState(initialQuery || "");

  const handleSearch = () => {
    if (query.trim()) {
      searchJikan(query);
    }
  };

  const handleSelect = (imageUrl: string) => {
    onSelect(imageUrl);
    handleClose();
  };

  const handleClose = () => {
    setQuery("");
    clearImages();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-stone-900 border border-border rounded-xl p-6 w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">
            Search Cover Image
          </h3>
          <button
            onClick={handleClose}
            className="text-dim-gray hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="flex gap-3 mb-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search manga..."
            className="flex-1 bg-background border border-[var(--color-border)/0.08] rounded px-3 py-2 text-sm focus:border-primary/50 focus:outline-none transition-all"
          />
          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded hover:brightness-110 transition-all disabled:opacity-50"
          >
            {isSearching ? "..." : "Search"}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {images.length > 0 ? (
            <div className="space-y-3">
              {images.map((img, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-3 bg-background border border-border rounded-lg"
                >
                  <p className="text-sm text-foreground font-medium min-w-30 max-w-45 truncate shrink-0">
                    {img.title}
                  </p>
                  <div className="flex gap-2 flex-1">
                    {img.images.jpg.small_image_url && (
                      <button
                        onClick={() => handleSelect(img.images.jpg.small_image_url!)}
                        className="flex-1 aspect-3/4 overflow-hidden rounded hover:ring-2 hover:ring-primary transition-all"
                      >
                        <img
                          src={img.images.jpg.small_image_url}
                          alt={img.title + " small"}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    )}
                    <button
                      onClick={() => handleSelect(img.images.jpg.image_url)}
                      className="flex-1 aspect-3/4 overflow-hidden rounded hover:ring-2 hover:ring-primary transition-all"
                    >
                      <img
                        src={img.images.jpg.image_url}
                        alt={img.title + " medium"}
                        className="w-full h-full object-cover"
                      />
                    </button>
                    {img.images.jpg.large_image_url && (
                      <button
                        onClick={() => handleSelect(img.images.jpg.large_image_url!)}
                        className="flex-1 aspect-3/4 overflow-hidden rounded hover:ring-2 hover:ring-primary transition-all"
                      >
                        <img
                          src={img.images.jpg.large_image_url}
                          alt={img.title + " large"}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-dim-gray py-8">
              {isSearching
                ? "Searching..."
                : "No results yet. Search for a manga cover."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export { JikanImageModal };
