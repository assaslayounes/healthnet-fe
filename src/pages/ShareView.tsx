import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { api, fileUrl } from '@/lib/api';
import { useI18n, type Key } from '@/i18n';
interface S { title: string; kind: string; patient_name: string; url: string }
export default function ShareView() {
  const { token } = useParams(); const { t } = useI18n();
  const { data: s, isError } = useQuery({ queryKey: ['share', token], retry: false, staleTime: 0, queryFn: async () => (await api.get<S>(`/shares/${token}`)).data });
  if (isError) return <p className="py-32 text-center font-bold text-red-600">{t('errExpired')}</p>;
  if (!s) return <p className="py-32 text-center text-muted-foreground">{t('loading')}</p>;
  return (
    <section className="mx-auto max-w-md space-y-4 px-4 py-12 text-center">
      <h1 className="text-2xl font-extrabold">{s.title}</h1>
      <p className="text-muted-foreground">{t('patientName')}: {s.patient_name} · {t(`kind_${s.kind}` as Key)}</p>
      <Button asChild size="lg" className="w-full"><a href={fileUrl(s.url)} target="_blank" rel="noreferrer">{t('openDoc')}</a></Button>
    </section>
  );
}
