import React, { useState, useEffect } from 'react';
import { CITIES_DATA } from './constants';
import { CityData } from './types';
import { RankingTable } from './components/RankingTable';
import { CityDetail } from './components/CityDetail';
import { Info, X, FileText, Moon, Sun, MonitorSmartphone, Sparkles } from 'lucide-react';

const Logo: React.FC = () => (
  <div className="flex items-center gap-2.5 select-none">
    {/* Icon mark */}
    <div className="relative w-8 h-8 shrink-0">
      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-500 opacity-20"></div>
      <div className="absolute inset-0 rounded-lg border border-violet-500/40"></div>
      {/* City silhouette bars */}
      <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-end gap-0.5">
        <div className="flex-1 bg-gradient-to-t from-violet-500 to-violet-400 rounded-sm" style={{height:'8px'}}></div>
        <div className="flex-1 bg-gradient-to-t from-fuchsia-500 to-fuchsia-400 rounded-sm" style={{height:'14px'}}></div>
        <div className="flex-1 bg-gradient-to-t from-violet-400 to-cyan-400 rounded-sm" style={{height:'10px'}}></div>
        <div className="flex-1 bg-gradient-to-t from-cyan-500 to-cyan-300 rounded-sm" style={{height:'6px'}}></div>
      </div>
      {/* Pulse dot */}
      <div className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse"></div>
    </div>

    {/* Wordmark */}
    <span className="text-xl md:text-2xl font-black tracking-tight leading-none">
      <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-fuchsia-400">
        Місто
      </span>
      <span className="bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 to-cyan-300">
        Lab
      </span>
    </span>
  </div>
);

