import React, { useState, useEffect, useRef, useMemo } from 'react';
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
import PlanetaryStatesView from './components/PlanetaryStatesView';
import KundaliReportView from './components/KundaliReportView';
import PrashnaView from './components/PrashnaView';
import { Compass, Star, Zap, List, Heart, Menu, X, Activity, Shield, Eye, Sun, Moon, Link, Map, Globe, ChevronLeft, ChevronRight, Award, FileText, Clock, MoreHorizontal } from 'lucide-react';
import { translations } from './utils/translations';

// Gotra by Janma Nakshatra (Saptarishi-Rishi system)
const NAKSHATRA_GOTRA_MAP = {
  'Ashwini':'Kashyapa','Bharani':'Bhargava','Krittika':'Agastya',
  'Rohini':'Gautama','Mrigashira':'Angirasa','Ardra':'Atreya',
  'Punarvasu':'Vashishtha','Pushya':'Kaushika','Ashlesha':'Kashyapa',
  'Magha':'Bhargava','Purva Phalguni':'Angirasa','Uttara Phalguni':'Agastya',
  'Hasta':'Atreya','Chitra':'Vashishtha','Swati':'Kaushika',
  'Vishakha':'Gautama','Anuradha':'Kashyapa','Jyeshtha':'Agastya',
  'Moola':'Angirasa','Purva Ashadha':'Bhargava','Uttara Ashadha':'Vashishtha',
  'Shravana':'Atreya','Dhanishta':'Kaushika','Shatabhisha':'Gautama',
  'Purva Bhadrapada':'Kashyapa','Uttara Bhadrapada':'Atreya','Revati':'Vashishtha'
};

