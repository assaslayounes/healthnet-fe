import axios from 'axios';
import type { Key } from '@/i18n';
export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api' });
api.interceptors.request.use((c) => {
  const t = localStorage.getItem('token');
  if (t) c.headers.Authorization = `Bearer ${t}`;
  return c;
});
export const errCode = (e: unknown): string =>
  axios.isAxiosError(e) ? ((e.response?.data as { error?: string } | undefined)?.error ?? 'network') : 'unknown';
const map: Record<string, Key> = { bad_credentials: 'errBadCredentials', email_taken: 'errEmailTaken', slot_taken: 'errSlotTaken', past_time: 'errPast', network: 'errNetwork',
  no_providers_nearby: 'errNoNearby', unsupported_file_type: 'errFileType', file_too_large: 'errTooLarge', document_in_use: 'errDocInUse', request_closed: 'errRequestClosed', invalid_or_expired: 'errExpired', not_eligible: 'errNotEligible', reset_disabled: 'errResetDisabled' };
export const errKey = (e: unknown): Key => map[errCode(e)] ?? 'errGeneric';
export const fileUrl = (u: string) => (u.startsWith('/') ? new URL(api.defaults.baseURL as string).origin + u : u);
