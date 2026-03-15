
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
  // ── Original 13 required fields ───────────────────────────────────────────
  avgSalary: number;               // UAH/month (Work.ua)
  rentCost: number;                // UAH/month 1BR
  airQuality: number;              // US AQI (Live OpenMeteo)
  transparencyScore: number;       // TI Ukraine 2025 index (0-100)
  safetyIndex: number;             // 0-100 perception
  unemployment: number;            // %
  registeredBusiness: number;      // per 1 000 pop
  universities: number;            // higher-ed institutions
  migrationBalance: number;        // 0-100 attractiveness index
  cultureScore: number;            // 0-100 composite
  procurementVolume: number;       // UAH per capita (ProZorro)
  hasTransportApi: boolean;        // CityBus/GPS availability
  hasAccessibilityMap: boolean;    // "City without barriers" map

  // ── Economy (extended) ────────────────────────────────────────────────────
  medianSalary?: number;            // UAH/month
  utilityExpenses?: number;         // UAH/month avg
  foodBasketCost?: number;          // UAH/month
  newBusinessRegistrations?: number;// per 1 000 pop/year
  smeShare?: number;                // % SME of all businesses
  gdpPerCapitaEstimate?: number;    // USD estimate
  fdiVolume?: number;               // USD millions
  avgCarOwnership?: number;         // per 100 residents
  bankBranches?: number;            // per 100 000 pop

  // ── Demographics ─────────────────────────────────────────────────────────
  populationDensity?: number;       // per sq km
  birthRate?: number;               // per 1 000
  deathRate?: number;               // per 1 000
  naturalGrowth?: number;           // per 1 000 (can be negative)
  avgAge?: number;                  // years
  youthShare?: number;              // % under 35
  workingAgeShare?: number;         // % 18-60
  pensionerShare?: number;          // % 60+
  householdsCount?: number;         // thousands

  // ── Housing ──────────────────────────────────────────────────────────────
  avgApartmentCost?: number;        // UAH per sq m
  newHousingM2?: number;            // sq m per 1 000 residents built/year
  housingStockM2PerCapita?: number; // sq m per person
  waterSupplyCoverage?: number;     // %
  sewerageCoverage?: number;        // %
  gasSupplyCoverage?: number;       // %
  heatingSystemCoverage?: number;   // %

  // ── Transport ────────────────────────────────────────────────────────────
  busRoutes?: number;               // count
  tramRoutes?: number;              // count (0 if no tram)
  trolleybusRoutes?: number;        // count (0 if none)
  taxiApps?: number;                // major ride-hail apps
  bikeSharingStations?: number;     // count
  avgCommuteTime?: number;          // minutes
  roadConditionIndex?: number;      // 0-100
  publicTransportScore?: number;    // 0-100

  // ── Healthcare ───────────────────────────────────────────────────────────
  hospitals?: number;               // count
  polyclinics?: number;             // count
  bedsPer1000?: number;             // hospital beds per 1 000 pop
  doctorsPer1000?: number;          // doctors per 1 000 pop
  pharmacies?: number;              // per 100 000 pop
  emergencyResponseTime?: number;   // avg minutes
  healthcareScore?: number;         // 0-100
  vaccinationRate?: number;         // % children vaccinated

  // ── Education ────────────────────────────────────────────────────────────
  colleges?: number;                // vocational/technical
  schools?: number;                 // secondary schools
  kindergartens?: number;           // count
  kindergartenCoverage?: number;    // % children enrolled
  librariesCount?: number;          // public libraries
  researchInstitutes?: number;      // R&D institutes
  schoolsPerCapita?: number;        // per 10 000 pop

  // ── Ecology (extended) ───────────────────────────────────────────────────
  waterQualityIndex?: number;       // 0-100
  greenAreaPerCapita?: number;      // sq m per person
  recyclingRate?: number;           // %
  co2EmissionsPerCapita?: number;   // tons/year
  noiseLevel?: number;              // dB average daytime
  industrialPollutionIndex?: number;// 0-100 (100 = cleanest)
  renewableEnergyShare?: number;    // %
  treesPlantedPerYear?: number;     // per 1 000 residents

  // ── Culture & Recreation (extended) ──────────────────────────────────────
  museums?: number;                 // count
  theaters?: number;                // count
  cinemas?: number;                 // count
  sportsArenas?: number;            // count
  swimmingPools?: number;           // public pools
  parks?: number;                   // named parks/gardens
  playgrounds?: number;             // count
  restaurantsPerCapita?: number;    // per 10 000 pop

  // ── Digital & Smart City ─────────────────────────────────────────────────
  digitalServicesCount?: number;    // e-services on city portal
  openDataSets?: number;            // published open datasets
  cityAppScore?: number;            // 0-100 mobile app quality
  smartCityIndex?: number;          // 0-100
  cctvCoverage?: number;            // % streets with CCTV
  wifiHotspots?: number;            // public hotspots count
  cybersecurityScore?: number;      // 0-100
  eVotingParticipation?: number;    // % eligible voters used e-services

  // ── Safety (extended) ────────────────────────────────────────────────────
  crimeRatePer10k?: number;         // registered crimes per 10 000
  policeStations?: number;          // count
  fireDepartments?: number;         // count
  accidentsPer10k?: number;         // road accidents per 10 000
  domesticViolenceRate?: number;    // per 10 000
  corruptionLocalIndex?: number;    // 0-100 (100 = least corrupt)

  // ── Tourism ──────────────────────────────────────────────────────────────
  hotels?: number;                  // count
  touristAttractions?: number;      // count
  annualTouristsEstimate?: number;  // thousands/year
  restaurantsCount?: number;        // total restaurants
  hostels?: number;                 // count
  internationalEvents?: number;     // per year
  tourismRevenueEstimate?: number;  // UAH millions/year

  // ── Municipal Finance ────────────────────────────────────────────────────
  budgetPerCapita?: number;         // UAH per person
  ownRevenueShare?: number;         // % from own revenue sources
  capitalExpenditureShare?: number; // % of budget for capital works
  budgetTransparencyScore?: number; // 0-100
  debtPerCapita?: number;           // UAH per person
  budgetExecution?: number;         // % execution rate
}

export interface CityData {
  id: string;
  rank: number;
  name: string;
  region: string;
  population: number;
  coordinates: { lat: number; lon: number };
  imageUrl?: string;
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
