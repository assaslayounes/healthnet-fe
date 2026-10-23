export const specialties = [
  ['general','طب عام','General Medicine'],['cardiology','أمراض القلب','Cardiology'],
  ['orthopedics','جراحة العظام','Orthopedics'],['gastro','الجهاز الهضمي','Gastroenterology'],
  ['pulmonology','الصدر والجهاز التنفسي','Pulmonology'],['pediatrics','طب الأطفال','Pediatrics'],
  ['ophthalmology','طب العيون','Ophthalmology'],['dermatology','الأمراض الجلدية','Dermatology'],
  ['gynecology','النساء والتوليد','Gynecology'],['psychiatry','الطب النفسي','Psychiatry'],
  ['ent','الأنف والأذن والحنجرة','ENT'],['neurology','الأعصاب','Neurology'],
  ['urology','المسالك البولية','Urology'],['nephrology','أمراض الكلى','Nephrology'],
  ['endocrinology','الغدد والسكري','Endocrinology'],['rheumatology','أمراض الروماتيزم','Rheumatology'],
  ['oncology','الأورام','Oncology'],['general_surgery','الجراحة العامة','General Surgery'],
  ['vascular','جراحة الأوعية','Vascular Surgery'],['infectious','الأمراض المعدية','Infectious Diseases'],
  ['physio','العلاج الطبيعي','Physiotherapy'],['nutrition','التغذية','Nutrition'],
  ['anesthesia','التخدير والإنعاش','Anesthesiology'],['radiology','الأشعة','Radiology'],
].map(([slug, ar, en]) => ({ slug, ar, en }));
// بيانات تجريبية للعرض فقط، تُستبدل لاحقاً ببيانات الـ API
export const featuredDoctors = [
  { id: 1, ar: 'د. سارة محمد', en: 'Dr. Sara Mohamed', spec: 'general', rating: 4.9, reviews: 320, online: true },
  { id: 2, ar: 'د. أحمد حسن', en: 'Dr. Ahmed Hassan', spec: 'cardiology', rating: 4.8, reviews: 245, online: false },
  { id: 3, ar: 'د. لمياء بن علي', en: 'Dr. Lamia Benali', spec: 'dermatology', rating: 4.7, reviews: 180, online: true },
];
