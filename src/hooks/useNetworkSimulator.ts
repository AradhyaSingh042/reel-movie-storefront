import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useNetworkStore } from '../store/networkStore';

export function useNetworkSimulator() {
  const setStatus = useNetworkStore((s) => s.setStatus);
  const isOnline = useNetworkStore((s) => s.isOnline);
  const queryClient = useQueryClient();
  const wasOffline = useRef(false);

  useEffect(() => {
    const online = navigator.onLine;
    setStatus(online, 'real');

    if (online) {
      void queryClient.refetchQueries({
        predicate: (query) => query.state.status === 'error',
      });
    }

    const handleOnline = () => {
      setStatus(true, 'real');
      void queryClient.invalidateQueries();
    };
    const handleOffline = () => setStatus(false, 'real');
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [setStatus, queryClient]);

  useEffect(() => {
    if (isOnline && wasOffline.current) {
      queryClient.invalidateQueries();
    }
    wasOffline.current = !isOnline;
  }, [isOnline, queryClient]);
}
