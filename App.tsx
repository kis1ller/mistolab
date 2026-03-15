import React, { useState, useEffect, useCallback } from 'react';
import { CITIES_DATA } from './constants';
import { CityData } from './types';
import { RankingTable } from './components/RankingTable';
import { CityDetail } from './components/CityDetail';

// ── hero illustration ─────────────────────────────────────────────────────────

const HeroIllustration: React.FC = () => (
  <svg width="360" height="300" viewBox="0 0 360 300" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">

    {/* ── dot grid background ── */}
    {Array.from({ length: 8 }, (_, row) =>
      Array.from({ length: 11 }, (_, col) => (
        <circle key={`${row}-${col}`} cx={col * 34 + 10} cy={row * 34 + 10} r="1.2"
          className="fill-slate-200 dark:fill-slate-800"/>
      ))
    )}

    {/* ── city skyline (right half, muted backdrop) ── */}
    {/* far buildings */}
    <rect x="200" y="170" width="18" height="58" rx="1" className="fill-slate-100 dark:fill-slate-800/80"/>
    <rect x="222" y="155" width="16" height="73" rx="1" className="fill-slate-100 dark:fill-slate-800/80"/>
    <rect x="242" y="162" width="20" height="66" rx="1" className="fill-slate-100 dark:fill-slate-800/80"/>
    <rect x="266" y="148" width="18" height="80" rx="1" className="fill-slate-100 dark:fill-slate-800/80"/>
    <rect x="288" y="158" width="22" height="70" rx="1" className="fill-slate-100 dark:fill-slate-800/80"/>
    <rect x="314" y="172" width="16" height="56" rx="1" className="fill-slate-100 dark:fill-slate-800/80"/>
    <rect x="334" y="165" width="20" height="63" rx="1" className="fill-slate-100 dark:fill-slate-800/80"/>
    {/* mid buildings */}
    <rect x="210" y="185" width="24" height="43" rx="1" className="fill-slate-200 dark:fill-slate-700/70"/>
    <rect x="248" y="178" width="28" height="50" rx="1" className="fill-slate-200 dark:fill-slate-700/70"/>
    <rect x="290" y="190" width="24" height="38" rx="1" className="fill-slate-200 dark:fill-slate-700/70"/>
    <rect x="328" y="182" width="28" height="46" rx="1" className="fill-slate-200 dark:fill-slate-700/70"/>
    {/* orange hero tower */}
    <rect x="270" y="118" width="36" height="110" rx="1.5" fill="#ea580c" fillOpacity="0.1"/>
    <rect x="270" y="118" width="36" height="110" rx="1.5" stroke="#ea580c" strokeWidth="1.5" strokeOpacity="0.5" fill="none"/>
    {[130,146,162,178,194].map(y => (
      <React.Fragment key={y}>
        <rect x="276" y={y} width="7" height="5" rx="0.5" fill="#ea580c" fillOpacity="0.55"/>
        <rect x="287" y={y} width="7" height="5" rx="0.5" fill="#ea580c" fillOpacity="0.3"/>
        <rect x="298" y={y} width="7" height="5" rx="0.5" fill="#ea580c" fillOpacity="0.55"/>
      </React.Fragment>
    ))}
    {/* antenna */}
    <line x1="288" y1="118" x2="288" y2="100" stroke="#ea580c" strokeWidth="1.5" strokeOpacity="0.6"/>
    <circle cx="288" cy="98" r="2.5" fill="#ea580c"/>
    <circle cx="288" cy="98" r="2.5" fill="#ea580c" fillOpacity="0.35">
      <animate attributeName="r" from="2.5" to="6" dur="2s" repeatCount="indefinite"/>
      <animate attributeName="opacity" from="0.35" to="0" dur="2s" repeatCount="indefinite"/>
    </circle>
    {/* ground */}
    <line x1="195" y1="228" x2="355" y2="228" className="stroke-slate-200 dark:stroke-slate-700" strokeWidth="1"/>

    {/* ── data card (left, floating) ── */}
    <rect x="12" y="46" width="168" height="148" rx="8"
      className="fill-white dark:fill-slate-900" stroke="none"/>
    <rect x="12" y="46" width="168" height="148" rx="8" fill="none"
      className="stroke-slate-200 dark:stroke-slate-700" strokeWidth="1"/>
    {/* card header */}
    <rect x="12" y="46" width="168" height="32" rx="8" className="fill-slate-50 dark:fill-slate-800/60"/>
    <rect x="12" y="62" width="168" height="16" className="fill-slate-50 dark:fill-slate-800/60"/>
    <circle cx="28" cy="62" r="5" fill="#ea580c" fillOpacity="0.2"/>
    <circle cx="28" cy="62" r="3" fill="#ea580c" fillOpacity="0.7"/>
    <rect x="38" y="57" width="54" height="5" rx="2" className="fill-slate-300 dark:fill-slate-600"/>
    <rect x="38" y="65" width="36" height="4" rx="2" className="fill-slate-200 dark:fill-slate-700"/>
    {/* bar chart inside card */}
    <line x1="24" y1="174" x2="168" y2="174" className="stroke-slate-100 dark:stroke-slate-800" strokeWidth="1"/>
    {[
      { x: 26,  h: 42, accent: true  },
      { x: 46,  h: 28, accent: false },
      { x: 66,  h: 55, accent: false },
      { x: 86,  h: 35, accent: false },
      { x: 106, h: 62, accent: true  },
      { x: 126, h: 20, accent: false },
      { x: 146, h: 48, accent: false },
    ].map(({ x, h, accent }) => (
      <rect key={x} x={x} y={174 - h} width="14" height={h} rx="2"
        fill={accent ? '#ea580c' : undefined}
        fillOpacity={accent ? 0.85 : undefined}
        className={accent ? '' : 'fill-slate-200 dark:fill-slate-700'}/>
    ))}
    {/* trend line */}
    <polyline points="33,162 53,148 73,136 93,152 113,122 133,158 153,138"
      stroke="#ea580c" strokeWidth="1.5" strokeOpacity="0.45" fill="none" strokeDasharray="3 2"/>
    {/* floating badge */}
    <rect x="118" y="52" width="52" height="22" rx="4" fill="#ea580c"/>
    <rect x="124" y="57" width="20" height="4" rx="1" fill="white" fillOpacity="0.9"/>
    <rect x="124" y="64" width="12" height="3" rx="1" fill="white" fillOpacity="0.55"/>

    {/* ── person ── */}
    {/* shadow */}
    <ellipse cx="185" cy="234" rx="22" ry="5" className="fill-slate-200 dark:fill-slate-800"/>
    {/* legs */}
    <rect x="175" y="202" width="10" height="32" rx="5" className="fill-slate-300 dark:fill-slate-600"/>
    <rect x="188" y="202" width="10" height="32" rx="5" className="fill-slate-300 dark:fill-slate-600"/>
    {/* shoes */}
    <rect x="172" y="229" width="14" height="6" rx="3" className="fill-slate-400 dark:fill-slate-500"/>
    <rect x="187" y="229" width="14" height="6" rx="3" className="fill-slate-400 dark:fill-slate-500"/>
    {/* torso */}
    <rect x="168" y="152" width="38" height="54" rx="10" className="fill-slate-200 dark:fill-slate-700"/>
    {/* shirt detail — orange collar */}
    <path d="M179 152 L185 164 L191 152" stroke="#ea580c" strokeWidth="2" fill="none" strokeLinejoin="round"/>
    {/* left arm — pointing at card */}
    <path d="M168 165 Q148 158 138 168" stroke="none" className="fill-slate-200 dark:fill-slate-700"/>
    <rect x="130" y="160" width="42" height="12" rx="6"
      className="fill-slate-200 dark:fill-slate-700"
      transform="rotate(-12 150 166)"/>
    {/* right arm — relaxed */}
    <rect x="204" y="162" width="12" height="36" rx="6"
      className="fill-slate-200 dark:fill-slate-700"
      transform="rotate(8 210 180)"/>
    {/* finger / pointer */}
    <circle cx="132" cy="160" r="4" fill="#ea580c" fillOpacity="0.85"/>
    <line x1="132" y1="160" x2="177" y2="160" stroke="#ea580c" strokeWidth="1"
      strokeOpacity="0.3" strokeDasharray="3 3"/>
    {/* neck */}
    <rect x="181" y="142" width="12" height="14" rx="4" className="fill-slate-200 dark:fill-slate-700"/>
    {/* head */}
    <circle cx="187" cy="128" r="22" className="fill-slate-200 dark:fill-slate-700"/>
    {/* hair */}
    <path d="M165 122 Q167 102 187 102 Q207 102 209 122" className="fill-slate-400 dark:fill-slate-500"/>
    {/* glasses frame */}
    <circle cx="180" cy="128" r="7" fill="none" className="stroke-slate-500 dark:stroke-slate-400" strokeWidth="1.5"/>
    <circle cx="194" cy="128" r="7" fill="none" className="stroke-slate-500 dark:stroke-slate-400" strokeWidth="1.5"/>
    <line x1="187" y1="128" x2="187" y2="128" className="stroke-slate-500 dark:stroke-slate-400" strokeWidth="1.5"/>
    <line x1="173" y1="126" x2="169" y2="124" className="stroke-slate-500 dark:stroke-slate-400" strokeWidth="1.5"/>
    <line x1="201" y1="126" x2="205" y2="124" className="stroke-slate-500 dark:stroke-slate-400" strokeWidth="1.5"/>
    {/* eyes */}
    <circle cx="180" cy="129" r="2.5" className="fill-slate-600 dark:fill-slate-300"/>
    <circle cx="194" cy="129" r="2.5" className="fill-slate-600 dark:fill-slate-300"/>
    {/* smile */}
    <path d="M182 137 Q187 141 192 137" stroke="#ea580c" strokeWidth="1.5" fill="none" strokeLinecap="round"/>

    {/* ── floating data tags ── */}
    <rect x="204" y="82" width="64" height="22" rx="4"
      className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1"/>
    <rect x="210" y="88" width="24" height="4" rx="1" className="fill-slate-300 dark:fill-slate-600"/>
    <rect x="210" y="95" width="16" height="3" rx="1" fill="#ea580c" fillOpacity="0.6"/>

    <rect x="330" y="88" width="22" height="22" rx="4" fill="#ea580c" fillOpacity="0.1"
      stroke="#ea580c" strokeWidth="1" strokeOpacity="0.4"/>
    <text x="341" y="103" textAnchor="middle" fontSize="9" fill="#ea580c" fontFamily="monospace" fontWeight="bold">#1</text>

    {/* connector dots */}
    <circle cx="180" cy="46" r="2" fill="#ea580c" fillOpacity="0.4"/>
    <circle cx="180" cy="34" r="1.5" fill="#ea580c" fillOpacity="0.25"/>
    <circle cx="180" cy="24" r="1" fill="#ea580c" fillOpacity="0.15"/>
  </svg>
);