export default function App() {
  const [lang, setLang] = useState('en');
  const [birthData, setBirthData] = useState(null);
  const [error, setError] = useState(null);
  const [currentTab, setCurrentTab] = useState('basics');
  const [params, setParams] = useState(null); // Load empty boxes by default
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [extraProfile, setExtraProfile] = useState({});
  const [birthHouseOffset, setBirthHouseOffset] = useState(0);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);

  const [prashnaLocation, setPrashnaLocation] = useState({
    name: 'New Delhi, India',
    lat: 28.6139,
    lon: 77.2090,
    timezone: 5.5
  });
  const [prashnaCityPreset, setPrashnaCityPreset] = useState('New Delhi, India');
  const [prashnaData, setPrashnaData] = useState(null);
  const [prashnaInstant] = useState(() => Date.now());

  const sharedPrashnaData = useMemo(() => ({
    location: prashnaLocation,
    setLocation: setPrashnaLocation,
    cityPreset: prashnaCityPreset,
    setCityPreset: setPrashnaCityPreset,
    data: prashnaData,
    setData: setPrashnaData,
    instant: prashnaInstant
  }), [prashnaLocation, prashnaCityPreset, prashnaData, prashnaInstant]);

  const navRef = useRef(null);
  const moreMenuRef = useRef(null);
  const t = (key) => translations[lang]?.[key] || key;

  // Track window size for responsive slice
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Click outside to close the More dropdown
  useEffect(() => {
    const handleClose = (e) => {
      // Check if clicked target is not within the More button as well
      const moreBtn = document.querySelector('.more-tab-btn');
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target) && (!moreBtn || !moreBtn.contains(e.target))) {
        setIsMoreOpen(false);
      }
    };
    window.addEventListener('click', handleClose);
    return () => window.removeEventListener('click', handleClose);
  }, []);

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

  useEffect(() => {
    setBirthHouseOffset(0);
  }, [params]);

  // Scroll active tab into view horizontally
  useEffect(() => {
    const activeEl = document.querySelector('.nav-tab.active');
    if (activeEl) {
      activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [currentTab]);

  const handleFormSubmit = (newParams, newExtra) => {
    setParams(newParams);
    if (newExtra) setExtraProfile(newExtra);
  };

  const scrollNav = (direction) => {
    if (navRef.current) {
      const amt = direction === 'left' ? -200 : 200;
      navRef.current.scrollBy({ left: amt, behavior: 'smooth' });
    }
  };

  const tabs = [
    { id: 'basics', label: t('basics'), icon: <Compass size={18} /> },
    { id: 'prashna', label: lang === 'en' ? 'Prashna' : 'प्रश्न', icon: <Clock size={18} /> },
    { id: 'kundali', label: lang === 'en' ? 'Kundali Report' : 'कुंडली रिपोर्ट', icon: <FileText size={18} /> },
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

  const isMobile = windowWidth <= 768;
  const visibleTabs = isMobile ? tabs.slice(0, 3) : tabs;
  const moreTabs = isMobile ? tabs.slice(3) : [];
  const isMoreActive = isMobile && moreTabs.some(t => t.id === currentTab);

  return (
    <div className="app-bg" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Mobile Sidebar Drawer Overlay */}
      {isMobile && isMenuOpen && (
        <div className="sidebar-backdrop" onClick={() => setIsMenuOpen(false)} />
      )}

      {/* Mobile Sidebar Drawer */}
      {isMobile && (
        <div className={`sidebar-drawer ${isMenuOpen ? 'open' : ''}`}>
          {/* Close button that overlaps right border */}
          <button className="sidebar-close-trigger" onClick={() => setIsMenuOpen(false)}>
            <ChevronLeft size={16} />
          </button>

          {/* Profile Header */}
          <div className="sidebar-profile">
            <div className="sidebar-avatar">
              {params?.name ? params.name[0].toUpperCase() : '🕉️'}
            </div>
            <div className="sidebar-profile-info">
              <div className="sidebar-profile-name">
                {params?.name ? params.name : (lang === 'hi' ? 'खगोल यात्री' : 'Astro Traveler')}
              </div>
              <div className="sidebar-profile-sub">
                {params?.city ? params.city : (lang === 'hi' ? 'जगतनाथ धाम' : 'Jagannath Dham')}
              </div>
            </div>
          </div>

          {/* List of scrollable options */}
          <div className="sidebar-menu-list">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setCurrentTab(tab.id);
                  setIsMenuOpen(false);
                }}
                className={`sidebar-item ${currentTab === tab.id ? 'active' : ''}`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Sidebar Footer with Reset Lagna or Close menu option */}
          <div className="sidebar-footer">
            {birthHouseOffset !== 0 ? (
              <button
                className="sidebar-footer-btn"
                onClick={() => {
                  setBirthHouseOffset(0);
                  setIsMenuOpen(false);
                }}
              >
                🔄 {lang === 'hi' ? 'मूल लग्न बहाल करें' : 'Reset Lagna'}
              </button>
            ) : (
              <button
                className="sidebar-footer-btn"
                style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', borderColor: 'rgba(255,255,255,0.1)' }}
                onClick={() => setIsMenuOpen(false)}
              >
                 {lang === 'hi' ? 'मेनू बंद करें' : 'Close Menu'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Header */}
      <header className="app-header">
        <div className="header-inner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div className="header-brand">
            {isMobile && (
              <button
                onClick={() => setIsMenuOpen(o => !o)}
                className="hamburger-menu-btn"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--gold)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '8px',
                  marginRight: '8px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(245,158,11,0.15)'
                }}
                aria-label="Toggle navigation menu"
              >
                <Menu size={20} />
              </button>
            )}
            <div className="header-logo">🙏</div>
            <div>
              <div className="header-title-line1">Astro Traveler</div>
              <div className="header-title-line2">JAI JAGANNATH</div>
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

          <nav ref={navRef} className={`nav-tabs ${isMenuOpen ? 'menu-open' : ''}`} style={{ flex: 1, position: 'relative' }}>
            {visibleTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => { setCurrentTab(tab.id); setIsMenuOpen(false); setIsMoreOpen(false); }}
                className={`nav-tab ${currentTab === tab.id ? 'active' : ''}`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}

            {isMobile && (
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <button
                  onClick={() => setIsMoreOpen(o => !o)}
                  className={`nav-tab more-tab-btn ${isMoreActive ? 'active' : ''}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <MoreHorizontal size={16} />
                  <span>{lang === 'hi' ? 'अधिक' : 'More'}</span>
                </button>

                {isMoreOpen && (
                  <div
                    ref={moreMenuRef}
                    className="more-dropdown-container"
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      right: 0,
                      width: '220px',
                      background: 'rgba(8, 10, 24, 0.98)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(245, 158, 11, 0.2)',
                      borderRadius: '12px',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.8), 0 0 0 1px rgba(245,158,11,0.1)',
                      zIndex: 1000,
                      display: 'flex',
                      flexDirection: 'column',
                      animation: 'fade-in 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  >
                    {/* Scrollable list of items */}
                    <div
                      className="more-dropdown-scrollable"
                      onScroll={(e) => {
                        const { scrollTop, scrollHeight, clientHeight } = e.target;
                        if (scrollHeight - scrollTop - clientHeight < 12) {
                          setShowScrollIndicator(false);
                        } else {
                          setShowScrollIndicator(true);
                        }
                      }}
                      style={{
                        maxHeight: '220px',
                        overflowY: 'auto',
                        padding: '6px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px'
                      }}
                    >
                      {moreTabs.map(tab => (
                        <button
                          key={tab.id}
                          onClick={() => {
                            setCurrentTab(tab.id);
                            setIsMoreOpen(false);
                          }}
                          className={`nav-tab-item ${currentTab === tab.id ? 'active' : ''}`}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            width: '100%',
                            padding: '10px 14px',
                            background: currentTab === tab.id ? 'rgba(245,158,11,0.08)' : 'transparent',
                            border: 'none',
                            borderLeft: currentTab === tab.id ? '3px solid var(--gold)' : '3px solid transparent',
                            borderRadius: currentTab === tab.id ? '0 8px 8px 0' : '8px',
                            color: currentTab === tab.id ? 'var(--gold)' : 'var(--text-secondary)',
                            fontSize: '13px',
                            fontWeight: currentTab === tab.id ? 700 : 500,
                            textAlign: 'left',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                          }}
                        >
                          {tab.icon}
                          {tab.label}
                        </button>
                      ))}
                    </div>
                    
                    {/* Fading bottom indicator overlay */}
                    {showScrollIndicator && (
                      <div
                        className="more-dropdown-fade-indicator"
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: '34px',
                          background: 'linear-gradient(to top, rgba(8, 10, 24, 0.98) 30%, transparent)',
                          pointerEvents: 'none',
                          borderBottomLeftRadius: '12px',
                          borderBottomRightRadius: '12px',
                          display: 'flex',
                          alignItems: 'flex-end',
                          justifyContent: 'center',
                          paddingBottom: '4px'
                        }}
                      >
                        <span style={{ fontSize: '9px', color: 'rgba(245, 158, 11, 0.7)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          {lang === 'hi' ? 'नीचे और विकल्प हैं ▼' : 'More options below ▼'}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
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
          currentTab === 'basics' ? (
            /* Empty Initial State - Welcome Panel with Prashna Chart */
            <div className="basics-grid" style={{ minHeight: '60vh' }}>
              <div className="basics-left">
                <BirthForm onSubmit={handleFormSubmit} lang={lang} collectExtra={true} />
              </div>
              <div className="basics-right" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <PrashnaView lang={lang} sharedData={sharedPrashnaData} />
              <div style={{
                textAlign: 'center', padding: '24px', borderRadius: '16px',
                background: 'linear-gradient(135deg, rgba(10,12,22,0.95), rgba(16,18,34,0.95))',
                border: '1px solid rgba(234,179,8,0.15)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px'
              }}>
                <div style={{ fontSize: '40px', animation: 'pulse 3s infinite' }}>🕉️</div>
                <h2 style={{ color: 'var(--gold)', margin: 0, fontSize: '18px', fontWeight: 800 }}>
                  {t('welcome_title')}
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '12px', lineHeight: 1.6, margin: 0 }}>
                  {t('welcome_desc')}
                </p>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px', width: '100%', fontFamily: 'JetBrains Mono' }}>
                  Lahiri Ayanamsa • Swiss Ephemeris API • Ashtakoota Guna Milan
                </div>
              </div>
            </div>
          </div>
        ) : currentTab === 'prashna' ? (
          <div style={{ width: '100%', maxWidth: '900px', margin: '0 auto' }}>
            <PrashnaView lang={lang} sharedData={sharedPrashnaData} />
          </div>
        ) : (
          <div style={{
            maxWidth: '480px',
            margin: '40px auto',
            padding: '24px 20px',
            borderRadius: '16px',
            background: 'rgba(239, 68, 68, 0.03)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            boxShadow: '0 8px 32px rgba(239, 68, 68, 0.04)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '14px'
          }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              background: 'rgba(239, 68, 68, 0.12)',
              color: '#f87171',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              animation: 'pulse 2s infinite'
            }}>
              ⚠️
            </div>
            <h3 style={{ color: '#f87171', margin: 0, fontSize: '15px', fontWeight: 700 }}>
              {lang === 'hi' ? 'जन्म विवरण आवश्यक है' : 'Birth Details Required'}
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '12px', lineHeight: 1.6, margin: 0 }}>
              {lang === 'hi'
                ? 'इस विश्लेषण को देखने के लिए, कृपया पहले "मूल जानकारी" (Basic Info) टैब पर जाएं और अपना जन्म विवरण भरकर कुंडली की गणना करें।'
                : 'To view this analysis, please first navigate to the "Basic Info" tab and fill out the birth form to calculate your chart.'}
            </p>
            <button 
              onClick={() => setCurrentTab('basics')}
              style={{
                marginTop: '6px',
                padding: '8px 18px',
                borderRadius: '8px',
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                color: '#fca5a5',
                fontWeight: 600,
                fontSize: '11px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(239, 68, 68, 0.18)';
                e.target.style.borderColor = 'rgba(239, 68, 68, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(239, 68, 68, 0.08)';
                e.target.style.borderColor = 'rgba(239, 68, 68, 0.25)';
              }}
            >
              {lang === 'hi' ? 'मूल जानकारी पर जाएं' : 'Go to Basic Info'}
            </button>
          </div>
        )) : (
          /* Active calculated state */
          <>
            {/* ── BASICS TAB (Form stays permanently mounted on left) ── */}
            {currentTab === 'basics' && (
              <div className="basics-grid">
                <div className="basics-left">
                  <BirthForm onSubmit={handleFormSubmit} lang={lang} defaultValues={params} collectExtra={true} />

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
                        <span className="profile-key">{lang === 'en' ? 'Janma Nakshatra:' : 'जन्म नक्षत्र:'}</span>
                        <span className="profile-val" style={{ color: '#c084fc' }}>{birthData.planets['Moon'].nakshatra.name} (Pada {birthData.planets['Moon'].nakshatra.pada})</span>
                        <span className="profile-key" style={{ color: 'var(--gold)', fontWeight: 700 }}>{lang === 'en' ? 'Gotra:' : 'गोत्र:'}</span>
                        <span className="profile-val gold" style={{ fontWeight: 700 }}>
                          {NAKSHATRA_GOTRA_MAP[birthData.planets['Moon'].nakshatra.name] || 'Kashyapa'}
                          <span style={{ fontSize: '9px', color: 'var(--text-muted)', fontWeight: 400, marginLeft: '4px' }}>(Nakshatra-based)</span>
                        </span>
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
                          <VedicChart planets={birthData.planets} defaultVarga={1} divisionalCharts={birthData.raw?.divisional_charts} lang={lang} houseOffset={birthHouseOffset} onHouseOffsetChange={setBirthHouseOffset} />
                        </div>
                        <div>
                          <div className="chart-label">{t('navamsa')}</div>
                          <VedicChart planets={birthData.planets} defaultVarga={9} divisionalCharts={birthData.raw?.divisional_charts} lang={lang} houseOffset={birthHouseOffset} onHouseOffsetChange={setBirthHouseOffset} />
                        </div>
                      </div>
                      <PlanetaryTable planets={birthData.planets} lang={lang} />
                      <PlanetaryStatesView planets={birthData.planets} lang={lang} />
                      {/* Prashna chart always shown on basics tab */}
                      <PrashnaView lang={lang} sharedData={sharedPrashnaData} />
                    </>
                  ) : null}
                </div>
              </div>
            )}

            {/* ── OTHER TABS (With loading state handled gracefully) ── */}
            {currentTab !== 'basics' && (
              currentTab === 'prashna' ? (
                /* Prashna tab doesn't need birthData - always show */
                <div style={{ width: '100%', maxWidth: '900px', margin: '0 auto' }}>
                  <PrashnaView lang={lang} sharedData={sharedPrashnaData} />
                </div>
              ) : loading ? (
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
                      <VedicChart planets={birthData.planets} defaultVarga={1} divisionalCharts={birthData.raw?.divisional_charts} lang={lang} showAllVargas={true} houseOffset={birthHouseOffset} onHouseOffsetChange={setBirthHouseOffset} />
                      <PlanetaryTable planets={birthData.planets} lang={lang} />
                    </div>
                  )}

                  {/* ── KUNDALI REPORT TAB ── */}
                  {currentTab === 'kundali' && (
                    <div style={{ display: 'flex', justifyContent: 'center', width: '100%', padding: '0 0 20px' }}>
                      <KundaliReportView birthData={birthData} params={params} extraProfile={extraProfile} />
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
                        lang={lang}
                      />
                    </div>
                  )}

                  {/* ── PANCHANG TAB ── */}
                  {currentTab === 'panchang' && (
                    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                      <PanchangamView panchang={birthData.panchang} lang={lang} />
                    </div>
                  )}

                  {/* ── DETAILS TAB ── */}
                  {currentTab === 'details' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', width: '100%' }}>
                      <PlanetaryTable planets={birthData.planets} lang={lang} />
                    </div>
                  )}

                  {/* ── SATURN TAB ── */}
                  {currentTab === 'saturn' && (
                    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                      <SaturnTransitView saturnTransits={birthData.raw?.saturn_transits} lang={lang} />
                    </div>
                  )}

                  {/* ── CHAKRAS TAB ── */}
                  {currentTab === 'chakras' && (
                    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                      <ChakrasView rawData={birthData.raw} lang={lang} />
                    </div>
                  )}

                  {/* ── BALAS TAB ── */}
                  {currentTab === 'balas' && (
                    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                      <BalasView shadBala={birthData.raw?.shad_bala} bhavaBala={birthData.raw?.bhava_bala} lang={lang} />
                    </div>
                  )}

                  {/* ── ASHTAKAVARGA TAB ── */}
                  {currentTab === 'ashtakavarga' && (
                    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                      <AshtakavargaView ashtakavarga={birthData.raw?.ashtakavarga} lang={lang} />
                    </div>
                  )}

                  {/* ── YOGAS TAB ── */}
                  {currentTab === 'yogas' && (
                    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                      <YogasView yogas={birthData.raw?.yogas} doshas={birthData.raw?.doshas} lang={lang} />
                    </div>
                  )}

                  {/* ── LONGEVITY TAB ── */}
                  {currentTab === 'longevity' && (
                    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                      <LongevityView longevity={birthData.raw?.longevity_prediction} lang={lang} />
                    </div>
                  )}

                  {/* ── ARUDHAS TAB ── */}
                  {currentTab === 'arudhas' && (
                    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                      <ArudhasView arudhaPadhas={birthData.raw?.arudha_padhas} lang={lang} />
                    </div>
                  )}

                  {/* ── ARGALA TAB ── */}
                  {currentTab === 'argala' && (
                    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                      <ArgalaView rawData={birthData.raw} lang={lang} />
                    </div>
                  )}

                  {/* ── SAHAMS TAB ── */}
                  {currentTab === 'sahams' && (
                    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                      <SahamsView rawData={birthData.raw} lang={lang} />
                    </div>
                  )}

                  {/* ── COMPATIBILITY TAB ── */}
                  {currentTab === 'compatibility' && (
                    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                      <CompatibilityView prefillParams={params} />
                    </div>
                  )}
                </>
              ) : (
                <div style={{
                  maxWidth: '480px',
                  margin: '40px auto',
                  padding: '24px 20px',
                  borderRadius: '16px',
                  background: 'rgba(239, 68, 68, 0.03)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  boxShadow: '0 8px 32px rgba(239, 68, 68, 0.04)',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '14px'
                }}>
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    background: 'rgba(239, 68, 68, 0.12)',
                    color: '#f87171',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    animation: 'pulse 2s infinite'
                  }}>
                    ⚠️
                  </div>
                  <h3 style={{ color: '#f87171', margin: 0, fontSize: '15px', fontWeight: 700 }}>
                    {lang === 'hi' ? 'जन्म विवरण आवश्यक है' : 'Birth Details Required'}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '12px', lineHeight: 1.6, margin: 0 }}>
                    {lang === 'hi'
                      ? 'इस विश्लेषण को देखने के लिए, कृपया पहले "मूल जानकारी" (Basic Info) टैब पर जाएं और अपना जन्म विवरण भरकर कुंडली की गणना करें।'
                      : 'To view this analysis, please first navigate to the "Basic Info" tab and fill out the birth form to calculate your chart.'}
                  </p>
                  <button 
                    onClick={() => setCurrentTab('basics')}
                    style={{
                      marginTop: '6px',
                      padding: '8px 18px',
                      borderRadius: '8px',
                      background: 'rgba(239, 68, 68, 0.08)',
                      border: '1px solid rgba(239, 68, 68, 0.25)',
                      color: '#fca5a5',
                      fontWeight: 600,
                      fontSize: '11px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(239, 68, 68, 0.18)';
                      e.target.style.borderColor = 'rgba(239, 68, 68, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'rgba(239, 68, 68, 0.08)';
                      e.target.style.borderColor = 'rgba(239, 68, 68, 0.25)';
                    }}
                  >
                    {lang === 'hi' ? 'मूल जानकारी पर जाएं' : 'Go to Basic Info'}
                  </button>
                </div>
              )
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <span>
          Made with 🙏 by{' '}
          <a
            href="https://portfolio-harsh-vashishth.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: 'var(--gold)',
              textDecoration: 'none',
              fontWeight: 700,
              borderBottom: '1px solid rgba(234,179,8,0.4)',
              paddingBottom: '1px',
              transition: 'border-color 0.2s'
            }}
            onMouseEnter={e => e.target.style.borderColor = 'var(--gold)'}
            onMouseLeave={e => e.target.style.borderColor = 'rgba(234,179,8,0.4)'}
          >
            Harsh Vashishth
          </a>
        </span>
        <span>Ayanamsa: Lahiri (Chitra Paksha) | VSOP87 Planetary Model | astronomy-engine</span>
      </footer>
    </div>
  );
}
