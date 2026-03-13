import React, { useState, useMemo } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, Search, ChevronRight, SlidersHorizontal, X, RotateCcw, Wallet, ShieldCheck, Leaf, MapPin, Building2, Users } from 'lucide-react';
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
}

export const RankingTable: React.FC<RankingTableProps> = ({ data, onSelectCity }) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'rank', direction: 'asc' });
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState<FilterState>({
    minSalary: 0,
    minEcology: 0,
    minSafety: 0,
    maxRent: 30000, // Default high to show all
    maxUnemployment: 30, // Default high to show all
    region: ''
  });

  // Extract unique regions for the dropdown
  const uniqueRegions = useMemo(() => {
    return Array.from(new Set(data.map(city => city.region))).sort();
  }, [data]);

  const handleSort = (key: keyof CityMetrics | 'totalScore' | 'rank' | 'name') => {
    let direction: 'asc' | 'desc' = 'desc'; // Default to high score first for metrics
    if (key === 'rank' || key === 'name') direction = 'asc'; // Default low to high for rank/name

    if (sortConfig.key === key) {
      direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
    }
    setSortConfig({ key, direction });
  };

  const resetFilters = () => {
    setFilters({
      minSalary: 0,
      minEcology: 0,
      minSafety: 0,
      maxRent: 30000,
      maxUnemployment: 30,
      region: ''
    });
    setSearchTerm('');
  };

  const filteredAndSortedData = useMemo(() => {
    return data
      .filter(city => {
        const matchesSearch = city.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSalary = city.subMetrics.avgSalary >= filters.minSalary;
        const matchesEcology = city.metrics[Category.ECOLOGY] >= filters.minEcology;
        const matchesSafety = city.subMetrics.safetyIndex >= filters.minSafety;
        const matchesRent = city.subMetrics.rentCost <= filters.maxRent;
        const matchesUnemployment = city.subMetrics.unemployment <= filters.maxUnemployment;
        const matchesRegion = filters.region === '' || city.region === filters.region;

        return matchesSearch && matchesSalary && matchesEcology && matchesSafety && matchesRegion && matchesRent && matchesUnemployment;
      })
      .sort((a, b) => {
        let aValue: any = a[sortConfig.key as keyof CityData];
        let bValue: any = b[sortConfig.key as keyof CityData];

        // Handle nested metrics sorting
        if (Object.values(Category).includes(sortConfig.key as any)) {
          aValue = a.metrics[sortConfig.key as Category];
          bValue = b.metrics[sortConfig.key as Category];
        }

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
  }, [data, searchTerm, filters, sortConfig]);

  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key) return <ArrowUpDown className="w-4 h-4 opacity-30" />;
    return sortConfig.direction === 'asc' ? <ArrowUp className="w-4 h-4 text-blue-600 dark:text-cyan-400" /> : <ArrowDown className="w-4 h-4 text-blue-600 dark:text-cyan-400" />;
  };

  const getScoreColor = (score: number) => {
    // 800 - 1000: Green
    if (score >= 800) return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 font-bold';
    // 700 - 800: Blue
    if (score >= 700) return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 font-semibold';
    // 600 - 700: Yellow
    if (score >= 600) return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
    // 0 - 600: Red
    return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900 shadow-xl dark:shadow-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors duration-300">
      <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col gap-4 bg-slate-50 dark:bg-slate-800/50">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            Загальний рейтинг 2025
            <span className="text-sm font-normal text-slate-500 dark:text-slate-400 ml-2 bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-full">
              {filteredAndSortedData.length} міст
            </span>
          </h2>
          
          <div className="flex w-full md:w-auto gap-3">
             <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl border transition-all ${
                showFilters 
                ? 'bg-blue-100 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-300' 
                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
             >
               <SlidersHorizontal className="w-4 h-4" />
               Фільтри
             </button>

            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Пошук міста..."
                className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500 transition-all placeholder:text-slate-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Expandable Filter Panel */}
        {showFilters && (
          <div className="animate-fade-in-down grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-inner">
            
            {/* Salary Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase flex items-center gap-1">
                <Wallet className="w-3 h-3" /> Мін. Зарплата (грн)
              </label>
              <div className="flex items-center gap-3">
                <input 
                  type="range" 
                  min="0" 
                  max="35000" 
                  step="1000" 
                  value={filters.minSalary}
                  onChange={(e) => setFilters({...filters, minSalary: Number(e.target.value)})}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300 w-16 text-right">
                  {filters.minSalary > 0 ? `${filters.minSalary/1000}k` : 'Всі'}
                </span>
              </div>
            </div>

            {/* Rent Filter (NEW) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase flex items-center gap-1">
                <Building2 className="w-3 h-3" /> Макс. Оренда (грн)
              </label>
              <div className="flex items-center gap-3">
                <input 
                  type="range" 
                  min="0" 
                  max="30000" 
                  step="1000" 
                  value={filters.maxRent}
                  onChange={(e) => setFilters({...filters, maxRent: Number(e.target.value)})}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-600"
                />
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300 w-16 text-right">
                  {filters.maxRent >= 30000 ? 'Всі' : `${filters.maxRent/1000}k`}
                </span>
              </div>
            </div>

            {/* Safety Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Мін. Безпека (0-100)
              </label>
              <div className="flex items-center gap-3">
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  step="5" 
                  value={filters.minSafety}
                  onChange={(e) => setFilters({...filters, minSafety: Number(e.target.value)})}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300 w-8 text-right">
                  {filters.minSafety}
                </span>
              </div>
            </div>

            {/* Ecology Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase flex items-center gap-1">
                <Leaf className="w-3 h-3" /> Мін. Екологія (Бал)
              </label>
              <div className="flex items-center gap-3">
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  step="5" 
                  value={filters.minEcology}
                  onChange={(e) => setFilters({...filters, minEcology: Number(e.target.value)})}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-green-600"
                />
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300 w-8 text-right">
                  {filters.minEcology}
                </span>
              </div>
            </div>

            {/* Unemployment Filter (NEW) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase flex items-center gap-1">
                <Users className="w-3 h-3" /> Макс. Безробіття (%)
              </label>
              <div className="flex items-center gap-3">
                <input 
                  type="range" 
                  min="0" 
                  max="30" 
                  step="1" 
                  value={filters.maxUnemployment}
                  onChange={(e) => setFilters({...filters, maxUnemployment: Number(e.target.value)})}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300 w-8 text-right">
                  {filters.maxUnemployment >= 30 ? 'Всі' : `${filters.maxUnemployment}%`}
                </span>
              </div>
            </div>

            {/* Region & Reset */}
            <div className="flex items-end gap-2">
               <div className="w-full space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Область
                  </label>
                  <select 
                    value={filters.region}
                    onChange={(e) => setFilters({...filters, region: e.target.value})}
                    className="w-full p-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Всі області</option>
                    {uniqueRegions.map(region => (
                      <option key={region} value={region}>{region}</option>
                    ))}
                  </select>
               </div>
               <button 
                onClick={resetFilters}
                className="p-2 mb-[1px] rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-red-100 dark:hover:bg-red-900/30 text-slate-500 hover:text-red-600 dark:text-slate-400 transition-colors"
                title="Скинути фільтри"
               >
                 <RotateCcw className="w-5 h-5" />
               </button>
            </div>

          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-100 dark:bg-slate-800 sticky top-0">
            <tr>
              <th scope="col" className="px-6 py-4 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" onClick={() => handleSort('rank')}>
                <div className="flex items-center gap-1">№ {getSortIcon('rank')}</div>
              </th>
              <th scope="col" className="px-6 py-4 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" onClick={() => handleSort('name')}>
                <div className="flex items-center gap-1">Місто {getSortIcon('name')}</div>
              </th>
              <th scope="col" className="px-6 py-4 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-right" onClick={() => handleSort('totalScore')}>
                <div className="flex items-center justify-end gap-1">Бали {getSortIcon('totalScore')}</div>
              </th>
              {/* Methodology Categories */}
              <th scope="col" className="hidden md:table-cell px-2 py-4 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 text-center" onClick={() => handleSort(Category.ECONOMY)}>
                <span className="border-b-2 border-sky-500 pb-1" title={Category.ECONOMY}>Економіка</span>
              </th>
               <th scope="col" className="hidden md:table-cell px-2 py-4 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 text-center" onClick={() => handleSort(Category.GOVERNANCE)}>
                <span className="border-b-2 border-violet-500 pb-1" title={Category.GOVERNANCE}>Прозорість</span>
              </th>
               <th scope="col" className="hidden lg:table-cell px-2 py-4 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 text-center" onClick={() => handleSort(Category.ECOLOGY)}>
                <span className="border-b-2 border-emerald-500 pb-1" title={Category.ECOLOGY}>Екологія</span>
              </th>
              <th scope="col" className="hidden lg:table-cell px-2 py-4 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 text-center" onClick={() => handleSort(Category.INFRASTRUCTURE)}>
                <span className="border-b-2 border-amber-500 pb-1" title={Category.INFRASTRUCTURE}>Інфра</span>
              </th>
              <th scope="col" className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredAndSortedData.length > 0 ? (
              filteredAndSortedData.map((city) => (
                <tr 
                  key={city.id} 
                  onClick={() => onSelectCity(city)}
                  className="bg-white dark:bg-slate-900 hover:bg-blue-50 dark:hover:bg-slate-800 cursor-pointer transition-colors group"
                >
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{city.rank}</td>
                  <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-100">{city.name}</td>
                  <td className="px-6 py-4 text-right">
                    <span className={`px-3 py-1 rounded-full text-xs ${getScoreColor(city.totalScore)}`}>
                      {city.totalScore}
                    </span>
                  </td>
                  {/* Metric Cells */}
                  <td className="hidden md:table-cell px-2 py-4 text-center text-slate-600 dark:text-slate-400">{city.metrics[Category.ECONOMY]}</td>
                  <td className="hidden md:table-cell px-2 py-4 text-center text-slate-600 dark:text-slate-400">{city.metrics[Category.GOVERNANCE]}</td>
                  <td className="hidden lg:table-cell px-2 py-4 text-center text-slate-600 dark:text-slate-400">{city.metrics[Category.ECOLOGY]}</td>
                  <td className="hidden lg:table-cell px-2 py-4 text-center text-slate-600 dark:text-slate-400">{city.metrics[Category.INFRASTRUCTURE]}</td>
                  
                  <td className="px-6 py-4 text-right">
                    <ChevronRight className="w-5 h-5 text-slate-300 dark:text-slate-600 group-hover:text-blue-500 dark:group-hover:text-cyan-400 transition-colors" />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                  <div className="flex flex-col items-center gap-3">
                    <Search className="w-8 h-8 opacity-50" />
                    <p>За вашими фільтрами міст не знайдено.</p>
                    <button 
                      onClick={resetFilters} 
                      className="text-blue-600 dark:text-cyan-400 font-medium hover:underline"
                    >
                      Скинути фільтри
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="p-4 bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-500 dark:text-slate-400 text-center border-t border-slate-200 dark:border-slate-800">
        * Дані: Work.ua (Зарплати), TI Ukraine (Прозорість), OpenMeteo (Екологія Live), ProZorro.
      </div>
    </div>
  );
};