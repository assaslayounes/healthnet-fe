export type Role = 'patient' | 'doctor' | 'dentist' | 'pharmacy' | 'lab' | 'admin';
export type ProviderType = 'doctor' | 'dentist' | 'pharmacy' | 'lab';
export interface Provider {
  id: number; type: ProviderType; name: string; wilaya?: string; city?: string; address?: string; phone?: string; bio?: string;
  is_available_today: number; consultation_price?: number | null; rating_avg: string | number; rating_count: number;
  specialty_slug?: string | null; name_ar?: string | null; name_en?: string | null; distance_km?: number | null;
}
export interface Appointment { id: number; scheduled_at: string; status: 'pending' | 'confirmed' | 'done' | 'cancelled'; provider_id: number; provider_name: string; type: ProviderType }
export interface Review { id: number; rating: number; comment: string | null; created_at: string; patient_first_name: string }
export interface Notice { id: number; type: string; title: string; body: string | null; is_read: number; created_at: string }
