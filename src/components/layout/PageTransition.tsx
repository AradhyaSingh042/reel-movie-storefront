import { useEffect, useRef, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import anime from 'animejs';

export function PageTransition({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    if (!containerRef.current) return;
    anime({
      targets: containerRef.current,
      opacity: [0, 1],
      translateY: [12, 0],
      easing: 'easeOutQuart',
      duration: 420,
    });
  }, [location.pathname]);

  return (
    <div ref={containerRef} key={location.pathname}>
      {children}
    </div>
  );
}
