import { Outlet } from 'react-router-dom';
import { NavBar } from './NavBar';
import { PageTransition } from './PageTransition';

export function AppShell() {
  return (
    <div className="min-h-screen bg-ink">
      <NavBar />
      <main className="mx-auto max-w-6xl px-6 py-8">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
    </div>
  );
}
