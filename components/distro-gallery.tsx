"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import {
  Cancel01Icon,
  ArrowLeft02Icon,
  ArrowRight02Icon,
  ZoomInAreaIcon,
  ZoomOutAreaIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "@/lib/utils";

type DistroGalleryProps = {
  img: string | undefined;
  screenshots: string[];
  name: string;
};

export function DistroGallery({ img, screenshots, name }: DistroGalleryProps) {
  const allImages = [img, ...screenshots].filter(Boolean) as string[];
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isOpen = mounted;
  const hasMultiple = allImages.length > 1;

  const close = useCallback(() => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setVisible(false);
    closeTimerRef.current = setTimeout(() => {
      setMounted(false);
      setLightboxIndex(null);
      setZoomed(false);
    }, 200);
  }, []);

  const goTo = useCallback(
    (index: number) => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
      setLightboxIndex(((index % allImages.length) + allImages.length) % allImages.length);
      setZoomed(false);
    },
    [allImages.length]
  );

  const prev = useCallback(() => {
    if (lightboxIndex !== null) goTo(lightboxIndex - 1);
  }, [lightboxIndex, goTo]);

  const next = useCallback(() => {
    if (lightboxIndex !== null) goTo(lightboxIndex + 1);
  }, [lightboxIndex, goTo]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, close, prev, next]);

  // Scroll the zoom container to center after zooming in
  useEffect(() => {
    if (!zoomed || !scrollRef.current) return;
    requestAnimationFrame(() => {
      const el = scrollRef.current;
      if (!el) return;
      el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
      el.scrollTop = (el.scrollHeight - el.clientHeight) / 2;
    });
  }, [zoomed]);

  // Reset scroll when navigating to a different image
  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollLeft = 0;
    scrollRef.current.scrollTop = 0;
  }, [lightboxIndex]);

  const openAt = (index: number) => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setZoomed(false);
    setLightboxIndex(index);
    setMounted(true);
    // Two-phase: mount first (opacity 0), then paint → set visible (opacity 1)
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
  };

  return (
    <>
      {/* Hero */}
      <button
        onClick={() => openAt(0)}
        className="ring-foreground/10 group focus-visible:ring-ring relative block aspect-video w-full cursor-zoom-in overflow-hidden ring-1 focus-visible:ring-2 focus-visible:outline-none"
        aria-label={`Open ${name} gallery`}
      >
        <Image
          src={img ?? "/placeholder.png"}
          alt={`${name} screenshot`}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-[1.015]"
          priority
          sizes="(max-width: 1200px) 100vw, 1152px"
          quality={90}
        />
        {hasMultiple && (
          <span className="pointer-events-none absolute right-3 bottom-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
            1 / {allImages.length}
          </span>
        )}
      </button>

      {/* Thumbnail strip */}
      {hasMultiple && (
        <div
          className="scrollbar-none mt-2 flex gap-2 overflow-x-auto pb-1"
          role="list"
          aria-label="Screenshot thumbnails"
        >
          {allImages.map((src, i) => (
            <button
              key={src}
              role="listitem"
              onClick={() => openAt(i)}
              aria-label={`View screenshot ${i + 1} of ${allImages.length}`}
              className={cn(
                "focus-visible:ring-ring relative h-16 w-24 shrink-0 overflow-hidden ring-1 transition-all focus-visible:ring-2 focus-visible:outline-none",
                i === 0 ? "ring-foreground/40" : "ring-foreground/10 hover:ring-foreground/30"
              )}
            >
              <Image
                src={src}
                alt={`${name} screenshot ${i + 1}`}
                fill
                className="object-cover"
                sizes="96px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {mounted && lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-black/92 backdrop-blur-sm"
          style={{
            opacity: visible ? 1 : 0,
            transition: "opacity 0.2s ease",
          }}
          role="dialog"
          aria-modal="true"
          aria-label={`${name} image lightbox`}
        >
          {/* Top bar */}
          <div className="flex shrink-0 items-center justify-between px-4 py-3">
            <span className="text-sm font-medium text-white/60">
              {hasMultiple ? `${lightboxIndex + 1} / ${allImages.length}` : name}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoomed((z) => !z)}
                className="rounded-full bg-white/10 p-2 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
                aria-label={zoomed ? "Zoom out" : "Zoom in"}
              >
                <HugeiconsIcon icon={zoomed ? ZoomOutAreaIcon : ZoomInAreaIcon} size="1rem" />
              </button>
              <button
                onClick={close}
                className="rounded-full bg-white/10 p-2 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
                aria-label="Close gallery"
              >
                <HugeiconsIcon icon={Cancel01Icon} size="1rem" />
              </button>
            </div>
          </div>

          {/* Scroll container - fills remaining height */}
          <div
            ref={scrollRef}
            className="min-h-0 flex-1"
            style={{
              overflow: zoomed ? "auto" : "hidden",
              touchAction: zoomed ? "pan-x pan-y pinch-zoom" : "none",
            }}
            onClick={!zoomed ? close : undefined}
          >
            {/* Inner wrapper: centers image when it fits; expands to enable scroll when zoomed */}
            <div
              style={
                zoomed
                  ? {
                      display: "inline-flex",
                      minWidth: "100%",
                      minHeight: "100%",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "2rem",
                      boxSizing: "border-box",
                    }
                  : {
                      display: "flex",
                      width: "100%",
                      height: "100%",
                      alignItems: "center",
                      justifyContent: "center",
                    }
              }
              onClick={(e) => e.stopPropagation()}
            >
              <div
                key={lightboxIndex}
                className="animate-in fade-in-0 zoom-in-95 fill-mode-[forwards] duration-200"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={allImages[lightboxIndex]}
                  alt={`${name} screenshot ${lightboxIndex + 1}`}
                  style={
                    zoomed
                      ? {
                          display: "block",
                          maxWidth: "none",
                          maxHeight: "none",
                          width: "auto",
                          height: "auto",
                        }
                      : {
                          display: "block",
                          maxWidth: "90vw",
                          maxHeight: "calc(100dvh - 120px)",
                          width: "auto",
                          height: "auto",
                        }
                  }
                  className={zoomed ? "cursor-zoom-out" : "cursor-zoom-in"}
                />
              </div>
            </div>
          </div>

          {/* Navigation arrows */}
          {hasMultiple && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                className="fixed top-1/2 left-3 z-20 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
                aria-label="Previous image"
              >
                <HugeiconsIcon icon={ArrowLeft02Icon} size="1.125rem" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                className="fixed top-1/2 right-3 z-20 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
                aria-label="Next image"
              >
                <HugeiconsIcon icon={ArrowRight02Icon} size="1.125rem" />
              </button>
            </>
          )}

          {/* Thumbnail dots */}
          {hasMultiple && (
            <div
              className="fixed bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-1.5"
              onClick={(e) => e.stopPropagation()}
            >
              {allImages.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    goTo(i);
                  }}
                  aria-label={`Go to image ${i + 1}`}
                  className={cn(
                    "h-1.5 w-1.5 rounded-full transition-all",
                    i === lightboxIndex ? "scale-125 bg-white" : "bg-white/40 hover:bg-white/70"
                  )}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
