"use client";

import { useState, useEffect, useCallback, useRef, type ComponentProps } from "react";
import Image from "next/image";
import {
  Cancel01Icon,
  ArrowLeft02Icon,
  ArrowRight02Icon,
  PlusSignIcon,
  MinusSignIcon,
  ArrowShrink02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "@/lib/utils";

const MIN_SCALE = 1;
const MAX_SCALE = 5;

type DistroGalleryProps = {
  img: string | undefined;
  screenshots: string[];
  name: string;
};

type ControlButtonProps = {
  onClick: () => void;
  label: string;
  icon: ComponentProps<typeof HugeiconsIcon>["icon"];
  disabled?: boolean;
};

function ControlButton({ onClick, label, icon, disabled }: ControlButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="rounded-full bg-white/10 p-2 text-white/70 transition-colors hover:bg-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white/10 disabled:hover:text-white/70"
    >
      <HugeiconsIcon icon={icon} size="1rem" />
    </button>
  );
}

export function DistroGallery({ img, screenshots, name }: DistroGalleryProps) {
  const allImages = [img, ...screenshots].filter(Boolean) as string[];
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [scale, setScale] = useState(1);

  const overlayRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const imgWrapRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Committed transform applied to the image wrapper.
  const tf = useRef({ x: 0, y: 0, scale: 1 });
  // Transient gesture bookkeeping.
  const g = useRef({
    mode: "none" as "none" | "pan" | "pinch" | "swipe",
    axis: null as null | "h" | "v",
    pointerStartX: 0,
    pointerStartY: 0,
    startX: 0,
    startY: 0,
    startScale: 1,
    startDist: 0,
    focalX: 0,
    focalY: 0,
    midStartX: 0,
    midStartY: 0,
    swipeDx: 0,
    swipeDy: 0,
  });

  const isOpen = mounted;
  const hasMultiple = allImages.length > 1;

  const draw = useCallback((x: number, y: number, s: number, animate = false) => {
    const el = imgWrapRef.current;
    if (!el) return;
    el.style.transition = animate ? "transform 0.28s cubic-bezier(0.22,1,0.36,1)" : "none";
    el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${s})`;
  }, []);

  const clampXY = useCallback((s: number, x: number, y: number) => {
    const wrap = imgWrapRef.current;
    const stage = stageRef.current;
    if (!wrap || !stage) return { x, y };
    const maxX = Math.max(0, (wrap.offsetWidth * s - stage.clientWidth) / 2);
    const maxY = Math.max(0, (wrap.offsetHeight * s - stage.clientHeight) / 2);
    return {
      x: Math.min(maxX, Math.max(-maxX, x)),
      y: Math.min(maxY, Math.max(-maxY, y)),
    };
  }, []);

  const commit = useCallback(
    (s: number, x: number, y: number, animate = false) => {
      const c = clampXY(s, x, y);
      tf.current = { x: c.x, y: c.y, scale: s };
      draw(c.x, c.y, s, animate);
      setScale(s);
    },
    [clampXY, draw]
  );

  const zoomTo = useCallback(
    (target: number, focalX: number, focalY: number, animate = false) => {
      const t = tf.current;
      const s2 = Math.min(MAX_SCALE, Math.max(MIN_SCALE, target));
      const ratio = s2 / t.scale;
      const nx = focalX - ratio * (focalX - t.x);
      const ny = focalY - ratio * (focalY - t.y);
      commit(s2, nx, ny, animate);
    },
    [commit]
  );

  const resetTransform = useCallback(
    (animate = false) => {
      tf.current = { x: 0, y: 0, scale: 1 };
      draw(0, 0, 1, animate);
      setScale(1);
    },
    [draw]
  );

  const close = useCallback(() => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setVisible(false);
    closeTimerRef.current = setTimeout(() => {
      setMounted(false);
      setLightboxIndex(null);
      setScale(1);
      tf.current = { x: 0, y: 0, scale: 1 };
    }, 220);
  }, []);

  const goTo = useCallback(
    (index: number) => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
      setLightboxIndex(((index % allImages.length) + allImages.length) % allImages.length);
      tf.current = { x: 0, y: 0, scale: 1 };
      setScale(1);
      requestAnimationFrame(() => draw(0, 0, 1, false));
    },
    [allImages.length, draw]
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
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "+" || e.key === "=") zoomTo(tf.current.scale + 0.5, 0, 0, true);
      else if (e.key === "-" || e.key === "_") zoomTo(tf.current.scale - 0.5, 0, 0, true);
      else if (e.key === "0") resetTransform(true);
    };
    document.addEventListener("keydown", handleKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, close, prev, next, zoomTo, resetTransform]);

  // Pointer / touch / wheel gesture handling.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || !mounted) return;

    const gs = g.current;
    gs.mode = "none";
    gs.axis = null;

    const SWIPE_THRESHOLD = 60;
    const DISMISS_THRESHOLD = 110;

    const centerOf = () => {
      const r = stage.getBoundingClientRect();
      return { cx: r.left + r.width / 2, cy: r.top + r.height / 2 };
    };
    const distOf = (a: Touch, b: Touch) => Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);

    const restoreOverlay = (animate: boolean) => {
      const o = overlayRef.current;
      if (!o) return;
      o.style.transition = animate ? "opacity 0.28s ease" : "none";
      o.style.opacity = "1";
    };

    const onTouchStart = (e: TouchEvent) => {
      const t = tf.current;
      if (e.touches.length === 2) {
        const a = e.touches[0];
        const b = e.touches[1];
        const { cx, cy } = centerOf();
        gs.mode = "pinch";
        gs.axis = null;
        gs.startDist = distOf(a, b);
        gs.startScale = t.scale;
        gs.startX = t.x;
        gs.startY = t.y;
        gs.midStartX = (a.clientX + b.clientX) / 2;
        gs.midStartY = (a.clientY + b.clientY) / 2;
        gs.focalX = gs.midStartX - cx;
        gs.focalY = gs.midStartY - cy;
      } else if (e.touches.length === 1) {
        const tch = e.touches[0];
        gs.pointerStartX = tch.clientX;
        gs.pointerStartY = tch.clientY;
        gs.startX = t.x;
        gs.startY = t.y;
        gs.startScale = t.scale;
        gs.mode = t.scale > 1 ? "pan" : "swipe";
        gs.axis = null;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      const t = tf.current;
      if (gs.mode === "pinch" && e.touches.length >= 2) {
        e.preventDefault();
        const a = e.touches[0];
        const b = e.touches[1];
        const factor = distOf(a, b) / (gs.startDist || 1);
        const s2 = Math.min(MAX_SCALE, Math.max(MIN_SCALE, gs.startScale * factor));
        const ratio = s2 / gs.startScale;
        const midX = (a.clientX + b.clientX) / 2;
        const midY = (a.clientY + b.clientY) / 2;
        const nx = gs.focalX - ratio * (gs.focalX - gs.startX) + (midX - gs.midStartX);
        const ny = gs.focalY - ratio * (gs.focalY - gs.startY) + (midY - gs.midStartY);
        const c = clampXY(s2, nx, ny);
        tf.current = { x: c.x, y: c.y, scale: s2 };
        draw(c.x, c.y, s2, false);
        setScale(s2);
        return;
      }
      if (gs.mode === "pan") {
        e.preventDefault();
        const tch = e.touches[0];
        const nx = gs.startX + (tch.clientX - gs.pointerStartX);
        const ny = gs.startY + (tch.clientY - gs.pointerStartY);
        const c = clampXY(t.scale, nx, ny);
        tf.current = { x: c.x, y: c.y, scale: t.scale };
        draw(c.x, c.y, t.scale, false);
        return;
      }
      if (gs.mode === "swipe") {
        const tch = e.touches[0];
        const dx = tch.clientX - gs.pointerStartX;
        const dy = tch.clientY - gs.pointerStartY;
        if (!gs.axis && Math.hypot(dx, dy) > 10) {
          gs.axis = Math.abs(dx) > Math.abs(dy) ? "h" : "v";
        }
        if (gs.axis === "h") {
          e.preventDefault();
          gs.swipeDx = dx;
          draw(dx, 0, 1, false);
        } else if (gs.axis === "v" && dy > 0) {
          e.preventDefault();
          gs.swipeDy = dy;
          const s = Math.max(0.85, 1 - dy / 1600);
          draw(0, dy, s, false);
          const o = overlayRef.current;
          if (o) {
            o.style.transition = "none";
            o.style.opacity = String(Math.max(0.3, 1 - dy / 500));
          }
        }
        return;
      }
    };

    const finishSwipe = () => {
      if (gs.axis === "h") {
        const dx = gs.swipeDx;
        if (hasMultiple && dx > SWIPE_THRESHOLD) prev();
        else if (hasMultiple && dx < -SWIPE_THRESHOLD) next();
        else draw(0, 0, 1, true);
      } else if (gs.axis === "v") {
        if (gs.swipeDy > DISMISS_THRESHOLD) {
          close();
        } else {
          draw(0, 0, 1, true);
          restoreOverlay(true);
        }
      }
      gs.swipeDx = 0;
      gs.swipeDy = 0;
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (gs.mode === "pinch") {
        if (tf.current.scale <= 1.02) resetTransform(true);
        if (e.touches.length === 1) {
          const tch = e.touches[0];
          gs.mode = "pan";
          gs.pointerStartX = tch.clientX;
          gs.pointerStartY = tch.clientY;
          gs.startX = tf.current.x;
          gs.startY = tf.current.y;
        } else if (e.touches.length === 0) {
          gs.mode = "none";
          gs.axis = null;
        }
        return;
      }
      if (gs.mode === "swipe") finishSwipe();
      if (e.touches.length === 0) {
        gs.mode = "none";
        gs.axis = null;
      }
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const { cx, cy } = centerOf();
      zoomTo(tf.current.scale * (1 - e.deltaY * 0.0015), e.clientX - cx, e.clientY - cy, false);
    };

    const onDblClick = (e: MouseEvent) => {
      const { cx, cy } = centerOf();
      if (tf.current.scale > 1) resetTransform(true);
      else zoomTo(2.5, e.clientX - cx, e.clientY - cy, true);
    };

    let dragging = false;
    const onMouseDown = (e: MouseEvent) => {
      if (tf.current.scale <= 1) return;
      dragging = true;
      gs.pointerStartX = e.clientX;
      gs.pointerStartY = e.clientY;
      gs.startX = tf.current.x;
      gs.startY = tf.current.y;
      stage.style.cursor = "grabbing";
      e.preventDefault();
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!dragging) return;
      const nx = gs.startX + (e.clientX - gs.pointerStartX);
      const ny = gs.startY + (e.clientY - gs.pointerStartY);
      const c = clampXY(tf.current.scale, nx, ny);
      tf.current = { x: c.x, y: c.y, scale: tf.current.scale };
      draw(c.x, c.y, tf.current.scale, false);
    };
    const onMouseUp = () => {
      dragging = false;
      stage.style.cursor = "";
    };

    stage.addEventListener("touchstart", onTouchStart, { passive: false });
    stage.addEventListener("touchmove", onTouchMove, { passive: false });
    stage.addEventListener("touchend", onTouchEnd);
    stage.addEventListener("touchcancel", onTouchEnd);
    stage.addEventListener("wheel", onWheel, { passive: false });
    stage.addEventListener("dblclick", onDblClick);
    stage.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      stage.removeEventListener("touchstart", onTouchStart);
      stage.removeEventListener("touchmove", onTouchMove);
      stage.removeEventListener("touchend", onTouchEnd);
      stage.removeEventListener("touchcancel", onTouchEnd);
      stage.removeEventListener("wheel", onWheel);
      stage.removeEventListener("dblclick", onDblClick);
      stage.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [
    mounted,
    lightboxIndex,
    hasMultiple,
    prev,
    next,
    close,
    zoomTo,
    resetTransform,
    clampXY,
    draw,
  ]);

  const openAt = useCallback((index: number) => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    tf.current = { x: 0, y: 0, scale: 1 };
    setScale(1);
    setLightboxIndex(index);
    setMounted(true);
    // Two-phase: mount first (opacity 0), then paint → set visible (opacity 1)
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
  }, []);

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
          ref={overlayRef}
          className="fixed inset-0 z-50 flex flex-col bg-black/92 backdrop-blur-sm select-none"
          style={{
            opacity: visible ? 1 : 0,
            transition: "opacity 0.22s ease",
          }}
          role="dialog"
          aria-modal="true"
          aria-label={`${name} image lightbox`}
        >
          {/* Top bar */}
          <div className="relative z-20 flex shrink-0 items-center justify-between gap-2 px-3 py-3 sm:px-4">
            <span className="text-sm font-medium text-white/60 tabular-nums">
              {hasMultiple ? `${lightboxIndex + 1} / ${allImages.length}` : name}
            </span>
            <div className="flex items-center gap-1.5">
              <ControlButton
                onClick={() => zoomTo(tf.current.scale - 0.5, 0, 0, true)}
                disabled={scale <= MIN_SCALE}
                label="Zoom out"
                icon={MinusSignIcon}
              />
              <span className="w-11 text-center text-xs font-medium text-white/50 tabular-nums">
                {Math.round(scale * 100)}%
              </span>
              <ControlButton
                onClick={() => zoomTo(tf.current.scale + 0.5, 0, 0, true)}
                disabled={scale >= MAX_SCALE}
                label="Zoom in"
                icon={PlusSignIcon}
              />
              <ControlButton
                onClick={() => resetTransform(true)}
                disabled={scale === 1}
                label="Reset zoom"
                icon={ArrowShrink02Icon}
              />
              <ControlButton onClick={close} label="Close gallery" icon={Cancel01Icon} />
            </div>
          </div>

          {/* Stage */}
          <div
            ref={stageRef}
            className="relative min-h-0 flex-1 overflow-hidden"
            style={{ touchAction: "none", cursor: scale > 1 ? "grab" : "default" }}
          >
            <div
              className="flex h-full w-full items-center justify-center"
              onClick={() => {
                if (tf.current.scale === 1) close();
              }}
            >
              <div
                ref={imgWrapRef}
                style={{ willChange: "transform", transformOrigin: "center center" }}
                onClick={(e) => e.stopPropagation()}
              >
                <div key={lightboxIndex} className="animate-in fade-in-0 zoom-in-95 duration-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={allImages[lightboxIndex]}
                    alt={`${name} screenshot ${lightboxIndex + 1}`}
                    draggable={false}
                    className="pointer-events-none block"
                    style={{
                      maxWidth: "94vw",
                      maxHeight: "calc(100dvh - 140px)",
                      width: "auto",
                      height: "auto",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Navigation arrows (desktop) */}
          {hasMultiple && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                className="fixed top-1/2 left-3 z-20 hidden -translate-y-1/2 rounded-full bg-white/10 p-3 text-white/70 transition-colors hover:bg-white/20 hover:text-white sm:flex"
                aria-label="Previous image"
              >
                <HugeiconsIcon icon={ArrowLeft02Icon} size="1.125rem" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                className="fixed top-1/2 right-3 z-20 hidden -translate-y-1/2 rounded-full bg-white/10 p-3 text-white/70 transition-colors hover:bg-white/20 hover:text-white sm:flex"
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
