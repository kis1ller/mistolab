import React, { useEffect, useState } from 'react';
import { ArrowLeft, Wind, Sun, Cloud, CloudRain, DollarSign } from 'lucide-react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
} from 'recharts';
import { CityData, Category } from '../types';
import { CITY_COAT_OF_ARMS } from '../constants';
import {
  fetchDetailedAirQuality,
  fetchWeather,
  fetchNbuRates,
  LiveAQIResult,
  LiveWeatherResult,
  ExchangeRates,
} from '../services/openDataService';

interface CityDetailProps {
  city: CityData;
  onBack: () => void;
}

// ── helpers ───────────────────────────────────────────────────────────────────

const fmt = (n: number, suffix = '') =>
  n === undefined || n === null ? '—' : `${n.toLocaleString('uk-UA')}${suffix}`;

const score = (n: number | undefined) =>
  n === undefined || n === null ? '—' : `${n}/100`;

// ── sub-components ────────────────────────────────────────────────────────────

const SectionTitle: React.FC<{ num: string; title: string; value?: number; bar?: boolean }> = ({
  num,
  title,
  value,
  bar = false,
}) => (
  <div className="pt-14 pb-6 border-b border-slate-100 dark:border-slate-800 mb-6">
    <div className="flex items-baseline justify-between gap-4">
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-xs text-slate-300 dark:text-slate-600 select-none">{num}</span>
        <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
          {title}
        </h2>
      </div>
      {value !== undefined && (
        <span className="text-3xl font-black tabular-nums text-slate-900 dark:text-white">
          {value}
        </span>
      )}
    </div>
    {bar && value !== undefined && (
      <div className="mt-3 h-[3px] bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-orange-500 rounded-full transition-all duration-700"
          style={{ width: `${value}%` }}
        />
      </div>
    )}
  </div>
);

interface MetricItem {
  label: string;
  value: string | number;
  sub?: string;
  highlight?: boolean;
}

const MetricGrid: React.FC<{ items: MetricItem[]; cols?: 2 | 3 | 4 }> = ({
  items,
  cols = 4,
}) => {
  const colClass = cols === 2 ? 'grid-cols-2' : cols === 3 ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4';
  return (
    <div className={`grid ${colClass} divide-x divide-y divide-slate-100 dark:divide-slate-800 border border-slate-100 dark:border-slate-800 rounded-lg overflow-hidden`}>
      {items.map((item, i) => (
        <div key={i} className="px-4 py-4 bg-white dark:bg-slate-900 group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
          <div className="text-[11px] text-slate-400 dark:text-slate-500 mb-1.5 leading-none">{item.label}</div>
          <div className={`text-xl font-bold tabular-nums leading-tight ${item.highlight ? 'text-orange-600 dark:text-orange-400' : 'text-slate-900 dark:text-white'}`}>
            {item.value === undefined || item.value === null ? '—' : item.value}
          </div>
          {item.sub && (
            <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">{item.sub}</div>
          )}
        </div>
      ))}
    </div>
  );
};

// ── main component ────────────────────────────────────────────────────────────

