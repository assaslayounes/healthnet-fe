import { useState } from 'react';
import { Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { FileText, Share2, Send, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api, fileUrl } from '@/lib/api';
import { useApiMutation, useDocs } from '@/lib/queries';
import { useI18n, type Key } from '@/i18n';
import { fmtDate } from '@/lib/format';
interface Share { token: string; expiresAt: string }
const kinds = ['prescription', 'lab_result', 'radiology', 'report', 'other'];
export default function Documents() {
  const { t, lang } = useI18n(); const { data } = useDocs();
  const [title, setTitle] = useState(''); const [kind, setKind] = useState('prescription'); const [file, setFile] = useState<File | null>(null);
  const [share, setShare] = useState<Share | null>(null); const [ttl, setTtl] = useState(60);
  const upload = useApiMutation(() => { const fd = new FormData(); fd.append('title', title.trim()); fd.append('kind', kind); fd.append('file', file as File); return api.post('/documents', fd); }, [['docs']], () => { setTitle(''); setFile(null); });
  const view = useApiMutation((id: number) => api.get<{ url: string }>(`/documents/${id}/url`), [], (r) => window.open(fileUrl((r as { data: { url: string } }).data.url), '_blank'));
  const remove = useApiMutation((id: number) => api.delete(`/documents/${id}`), [['docs']]);
  const mk = useApiMutation((id: number) => api.post<Share>(`/documents/${id}/shares`, { ttlMinutes: ttl }), [], (r) => setShare((r as { data: Share }).data));
  const revoke = useApiMutation((tok: string) => api.delete(`/shares/${tok}`), [], () => setShare(null));
  return (
    <section className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-extrabold">{t('documents')}</h1>
      <div className="mb-8 space-y-3 rounded-2xl bg-primary-soft p-5">
        <h2 className="font-extrabold">{t('upload')}</h2>
        <Input placeholder={t('docTitle')} value={title} onChange={(e) => setTitle(e.target.value)} />
        <select value={kind} onChange={(e) => setKind(e.target.value)} className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm">
          {kinds.map((k) => <option key={k} value={k}>{t(`kind_${k}` as Key)}</option>)}
        </select>
        <input type="file" accept="application/pdf,image/jpeg,image/png" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="block w-full text-sm" aria-label={t('chooseFile')} />
        <Button onClick={() => upload.mutate(undefined)} disabled={upload.isPending || !file || !title.trim()}>{t('upload')}</Button>
      </div>
      {share && (
        <div className="mb-8 rounded-2xl border-2 border-primary p-5 text-center">
          <QRCodeSVG value={`${window.location.origin}/share/${share.token}`} size={176} className="mx-auto" />
          <p className="mt-3 break-all font-mono text-sm" dir="ltr">{share.token}</p>
          <p className="mt-1 text-sm text-muted-foreground">{t('shareHint')}</p>
          <p className="text-xs text-muted-foreground">{t('expiresAt')}: {fmtDate(share.expiresAt, lang)}</p>
          <Button variant="outline" className="mt-3" onClick={() => revoke.mutate(share.token)}>{t('revoke')}</Button>
        </div>
      )}
      {data?.length === 0 && <p className="py-8 text-center text-muted-foreground">{t('noItems')}</p>}
      <ul className="space-y-3">
        {data?.map((d) => (
          <li key={d.id} className="rounded-2xl border border-border p-4">
            <div className="flex items-start gap-3"><FileText className="mt-1 h-6 w-6 shrink-0 text-primary" />
              <div className="flex-1"><p className="font-extrabold">{d.title}</p>
                <p className="text-sm text-muted-foreground">{t(`kind_${d.kind}` as Key)} · {fmtDate(d.created_at, lang)}</p></div></div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => view.mutate(d.id)}><Eye className="h-4 w-4" />{t('view')}</Button>
              <select value={ttl} onChange={(e) => setTtl(Number(e.target.value))} aria-label={t('shareTtl')} className="h-9 rounded-lg border border-border bg-background px-2 text-sm">
                {[15, 60, 240, 1440].map((m) => <option key={m} value={m}>{m} {t('minutes')}</option>)}</select>
              <Button variant="outline" size="sm" onClick={() => mk.mutate(d.id)}><Share2 className="h-4 w-4" />{t('share')}</Button>
              <Button asChild size="sm"><Link to={`/requests/new?doc=${d.id}&kind=${d.kind === 'lab_result' ? 'lab' : 'prescription'}`}><Send className="h-4 w-4" />{t('sendToProvider')}</Link></Button>
              <Button variant="ghost" size="sm" onClick={() => remove.mutate(d.id)} aria-label={t('remove')}><Trash2 className="h-4 w-4" /></Button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
