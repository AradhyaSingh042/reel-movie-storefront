import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import anime from "animejs";
import type { Show } from "../../types/show";
import { Button } from "../ui/Button";
import { useLibraryStore } from "../../store/libraryStore";

interface ShowModalProps {
  show: Show | null;
  onClose: () => void;
}

const OPEN_DURATION = 320;
const CLOSE_DURATION = 220;

function pulseButton(button: HTMLButtonElement) {
  anime({
    targets: button,
    scale: [1, 1.05, 1],
    duration: 320,
    easing: "easeOutElastic(1, .65)",
  });
}

export function ShowModal({ show, onClose }: ShowModalProps) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const [activeShow, setActiveShow] = useState<Show | null>(show);
  const isClosingRef = useRef(false);

  const addToWatchlist = useLibraryStore((s) => s.addToWatchlist);
  const removeFromWatchlist = useLibraryStore((s) => s.removeFromWatchlist);
  const markAsWatched = useLibraryStore((s) => s.markAsWatched);
  const watchlist = useLibraryStore((s) => s.watchlist);
  const history = useLibraryStore((s) => s.history);

  useEffect(() => {
    if (!show) return;
    isClosingRef.current = false;
    setActiveShow(show);
  }, [show]);

  useEffect(() => {
    if (!activeShow) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [activeShow]);

  useEffect(() => {
    if (!show || !activeShow || !dialogRef.current || !backdropRef.current)
      return;
    anime.set(backdropRef.current, { opacity: 0 });
    anime.set(dialogRef.current, { opacity: 0, scale: 0.94, translateY: 18 });
    anime({
      targets: backdropRef.current,
      opacity: [0, 1],
      duration: OPEN_DURATION,
      easing: "easeOutQuad",
    });
    anime({
      targets: dialogRef.current,
      opacity: [0, 1],
      scale: [0.94, 1],
      translateY: [18, 0],
      duration: OPEN_DURATION,
      easing: "easeOutQuart",
    });
  }, [activeShow?.id, show]);

  function requestClose() {
    if (isClosingRef.current || !dialogRef.current || !backdropRef.current) {
      onClose();
      return;
    }
    isClosingRef.current = true;
    anime({
      targets: backdropRef.current,
      opacity: 0,
      duration: CLOSE_DURATION,
      easing: "easeInQuad",
    });
    anime({
      targets: dialogRef.current,
      opacity: [1, 0],
      scale: [1, 0.94],
      translateY: [0, 18],
      duration: CLOSE_DURATION,
      easing: "easeInQuart",
      complete: () => {
        setActiveShow(null);
        onClose();
      },
    });
  }

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") requestClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!activeShow) return null;

  const inWatchlist = watchlist.some((item) => item.id === activeShow.id);
  const isWatched = history.some((item) => item.id === activeShow.id);

  return createPortal(
    <div
      ref={backdropRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4"
      onClick={requestClose}
    >
      <div
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
        className="grid max-h-[calc(100vh-2rem)] w-full max-w-2xl grid-cols-1 gap-6 overflow-y-auto rounded-xl border border-line bg-surface p-6 sm:grid-cols-[180px_1fr]"
      >
        <div className="aspect-[2/3] w-full max-w-[180px] self-start overflow-hidden rounded-lg bg-surfaceRaised">
          {activeShow.image && (
            <img
              src={activeShow.image}
              alt={activeShow.name}
              className="h-full w-full object-cover"
            />
          )}
        </div>
        <div className="min-w-0">
          <div className="flex items-start justify-between gap-4">
            <h2 className="font-display text-4xl leading-none tracking-wide">
              {activeShow.name}
            </h2>
            <button
              onClick={requestClose}
              aria-label="Close"
              className="shrink-0 text-muted hover:text-text"
            >
              ✕
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2 font-mono text-xs text-muted">
            <span>{activeShow.premiereYear ?? "—"}</span>
            {activeShow.rating && <span>★ {activeShow.rating}</span>}
            <span>{activeShow.status}</span>
            {activeShow.genres.map((g) => (
              <span
                key={g}
                className="rounded-full border border-line px-2 py-0.5"
              >
                {g}
              </span>
            ))}
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            {activeShow.summary || "No summary available for this show yet."}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              variant={inWatchlist ? "danger" : "primary"}
              onClick={(e) => {
                pulseButton(e.currentTarget);
                if (inWatchlist) {
                  removeFromWatchlist(activeShow.id);
                } else {
                  addToWatchlist(activeShow);
                }
              }}
            >
              {inWatchlist ? "Remove from watchlist" : "+ Add to watchlist"}
            </Button>
            <Button
              variant={isWatched ? "primary" : "ghost"}
              onClick={(e) => {
                pulseButton(e.currentTarget);
                markAsWatched(activeShow);
              }}
            >
              {isWatched ? "✓ Marked as watched" : "Mark as watched"}
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
