import { CityData, Category } from './types';
import citiesRaw from './data/cities.json';

export const CATEGORY_COLORS: Record<Category, string> = {
  [Category.ECONOMY]: '#0ea5e9',       // Sky 500
  [Category.GOVERNANCE]: '#8b5cf6',    // Violet 500
  [Category.ECOLOGY]: '#10b981',       // Emerald 500
  [Category.INFRASTRUCTURE]: '#f59e0b', // Amber 500
};

// Cast from JSON — update data/cities.json to add/edit cities
export const CITIES_DATA: CityData[] = citiesRaw as unknown as CityData[];
