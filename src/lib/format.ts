export const fmtDate = (iso: string, lang: string) =>
  new Date(iso).toLocaleString(lang === 'ar' ? 'ar-DZ' : 'en-GB', { dateStyle: 'medium', timeStyle: 'short' });