export const CityDetail: React.FC<CityDetailProps> = ({ city, onBack }) => {
  const [liveAQI, setLiveAQI] = useState<LiveAQIResult | null>(null);
  const [liveWeather, setLiveWeather] = useState<LiveWeatherResult | null>(null);
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates | null>(null);
  const [loading, setLoading] = useState(true);
  const coatOfArms = CITY_COAT_OF_ARMS[city.id] ?? null;
  const [coatError, setCoatError] = useState(false);

  useEffect(() => { setCoatError(false); }, [city.id]);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchDetailedAirQuality(city.coordinates.lat, city.coordinates.lon),
      fetchWeather(city.coordinates.lat, city.coordinates.lon),
      fetchNbuRates(),
    ]).then(([aqi, weather, rates]) => {
      setLiveAQI(aqi);
      setLiveWeather(weather);
      setExchangeRates(rates);
      setLoading(false);
    });
  }, [city]);

  const sm = city.subMetrics;

  const radarData = [
    { subject: 'Економіка',    A: city.metrics[Category.ECONOMY] },
    { subject: 'Заможність',   A: Math.min(100, Math.round((sm.avgSalary / 35000) * 100)) },
    { subject: 'Прозорість',   A: sm.transparencyScore },
    { subject: 'Управління',   A: city.metrics[Category.GOVERNANCE] },
    { subject: 'Безпека',      A: sm.safetyIndex },
    { subject: 'Екологія',     A: city.metrics[Category.ECOLOGY] },
    { subject: 'Культура',     A: sm.cultureScore },
    { subject: 'Цифровізація', A: sm.smartCityIndex ?? Math.round((sm.hasTransportApi ? 50 : 0) + (sm.hasAccessibilityMap ? 50 : 0)) },
    { subject: 'Інфраструктура', A: city.metrics[Category.INFRASTRUCTURE] },
  ];

  const aqiColor = liveAQI
    ? liveAQI.aqi <= 50 ? '#16a34a' : liveAQI.aqi <= 100 ? '#ca8a04' : '#dc2626'
    : '#94a3b8';

  const weatherIcon = liveWeather
    ? liveWeather.conditionCode <= 1 ? <Sun className="w-4 h-4 text-orange-400" />
      : liveWeather.conditionCode <= 3 ? <Cloud className="w-4 h-4 text-slate-400" />
      : <CloudRain className="w-4 h-4 text-blue-400" />
    : null;

  return (
    <article className="max-w-4xl mx-auto pb-24 animate-fade-in">
      {/* Back */}
      <button
        onClick={onBack}
        className="group flex items-center gap-2 text-sm text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors mb-10"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        Рейтинг
      </button>

      {/* ── Hero ── */}
      <header className="mb-12 border-b border-slate-100 dark:border-slate-800 pb-10">
        <div className="flex items-center gap-6">
          {/* coat of arms */}
          {coatOfArms && !coatError && (
            <img
              src={coatOfArms}
              alt={`Герб ${city.name}`}
              className="h-40 w-auto object-contain flex-shrink-0"
              onError={() => setCoatError(true)}
            />
          )}

          <div className="flex-1 min-w-0">
            {/* rank + score row */}
            <div className="flex items-baseline gap-4 mb-3">
              <span className="font-mono text-xs text-slate-400 dark:text-slate-500">#{city.rank}</span>
              <span className="text-4xl font-black tabular-nums text-orange-500 leading-none">{city.totalScore}</span>
              <span className="text-xs text-slate-400 dark:text-slate-500">/1000</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
              {city.name}
            </h1>
            <div className="flex flex-wrap gap-3 mt-2 text-sm text-slate-400 dark:text-slate-500">
              <span>{city.region}</span>
              <span>·</span>
              <span>{city.population.toLocaleString('uk-UA')} мешканців</span>
            </div>
          </div>
        </div>

        {/* description */}
        <p className="mt-6 text-slate-600 dark:text-slate-300 text-base leading-relaxed max-w-2xl">
          {city.description}
        </p>

        {/* highlights */}
        {city.highlights && city.highlights.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {city.highlights.map((h) => (
              <span key={h} className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                — {h}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* ── Live bar ── */}
      <div className="flex flex-col sm:flex-row gap-px bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden mb-2">
        {/* weather */}
        <div className="flex-1 bg-white dark:bg-slate-900 px-5 py-4">
          <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-2">Погода</div>
          {loading ? (
            <div className="h-6 w-20 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
          ) : liveWeather ? (
            <div className="flex items-center gap-2">
              {weatherIcon}
              <span className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
                {liveWeather.temperature}°
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Wind className="w-3 h-3" /> {liveWeather.windSpeed} км/г
              </span>
            </div>
          ) : <span className="text-slate-400 text-sm">—</span>}
        </div>
        {/* AQI */}
        <div className="flex-1 bg-white dark:bg-slate-900 px-5 py-4">
          <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-2">Якість повітря</div>
          {loading ? (
            <div className="h-6 w-20 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
          ) : liveAQI ? (
            <div>
              <span className="text-2xl font-bold tabular-nums" style={{ color: aqiColor }}>
                {liveAQI.aqi}
              </span>
              <span className="text-xs text-slate-400 ml-1.5">AQI</span>
              <span className="text-[10px] text-slate-400 ml-2">PM2.5 {liveAQI.pm2_5} · NO₂ {liveAQI.no2}</span>
            </div>
          ) : <span className="text-slate-400 text-sm">—</span>}
        </div>
        {/* salary USD */}
        <div className="flex-1 bg-white dark:bg-slate-900 px-5 py-4">
          <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-2">Зарплата USD</div>
          {loading ? (
            <div className="h-6 w-20 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
          ) : exchangeRates ? (
            <div className="flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-slate-400" />
              <span className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
                {Math.round(sm.avgSalary / exchangeRates.usd)}
              </span>
              <span className="text-[10px] text-slate-400">/міс · НБУ {exchangeRates.usd} ₴</span>
            </div>
          ) : <span className="text-slate-400 text-sm">—</span>}
        </div>
      </div>
      <p className="text-[10px] text-slate-400 dark:text-slate-600 mb-12">
        Погода та AQI — OpenMeteo live API
      </p>

      {/* ── Radar ── */}
      <div className="mb-2">
        <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-4">Профіль міста · 9 вимірів</div>
        <div className="h-[340px] bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="68%" data={radarData}>
              <PolarGrid stroke="#e2e8f0" strokeOpacity={0.5} />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }}
              />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar
                name={city.name}
                dataKey="A"
                stroke="#ea580c"
                strokeWidth={2}
                fill="#ea580c"
                fillOpacity={0.15}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)',
                  backgroundColor: '#fff',
                  color: '#0f172a',
                  padding: '6px 10px',
                  fontSize: '12px',
                }}
                itemStyle={{ color: '#ea580c', fontWeight: 600 }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}

      {/* 01 — Economy */}
      <SectionTitle num="01" title="Економіка" value={city.metrics[Category.ECONOMY]} bar />
      <MetricGrid items={[
        { label: 'Середня зарплата', value: `${fmt(sm.avgSalary)} ₴`, highlight: true },
        { label: 'Медіанна зарплата', value: `${fmt(sm.medianSalary ?? Math.round(sm.avgSalary * 0.83))} ₴` },
        { label: 'Оренда 1к', value: `${fmt(sm.rentCost)} ₴`, sub: `${Math.round(sm.rentCost / sm.avgSalary * 100)}% від ЗП` },
        { label: 'Комунальні послуги', value: `${fmt(sm.utilityExpenses ?? Math.round(sm.rentCost * 0.42))} ₴` },
        { label: 'Продуктовий кошик', value: `${fmt(sm.foodBasketCost ?? Math.round(sm.avgSalary * 0.45))} ₴` },
        { label: 'Безробіття', value: `${sm.unemployment}%` },
        { label: 'Бізнесів на 1 000', value: sm.registeredBusiness },
        { label: 'Нові реєстрації/рік', value: `${sm.newBusinessRegistrations ?? 3.2}/1к` },
        { label: 'Частка МСП', value: `${sm.smeShare ?? 82}%` },
        { label: 'ВВП/особу (оцінка)', value: `$${fmt(sm.gdpPerCapitaEstimate ?? Math.round(sm.avgSalary / 4.5))}` },
        { label: 'Прямі інвестиції', value: `$${sm.fdiVolume ?? 20} млн` },
        { label: 'Авто на 100 осіб', value: sm.avgCarOwnership ?? 28 },
        { label: 'Відділень банків/100к', value: sm.bankBranches ?? 45 },
        { label: 'Закупівлі ProZorro', value: `${fmt(sm.procurementVolume)} ₴`, sub: 'на душу населення' },
      ]} />

      {/* 02 — Transparency */}
      <SectionTitle num="02" title="Прозорість та Управління" value={city.metrics[Category.GOVERNANCE]} bar />
      <MetricGrid items={[
        { label: 'TI Індекс прозорості', value: score(sm.transparencyScore), highlight: true },
        { label: 'Відкриті набори даних', value: sm.openDataSets ?? 12 },
        { label: 'Прозорість бюджету', value: score(sm.budgetTransparencyScore) },
        { label: 'Корупція (локальна)', value: score(sm.corruptionLocalIndex), sub: '100 = найменша' },
        { label: 'Міграційна привабл.', value: score(sm.migrationBalance) },
        { label: 'е-Голосування', value: `${sm.eVotingParticipation ?? 10}%` },
        { label: 'е-Послуги', value: sm.digitalServicesCount ?? 25 },
        { label: 'Виконання бюджету', value: `${sm.budgetExecution ?? 90}%` },
      ]} cols={4} />

      {/* 03 — Ecology */}
      <SectionTitle num="03" title="Екологія" value={city.metrics[Category.ECOLOGY]} bar />
      <MetricGrid items={[
        { label: 'AQI (Live OpenMeteo)', value: liveAQI?.aqi ?? sm.airQuality, highlight: true },
        { label: 'Якість води', value: score(sm.waterQualityIndex) },
        { label: 'Зелень на особу', value: `${sm.greenAreaPerCapita ?? 18} м²` },
        { label: 'Переробка відходів', value: `${sm.recyclingRate ?? 8}%` },
        { label: 'CO₂ на особу', value: `${sm.co2EmissionsPerCapita ?? 5} т/рік` },
        { label: 'Рівень шуму', value: `${sm.noiseLevel ?? 62} дБ` },
        { label: 'Пром. чистота', value: score(sm.industrialPollutionIndex), sub: '100 = найчистіше' },
        { label: 'Відновлювана енергія', value: `${sm.renewableEnergyShare ?? 5}%` },
        { label: 'Посадка дерев', value: `${sm.treesPlantedPerYear ?? 8}/1к` },
      ]} />

      {/* 04 — Infrastructure */}
      <SectionTitle num="04" title="Інфраструктура" value={city.metrics[Category.INFRASTRUCTURE]} bar />
      <MetricGrid items={[
        { label: 'GPS Транспорт', value: sm.hasTransportApi ? 'Є' : 'Немає' },
        { label: 'Безбар\u2019єрна мапа', value: sm.hasAccessibilityMap ? 'Є' : 'Немає' },
        { label: 'Маршрути автобусів', value: sm.busRoutes ?? 20 },
        { label: 'Трамвайні маршрути', value: sm.tramRoutes ?? 0 },
        { label: 'Тролейбусні', value: sm.trolleybusRoutes ?? 0 },
        { label: 'Велошеринг (станцій)', value: sm.bikeSharingStations ?? 0 },
        { label: 'Час у дорозі', value: `${sm.avgCommuteTime ?? 22} хв` },
        { label: 'Стан доріг', value: score(sm.roadConditionIndex) },
        { label: 'Транспорт Score', value: score(sm.publicTransportScore) },
        { label: 'Таксі-додатки', value: sm.taxiApps ?? 2 },
        { label: 'Smart City', value: score(sm.smartCityIndex) },
        { label: 'WiFi-точок', value: sm.wifiHotspots ?? 20 },
      ]} />

      {/* 05 — Healthcare */}
      <SectionTitle num="05" title="Охорона здоров'я" />
      <MetricGrid items={[
        { label: "Рейтинг охорони здоров'я", value: score(sm.healthcareScore), highlight: true },
        { label: 'Лікарні', value: sm.hospitals ?? 5 },
        { label: 'Поліклініки', value: sm.polyclinics ?? 8 },
        { label: 'Ліжок на 1 000', value: sm.bedsPer1000 ?? 7.2 },
        { label: 'Лікарів на 1 000', value: sm.doctorsPer1000 ?? 3.5 },
        { label: 'Аптек на 100к', value: sm.pharmacies ?? 80 },
        { label: 'Швидка (хв)', value: `${sm.emergencyResponseTime ?? 12} хв` },
        { label: 'Вакцинація дітей', value: `${sm.vaccinationRate ?? 78}%` },
      ]} />

      {/* 06 — Education */}
      <SectionTitle num="06" title="Освіта та Наука" />
      <MetricGrid items={[
        { label: 'ВНЗ', value: sm.universities, highlight: true },
        { label: 'Коледжі', value: sm.colleges ?? 3 },
        { label: 'Школи', value: sm.schools ?? 30 },
        { label: 'Школи на 10к', value: sm.schoolsPerCapita ?? 2.2 },
        { label: 'Дитячі садки', value: sm.kindergartens ?? 25 },
        { label: 'Охоплення д/с', value: `${sm.kindergartenCoverage ?? 72}%` },
        { label: 'Бібліотеки', value: sm.librariesCount ?? 8 },
        { label: 'НДІ', value: sm.researchInstitutes ?? 1 },
      ]} />

      {/* 07 — Housing */}
      <SectionTitle num="07" title="Житло та ЖКГ" />
      <MetricGrid items={[
        { label: 'Ціна м² квартири', value: `${fmt(sm.avgApartmentCost ?? 22000)} ₴`, highlight: true },
        { label: 'Нове житло/рік', value: `${sm.newHousingM2 ?? 150} м²/1к` },
        { label: 'Фонд на особу', value: `${sm.housingStockM2PerCapita ?? 24} м²` },
        { label: 'Водопостачання', value: `${sm.waterSupplyCoverage ?? 88}%` },
        { label: 'Каналізація', value: `${sm.sewerageCoverage ?? 85}%` },
        { label: 'Газопостачання', value: `${sm.gasSupplyCoverage ?? 78}%` },
        { label: 'Централіз. тепло', value: `${sm.heatingSystemCoverage ?? 82}%` },
        { label: 'Домогосподарств', value: `${sm.householdsCount ?? 100}к` },
      ]} />

      {/* 08 — Culture */}
      <SectionTitle num="08" title="Культура та Відпочинок" />
      <MetricGrid items={[
        { label: 'Культурний рейтинг', value: score(sm.cultureScore), highlight: true },
        { label: 'Музеї', value: sm.museums ?? 4 },
        { label: 'Театри', value: sm.theaters ?? 2 },
        { label: 'Кінотеатри', value: sm.cinemas ?? 2 },
        { label: 'Спортарени', value: sm.sportsArenas ?? 5 },
        { label: 'Публічні басейни', value: sm.swimmingPools ?? 2 },
        { label: 'Парки', value: sm.parks ?? 15 },
        { label: 'Дитмайданчики', value: sm.playgrounds ?? 50 },
        { label: 'Ресторанів на 10к', value: sm.restaurantsPerCapita ?? 22 },
      ]} />

      {/* 09 — Digital */}
      <SectionTitle num="09" title="Цифровізація" />
      <MetricGrid items={[
        { label: 'Smart City Index', value: score(sm.smartCityIndex), highlight: true },
        { label: 'е-Послуги онлайн', value: sm.digitalServicesCount ?? 25 },
        { label: 'Відкриті датасети', value: sm.openDataSets ?? 12 },
        { label: 'Рейтинг застосунку', value: score(sm.cityAppScore) },
        { label: 'CCTV покриття', value: `${sm.cctvCoverage ?? 15}%` },
        { label: 'WiFi-точок', value: sm.wifiHotspots ?? 20 },
        { label: 'Кіберзахист', value: score(sm.cybersecurityScore) },
        { label: 'е-Голосування', value: `${sm.eVotingParticipation ?? 8}%` },
      ]} />

      {/* 10 — Safety */}
      <SectionTitle num="10" title="Безпека" />
      <MetricGrid items={[
        { label: 'Індекс безпеки', value: score(sm.safetyIndex), highlight: true },
        { label: 'Злочинів на 10к', value: sm.crimeRatePer10k ?? 80 },
        { label: 'Поліцейські відділи', value: sm.policeStations ?? 4 },
        { label: 'Пожежні частини', value: sm.fireDepartments ?? 2 },
        { label: 'ДТП на 10к', value: sm.accidentsPer10k ?? 8 },
        { label: 'Дом. насильство/10к', value: sm.domesticViolenceRate ?? 12 },
        { label: 'Корупція (локальна)', value: score(sm.corruptionLocalIndex) },
      ]} cols={4} />

      {/* 11 — Tourism */}
      <SectionTitle num="11" title="Туризм та Гостинність" />
      <MetricGrid items={[
        { label: 'Туристів на рік', value: `${sm.annualTouristsEstimate ?? 50}к`, highlight: true },
        { label: 'Готелі', value: sm.hotels ?? 8 },
        { label: 'Хостели', value: sm.hostels ?? 2 },
        { label: 'Туристичні атракції', value: sm.touristAttractions ?? 10 },
        { label: 'Ресторанів', value: sm.restaurantsCount ?? 80 },
        { label: 'Міжнар. подій/рік', value: sm.internationalEvents ?? 2 },
        { label: 'Туристичний дохід', value: `${sm.tourismRevenueEstimate ?? 80} млн ₴` },
      ]} cols={4} />

      {/* 12 — Finance */}
      <SectionTitle num="12" title="Муніципальні Фінанси" />
      <MetricGrid items={[
        { label: 'Бюджет на особу', value: `${fmt(sm.budgetPerCapita ?? 8000)} ₴`, highlight: true },
        { label: 'Власні доходи', value: `${sm.ownRevenueShare ?? 58}%` },
        { label: 'Капітальні видатки', value: `${sm.capitalExpenditureShare ?? 20}%` },
        { label: 'Прозорість бюджету', value: score(sm.budgetTransparencyScore) },
        { label: 'Борг на особу', value: `${fmt(sm.debtPerCapita ?? 1200)} ₴` },
        { label: 'Виконання бюджету', value: `${sm.budgetExecution ?? 90}%` },
        { label: 'Закупівлі (ProZorro)', value: `${fmt(sm.procurementVolume)} ₴` },
      ]} cols={4} />

      {/* 13 — Demographics */}
      <SectionTitle num="13" title="Демографія" />
      <MetricGrid items={[
        { label: 'Населення', value: city.population.toLocaleString('uk-UA'), highlight: true },
        { label: 'Щільність', value: `${fmt(sm.populationDensity ?? 800)}/км²` },
        { label: 'Народжуваність', value: `${sm.birthRate ?? 7.8}‰` },
        { label: 'Смертність', value: `${sm.deathRate ?? 13.5}‰` },
        { label: 'Природній приріст', value: `${sm.naturalGrowth ?? -5.7}‰` },
        { label: 'Середній вік', value: `${sm.avgAge ?? 41} р` },
        { label: 'Молодь (до 35)', value: `${sm.youthShare ?? 33}%` },
        { label: 'Працездатні (18–60)', value: `${sm.workingAgeShare ?? 54}%` },
        { label: 'Пенсіонери (60+)', value: `${sm.pensionerShare ?? 24}%` },
        { label: 'Домогосподарств', value: `${sm.householdsCount ?? 100}к` },
      ]} />

    </article>
  );
};
