import { memo, useRef } from 'react';
import anime from 'animejs';
import type { Show } from '../../types/show';

interface ShowCardProps {
  show: Show;
  onOpen: (show: Show) => void;
}

function ShowCardBase({ show, onOpen }: ShowCardProps) {
  const cardRef = useRef<HTMLButtonElement>(null);

  function handleMouseEnter() {
    if (!cardRef.current) return;
    anime({
      targets: cardRef.current,
      scale: 1.045,
      duration: 220,
      easing: 'easeOutQuad',
    });
  }

  function handleMouseLeave() {
    if (!cardRef.current) return;
    anime({
      targets: cardRef.current,
      scale: 1,
      duration: 220,
      easing: 'easeOutQuad',
    });
  }

  return (
    <button
      ref={cardRef}
      onClick={() => onOpen(show)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-surface text-left"
    >
      <img
        src={show.image ?? undefined}
        alt={show.name}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-ink via-ink/80 to-transparent p-3 transition-transform duration-200 group-hover:translate-y-0">
        <p className="truncate text-sm font-semibold text-text">{show.name}</p>
        <p className="font-mono text-xs text-muted">
          {show.premiereYear ?? '—'}
          {show.rating ? ` · ★ ${show.rating}` : ''}
        </p>
      </div>
    </button>
  );
}

export const ShowCard = memo(ShowCardBase, (prev, next) => prev.show.id === next.show.id);
