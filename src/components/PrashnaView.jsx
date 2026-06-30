import React, { useState, useEffect, useRef, useCallback } from 'react';
import { calculateBirthDataAsync } from '../utils/astrology';
import { PRESET_CITIES } from '../utils/cities';
import VedicChart from './VedicChart';
import { Clock, MapPin, RefreshCw, Map, Search, X, Check, Compass, Globe } from 'lucide-react';
import { translations } from '../utils/translations';

// Default location: New Delhi
const DEFAULT_LOCATION = {
  name: 'New Delhi, India',
  lat: 28.6139,
  lon: 77.2090,
  timezone: 5.5
};

function pad(n) { return String(n).padStart(2, '0'); }

// ── Given an ABSOLUTE instant (epoch ms) and a timezone offset (hours),
//    return the LOCAL wall-clock date/time string for that place.
//    We shift the UTC instant by the offset, then read it back using
//    UTC getters — this avoids re-shifting by the browser's own
//    local timezone, which is the bug that caused the chart to drift
//    when the location changed. ──
function getLocalDateTimeAt(epochMs, offsetHours) {
  const shifted = new Date(epochMs + offsetHours * 3600 * 1000);
  return {
    dateStr: `${shifted.getUTCFullYear()}-${pad(shifted.getUTCMonth() + 1)}-${pad(shifted.getUTCDate())}`,
    timeStr: `${pad(shifted.getUTCHours())}:${pad(shifted.getUTCMinutes())}:${pad(shifted.getUTCSeconds())}`,
  };
}

// ─── PANCHANG DISPLAY ────────────────────────────────────────────────────────
function PanchangRow({ label, value }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between',
      padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,0.04)'
    }}>
      <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>{label}</span>
      <span style={{ fontSize: '12px', color: 'var(--gold)', fontWeight: 700, textAlign: 'right', maxWidth: '60%' }}>{value}</span>
    </div>
  );
}

