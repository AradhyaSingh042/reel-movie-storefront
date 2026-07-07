import { useRef, useEffect } from 'react';
import anime from 'animejs';
import type { Show } from '../../types/show';
import { Button } from '../ui/Button';

interface HeroBannerProps {
  show: Show | null;
  isLoading: boolean;
  onOpen: (show: Show) => void;
}

export function HeroBanner({ show, isLoading, onOpen }: HeroBannerProps) {
  const posterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!show || !posterRef.current) return;
    anime({
      targets: posterRef.current,
      opacity: [0, 1],
      translateX: [-16, 0],
      easing: 'easeOutCubic',
      duration: 500,
    });
  }, [show?.id]);

  return (
    <section className="mb-10">
      <div className="mb-6 overflow-hidden rounded-md border border-line bg-surface py-2">
        <div className="flex w-max animate-marquee whitespace-nowrap font-mono text-xs tracking-[0.2em] text-marquee">
          {Array.from({ length: 2 }).map((_, i) => (
            <span key={i} className="px-6">
              ★ NOW SHOWING — {show ? show.name.toUpperCase() : 'LOADING TODAY’S PICK'} ★ TODAY’S
              TOP SHOW ★ NOW SHOWING — {show ? show.name.toUpperCase() : 'LOADING TODAY’S PICK'} ★
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 rounded-xl border border-line bg-surface p-6 md:grid-cols-[220px_1fr]">
        <div
          ref={posterRef}
          className="aspect-[2/3] w-full max-w-[220px] overflow-hidden rounded-lg bg-surfaceRaised"
        >
          {show?.image && (
            <img
              src={show.image}
              alt={show.name}
              className="h-full w-full object-cover"
            />
          )}
        </div>
        <div className="flex flex-col justify-center gap-3">
          <p className="font-mono text-xs uppercase tracking-widest text-live">
            Today's top show
          </p>
          {isLoading || !show ? (
            <div className="h-10 w-2/3 animate-pulse rounded bg-surfaceRaised" />
          ) : (
            <>
              <h1 className="font-display text-5xl leading-none tracking-wide">
                {show.name}
              </h1>
              <div className="flex gap-3 font-mono text-sm text-muted">
                <span>{show.premiereYear ?? '—'}</span>
                {show.rating && <span>★ {show.rating}</span>}
                <span>{show.status}</span>
              </div>
              <p className="max-w-xl text-sm text-muted line-clamp-3">
                {show.summary}
              </p>
              <div className="mt-2 flex gap-3">
                <Button onClick={() => onOpen(show)}>View details</Button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
