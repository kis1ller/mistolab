import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  MapPin,
  Users,
  TrendingUp,
  Building2,
  Wallet,
  Wind,
  ShieldCheck,
  FileText,
  Wifi,
  Sun,
  Cloud,
  CloudRain,
  Briefcase,
  Accessibility,
  DollarSign,
  Activity,
  Monitor,
  Palette,
} from 'lucide-react';
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
import { CATEGORY_COLORS, CITY_COAT_OF_ARMS } from '../constants';
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

export const CityDetail: React.FC<CityDetailProps> = ({ city, onBack }) => {
  const [liveAQI, setLiveAQI] = useState<LiveAQIResult | null>(null);
  const [liveWeather, setLiveWeather] = useState<LiveWeatherResult | null>(null);
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates | null>(null);
  const [loading, setLoading] = useState(true);

  const coatOfArms = CITY_COAT_OF_ARMS[city.id] ?? null;
  const [coatError, setCoatError] = useState(false);

  useEffect(() => { setCoatError(false); }, [city.id]);

  const backgroundUrl =
    'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=1600&auto=format&fit=crop';

  useEffect(() => {
    setLoading(true);

    const loadData = async () => {
      const [aqi, weather, rates] = await Promise.all([
        fetchDetailedAirQuality(city.coordinates.lat, city.coordinates.lon),
        fetchWeather(city.coordinates.lat, city.coordinates.lon),
        fetchNbuRates(),
      ]);
      setLiveAQI(aqi);
      setLiveWeather(weather);
      setExchangeRates(rates);
      setLoading(false);
    };

    loadData();
  }, [city]);

  const radarData = [
    { subject: 'Економіка', A: city.metrics[Category.ECONOMY], fullMark: 100 },
    {
      subject: 'Заможність',
      A: Math.min(100, (city.subMetrics.avgSalary / 35000) * 100),
      fullMark: 100,
    },
    { subject: 'Прозорість', A: city.subMetrics.transparencyScore, fullMark: 100 },
    { subject: 'Управління', A: city.metrics[Category.GOVERNANCE], fullMark: 100 },
    { subject: 'Безпека', A: city.subMetrics.safetyIndex, fullMark: 100 },
    { subject: 'Екологія', A: city.metrics[Category.ECOLOGY], fullMark: 100 },
    { subject: 'Культура', A: city.subMetrics.cultureScore, fullMark: 100 },
    {
      subject: 'Цифровізація',
      A:
        (city.subMetrics.hasTransportApi ? 50 : 0) +
        (city.subMetrics.hasAccessibilityMap ? 50 : 0),
      fullMark: 100,
    },
    { subject: 'Інфраструктура', A: city.metrics[Category.INFRASTRUCTURE], fullMark: 100 },
  ];

  const getAqiColor = (aqi: number) => {
    if (aqi <= 50) return 'text-emerald-600 dark:text-emerald-400';
    if (aqi <= 100) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getWeatherIcon = (code: number) => {
    if (code <= 1) return <Sun className="w-5 h-5 text-orange-500" />;
    if (code <= 3) return <Cloud className="w-5 h-5 text-slate-400" />;
    return <CloudRain className="w-5 h-5 text-blue-500" />;
  };

  const calculateRentToSalary = () =>
    Math.round((city.subMetrics.rentCost / city.subMetrics.avgSalary) * 100);

  const getSubItems = (category: Category) => {
    const { subMetrics } = city;
    switch (category) {
      case Category.ECONOMY:
        return [
          {
            label: 'Середня ЗП',
            value: `${subMetrics.avgSalary.toLocaleString()} ₴`,
            subtext: 'Work.ua',
            icon: <Wallet className="w-4 h-4 text-sky-500" />,
          },
          {
            label: 'Оренда 1к',
            value: `${subMetrics.rentCost.toLocaleString()} ₴`,
            subtext: `${calculateRentToSalary()}% від ЗП`,
            icon: <Building2 className="w-4 h-4 text-sky-500" />,
          },
          {
            label: 'Безробіття',
            value: `${subMetrics.unemployment}%`,
            subtext: 'Офіційні дані',
            icon: <Users className="w-4 h-4 text-sky-500" />,
          },
          {
            label: 'Закупівлі',
            value: `${(subMetrics.procurementVolume / 1000).toFixed(1)}k ₴`,
            subtext: 'ProZorro / душу',
            icon: <Briefcase className="w-4 h-4 text-sky-500" />,
          },
        ];
      case Category.GOVERNANCE:
        return [
          {
            label: 'TI Індекс',
            value: `${subMetrics.transparencyScore}/100`,
            subtext: 'Рейтинг прозорості',
            icon: <FileText className="w-4 h-4 text-violet-500" />,
          },
          {
            label: 'Бізнес',
            value: subMetrics.registeredBusiness,
            subtext: 'на 1000 осіб',
            icon: <TrendingUp className="w-4 h-4 text-violet-500" />,
          },
          {
            label: 'Міграція',
            value: `${subMetrics.migrationBalance}/100`,
            subtext: 'Індекс привабливості',
            icon: <Activity className="w-4 h-4 text-violet-500" />,
          },
        ];
      case Category.ECOLOGY:
        return [
          {
            label: 'AQI (Повітря)',
            value: liveAQI ? liveAQI.aqi : subMetrics.airQuality,
            subtext: 'OpenMeteo Live',
            icon: <Wind className="w-4 h-4 text-emerald-500" />,
          },
          {
            label: 'Безпека',
            value: `${subMetrics.safetyIndex}/100`,
            subtext: 'Індекс сприйняття',
            icon: <ShieldCheck className="w-4 h-4 text-emerald-500" />,
          },
        ];
      case Category.INFRASTRUCTURE:
        return [
          {
            label: 'GPS Транспорт',
            value: subMetrics.hasTransportApi ? 'Доступно' : 'Немає',
            subtext: 'API міста',
            icon: <Wifi className="w-4 h-4 text-amber-500" />,
          },
          {
            label: "Безбар'єрність",
            value: subMetrics.hasAccessibilityMap ? 'Мапа є' : 'Немає',
            subtext: 'LUN Misto',
            icon: <Accessibility className="w-4 h-4 text-amber-500" />,
          },
          {
            label: 'ВНЗ',
            value: subMetrics.universities,
            subtext: 'Заклади освіти',
            icon: <Building2 className="w-4 h-4 text-amber-500" />,
          },
          {
            label: 'Культура',
            value: `${subMetrics.cultureScore}/100`,
            subtext: 'Заклади дозвілля',
            icon: <Palette className="w-4 h-4 text-amber-500" />,
          },
        ];
      default:
        return [];
    }
  };

  return (
    <div className="animate-fade-in-up space-y-8 pb-12">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors mb-4 group font-medium"
      >
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Повернутися до рейтингу
      </button>

      {/* Main Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl dark:shadow-slate-900/50 border border-slate-200 dark:border-slate-800 overflow-visible">
        {/* Image Header */}
        <div className="relative h-56 md:h-64 group">
          <div className="absolute inset-0 overflow-hidden rounded-t-3xl">
            <div
              className={`absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105 ${
                coatOfArms ? 'blur-[2px] scale-105' : ''
              }`}
              style={{ backgroundImage: `url(${backgroundUrl})` }}
            />
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none mix-blend-overlay"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-violet-950 via-violet-900/40 to-transparent opacity-90"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/70 via-transparent to-transparent opacity-80"></div>

            {coatOfArms && !coatError && (
              <div className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none">
                <img
                  src={coatOfArms}
                  alt={`Герб ${city.name}`}
                  className="h-28 md:h-32 w-auto object-contain drop-shadow-[0_0_35px_rgba(167,139,250,0.6)] animate-fade-in-up"
                  onError={() => setCoatError(true)}
                />
              </div>
            )}
          </div>

          {/* Rank Badge */}
          <div className="absolute -bottom-8 left-6 md:left-10 z-20">
            <div className="relative group/badge scale-90 md:scale-100">
              <div className="absolute inset-0 bg-violet-400 blur-xl opacity-40 rounded-full animate-pulse"></div>
              <div className="relative p-1 bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-white/20">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-white dark:bg-slate-900/90 backdrop-blur-xl rounded-xl flex flex-col items-center justify-center border border-white/50 dark:border-slate-700 shadow-inner">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mb-0.5">
                    Місце
                  </span>
                  <span className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-br from-violet-600 to-cyan-500 dark:from-violet-400 dark:to-cyan-300 tracking-tighter">
                    {city.rank}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Total Score */}
          <div className="absolute bottom-3 right-6 md:right-10 text-white text-right z-10">
            <p className="opacity-90 text-[10px] font-bold uppercase tracking-widest mb-0.5 text-violet-200">
              Загальний Бал
            </p>
            <div className="text-6xl md:text-7xl font-black tracking-tight text-white drop-shadow-[0_0_25px_rgba(167,139,250,0.7)] leading-none">
              {city.totalScore}
            </div>
          </div>

          {/* City Name (mobile) */}
          <div className="absolute bottom-12 left-6 md:left-10 z-0 md:hidden">
            <h1 className="text-2xl font-bold text-white drop-shadow-lg">{city.name}</h1>
          </div>
        </div>

        {/* Content */}
        <div className="pt-12 px-6 md:px-10 pb-8 rounded-b-3xl bg-white dark:bg-slate-900 relative z-0">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="hidden md:block text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                {city.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-slate-500 dark:text-slate-400 text-sm font-medium">
                <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg text-slate-600 dark:text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-violet-500" /> {city.region}
                </span>
                <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg text-slate-600 dark:text-slate-300">
                  <Users className="w-3.5 h-3.5 text-violet-500" />{' '}
                  {city.population.toLocaleString()} мешканців
                </span>
              </div>
            </div>
          </div>
          <p className="text-slate-600 dark:text-slate-300 text-base md:text-lg leading-relaxed max-w-4xl border-l-4 border-violet-400 pl-5 italic">
            {city.description}
          </p>
        </div>
      </div>

      {/* Live Monitor + Radar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        {/* Live Monitor */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Wifi className="w-5 h-5 text-red-500 animate-pulse" />
            Live Монітор (API)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            {/* Weather */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-center justify-between hover:border-violet-300 dark:hover:border-violet-700 transition-colors">
              <div>
                <div className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-1">
                  Погода зараз
                </div>
                {loading || !liveWeather ? (
                  <div className="animate-pulse h-6 w-24 bg-slate-100 dark:bg-slate-800 rounded"></div>
                ) : (
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-slate-900 dark:text-white">
                      {liveWeather.temperature}°
                    </span>
                    <span className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Wind className="w-3 h-3" /> {liveWeather.windSpeed} км/г
                    </span>
                  </div>
                )}
              </div>
              {liveWeather && (
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  {getWeatherIcon(liveWeather.conditionCode)}
                </div>
              )}
            </div>

            {/* AQI */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-center justify-between hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors">
              <div>
                <div className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-1">
                  Якість повітря
                </div>
                {loading || !liveAQI ? (
                  <div className="animate-pulse h-6 w-24 bg-slate-100 dark:bg-slate-800 rounded"></div>
                ) : (
                  <div>
                    <div className="text-3xl font-bold flex items-center gap-2">
                      <span className={getAqiColor(liveAQI.aqi)}>{liveAQI.aqi}</span>
                      <span className="text-sm text-slate-400 font-normal">AQI</span>
                    </div>
                    <div className="flex gap-2 mt-1 text-[10px] text-slate-500">
                      <span className="bg-slate-50 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-100 dark:border-slate-700">
                        PM2.5: {liveAQI.pm2_5}
                      </span>
                      <span className="bg-slate-50 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-100 dark:border-slate-700">
                        NO₂: {liveAQI.no2}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <Wind
                  className={`w-6 h-6 ${liveAQI ? getAqiColor(liveAQI.aqi) : 'text-slate-400'}`}
                />
              </div>
            </div>

            {/* Exchange Rate */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-center justify-between hover:border-amber-300 dark:hover:border-amber-700 transition-colors">
              <div>
                <div className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-1">
                  Зарплата (екв.)
                </div>
                {loading || !exchangeRates ? (
                  <div className="animate-pulse h-6 w-24 bg-slate-100 dark:bg-slate-800 rounded"></div>
                ) : (
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                      ${(city.subMetrics.avgSalary / exchangeRates.usd).toFixed(0)}
                    </span>
                    <span className="text-xs text-slate-500">Курс НБУ: {exchangeRates.usd}</span>
                  </div>
                )}
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <DollarSign className="w-6 h-6 text-emerald-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Radar Chart */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-lg dark:shadow-slate-900/50 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center relative min-h-[400px]">
          <h3 className="absolute top-6 left-6 text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Monitor className="w-5 h-5 text-violet-500" />
            Профіль міста (9-Axis)
          </h3>
          <div className="w-full h-[350px] mt-8">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="#94a3b8" strokeOpacity={0.2} />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }}
                />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name={city.name}
                  dataKey="A"
                  stroke="#7c3aed"
                  strokeWidth={3}
                  fill="#7c3aed"
                  fillOpacity={0.35}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    backgroundColor: '#1e293b',
                    color: '#f8fafc',
                    padding: '8px 12px',
                  }}
                  itemStyle={{ color: '#a78bfa', fontWeight: 600 }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Cluster Breakdown */}
      <div>
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2 px-1">
          <Building2 className="w-6 h-6 text-violet-500" />
          Детальний аналіз за методологією
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.values(Category).map((cat) => {
            const color = CATEGORY_COLORS[cat];
            const score = city.metrics[cat];
            const subItems = getSubItems(cat);

            return (
              <div
                key={cat}
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-lg font-bold text-slate-800 dark:text-white">{cat}</h4>
                    <div
                      className="h-1 w-12 rounded-full mt-2"
                      style={{ backgroundColor: color }}
                    ></div>
                  </div>
                  <span className="text-2xl font-black" style={{ color }}>
                    {score}
                  </span>
                </div>

                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 mb-6">
                  <div
                    className="h-2 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${score}%`, backgroundColor: color }}
                  ></div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {subItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-50 dark:bg-slate-950/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800/50 flex flex-col hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                    >
                      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs uppercase font-bold tracking-wide mb-1">
                        {item.icon}
                        <span className="truncate">{item.label}</span>
                      </div>
                      <div className="text-base font-bold text-slate-800 dark:text-slate-200 mt-auto">
                        {item.value}
                      </div>
                      <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                        {item.subtext}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
