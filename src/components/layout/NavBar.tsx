import { NavLink } from 'react-router-dom';
import { NetworkBanner } from './NetworkBanner';

const links = [
  { to: '/home', label: 'Home' },
  { to: '/search', label: 'Search' },
  { to: '/profile', label: 'Profile' },
];

export function NavBar() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ink/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-8">
          <span className="font-display text-3xl tracking-wide text-marquee">
            REEL
          </span>
          <nav className="flex gap-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-surfaceRaised text-text'
                      : 'text-muted hover:text-text'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <NetworkBanner />
      </div>
    </header>
  );
}
