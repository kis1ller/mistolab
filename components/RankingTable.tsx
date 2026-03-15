import React, { useState, useMemo } from 'react';
import { Search, ChevronRight, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { CityData, CityMetrics, Category, SortConfig } from '../types';

interface RankingTableProps {
  data: CityData[];
  onSelectCity: (city: CityData) => void;
}

interface FilterState {
  minSalary: number;
  minEcology: number;
  minSafety: number;
  maxRent: number;
  maxUnemployment: number;
  region: string;
  minTotalScore: number;
  minTransparency: number;
  minInfrastructure: number;
  minEconomy: number;
  minPopulation: number;
  maxPopulation: number;
  hasTransportApi: boolean | null;
}

export const RankingTable: React.FC<RankingTableProps> = ({ data, onSelectCity }) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'rank', direction: 'asc' });
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    minSalary: 0, minEcology: 0, minSafety: 0,
    maxRent: 30000, maxUnemployment: 30, region: '',
    minTotalScore: 0, minTransparency: 0, minInfrastructure: 0,
    minEconomy: 0, minPopulation: 0, maxPopulation: 3000,
    hasTransportApi: null,
  });

  const uniqueRegions = useMemo(
    () => Array.from(new Set(data.map((c) => c.region))).sort(),
    [data]
  );

  const handleSort = (key: keyof CityMetrics | 'totalScore' | 'rank' | 'name') => {
    let dir: 'asc' | 'desc' = key === 'rank' || key === 'name' ? 'asc' : 'desc';
    if (sortConfig.key === key) dir = sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction: dir });
  };

  const resetFilters = () => {
    setFilters({
      minSalary: 0, minEcology: 0, minSafety: 0,
      maxRent: 30000, maxUnemployment: 30, region: '',
      minTotalScore: 0, minTransparency: 0, minInfrastructure: 0,
      minEconomy: 0, minPopulation: 0, maxPopulation: 3000,
      hasTransportApi: null,
    });
    setSearchTerm('');
  };

  const rows = useMemo(() => {
    return data
      .filter((c) => {
        const s = c.subMetrics;
        return (
          c.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          s.avgSalary >= filters.minSalary &&
          c.metrics[Category.ECOLOGY] >= filters.minEcology &&
          s.safetyIndex >= filters.minSafety &&
          s.rentCost <= filters.maxRent &&
          s.unemployment <= filters.maxUnemployment &&
          (filters.region === '' || c.region === filters.region) &&
          c.totalScore >= filters.minTotalScore &&
          c.metrics[Category.GOVERNANCE] >= filters.minTransparency &&
          c.metrics[Category.INFRASTRUCTURE] >= filters.minInfrastructure &&
          c.metrics[Category.ECONOMY] >= filters.minEconomy &&
          c.population >= filters.minPopulation * 1000 &&
          (filters.maxPopulation >= 3000 || c.population <= filters.maxPopulation * 1000) &&
          (filters.hasTransportApi === null || s.hasTransportApi === filters.hasTransportApi)
        );
      })
      .sort((a, b) => {
        let av: any = a[sortConfig.key as keyof CityData];
        let bv: any = b[sortConfig.key as keyof CityData];
        if (Object.values(Category).includes(sortConfig.key as Category)) {
          av = a.metrics[sortConfig.key as Category];
          bv = b.metrics[sortConfig.key as Category];
        }
        if (av < bv) return sortConfig.direction === 'asc' ? -1 : 1;
        if (av > bv) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
  }, [data, searchTerm, filters, sortConfig]);

  const SortIndicator = ({ k }: { k: string }) => {
    if (sortConfig.key !== k) return <span className="opacity-20 text-[10px]">↕</span>;
    return <span className="text-orange-500 text-[10px]">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>;
  };

  const th = (label: string, key: keyof CityMetrics | 'totalScore' | 'rank' | 'name', cls = '') => (
    <th
      className={`px-4 py-3 text-left cursor-pointer select-none hover:text-slate-900 dark:hover:text-white transition-colors group ${cls}`}
      onClick={() => handleSort(key)}
    >
      <span className="flex items-center gap-1">
        {label}
        <SortIndicator k={key} />
      </span>
    </th>
  );

  return (
    <div className="w-full">
      {/* toolbar */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Пошук міста…"
            className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-400 placeholder:text-slate-400 transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs rounded-lg border transition-colors ${
            showFilters
              ? 'border-orange-300 dark:border-orange-700 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
              : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Фільтри
        </button>
        <span className="text-xs text-slate-400 dark:text-slate-500 font-mono ml-1">
          {rows.length}/{data.length}
        </span>
      </div>

      {/* filter panel */}
      {showFilters && (
        <div className="mb-4 p-4 border border-slate-100 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4">
            {[
              { label: 'Мін. зарплата', key: 'minSalary', min: 0, max: 35000, step: 1000, fmt: (v: number) => v > 0 ? `${v/1000}k ₴` : 'Всі' },
              { label: 'Макс. оренда', key: 'maxRent', min: 0, max: 30000, step: 1000, fmt: (v: number) => v < 30000 ? `${v/1000}k ₴` : 'Всі' },
              { label: 'Мін. безпека', key: 'minSafety', min: 0, max: 100, step: 5, fmt: (v: number) => v > 0 ? v : 'Всі' },
              { label: 'Мін. екологія', key: 'minEcology', min: 0, max: 100, step: 5, fmt: (v: number) => v > 0 ? v : 'Всі' },
              { label: 'Макс. безробіття', key: 'maxUnemployment', min: 0, max: 30, step: 1, fmt: (v: number) => v < 30 ? `${v}%` : 'Всі' },
              { label: 'Мін. бал', key: 'minTotalScore', min: 0, max: 900, step: 50, fmt: (v: number) => v > 0 ? String(v) : 'Всі' },
              { label: 'Мін. прозорість', key: 'minTransparency', min: 0, max: 100, step: 5, fmt: (v: number) => v > 0 ? String(v) : 'Всі' },
              { label: 'Мін. інфраструктура', key: 'minInfrastructure', min: 0, max: 100, step: 5, fmt: (v: number) => v > 0 ? String(v) : 'Всі' },
              { label: 'Мін. економіка', key: 'minEconomy', min: 0, max: 100, step: 5, fmt: (v: number) => v > 0 ? String(v) : 'Всі' },
              { label: 'Мін. населення', key: 'minPopulation', min: 0, max: 2000, step: 50, fmt: (v: number) => v > 0 ? `${v}k` : 'Всі' },
              { label: 'Макс. населення', key: 'maxPopulation', min: 50, max: 3000, step: 50, fmt: (v: number) => v < 3000 ? `${v}k` : 'Всі' },
            ].map(({ label, key, min, max, step, fmt }) => (
              <div key={key}>
                <div className="flex justify-between items-baseline mb-1.5">
                  <label className="text-[11px] text-slate-400 dark:text-slate-500 uppercase tracking-wide">{label}</label>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 tabular-nums">
                    {fmt(filters[key as keyof FilterState] as number)}
                  </span>
                </div>
                <input
                  type="range"
                  min={min}
                  max={max}
                  step={step}
                  value={filters[key as keyof FilterState] as number}
                  onChange={(e) => setFilters({ ...filters, [key]: Number(e.target.value) })}
                  className="w-full h-1 accent-orange-500 cursor-pointer"
                />
              </div>
            ))}
            <div>
              <label className="text-[11px] text-slate-400 dark:text-slate-500 uppercase tracking-wide block mb-1.5">Область</label>
              <select
                value={filters.region}
                onChange={(e) => setFilters({ ...filters, region: e.target.value })}
                className="w-full text-xs px-2 py-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
              >
                <option value="">Всі</option>
                {uniqueRegions.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[11px] text-slate-400 dark:text-slate-500 uppercase tracking-wide block mb-1.5">Транспорт API</label>
              <div className="flex gap-2">
                {([null, true, false] as const).map((val) => (
                  <button
                    key={String(val)}
                    onClick={() => setFilters({ ...filters, hasTransportApi: val })}
                    className={`flex-1 text-[11px] py-1.5 rounded border transition-colors ${
                      filters.hasTransportApi === val
                        ? 'border-orange-300 dark:border-orange-700 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
                        : 'border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {val === null ? 'Всі' : val ? 'Так' : 'Ні'}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <button
            onClick={resetFilters}
            className="mt-4 flex items-center gap-1 text-xs text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <RotateCcw className="w-3 h-3" /> скинути
          </button>
        </div>
      )}

      {/* table */}
      <div className="border border-slate-100 dark:border-slate-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[11px] font-mono text-slate-400 dark:text-slate-500 uppercase tracking-wide border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                {th('#', 'rank', 'w-10')}
                {th('Місто', 'name')}
                {th('Бал', 'totalScore', 'text-right')}
                {th('Економіка', Category.ECONOMY, 'hidden md:table-cell text-right')}
                {th('Прозорість', Category.GOVERNANCE, 'hidden md:table-cell text-right')}
                {th('Екологія', Category.ECOLOGY, 'hidden lg:table-cell text-right')}
                {th('Інфра', Category.INFRASTRUCTURE, 'hidden lg:table-cell text-right')}
                <th className="w-8"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/60">
              {rows.length > 0 ? rows.map((city) => (
                <tr
                  key={city.id}
                  onClick={() => onSelectCity(city)}
                  className="bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer transition-colors group"
                >
                  <td className="px-4 py-3 font-mono text-xs text-slate-400 dark:text-slate-600 tabular-nums">
                    {city.rank}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-semibold text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                      {city.name}
                    </span>
                    <span className="hidden sm:inline text-xs text-slate-400 dark:text-slate-600 ml-2">
                      {city.region}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="font-bold tabular-nums text-slate-900 dark:text-white">
                      {city.totalScore}
                    </span>
                  </td>
                  <td className="hidden md:table-cell px-4 py-3 text-right text-xs tabular-nums text-slate-500 dark:text-slate-400">
                    {city.metrics[Category.ECONOMY]}
                  </td>
                  <td className="hidden md:table-cell px-4 py-3 text-right text-xs tabular-nums text-slate-500 dark:text-slate-400">
                    {city.metrics[Category.GOVERNANCE]}
                  </td>
                  <td className="hidden lg:table-cell px-4 py-3 text-right text-xs tabular-nums text-slate-500 dark:text-slate-400">
                    {city.metrics[Category.ECOLOGY]}
                  </td>
                  <td className="hidden lg:table-cell px-4 py-3 text-right text-xs tabular-nums text-slate-500 dark:text-slate-400">
                    {city.metrics[Category.INFRASTRUCTURE]}
                  </td>
                  <td className="px-2 py-3">
                    <ChevronRight className="w-4 h-4 text-slate-200 dark:text-slate-700 group-hover:text-orange-500 transition-colors" />
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-sm text-slate-400">
                    Нічого не знайдено.{' '}
                    <button onClick={resetFilters} className="text-orange-500 hover:underline">скинути фільтри</button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
