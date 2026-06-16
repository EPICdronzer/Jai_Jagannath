import React, { useState, useEffect } from 'react';
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
import { Compass, Star, Zap, List, Heart, Menu, X, Activity, Shield, Eye, Sun, Moon, Link, Map } from 'lucide-react';

export default function App() {
  const defaultBirth = {
    name: 'Sri Jagannath Birth Chart',
    dateStr: '2026-06-15',
    timeStr: '17:30:00',
    lat: 19.8135,
    lon: 85.8312,
    timezoneOffset: 5.5,
    cityPreset: 'Puri, Odisha, India (Jagannath Temple)'
  };

  const [birthData, setBirthData] = useState(null);
  const [error, setError] = useState(null);
  const [currentTab, setCurrentTab] = useState('basics');
  const [params, setParams] = useState(defaultBirth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
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

  const tabs = [
    { id: 'basics', label: 'Basic Info', icon: <Compass size={18} /> },
    { id: 'details', label: 'Details', icon: <List size={18} /> },
    { id: 'vargas', label: 'Charts', icon: <Star size={18} /> },
    { id: 'dashas', label: 'Dasha', icon: <Zap size={18} /> },
    { id: 'saturn', label: 'Saturn', icon: <Moon size={18} /> },
    { id: 'chakras', label: 'Chakras', icon: <Activity size={18} /> },
    { id: 'balas', label: 'Balas', icon: <Shield size={18} /> },
    { id: 'ashtakavarga', label: 'Ashtakavarga', icon: <Map size={18} /> },
    { id: 'yogas', label: 'Yogas', icon: <Sun size={18} /> },
    { id: 'longevity', label: 'Longevity', icon: <Heart size={18} /> },
    { id: 'arudhas', label: 'Arudhas', icon: <Eye size={18} /> },
    { id: 'argala', label: 'Argala', icon: <Link size={18} /> },
    { id: 'sahams', label: 'Sahams', icon: <Star size={18} /> },
    { id: 'panchang', label: 'Panchangam', icon: <List size={18} /> },
    { id: 'compatibility', label: 'Guna Milan', icon: <Heart size={18} /> }
  ];

  return (
    <div className="app-bg" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header className="app-header">
        <div className="header-inner">
          <div className="header-brand">
            <div className="header-logo">🕉️</div>
            <div>
              <div className="header-title-line1">JAGANNATHA HORA</div>
              <div className="header-title-line2">Vedic Astrology Workstation</div>
            </div>
          </div>
          <div className="header-mantra">
            <div className="mantra-text">ॐ नमो भगवते वासुदेवाय</div>
            <div className="mantra-translation">Om Namo Bhagavate Vasudevaya</div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="app-main">
        {/* Nav Container - responsive hamburger on mobile */}
        <div className="nav-container">
          {/* Hamburger Toggle Button (mobile/tablet only) */}
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

          {/* Backdrop overlay to close menu */}
          {isMenuOpen && (
            <div
              className="menu-backdrop"
              onClick={() => setIsMenuOpen(false)}
            />
          )}

          {/* Nav Tabs - horizontal on desktop, dropdown on mobile */}
          <nav className={`nav-tabs ${isMenuOpen ? 'menu-open' : ''}`}>
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
        </div>

        {error && (
          <div style={{
            padding: '12px 16px',
            background: 'rgba(248,113,113,0.1)',
            border: '1px solid rgba(248,113,113,0.3)',
            borderRadius: '10px',
            color: '#fca5a5',
            fontSize: '13px',
            fontFamily: 'JetBrains Mono, monospace'
          }}>
            ⚠️ Calculation Error: {error}
          </div>
        )}

        {/* Tab Content */}
        {birthData && !loading ? (
          <>
            {/* ── BASICS TAB ── */}
            {currentTab === 'basics' && (
              <div className="basics-grid">
                {/* Left Column */}
                <div className="basics-left">
                  <BirthForm onSubmit={handleFormSubmit} defaultValues={params} />

                  {/* Quick Profile */}
                  <div className="profile-quick-card">
                    <div className="profile-quick-title">Calculated Profile</div>
                    <div className="profile-grid">
                      <span className="profile-key">Subject:</span>
                      <span className="profile-val">{params.name}</span>
                      <span className="profile-key">Local Birth:</span>
                      <span className="profile-val font-mono" style={{fontSize:'10px'}}>{params.dateStr} {params.timeStr}</span>
                      <span className="profile-key">Coordinates:</span>
                      <span className="profile-val font-mono" style={{fontSize:'10px'}}>{Math.abs(params.lat).toFixed(2)}°{params.lat>=0?'N':'S'} {Math.abs(params.lon).toFixed(2)}°{params.lon>=0?'E':'W'}</span>
                      <span className="profile-key">Ayanamsa:</span>
                      <span className="profile-val font-mono" style={{fontSize:'10px'}}>{birthData.ayanamsa.toFixed(4)}°</span>
                      <span className="profile-key">Sidereal Sun:</span>
                      <span className="profile-val gold">{birthData.planets['Sun'].rasi.symbol} {birthData.planets['Sun'].rasi.name}</span>
                      <span className="profile-key">Sidereal Moon:</span>
                      <span className="profile-val cyan">{birthData.planets['Moon'].rasi.symbol} {birthData.planets['Moon'].rasi.name}</span>
                      <span className="profile-key">Lagna (Asc):</span>
                      <span className="profile-val gold">{birthData.planets['Lagna'].rasi.symbol} {birthData.planets['Lagna'].rasi.name} {Math.floor(birthData.planets['Lagna'].rasi.deg)}°</span>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="basics-right">
                  <div className="charts-row">
                    <div>
                      <div className="chart-label">Rasi Chart (D-1)</div>
                      <VedicChart planets={birthData.planets} defaultVarga={1} divisionalCharts={birthData.raw?.divisional_charts} />
                    </div>
                    <div>
                      <div className="chart-label">Navamsa Chart (D-9)</div>
                      <VedicChart planets={birthData.planets} defaultVarga={9} divisionalCharts={birthData.raw?.divisional_charts} />
                    </div>
                  </div>
                  <PlanetaryTable planets={birthData.planets} />
                </div>
              </div>
            )}

            {/* ── VARGAS TAB ── */}
            {currentTab === 'vargas' && (
              <div style={{display:'flex', flexDirection:'column', gap:'20px', alignItems:'center'}}>
                <VedicChart planets={birthData.planets} defaultVarga={1} divisionalCharts={birthData.raw?.divisional_charts} />
                <PlanetaryTable planets={birthData.planets} />
              </div>
            )}

            {/* ── DASHAS TAB ── */}
            {currentTab === 'dashas' && (
              <div style={{display:'flex', justifyContent:'center'}}>
                <DashaView
                  moonLong={birthData.planets['Moon'].siderealLong}
                  birthDate={birthData.utcDate}
                />
              </div>
            )}

            {/* ── PANCHANG TAB ── */}
            {currentTab === 'panchang' && (
              <div style={{display:'flex', justifyContent:'center'}}>
                <PanchangamView panchang={birthData.panchang} />
              </div>
            )}

            {/* ── DETAILS TAB ── */}
            {currentTab === 'details' && (
              <div style={{display:'flex', flexDirection:'column', gap:'20px', alignItems:'center'}}>
                <PlanetaryTable planets={birthData.planets} />
              </div>
            )}

            {/* ── SATURN TAB ── */}
            {currentTab === 'saturn' && (
              <div style={{display:'flex', justifyContent:'center'}}>
                <SaturnTransitView saturnTransits={birthData.raw?.saturn_transits} />
              </div>
            )}

            {/* ── CHAKRAS TAB ── */}
            {currentTab === 'chakras' && (
              <div style={{display:'flex', justifyContent:'center'}}>
                <ChakrasView rawData={birthData.raw} />
              </div>
            )}

            {/* ── BALAS TAB ── */}
            {currentTab === 'balas' && (
              <div style={{display:'flex', justifyContent:'center'}}>
                <BalasView shadBala={birthData.raw?.shad_bala} bhavaBala={birthData.raw?.bhava_bala} />
              </div>
            )}

            {/* ── ASHTAKAVARGA TAB ── */}
            {currentTab === 'ashtakavarga' && (
              <div style={{display:'flex', justifyContent:'center'}}>
                <AshtakavargaView ashtakavarga={birthData.raw?.ashtakavarga} />
              </div>
            )}

            {/* ── YOGAS TAB ── */}
            {currentTab === 'yogas' && (
              <div style={{display:'flex', justifyContent:'center'}}>
                <YogasView yogas={birthData.raw?.yogas} doshas={birthData.raw?.doshas} />
              </div>
            )}

            {/* ── LONGEVITY TAB ── */}
            {currentTab === 'longevity' && (
              <div style={{display:'flex', justifyContent:'center'}}>
                <LongevityView longevity={birthData.raw?.longevity_prediction} />
              </div>
            )}

            {/* ── ARUDHAS TAB ── */}
            {currentTab === 'arudhas' && (
              <div style={{display:'flex', justifyContent:'center'}}>
                <ArudhasView arudhaPadhas={birthData.raw?.arudha_padhas} />
              </div>
            )}

            {/* ── ARGALA TAB ── */}
            {currentTab === 'argala' && (
              <div style={{display:'flex', justifyContent:'center'}}>
                <ArgalaView rawData={birthData.raw} />
              </div>
            )}

            {/* ── SAHAMS TAB ── */}
            {currentTab === 'sahams' && (
              <div style={{display:'flex', justifyContent:'center'}}>
                <SahamsView rawData={birthData.raw} />
              </div>
            )}

            {/* ── COMPATIBILITY TAB ── */}
            {currentTab === 'compatibility' && (
              <div style={{display:'flex', justifyContent:'center'}}>
                <CompatibilityView />
              </div>
            )}
          </>
        ) : (
          <div className="loading-container">
            <div className="spinner" />
            <div className="loading-text">Computing planetary positions...</div>
          </div>
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
