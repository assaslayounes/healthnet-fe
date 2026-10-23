import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import App from './App';
import { I18nProvider } from './i18n';
import { AuthProvider } from './auth';
import './index.css';
const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 15_000, retry: 1, refetchOnWindowFocus: true } } });
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><QueryClientProvider client={queryClient}><I18nProvider><AuthProvider><BrowserRouter><App /><Toaster position="top-center" /></BrowserRouter></AuthProvider></I18nProvider></QueryClientProvider></React.StrictMode>);
