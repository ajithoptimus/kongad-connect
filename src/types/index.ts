export interface Panchayat {
  id: string;
  name: string;
}

export interface MarketRate {
  id: string;
  commodity: string;
  price: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  imgUrl: string;
}

export interface WeatherAlert {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
}

export type UserRole = 'farmer' | 'merchant';

export interface CropListingFormData {
  role: UserRole;
  cropType: string;
  quantity: string;
  panchayat: string;
}

export interface EmergencyService {
  id: string;
  name: string;
  type: 'chc' | 'clinic' | 'pharmacy' | 'ambulance' | 'police' | 'fire' | 'kseb';
  location: string;
  phone: string;
  panchayatId?: string;
}

export interface CivicReportFormData {
  category: 'Roads' | 'Water Leakage' | 'Power Grid' | '';
  landmark: string;
  photoUrl?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  category: string;
  thumbnailUrl: string;
  summary: string;
  panchayatId?: string;
}

export interface JobListing {
  id: string;
  title: string;
  employer: string;
  location: string;
  isBoosted: boolean;
  panchayatId?: string;
}

export interface ClassifiedListing {
  id: string;
  item: string;
  price: string;
  seller: string;
  location: string;
  isBoosted: boolean;
  panchayatId?: string;
}

export interface BusTiming {
  id: string;
  route: string;
  time: string;
  type: 'ksrtc' | 'private';
  status: 'on-time' | 'delayed';
  panchayatId?: string;
}

export interface LocalEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  category: 'festival' | 'sports' | 'meeting' | 'culture';
  thumbnailUrl?: string;
  panchayatId?: string;
}

export interface BloodDonor {
  id: string;
  name: string;
  bloodGroup: string;
  panchayat: string;
  phone: string;
  panchayatId?: string;
}
