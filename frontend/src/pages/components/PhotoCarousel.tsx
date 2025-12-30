import { useEffect, useMemo, useState } from "react";

type CarouselImage = {
  src: string;
  alt: string;
};

type Props = {
  images: CarouselImage[];
  className?: string;
  autoPlay?: boolean;
  autoPlayMs?: number;
  showDots?: boolean;
  showArrows?: boolean;
};

const PhotoCarousel = ({
  images,
  className = "",
  autoPlay = true,
  autoPlayMs = 4500,
  showDots = true,
  showArrows = true,
}: Props) => {
  const safeImages = useMemo(() => images?.filter(Boolean) ?? [], [images]);
  const total = safeImages.length;

  const [index, setIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  useEffect(() => {
    setIndex(0);
  }, [total]);

  useEffect(() => {
    if (!autoPlay || total <= 1) return;
    const id = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % total);
    }, autoPlayMs);
    return () => window.clearInterval(id);
  }, [autoPlay, autoPlayMs, total]);

  const goPrev = () => setIndex((prev) => (prev - 1 + total) % total);
  const goNext = () => setIndex((prev) => (prev + 1) % total);

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const endX = e.changedTouches[0].clientX;
    const delta = endX - touchStartX;

    // swipe threshold
    if (Math.abs(delta) > 50) {
      if (delta > 0) goPrev();
      else goNext();
    }
    setTouchStartX(null);
  };

  if (!total) {
    return (
      <div className="rounded-xl border border-hairline bg-surface p-6 text-sm text-body/70">
        No images found.
      </div>
    );
  }

  const current = safeImages[index];

  return (
    <div
      className={[
        "relative overflow-hidden rounded-2xl border border-hairline bg-white shadow-sm",
        className,
      ].join(" ")}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Image */}
      <div className="relative aspect-[16/9] w-full">
        <img
          src={current.src}
          alt={current.alt}
          className="h-full w-full object-cover"
          loading="lazy"
          draggable={false}
        />
      </div>

      {/* Arrows */}
      {showArrows && total > 1 ? (
        <>
          <button
            type="button"
            aria-label="Previous photo"
            onClick={goPrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-slate-900/40 px-3 py-2 text-white backdrop-blur hover:bg-slate-900/55"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next photo"
            onClick={goNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-slate-900/40 px-3 py-2 text-white backdrop-blur hover:bg-slate-900/55"
          >
            ›
          </button>
        </>
      ) : null}

      {/* Dots */}
      {showDots && total > 1 ? (
        <div className="flex items-center justify-center gap-2 p-3">
          {safeImages.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to photo ${i + 1}`}
              onClick={() => setIndex(i)}
              className={[
                "h-2.5 w-2.5 rounded-full transition",
                i === index ? "bg-brand" : "bg-slate-300 hover:bg-slate-400",
              ].join(" ")}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default PhotoCarousel;
