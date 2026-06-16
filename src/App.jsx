import React, { useState, useEffect, useRef } from 'react';
import { calculateBirthData, calculateBirthDataAsync } from './utils/astrology';
import BirthForm from './components/BirthForm';
import PlanetaryTable from './components/PlanetaryTable';
import VedicChart from './components/VedicChart';
import DashaView from './components/DashaView';
import PanchangamView from './components/PanchangamView';
import CompatibilityView from './components/CompatibilityView';
import AshtakavargaView from './components/AshtakavargaView';
import BalasView from './components/BalasView';
import LongevityView from './components/LongevityView';
import YogasView from './components/YogasView';
import ArudhasView from './components/ArudhasView';
import ChakrasView from './components/ChakrasView';
import SaturnTransitView from './components/SaturnTransitView';
import ArgalaView from './components/ArgalaView';
import SahamsView from './components/SahamsView';
import PredictionsView from './components/PredictionsView';
import { Compass, Star, Zap, List, Heart, Menu, X, Activity, Shield, Eye, Sun, Moon, Link, Map, Globe, ChevronLeft, ChevronRight, Award } from 'lucide-react';
import { translations } from './utils/translations';

export default function App() {
  const [lang, setLang] = useState('en');
  const [birthData, setBirthData] = useState(null);
  const [error, setError] = useState(null);
  const [currentTab, setCurrentTab] = useState('basics');
  const [params, setParams] = useState(null); // Load empty boxes by default
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const navRef = useRef(null);
  const t = (key) => translations[lang]?.[key] || key;

  useEffect(() => {
    if (!params) {
      setBirthData(null);
      setLoading(false);
      return;
    }
    
    let active = true;
    setLoading(true);
    setError(null);

    calculateBirthDataAsync(params)
      .then(result => {
        if (active) {
          setBirthData(result.data);
          setLoading(false);
        }
      })
      .catch(err => {
        if (active) {
          console.error(err);
          setError(err.message);
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [params]);

  const handleFormSubmit = (newParams) => {
    setParams(newParams);
  };

  const scrollNav = (direction) => {
    if (navRef.current) {
      const amt = direction === 'left' ? -200 : 200;
      navRef.current.scrollBy({ left: amt, behavior: 'smooth' });
    }
  };

  const tabs = [
    { id: 'basics', label: t('basics'), icon: <Compass size={18} /> },
    { id: 'details', label: t('details'), icon: <List size={18} /> },
    { id: 'vargas', label: t('charts'), icon: <Star size={18} /> },
    { id: 'predictions', label: t('predictions'), icon: <Award size={18} /> },
    { id: 'dashas', label: t('dasha'), icon: <Zap size={18} /> },
    { id: 'saturn', label: t('saturn'), icon: <Moon size={18} /> },
    { id: 'chakras', label: t('chakras'), icon: <Activity size={18} /> },
    { id: 'balas', label: t('balas'), icon: <Shield size={18} /> },
    { id: 'ashtakavarga', label: t('ashtakavarga'), icon: <Map size={18} /> },
    { id: 'yogas', label: t('yogas'), icon: <Sun size={18} /> },
    { id: 'longevity', label: t('longevity'), icon: <Heart size={18} /> },
    { id: 'arudhas', label: t('arudhas'), icon: <Eye size={18} /> },
    { id: 'argala', label: t('argala'), icon: <Link size={18} /> },
    { id: 'sahams', label: t('sahams'), icon: <Star size={18} /> },
    { id: 'panchang', label: t('panchang'), icon: <List size={18} /> },
    { id: 'compatibility', label: t('compatibility'), icon: <Heart size={18} /> }
  ];

  return (
    <div className="app-bg" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header className="app-header">
        <div className="header-inner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div className="header-brand">
            <div className="header-logo">🕉️</div>
            <div>
              <div className="header-title-line1">JAGANNATHA HORA</div>
              <div className="header-title-line2">Vedic Astrology Workstation</div>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div className="header-mantra" style={{ marginRight: '10px' }}>
              <div className="mantra-text">ॐ नमो भगवते वासुदेवाय</div>
              <div className="mantra-translation">Om Namo Bhagavate Vasudevaya</div>
            </div>

            {/* Language Convert Button */}
            <button
              onClick={() => setLang(l => l === 'en' ? 'hi' : 'en')}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid var(--gold)',
                background: 'rgba(234,179,8,0.1)',
                color: 'var(--gold)',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '12px',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 0 10px rgba(234,179,8,0.15)'
              }}
              title="Switch Language / भाषा बदलें"
            >
              <Globe size={14} />
              {lang === 'en' ? 'हिन्दी' : 'English'}
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="app-main">
        {/* Nav Container with Scroll Arrows */}
        <div className="nav-container" style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '100%', position: 'relative' }}>
          
          {/* Scroll Left Arrow */}
          <button
            onClick={() => scrollNav('left')}
            className="nav-scroll-btn"
            title="Scroll Left"
            style={{ display: isMenuOpen ? 'none' : 'flex' }}
          >
            <ChevronLeft size={16} />
          </button>

          <button
            className="menu-toggle-btn"
            onClick={() => setIsMenuOpen(o => !o)}
            aria-label="Toggle navigation menu"
          >
            <div className="menu-toggle-inner">
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              <span className="menu-toggle-label">
                {tabs.find(t => t.id === currentTab)?.label || 'Menu'}
              </span>
            </div>
            <span className="menu-toggle-chevron">{isMenuOpen ? '▲' : '▼'}</span>
          </button>

          {isMenuOpen && (
            <div
              className="menu-backdrop"
              onClick={() => setIsMenuOpen(false)}
            />
          )}

          <nav ref={navRef} className={`nav-tabs ${isMenuOpen ? 'menu-open' : ''}`} style={{ flex: 1 }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => { setCurrentTab(tab.id); setIsMenuOpen(false); }}
                className={`nav-tab ${currentTab === tab.id ? 'active' : ''}`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Scroll Right Arrow with Pulsing Hint */}
          <button
            onClick={() => scrollNav('right')}
            className="nav-scroll-btn"
            title="Scroll Right"
            style={{
              display: isMenuOpen ? 'none' : 'flex',
              animation: 'pulse 2s infinite'
            }}
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {error && (
          <div style={{
            padding: '12px 16px',
            background: 'rgba(248,113,113,0.1)',
            border: '1px solid rgba(248,113,113,0.3)',
            borderRadius: '10px',
            color: '#fca5a5',
            fontSize: '13px',
            fontFamily: 'JetBrains Mono, monospace',
            marginBottom: '16px'
          }}>
            ⚠️ Calculation Error: {error}
          </div>
        )}

        {/* Tab Content */}
        {params === null ? (
          /* Empty Initial State - Starry Sky Welcome Panel */
          <div className="basics-grid" style={{ minHeight: '60vh' }}>
            <div className="basics-left">
              <BirthForm onSubmit={handleFormSubmit} lang={lang} />
            </div>
            <div className="basics-right" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div style={{
                textAlign: 'center',
                padding: '40px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, rgba(10,12,22,0.95), rgba(16,18,34,0.95))',
                border: '1px solid rgba(234, 179, 8, 0.15)',
                maxWidth: '500px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '16px'
              }}>
                <div style={{ fontSize: '48px', animation: 'pulse 3s infinite' }}>🕉️</div>
                <h2 style={{ color: 'var(--gold)', margin: 0, fontSize: '20px', fontWeight: 800 }}>
                  {t('welcome_title')}
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: 1.6, margin: 0 }}>
                  {t('welcome_desc')}
                </p>
                <div style={{
                  fontSize: '11px',
                  color: 'rgba(255,255,255,0.25)',
                  borderTop: '1px solid rgba(255,255,255,0.06)',
                  paddingTop: '12px',
                  width: '100%',
                  fontFamily: 'JetBrains Mono'
                }}>
                  Lahiri Ayanamsa • Swiss Ephemeris API • Ashtakoota Guna Milan
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Active calculated state */
          <>
            {/* ── BASICS TAB (Form stays permanently mounted on left) ── */}
            {currentTab === 'basics' && (
              <div className="basics-grid">
                <div className="basics-left">
                  <BirthForm onSubmit={handleFormSubmit} lang={lang} defaultValues={params} />

                  {/* Quick Profile */}
                  {birthData && (
                    <div className="profile-quick-card">
                      <div className="profile-quick-title">{lang === 'en' ? 'Calculated Profile' : 'गणित विवरण'}</div>
                      <div className="profile-grid">
                        <span className="profile-key">{lang === 'en' ? 'Subject:' : 'जातक:'}</span>
                        <span className="profile-val">{params.name}</span>
                        <span className="profile-key">{lang === 'en' ? 'Local Birth:' : 'स्थानीय जन्म:'}</span>
                        <span className="profile-val font-mono" style={{ fontSize: '10px' }}>{params.dateStr} {params.timeStr}</span>
                        <span className="profile-key">{lang === 'en' ? 'Coordinates:' : 'रेखांश अक्षांश:'}</span>
                        <span className="profile-val font-mono" style={{ fontSize: '10px' }}>{Math.abs(params.lat).toFixed(2)}°{params.lat >= 0 ? 'N' : 'S'} {Math.abs(params.lon).toFixed(2)}°{params.lon >= 0 ? 'E' : 'W'}</span>
                        <span className="profile-key">{lang === 'en' ? 'Ayanamsa:' : 'अयनश:'}</span>
                        <span className="profile-val font-mono" style={{ fontSize: '10px' }}>{birthData.ayanamsa.toFixed(4)}°</span>
                        <span className="profile-key">{lang === 'en' ? 'Sidereal Sun:' : 'सूर्य स्थिति:'}</span>
                        <span className="profile-val gold">{birthData.planets['Sun'].rasi.symbol} {lang === 'en' ? birthData.planets['Sun'].rasi.name : birthData.planets['Sun'].rasi.hindi}</span>
                        <span className="profile-key">{lang === 'en' ? 'Sidereal Moon:' : 'चंद्र स्थिति:'}</span>
                        <span className="profile-val cyan">{birthData.planets['Moon'].rasi.symbol} {lang === 'en' ? birthData.planets['Moon'].rasi.name : birthData.planets['Moon'].rasi.hindi}</span>
                        <span className="profile-key">{lang === 'en' ? 'Lagna (Asc):' : 'लग्न:'}</span>
                        <span className="profile-val gold">{birthData.planets['Lagna'].rasi.symbol} {lang === 'en' ? birthData.planets['Lagna'].rasi.name : birthData.planets['Lagna'].rasi.hindi} {Math.floor(birthData.planets['Lagna'].rasi.deg)}°</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="basics-right">
                  {loading ? (
                    <div className="loading-container" style={{ padding: '60px 0' }}>
                      <div className="spinner" />
                      <div className="loading-text" style={{ fontSize: '14px', color: 'var(--gold)', marginTop: '12px' }}>
                        {lang === 'en' ? 'Accessing Swiss Ephemeris data...' : 'स्विस एफिमेरिस डेटा एक्सेस किया जा रहा है...'}
                      </div>
                    </div>
                  ) : birthData ? (
                    <>
                      <div className="basics-charts-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
                        <div>
                          <div className="chart-label">{t('rasi')}</div>
                          <VedicChart planets={birthData.planets} defaultVarga={1} divisionalCharts={birthData.raw?.divisional_charts} lang={lang} />
                        </div>
                        <div>
                          <div className="chart-label">{t('navamsa')}</div>
                          <VedicChart planets={birthData.planets} defaultVarga={9} divisionalCharts={birthData.raw?.divisional_charts} lang={lang} />
                        </div>
                      </div>
                      <PlanetaryTable planets={birthData.planets} />
                    </>
                  ) : null}
                </div>
              </div>
            )}

            {/* ── OTHER TABS (With loading state handled gracefully) ── */}
            {currentTab !== 'basics' && (
              loading ? (
                <div className="loading-container" style={{ padding: '60px 0' }}>
                  <div className="spinner" />
                  <div className="loading-text" style={{ fontSize: '14px', color: 'var(--gold)', marginTop: '12px' }}>
                    {lang === 'en' ? 'Accessing Swiss Ephemeris data...' : 'स्विस एफिमेरिस डेटा एक्सेस किया जा रहा है...'}
                  </div>
                </div>
              ) : birthData ? (
                <>
                  {/* ── VARGAS TAB ── */}
                  {currentTab === 'vargas' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', width: '100%' }}>
                      <VedicChart planets={birthData.planets} defaultVarga={1} divisionalCharts={birthData.raw?.divisional_charts} lang={lang} showAllVargas={true} />
                      <PlanetaryTable planets={birthData.planets} />
                    </div>
                  )}

                  {/* ── PREDICTIONS TAB ── */}
                  {currentTab === 'predictions' && (
                    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                      <PredictionsView birthData={birthData} lang={lang} />
                    </div>
                  )}

                  {/* ── DASHAS TAB ── */}
                  {currentTab === 'dashas' && (
                    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                      <DashaView
                        moonLong={birthData.planets['Moon'].siderealLong}
                        birthDate={birthData.utcDate}
                      />
                    </div>
                  )}

                  {/* ── PANCHANG TAB ── */}
                  {currentTab === 'panchang' && (
                    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                      <PanchangamView panchang={birthData.panchang} />
                    </div>
                  )}

                  {/* ── DETAILS TAB ── */}
                  {currentTab === 'details' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', width: '100%' }}>
                      <PlanetaryTable planets={birthData.planets} />
                    </div>
                  )}

                  {/* ── SATURN TAB ── */}
                  {currentTab === 'saturn' && (
                    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                      <SaturnTransitView saturnTransits={birthData.raw?.saturn_transits} />
                    </div>
                  )}

                  {/* ── CHAKRAS TAB ── */}
                  {currentTab === 'chakras' && (
                    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                      <ChakrasView rawData={birthData.raw} />
                    </div>
                  )}

                  {/* ── BALAS TAB ── */}
                  {currentTab === 'balas' && (
                    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                      <BalasView shadBala={birthData.raw?.shad_bala} bhavaBala={birthData.raw?.bhava_bala} />
                    </div>
                  )}

                  {/* ── ASHTAKAVARGA TAB ── */}
                  {currentTab === 'ashtakavarga' && (
                    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                      <AshtakavargaView ashtakavarga={birthData.raw?.ashtakavarga} />
                    </div>
                  )}

                  {/* ── YOGAS TAB ── */}
                  {currentTab === 'yogas' && (
                    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                      <YogasView yogas={birthData.raw?.yogas} doshas={birthData.raw?.doshas} />
                    </div>
                  )}

                  {/* ── LONGEVITY TAB ── */}
                  {currentTab === 'longevity' && (
                    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                      <LongevityView longevity={birthData.raw?.longevity_prediction} />
                    </div>
                  )}

                  {/* ── ARUDHAS TAB ── */}
                  {currentTab === 'arudhas' && (
                    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                      <ArudhasView arudhaPadhas={birthData.raw?.arudha_padhas} />
                    </div>
                  )}

                  {/* ── ARGALA TAB ── */}
                  {currentTab === 'argala' && (
                    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                      <ArgalaView rawData={birthData.raw} />
                    </div>
                  )}

                  {/* ── SAHAMS TAB ── */}
                  {currentTab === 'sahams' && (
                    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                      <SahamsView rawData={birthData.raw} />
                    </div>
                  )}

                  {/* ── COMPATIBILITY TAB ── */}
                  {currentTab === 'compatibility' && (
                    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                      <CompatibilityView prefillParams={params} />
                    </div>
                  )}
                </>
              ) : null
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <span>© {new Date().getFullYear()} Jagannatha Hora React Suite</span>
        <span>Ayanamsa: Lahiri (Chitra Paksha) | VSOP87 Planetary Model | astronomy-engine</span>
      </footer>
    </div>
  );
}