const App: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<CityData | null>(null);
  const [showMethodology, setShowMethodology] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    window.scrollTo(0, 0);

    const metaDesc = document.querySelector('meta[name="description"]');
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDesc = document.querySelector('meta[property="og:description"]');

    if (selectedCity) {
      const title = `${selectedCity.name} — рейтинг ${selectedCity.rank}, бал ${selectedCity.totalScore} | МістоLab`;
      const desc = `${selectedCity.name} (${selectedCity.region}): загальний бал ${selectedCity.totalScore}, місце №${selectedCity.rank} серед 51 міста України. ${selectedCity.description} Дані: Work.ua, ProZorro, TI Ukraine, OpenMeteo.`;
      document.title = title;
      if (metaDesc) metaDesc.setAttribute('content', desc);
      if (ogTitle) ogTitle.setAttribute('content', title);
      if (ogDesc) ogDesc.setAttribute('content', desc);
    } else {
      const title = 'МістоLab — Рейтинг якості життя міст України 2024';
      const desc = 'МістоLab — інтегральний рейтинг 51 міста України за якістю життя. Аналізуємо економіку, прозорість влади, екологію та інфраструктуру на основі відкритих даних: Work.ua, ProZorro, TI Ukraine, OpenMeteo.';
      document.title = title;
      if (metaDesc) metaDesc.setAttribute('content', desc);
      if (ogTitle) ogTitle.setAttribute('content', title);
      if (ogDesc) ogDesc.setAttribute('content', desc);
    }
  }, [selectedCity]);

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-12 font-sans transition-colors duration-300">
      {/* Navbar */}
      <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 shadow-sm dark:shadow-slate-900/50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center cursor-pointer" onClick={() => setSelectedCity(null)}>
              <Logo />
            </div>
            <div className="flex items-center space-x-2 md:space-x-6">
              <button
                onClick={() => setShowMethodology(true)}
                className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors hidden sm:block focus:outline-none"
              >
                Методологія
              </button>
              <button
                onClick={() => setShowAbout(true)}
                className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors hidden sm:block focus:outline-none"
              >
                Про проект
              </button>

              <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2 hidden sm:block"></div>


              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all focus:outline-none"
                aria-label="Toggle theme"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      {!selectedCity && (
        <div className="bg-slate-900 dark:bg-black text-white py-12 mb-8 relative overflow-hidden border-b border-slate-800">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-violet-900/40 via-slate-900/80 to-black pointer-events-none"></div>

          {/* Subtle violet glow */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-semibold uppercase tracking-wider mb-4 backdrop-blur-sm">
                <Sparkles className="w-3 h-3" />
                Open Data 2024
              </div>
              <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
                <span className="text-white">Якість життя: </span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-cyan-300">
                  Відкриті Дані
                </span>
              </h1>
              <p className="text-slate-300 text-lg md:text-xl leading-relaxed max-w-2xl text-balance">
                Інтегральний рейтинг міст України. Аналізуємо{' '}
                <span className="text-white font-medium">Економіку</span>,{' '}
                <span className="text-white font-medium">Прозорість</span>,{' '}
                <span className="text-white font-medium">Екологію</span> та{' '}
                <span className="text-white font-medium">Інфраструктуру</span> за допомогою прямих
                API запитів —{' '}
                <strong>17 ключових показників</strong>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {selectedCity ? (
          <CityDetail city={selectedCity} onBack={() => setSelectedCity(null)} />
        ) : (
          <div className="space-y-8 animate-fade-in">
            {/* Stats Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div
                className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg dark:shadow-slate-900/50 hover:border-violet-300 dark:hover:border-violet-700 transition-all cursor-pointer group"
                onClick={() => {
                  const city = CITIES_DATA.find((c) => c.rank === 1);
                  if (city) setSelectedCity(city);
                }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider mb-1">
                      Лідер рейтингу
                    </p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                      Київ
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-2xl bg-violet-50 dark:bg-violet-900/20 flex items-center justify-center text-violet-600 dark:text-violet-400 font-black text-xl border border-violet-100 dark:border-violet-800">
                    1
                  </div>
                </div>
              </div>

              <div
                className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg dark:shadow-slate-900/50 hover:border-fuchsia-300 dark:hover:border-fuchsia-700 transition-all cursor-pointer group"
                onClick={() => {
                  const city = CITIES_DATA.find((c) => c.id === 'chernivtsi');
                  if (city) setSelectedCity(city);
                }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider mb-1">
                      Лідер прозорості
                    </p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white group-hover:text-fuchsia-600 dark:group-hover:text-fuchsia-400 transition-colors">
                      Чернівці
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-2xl bg-fuchsia-50 dark:bg-fuchsia-900/20 flex items-center justify-center text-fuchsia-600 dark:text-fuchsia-400 font-black text-xl border border-fuchsia-100 dark:border-fuchsia-800">
                    4
                  </div>
                </div>
              </div>

              <div
                className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg dark:shadow-slate-900/50 hover:border-amber-300 dark:hover:border-amber-700 transition-all cursor-pointer group"
                onClick={() => {
                  const city = CITIES_DATA.find((c) => c.id === 'kharkiv');
                  if (city) setSelectedCity(city);
                }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider mb-1">
                      Стійкість
                    </p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      Харків
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-2xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-600 dark:text-amber-400 font-black text-xl border border-amber-100 dark:border-amber-800">
                    9
                  </div>
                </div>
              </div>
            </div>

            <RankingTable data={CITIES_DATA} onSelectCity={setSelectedCity} />
          </div>
        )}
      </main>

      <footer className="max-w-7xl mx-auto px-4 py-12 mt-12 text-center border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-violet-400" />
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            &copy; 2024 МістоLab
          </p>
        </div>
        <p className="text-slate-400 dark:text-slate-600 text-xs">
          Дані: Work.ua, TI Ukraine, ProZorro, OpenMeteo, НБУ
        </p>
      </footer>

      {/* Methodology Modal */}
      {showMethodology && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl relative border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setShowMethodology(false)}
              className="absolute top-4 right-4 p-2 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            </button>
            <div className="p-8">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-3">
                <div className="p-2 bg-violet-100 dark:bg-violet-900/30 rounded-lg">
                  <FileText className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                </div>
                Методологія
              </h2>
              <div className="space-y-4 text-slate-600 dark:text-slate-300 leading-relaxed">
                <p>
                  Рейтинг побудовано на 4 кластерах згідно з рекомендаціями "Використання Відкритих
                  Даних для Рейтингу Міст України":
                </p>

                <div className="bg-slate-50 dark:bg-slate-800 p-5 rounded-2xl space-y-4 border border-slate-100 dark:border-slate-700">
                  <div>
                    <h3 className="font-bold text-sky-700 dark:text-sky-400 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                      1. Економіка та Добробут (30%)
                    </h3>
                    <p className="text-sm mt-1 ml-4 text-slate-500 dark:text-slate-400">
                      Базується на даних Work.ua (середня ЗП) та обсягах публічних закупівель
                      (ProZorro).
                    </p>
                  </div>
                  <div>
                    <h3 className="font-bold text-violet-700 dark:text-violet-400 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-violet-500"></span>
                      2. Прозорість та Управління (20%)
                    </h3>
                    <p className="text-sm mt-1 ml-4 text-slate-500 dark:text-slate-400">
                      Використовує "Рейтинг прозорості" Transparency International Ukraine (TI) за
                      2024 рік.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      3. Екологія та Здоров'я (20%)
                    </h3>
                    <p className="text-sm mt-1 ml-4 text-slate-500 dark:text-slate-400">
                      Поєднує live-дані моніторингу повітря (AQI) та щільність зелених зон.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-bold text-amber-700 dark:text-amber-400 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      4. Інфраструктура та Мобільність (30%)
                    </h3>
                    <p className="text-sm mt-1 ml-4 text-slate-500 dark:text-slate-400">
                      Оцінка на основі наявності транспортних API (CityBus) та мап безбар'єрності.
                    </p>
                  </div>
                </div>


                <p className="text-sm bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl border border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200">
                  <strong>API Integration:</strong> Для блоку "Екологія" використовуються прямі
                  запити до OpenMeteo API в реальному часі. Курси валют — НБУ API.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* About Modal */}
      {showAbout && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full shadow-2xl relative border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setShowAbout(false)}
              className="absolute top-4 right-4 p-2 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            </button>
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-violet-100 dark:bg-violet-900/30 rounded-2xl flex items-center justify-center mx-auto mb-5 rotate-3">
                <Info className="w-8 h-8 text-violet-600 dark:text-violet-400" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Про проект</h2>
              <p className="text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
                <strong>МістоLab</strong> — це демонстраційний інструмент, що реалізує сучасну
                методологію оцінки міст на основі відкритих даних (Open Data).
              </p>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 leading-relaxed">
                Дані оновлюються через збір у відкритих даних включаючи 17 різних джерел через{' '}
                <code className="text-violet-500 font-semibold">data/cities.json</code>.
                Живі показники (погода, AQI, курс валют) підтягуються з відкритих API в реальному часі.
              </p>
              <button
                onClick={() => setShowAbout(false)}
                className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-3 rounded-xl font-bold transition-colors w-full"
              >
                Зрозуміло
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
