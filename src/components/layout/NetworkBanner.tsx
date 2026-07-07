import { useNetworkStore } from '../../store/networkStore';

export function NetworkBanner() {
  const isOnline = useNetworkStore((s) => s.isOnline);

  return (
    <div
      className={`flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-mono tracking-wide transition-colors duration-300 ${
        isOnline
          ? 'border-live/40 text-live'
          : 'border-danger/40 text-danger'
      }`}
      title={isOnline ? 'Connected' : 'Offline - showing cached content'}
    >
      <span
        className={`h-2 w-2 rounded-full ${
          isOnline ? 'bg-live animate-pulse' : 'bg-danger'
        }`}
      />
      {isOnline ? 'LIVE' : 'OFFLINE'}
    </div>
  );
}
