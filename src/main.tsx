import React from 'react';
import ReactDOM from 'react-dom/client';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import App from './App';
import { queryClient, queryPersister } from './lib/queryClient';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister: queryPersister }}
      onSuccess={() => {
        if (navigator.onLine) {
          void queryClient.refetchQueries({
            predicate: (query) => query.state.status === 'error',
          });
        }
      }}
    >
      <App />
    </PersistQueryClientProvider>
  </React.StrictMode>,
);
