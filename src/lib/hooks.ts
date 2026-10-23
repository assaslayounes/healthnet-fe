import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useI18n } from '@/i18n';
export function useDebounced<T>(value: T, ms = 300) {
  const [v, setV] = useState(value);
  useEffect(() => { const h = setTimeout(() => setV(value), ms); return () => clearTimeout(h); }, [value, ms]);
  return v;
}
export type Pos = { lat: number; lng: number };
export function useGeolocate() {
  const { t } = useI18n(); const [pos, setPos] = useState<Pos | null>(null);
  const locate = (cb?: (p: Pos) => void) => navigator.geolocation?.getCurrentPosition(
    (g) => { const p = { lat: g.coords.latitude, lng: g.coords.longitude }; setPos(p); cb?.(p); }, () => toast.error(t('locationNeeded')));
  return { pos, locate };
}
export const localDate = () => new Date().toLocaleDateString('en-CA');