// ── hash routing ──────────────────────────────────────────────────────────────

const getCityIdFromHash = (): string | null => {
  const m = window.location.hash.match(/^#\/city\/(.+)$/);
  return m ? decodeURIComponent(m[1]) : null;
};

// ── app ───────────────────────────────────────────────────────────────────────

const App: React.FC = () => {
  const [selectedCityId, setSelectedCityId] = useState<string | null>(getCityIdFromHash);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showAbout, setShowAbout] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    const onHash = () => setSelectedCityId(getCityIdFromHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const selectedCity: CityData | null = selectedCityId
    ? CITIES_DATA.find((c) => c.id === selectedCityId) ?? null
    : null;

  const handleSelectCity = useCallback((city: CityData) => {
    window.location.hash = `/city/${encodeURIComponent(city.id)}`;
  }, []);

  const handleBack = useCallback(() => {
    window.location.hash = '';
  }, []);

  // meta tags
  useEffect(() => {
    window.scrollTo(0, 0);
    if (selectedCity) {
      document.title = `${selectedCity.name} — #${selectedCity.rank} · МістоLab`;
      document.querySelector('meta[name="description"]')?.setAttribute(
        'content',
        `${selectedCity.name}: ${selectedCity.description} Бал: ${selectedCity.totalScore}/1000.`
      );
    } else {
      document.title = 'МістоLab — Рейтинг якості життя міст України 2025';
      document.querySelector('meta[name="description"]')?.setAttribute(
        'content',
        'Інтегральний рейтинг 51 міста України. 100+ показників: економіка, екологія, інфраструктура, охорона здоров\'я.'
      );
    }
  }, [selectedCity]);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
      {/* ── navbar ── */}
      <nav className="sticky top-0 z-40 bg-white/90 dark:bg-slate-950/90 backdrop-blur border-b border-slate-100 dark:border-slate-800/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 select-none hover:opacity-70 transition-opacity"
          >
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="26" height="26" rx="6" fill="#ea580c" fillOpacity="0.1"/>
              <rect x="3" y="17" width="4" height="6" rx="0.75" fill="#ea580c"/>
              <rect x="8" y="12" width="4" height="11" rx="0.75" fill="#ea580c" fillOpacity="0.7"/>
              <rect x="13" y="14" width="4" height="9" rx="0.75" fill="#ea580c" fillOpacity="0.85"/>
              <rect x="18" y="18" width="4" height="5" rx="0.75" fill="#ea580c" fillOpacity="0.5"/>
              <circle cx="21" cy="4.5" r="1.75" fill="#ea580c"/>
              <circle cx="21" cy="4.5" r="1.75" fill="#ea580c" fillOpacity="0.35">
                <animate attributeName="r" from="1.75" to="3.5" dur="1.8s" repeatCount="indefinite"/>
                <animate attributeName="opacity" from="0.35" to="0" dur="1.8s" repeatCount="indefinite"/>
              </circle>
            </svg>
            <span className="font-black tracking-tight text-lg">
              <span className="text-slate-900 dark:text-white">Місто</span>
              <span className="text-orange-500">Lab</span>
            </span>
          </button>

          <div className="flex items-center gap-5">
            <button
              onClick={() => setShowAbout(true)}
              className="text-xs text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Про проект
            </button>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="text-xs text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors tabular-nums"
              aria-label="Toggle theme"
            >
              {isDarkMode ? '☀' : '☾'}
            </button>
          </div>
        </div>
      </nav>

      {/* ── main ── */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6">
        {selectedCity ? (
          <div className="pt-10">
            <CityDetail city={selectedCity} onBack={handleBack} />
          </div>
        ) : (
          <>
            {/* hero */}
            <div className="pt-16 pb-14 border-b border-slate-100 dark:border-slate-800/60">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">
                {/* text */}
                <div className="max-w-xl">
                  <p className="text-[11px] font-mono text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">
                    Open Data · Ukraine · 2025
                  </p>
                  <h1 className="text-5xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.05] mb-5">
                    Якість життя<br />
                    <span className="text-orange-500">в містах України</span>
                  </h1>
                  <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed max-w-lg">
                    51 місто · 100+ показників. Економіка, екологія, прозорість влади,
                    інфраструктура, охорона здоров'я — на основі відкритих даних.
                  </p>

                  {/* stat pills */}
                  <div className="flex flex-wrap gap-2 mt-8">
                    {[
                      ['51', 'міст'],
                      ['100+', 'показників'],
                      ['13', 'категорій'],
                      ['Live', 'AQI · погода'],
                    ].map(([val, label]) => (
                      <div key={label} className="flex items-baseline gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 text-sm">
                        <span className="font-bold text-slate-900 dark:text-white">{val}</span>
                        <span className="text-slate-400 dark:text-slate-500 text-xs">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* illustration */}
                <div className="hidden lg:block flex-shrink-0">
                  <HeroIllustration />
                </div>
              </div>
            </div>

            {/* featured cities */}
            <div className="py-10 border-b border-slate-100 dark:border-slate-800/60">
              <p className="text-[11px] font-mono text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6">
                Вибрані міста
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-slate-100 dark:bg-slate-800/60 rounded-lg overflow-hidden">
                {[
                  { id: null, rank: 1, label: 'Лідер рейтингу' },
                  { id: 'chernivtsi', rank: null, label: 'Лідер прозорості' },
                  { id: 'kharkiv', rank: null, label: 'Героїчна стійкість' },
                ].map(({ id, rank, label }) => {
                  const city = id
                    ? CITIES_DATA.find((c) => c.id === id)
                    : CITIES_DATA.find((c) => c.rank === rank);
                  if (!city) return null;
                  return (
                    <button
                      key={city.id}
                      onClick={() => handleSelectCity(city)}
                      className="group bg-white dark:bg-slate-950 px-6 py-5 text-left hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                    >
                      <div className="text-[10px] font-mono text-slate-400 dark:text-slate-600 uppercase tracking-widest mb-3">
                        {label}
                      </div>
                      <div className="text-2xl font-black text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                        {city.name}
                      </div>
                      <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-sm font-bold tabular-nums text-orange-500">
                          {city.totalScore}
                        </span>
                        <span className="text-xs text-slate-400">балів · #{city.rank}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* table */}
            <div className="py-10">
              <p className="text-[11px] font-mono text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6">
                Повний рейтинг
              </p>
              <RankingTable data={CITIES_DATA} onSelectCity={handleSelectCity} />
            </div>
          </>
        )}
      </main>

      {/* footer */}
      <footer className="border-t border-slate-100 dark:border-slate-800/60 mt-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <span className="font-black text-lg">
            <span className="text-slate-900 dark:text-white">Місто</span>
            <span className="text-orange-500">Lab</span>
          </span>
          <div className="text-xs text-slate-400 dark:text-slate-600 space-y-1 sm:text-right">
            <p>Дані: Work.ua · ProZorro · TI Ukraine 2025 · OpenMeteo · НБУ · Укрстат</p>
            <p>Живі показники (погода, AQI, курс) оновлюються при завантаженні сторінки.</p>
          </div>
        </div>
      </footer>

      {/* about modal */}
      {showAbout && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setShowAbout(false)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-xl max-w-md w-full p-8 shadow-2xl border border-slate-100 dark:border-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-black text-slate-900 dark:text-white mb-3">
              <span>Місто</span><span className="text-orange-500">Lab</span>
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Інструмент аналізу якості життя в містах України на основі відкритих даних.
              100+ показників у 13 категоріях для кожного міста.
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed mb-6">
              Живі дані (погода, AQI, курс ₴/$) оновлюються в реальному часі через відкриті API.
            </p>
            <button
              onClick={() => setShowAbout(false)}
              className="w-full py-2.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-semibold hover:opacity-80 transition-opacity"
            >
              Закрити
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