export default function PrashnaView({ lang = 'en' }) {
  const t = (key) => translations[lang]?.[key] || key;

  const translatePlanet = (name) => {
    const dict = translations[lang]?.planets;
    return dict?.[name] || name;
  };
  const translateZodiac = (name) => {
    const dict = translations[lang]?.zodiacs;
    return dict?.[name] || name;
  };
  const translateNakshatra = (name) => {
    const dict = translations[lang]?.nakshatras;
    return dict?.[name] || name;
  };
  const translateWeekday = (name) => {
    const dict = translations[lang]?.weekdays;
    return dict?.[name] || name;
  };
  const translatePaksha = (name) => {
    const dict = translations[lang]?.pakshas;
    return dict?.[name] || name;
  };
  const translateTithi = (name) => {
    const dict = translations[lang]?.tithis;
    return dict?.[name] || name;
  };
  const translateYoga = (name) => {
    const dict = translations[lang]?.yoga_names;
    return dict?.[name] || name;
  };
  const translateKarana = (name) => {
    const dict = translations[lang]?.karana_names;
    return dict?.[name] || name;
  };

  // ── Capture the ABSOLUTE moment ONCE on mount — never changes until
  //    browser refresh. Stored as epoch ms (UTC-based), NOT as local
  //    wall-clock digits, so it's independent of any timezone choice. ──
  const frozenInstantRef = useRef(Date.now());
  const frozenInstant = frozenInstantRef.current;

  // ── Live clock (display only, does NOT affect calculations) ──
  const [clockDisplay, setClockDisplay] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setClockDisplay(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // ── Location state ──
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [cityPreset, setCityPreset] = useState(DEFAULT_LOCATION.name);
  const [showMapModal, setShowMapModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mapError, setMapError] = useState('');
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const tempCoords = useRef({ lat: DEFAULT_LOCATION.lat, lon: DEFAULT_LOCATION.lon, name: DEFAULT_LOCATION.name });

  // ── Calculated data ──
  const [prashnaData, setPrashnaData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ── Calculate whenever location changes. The absolute instant never
  //    moves — only its LOCAL representation (date/time string) at the
  //    chosen place changes, which is what we feed to the engine along
  //    with that place's offset. This guarantees the same UTC instant
  //    is reconstructed (local time − offset = UTC) no matter which
  //    location is selected, so the Prashna moment itself never drifts —
  //    only the ascendant/houses rotate, which is the correct
  //    astrological effect of relocating a chart. ──
  const calculate = useCallback(async (loc) => {
    setLoading(true);
    setError(null);
    try {
      const { dateStr, timeStr } = getLocalDateTimeAt(frozenInstant, loc.timezone);
      const params = {
        name: 'Prashna',
        gender: 'other',
        dateStr,
        timeStr,
        lat: loc.lat,
        lon: loc.lon,
        timezoneOffset: loc.timezone,
        cityPreset: loc.name
      };
      const result = await calculateBirthDataAsync(params);
      setPrashnaData(result.data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [frozenInstant]);

  // ── Calculate on mount and when location changes ──
  useEffect(() => {
    calculate(location);
  }, [location, calculate]);

  // ── City dropdown handler ──
  const handleCityChange = (e) => {
    const name = e.target.value;
    if (!name) return;
    const city = PRESET_CITIES.find(c => c.name === name);
    if (city) {
      setCityPreset(name);
      setLocation({ name: city.name, lat: city.lat, lon: city.lon, timezone: city.timezone });
    }
  };

  // ── Map Modal init ──
  useEffect(() => {
    if (!showMapModal) return;
    const initTimer = setTimeout(() => {
      if (!window.L) { setMapError('Leaflet map library could not load.'); return; }
      try {
        const { lat, lon } = tempCoords.current;
        const map = window.L.map('prashna-leaflet-container').setView([lat, lon], 5);
        mapRef.current = map;
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19, attribution: '&copy; OpenStreetMap'
        }).addTo(map);
        const marker = window.L.marker([lat, lon], { draggable: true }).addTo(map);
        markerRef.current = marker;
        const updatePos = (newLat, newLng, addr = '') => {
          marker.setLatLng([newLat, newLng]);
          map.panTo([newLat, newLng]);
          tempCoords.current = {
            lat: parseFloat(newLat.toFixed(4)),
            lon: parseFloat(newLng.toFixed(4)),
            name: addr
          };
        };
        map.on('click', e => updatePos(e.latlng.lat, e.latlng.lng));
        marker.on('dragend', e => { const p = marker.getLatLng(); updatePos(p.lat, p.lng); });
      } catch (err) { setMapError('Failed to initialize map.'); }
    }, 250);
    return () => {
      clearTimeout(initTimer);
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
    };
  }, [showMapModal]);

  const handleMapSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
      const results = await res.json();
      if (results && results.length > 0) {
        const first = results[0];
        const lat = parseFloat(first.lat);
        const lon = parseFloat(first.lon);
        const addr = first.display_name.split(',')[0] + ', ' + (first.display_name.split(',')[1] || '').trim();
        if (mapRef.current && markerRef.current) {
          mapRef.current.setView([lat, lon], 12);
          markerRef.current.setLatLng([lat, lon]);
          tempCoords.current = { lat: parseFloat(lat.toFixed(4)), lon: parseFloat(lon.toFixed(4)), name: addr };
        }
      } else { alert('Place not found.'); }
    } catch { alert('Geocoding error.'); }
  };

  const handleConfirmLocation = () => {
    const { lat, lon, name } = tempCoords.current;
    // Smart timezone: round lon/15 to nearest 0.5h (rough geometric
    // estimate — not DST/political-boundary aware; disclaimer covers this)
    const tz = Math.round((lon / 15) * 2) / 2;
    const loc = { name: name || `${lat.toFixed(2)}N ${lon.toFixed(2)}E`, lat, lon, timezone: tz };
    // Custom map locations don't correspond to a PRESET_CITIES entry,
    // so keep the select on "Custom" rather than desyncing it with a
    // name that has no matching <option>.
    setCityPreset('');
    setLocation(loc);
    setShowMapModal(false);
  };

  // ── Formatted frozen time for display, projected into the CURRENTLY
  //    SELECTED location's local clock (not the browser's local time,
  //    and not hardcoded to IST) ──
  const { dateStr: displayDateStr, timeStr: displayTimeStr } =
    getLocalDateTimeAt(frozenInstant, location.timezone);
  const frozenDateStr = new Date(`${displayDateStr}T${displayTimeStr}`)
    .toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const frozenTimeStr = displayTimeStr;
  const tzLabel = `UTC${location.timezone >= 0 ? '+' : ''}${location.timezone}`;

  // ── Panchang extraction ──
  const panchang = prashnaData?.panchang;
  const planets  = prashnaData?.planets;
  const lagna    = planets?.['Lagna'];

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(8,10,20,0.98), rgba(16,20,45,0.98))',
      border: '1px solid rgba(6,182,212,0.2)',
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
    }}>
      {/* ── Header ── */}
      <div style={{
        background: 'linear-gradient(90deg, rgba(6,182,212,0.12), rgba(139,92,246,0.08))',
        borderBottom: '1px solid rgba(6,182,212,0.15)',
        padding: '16px 20px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'rgba(6,182,212,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Clock size={18} color="#06b6d4" />
          </div>
          <div>
            <div style={{ fontWeight: 800, color: '#06b6d4', fontSize: '14px' }}>
               {t('prashna_title')}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
              {t('prashna_moment_frozen')}
            </div>
          </div>
        </div>

        {/* Live Clock */}
        <div style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '18px',
          fontWeight: 800,
          color: '#06b6d4',
          letterSpacing: '0.05em',
          textShadow: '0 0 20px rgba(6,182,212,0.4)'
        }}>
          {pad(clockDisplay.getHours())}:{pad(clockDisplay.getMinutes())}:{pad(clockDisplay.getSeconds())}
          <div style={{ fontSize: '9px', color: 'rgba(6,182,212,0.5)', fontWeight: 400, textAlign: 'center', letterSpacing: '0.02em' }}>
            {t('live_clock')}
          </div>
        </div>
      </div>

      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* ── Frozen Time Info ── */}
        <div style={{
          background: 'rgba(6,182,212,0.05)',
          border: '1px solid rgba(6,182,212,0.15)',
          borderRadius: '10px',
          padding: '12px 16px',
          display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '3px' }}> {t('chart_calc_for')}</div>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: '12px', color: '#06b6d4', fontWeight: 700 }}>
              {frozenDateStr}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '3px' }}> {t('prashna_time_frozen')}</div>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: '12px', color: 'var(--gold)', fontWeight: 700 }}>
              {frozenTimeStr} {t('local_at')} {location.name} ({tzLabel})
            </div>
          </div>
          <div style={{ fontSize: '10px', color: 'rgba(6,182,212,0.5)', fontStyle: 'italic', flex: 1 }}>
             {t('prashna_disclaimer_top')}
          </div>
        </div>

        {/* ── Location Selector ── */}
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '10px',
          padding: '14px 16px',
          display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center'
        }}>
          <MapPin size={14} color="var(--gold)" />
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>{t('prashna_location')}</span>

          {/* City dropdown */}
          <select
            value={cityPreset}
            onChange={handleCityChange}
            style={{
              flex: '1 1 200px',
              padding: '8px 10px',
              borderRadius: '7px',
              border: '1px solid rgba(6,182,212,0.25)',
              background: 'rgba(6,182,212,0.05)',
              color: 'var(--text-primary)',
              fontSize: '12px',
              cursor: 'pointer',
              colorScheme: 'dark',
              minWidth: '160px'
            }}
          >
            <option value="">— Custom (use map) —</option>
            {PRESET_CITIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
          </select>
          {/* Map button */}
          <button
            onClick={() => {
              setShowMapModal(true);
              setMapError('');
              tempCoords.current = { lat: location.lat, lon: location.lon, name: location.name };
            }}
            style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              padding: '8px 12px', borderRadius: '7px',
              border: '1px solid rgba(6,182,212,0.3)',
              background: 'rgba(6,182,212,0.08)',
              color: '#06b6d4',
              cursor: 'pointer', fontSize: '11px', fontWeight: 600
            }}
          >
            <Map size={13} /> {t('map_btn')}
          </button>

          {/* Current location display */}
          <div style={{
            fontFamily: 'JetBrains Mono', fontSize: '10px',
            color: 'var(--text-muted)', flex: '1 0 180px'
          }}>
             {location.lat.toFixed(4)}°N {location.lon.toFixed(4)}°E | {tzLabel}
          </div>
        </div>

        {/* ── Chart + Panchang ── */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', padding: '40px 0', color: '#06b6d4', fontSize: '13px' }}>
            <RefreshCw size={18} style={{ animation: 'spin-slow 1s linear infinite' }} />
            {t('calc_prashna')}
          </div>
        ) : error ? (
          <div style={{ padding: '14px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', color: '#f87171', fontSize: '12px' }}>
            ⚠️ {error}
          </div>
        ) : prashnaData ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', alignItems: 'start' }}>
            {/* Rasi Chart */}
            <div>
              <div style={{ fontSize: '11px', color: '#06b6d4', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px', display: 'flex', gap: '6px', alignItems: 'center' }}>
                 {t('prashna_rasi_chart')}
              </div>
              <VedicChart
                planets={prashnaData.planets}
                defaultVarga={1}
                divisionalCharts={prashnaData.raw?.divisional_charts}
                lang={lang}
              />
            </div>

            {/* Panchang & Planet Summary */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Prashna Lagna highlight */}
              {lagna && (
                <div style={{
                  background: 'linear-gradient(135deg, rgba(6,182,212,0.1), rgba(139,92,246,0.08))',
                  border: '1px solid rgba(6,182,212,0.25)',
                  borderRadius: '10px',
                  padding: '14px 16px',
                  display: 'flex', gap: '14px', alignItems: 'center'
                }}>
                  <div style={{ fontSize: '28px' }}>{lagna.rasi.symbol}</div>
                  <div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('prashna_lagna')}</div>
                    <div style={{ fontSize: '17px', fontWeight: 800, color: '#06b6d4' }}>{translateZodiac(lagna.rasi.name)}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {Math.floor(lagna.rasi.deg)}° {Math.floor((lagna.rasi.deg % 1) * 60)}' in {translateZodiac(lagna.rasi.name)}
                    </div>
                  </div>
                  <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>{t('moon_in')}</div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#c084fc' }}>
                      {planets?.['Moon']?.rasi?.symbol} {translateZodiac(planets?.['Moon']?.rasi?.name)}
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {translateNakshatra(planets?.['Moon']?.nakshatra?.name)}
                    </div>
                  </div>
                </div>
              )}

              {/* Panchang */}
              {panchang && (
                <div style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: '10px',
                  padding: '14px 16px'
                }}>
                  <div style={{ fontWeight: 700, color: 'var(--gold)', fontSize: '12px', marginBottom: '10px' }}>
                     {t('current_panchang')}
                  </div>
                  <PanchangRow label={t('vara_label')} value={translateWeekday(panchang.vara)} />
                  <PanchangRow label={t('tithi_label')} value={`${translatePaksha(panchang.tithi.paksha)} ${translateTithi(panchang.tithi.name)} (${Math.round(panchang.tithi.percent)}%)`} />
                  <PanchangRow label={t('nakshatra_label')} value={translateNakshatra(panchang.nakshatra)} />
                  <PanchangRow label={t('yoga_label')} value={translateYoga(panchang.yoga)} />
                  <PanchangRow label={t('karana_label')} value={translateKarana(panchang.karana)} />
                </div>
              )}

              {/* Key planetary positions */}
              {planets && (
                <div style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '10px',
                  padding: '14px 16px'
                }}>
                  <div style={{ fontWeight: 700, color: '#06b6d4', fontSize: '12px', marginBottom: '10px' }}>
                     {t('key_positions')}
                  </div>
                  {['Sun','Moon','Mars','Mercury','Jupiter','Venus','Saturn','Rahu'].map(name => {
                    const p = planets[name];
                    if (!p) return null;
                    return (
                      <div key={name} style={{
                        display: 'flex', justifyContent: 'space-between',
                        padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.03)'
                      }}>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, minWidth: '65px' }}>{translatePlanet(name)}</span>
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                          {p.rasi.symbol} {translateZodiac(p.rasi.name)} {Math.floor(p.rasi.deg)}°
                          {p.isRetrograde && <span style={{ color: '#f59e0b', fontSize: '9px', marginLeft: '4px' }}>℞</span>}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ) : null}

        {/* Disclaimer */}
        <div style={{
          fontSize: '10px', color: 'rgba(6,182,212,0.4)',
          borderTop: '1px solid rgba(255,255,255,0.04)',
          paddingTop: '10px', lineHeight: 1.6
        }}>
          <strong>{lang === 'hi' ? 'प्रश्न ज्योतिष' : 'Prashna Jyotish'}</strong>: {t('prashna_disclaimer_bottom')}
        </div>
      </div>

      {/* ── MAP MODAL ── */}
      {showMapModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.85)',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          zIndex: 1000, padding: '20px'
        }}>
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
            borderRadius: '16px', width: '100%', maxWidth: '650px',
            padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.6)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, color: '#06b6d4', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px' }}>
                <Map size={16} /> {t('choose_prashna_loc')}
              </h3>
              <button onClick={() => setShowMapModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleMapSearch} style={{ display: 'flex', gap: '8px' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <input
                  type="text"
                  placeholder={t('search_city_place')}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%', padding: '10px 12px 10px 36px',
                    borderRadius: '8px', border: '1px solid var(--border-subtle)',
                    background: 'rgba(255,255,255,0.03)', color: 'var(--text-primary)', fontSize: '13px'
                  }}
                />
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
              </div>
              <button type="submit" style={{
                padding: '10px 16px', borderRadius: '8px', background: '#06b6d4',
                color: 'black', fontWeight: 700, border: 'none', cursor: 'pointer'
              }}>
                {t('search_btn')}
              </button>
            </form>

            {mapError && <div style={{ color: '#f87171', fontSize: '12px' }}>{mapError}</div>}

            <div
              id="prashna-leaflet-container"
              style={{ height: '320px', width: '100%', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: '#1a1a1a', zIndex: 1 }}
            />

            <div style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              📍 {t('map_picker_help')}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={() => setShowMapModal(false)}
                style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}>
                {t('cancel')}
              </button>
              <button onClick={handleConfirmLocation}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 20px', borderRadius: '8px', background: '#06b6d4', color: 'black', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                <Check size={14} /> {t('use_this_loc')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}