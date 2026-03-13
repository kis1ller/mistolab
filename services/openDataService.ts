
// Service to fetch live Open Data

export interface LiveAQIResult {
  aqi: number;
  pm2_5?: number;
  pm10?: number;
  no2?: number;
  so2?: number;
  o3?: number;
  source: string;
  timestamp: string;
}

export interface LiveWeatherResult {
  temperature: number;
  windSpeed: number;
  conditionCode: number;
  timestamp: string;
}

export interface ExchangeRates {
  usd: number;
  eur: number;
}

/**
 * Fetches current US AQI and specific pollutants (PM2.5, NO2) from Open-Meteo Air Quality API
 * Explicitly requested by PDF methodology for "Ecology" cluster.
 */
export const fetchDetailedAirQuality = async (lat: number, lon: number): Promise<LiveAQIResult | null> => {
  try {
    const response = await fetch(
      `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,pm10,pm2_5,nitrogen_dioxide,sulphur_dioxide,ozone&timezone=auto`
    );
    
    if (!response.ok) {
      throw new Error('Air Quality API Error');
    }

    const data = await response.json();
    
    if (data && data.current) {
      return {
        aqi: data.current.us_aqi,
        pm2_5: data.current.pm2_5,
        pm10: data.current.pm10,
        no2: data.current.nitrogen_dioxide,
        so2: data.current.sulphur_dioxide,
        o3: data.current.ozone,
        source: 'Open-Meteo Live API',
        timestamp: new Date().toLocaleTimeString('uk-UA', {hour: '2-digit', minute:'2-digit'})
      };
    }
    
    return null;
  } catch (error) {
    console.error("Failed to fetch live AQI:", error);
    return null;
  }
};

/**
 * Fetches current weather from Open-Meteo
 */
export const fetchWeather = async (lat: number, lon: number): Promise<LiveWeatherResult | null> => {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,wind_speed_10m&timezone=auto`
    );

    if (!response.ok) {
      throw new Error('Weather API Error');
    }

    const data = await response.json();

    if (data && data.current) {
      return {
        temperature: data.current.temperature_2m,
        windSpeed: data.current.wind_speed_10m,
        conditionCode: data.current.weather_code,
        timestamp: new Date().toLocaleTimeString('uk-UA', {hour: '2-digit', minute:'2-digit'})
      };
    }
    return null;
  } catch (error) {
    console.error("Failed to fetch weather:", error);
    return null;
  }
}

/**
 * Fetches current USD/EUR rates from NBU
 */
export const fetchNbuRates = async (): Promise<ExchangeRates | null> => {
  try {
    const response = await fetch('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json');
    if (!response.ok) return null;
    const data = await response.json();
    
    const usd = data.find((r: any) => r.cc === 'USD')?.rate || 41.5;
    const eur = data.find((r: any) => r.cc === 'EUR')?.rate || 44.5;
    
    return { usd, eur };
  } catch (error) {
    console.warn("Failed to fetch NBU rates, using defaults");
    return { usd: 41.5, eur: 44.5 };
  }
}

/**
 * Fetches the City Coat of Arms (Herb) from Ukrainian Wikipedia
 */
export const fetchCityCoatOfArms = async (cityName: string): Promise<string | null> => {
  try {
    // Attempt to find the specific "Herb of [City]" page, leveraging redirects
    const searchTerms = [`Герб_${cityName}`, `Герб_міста_${cityName}`, cityName];

    for (const term of searchTerms) {
      const response = await fetch(
        `https://uk.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(term)}&prop=pageimages&format=json&pithumbsize=500&redirects=1&origin=*`
      );
      
      const data = await response.json();
      const pages = data.query?.pages;

      if (pages) {
        const pageId = Object.keys(pages)[0];
        // Ensure page exists (-1 means missing) and has a thumbnail
        if (pageId !== '-1' && pages[pageId]?.thumbnail?.source) {
          return pages[pageId].thumbnail.source;
        }
      }
    }
    return null;
  } catch (error) {
    console.warn(`Failed to fetch coat of arms for ${cityName}:`, error);
    return null;
  }
};
