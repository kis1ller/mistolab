
export enum Category {
  ECONOMY = 'Економіка (30%)',
  GOVERNANCE = 'Прозорість (20%)',
  ECOLOGY = 'Екологія (20%)',
  INFRASTRUCTURE = 'Інфраструктура (30%)',
}

export interface CityMetrics {
  [Category.ECONOMY]: number;
  [Category.GOVERNANCE]: number;
  [Category.ECOLOGY]: number;
  [Category.INFRASTRUCTURE]: number;
}

export interface SubMetrics {
  avgSalary: number; // UAH (Source: Work.ua/PDF)
  rentCost: number; // UAH
  airQuality: number; // AQI (Live from OpenMeteo)
  transparencyScore: number; // TI Ukraine 2024 (Source: PDF)
  safetyIndex: number; // 0-100
  unemployment: number; // %
  registeredBusiness: number; // per 1k pop
  universities: number;
  migrationBalance: number;
  cultureScore: number; // Renamed from leisureVenues
  // New indicators from PDF context
  procurementVolume: number; // UAH per capita (ProZorro proxy)
  hasTransportApi: boolean; // CityBus/GPS availability
  hasAccessibilityMap: boolean; // "City without limits"
}

export interface CityData {
  id: string;
  rank: number;
  name: string;
  region: string;
  population: number;
  coordinates: { lat: number, lon: number }; // For live API calls
  imageUrl?: string; // URL for header image
  totalScore: number;
  metrics: CityMetrics;
  subMetrics: SubMetrics;
  highlights?: string[];
  description: string;
}

export interface SortConfig {
  key: keyof CityMetrics | 'totalScore' | 'rank' | 'name';
  direction: 'asc' | 'desc';
}