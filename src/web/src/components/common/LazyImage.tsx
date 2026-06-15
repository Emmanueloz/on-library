import { useEffect, useRef, useState } from "react";

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  rootMargin?: string;
  minHeight?: string;
}

function LazyImage({
  src,
  alt,
  className = "",
  rootMargin = "200px",
  minHeight = "300px",
}: LazyImageProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin },
    );

    const currentRef = imgRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [rootMargin]);

  return (
    <div
      ref={imgRef}
      className={`relative overflow-hidden bg-stone-800 ${className}`}
      style={{ minHeight }}
    >
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-stone-700 animate-pulse" />
      )}

      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-stone-900">
          <span className="text-xs text-stone-500">Failed to load</span>
        </div>
      )}

      {isVisible && !hasError && (
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-contain transition-opacity duration-300 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
        />
      )}
    </div>
  );
}

export { LazyImage };