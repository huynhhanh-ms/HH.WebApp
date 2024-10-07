import './tailwind.css';

import ReactDOM from 'react-dom/client';
import { Suspense, StrictMode } from 'react';
import { SnackbarProvider } from 'notistack';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import App from './app';
import AxiosInterceptor from './services/AxiosInterceptor';
import SnackbarProviderCustom from './customs/notistack-custom';

// ----------------------------------------------------------------------

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

const queryClient = new QueryClient();

root.render(
  <StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <SnackbarProviderCustom>
          <AxiosInterceptor>
            <BrowserRouter>
              <Suspense>
                <App />
              </Suspense>
            </BrowserRouter>
          </AxiosInterceptor>
        </SnackbarProviderCustom>
      </QueryClientProvider>
    </HelmetProvider>
  </StrictMode>
);
