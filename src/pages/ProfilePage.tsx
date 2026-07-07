import { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import { useAuthStore } from '../store/authStore';
import { useLibraryStore } from '../store/libraryStore';
import { ShowGrid } from '../components/shows/ShowGrid';
import { ShowModal } from '../components/shows/ShowModal';
import { Button } from '../components/ui/Button';
import type { Show } from '../types/show';

type Tab = 'watchlist' | 'history';

export function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const watchlist = useLibraryStore((s) => s.watchlist);
  const history = useLibraryStore((s) => s.history);
  const [tab, setTab] = useState<Tab>('watchlist');
  const [selectedShow, setSelectedShow] = useState<Show | null>(null);

  const activeList = tab === 'watchlist' ? watchlist : history;

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl tracking-wide">Profile</h1>
          <p className="text-sm text-muted">{user?.email}</p>
        </div>
        <Button variant="ghost" onClick={() => signOut(auth)}>
          Sign out
        </Button>
      </div>

      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setTab('watchlist')}
          className={`rounded-md px-4 py-2 text-sm font-medium ${
            tab === 'watchlist' ? 'bg-surfaceRaised text-text' : 'text-muted'
          }`}
        >
          Watchlist ({watchlist.length})
        </button>
        <button
          onClick={() => setTab('history')}
          className={`rounded-md px-4 py-2 text-sm font-medium ${
            tab === 'history' ? 'bg-surfaceRaised text-text' : 'text-muted'
          }`}
        >
          Watch history ({history.length})
        </button>
      </div>

      {activeList.length === 0 ? (
        <p className="font-mono text-sm text-muted">
          {tab === 'watchlist'
            ? "Nothing saved yet — open a show from Home and hit 'Add to watchlist'."
            : "No watched shows yet — open a show and hit 'Mark as watched'."}
        </p>
      ) : (
        <ShowGrid
          shows={activeList}
          hasNextPage={false}
          isFetchingNextPage={false}
          onFetchNextPage={() => {}}
          onOpenShow={setSelectedShow}
        />
      )}

      <ShowModal show={selectedShow} onClose={() => setSelectedShow(null)} />
    </div>
  );
}
