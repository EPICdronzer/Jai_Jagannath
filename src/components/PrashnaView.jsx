import React, { useState, useEffect, useRef, useCallback } from 'react';
import { calculateBirthDataAsync } from '../utils/astrology';
import { PRESET_CITIES } from '../utils/cities';
import VedicChart from './VedicChart';
import { Clock, MapPin, RefreshCw, Map, Search, X, Check, Compass, Globe } from 'lucide-react';

// Default location: New Delhi
const DEFAULT_LOCATION = {
  name: 'New Delhi, India',
  lat: 28.6139,
  lon: 77.2090,
  timezone: 5.5
};

function pad(n) { return String(n).padStart(2, '0'); }

function formatLocalTime(d) {
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}
function formatLocalDate(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
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
  // ── Capture current time ONCE on mount — never changes until page refresh ──
  const frozenTimeRef = useRef(new Date());
  const frozenTime    = frozenTimeRef.current;

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

  // ── Calculate whenever location changes (time is always frozen) ──
  const calculate = useCallback(async (loc) => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        name: 'Prashna',
        gender: 'other',
        dateStr: formatLocalDate(frozenTime),
        timeStr: formatLocalTime(frozenTime),
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
  }, [frozenTime]);

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
    // Smart timezone: round lon/15 to nearest 0.5h
    const tz = Math.round((lon / 15) * 2) / 2;
    const loc = { name: name || `${lat.toFixed(2)}N ${lon.toFixed(2)}E`, lat, lon, timezone: tz };
    setCityPreset(loc.name);
    setLocation(loc);
    setShowMapModal(false);
  };

  // ── Formatted frozen time for display ──
  const frozenDateStr = frozenTime.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const frozenTimeStr = formatLocalTime(frozenTime);

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
               Prashna Kundali ( Current Moment Chart )
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
              Time frozen at page load • Location changeable below
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
            LIVE CLOCK
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
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '3px' }}> Chart Calculated For</div>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: '12px', color: '#06b6d4', fontWeight: 700 }}>
              {frozenDateStr}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '3px' }}> Prashna Time (Frozen)</div>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: '12px', color: 'var(--gold)', fontWeight: 700 }}>
              {frozenTimeStr} IST (at page load)
            </div>
          </div>
          <div style={{ fontSize: '10px', color: 'rgba(6,182,212,0.5)', fontStyle: 'italic', flex: 1 }}>
             Time is locked at page open. Refresh browser to get a new Prashna moment.
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
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Prashna Location:</span>

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
            <Map size={13} /> Map
          </button>

          {/* Current location display */}
          <div style={{
            fontFamily: 'JetBrains Mono', fontSize: '10px',
            color: 'var(--text-muted)', flex: '1 0 180px'
          }}>
             {location.lat.toFixed(4)}°N {location.lon.toFixed(4)}°E | UTC+{location.timezone}
          </div>
        </div>

        {/* ── Chart + Panchang ── */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', padding: '40px 0', color: '#06b6d4', fontSize: '13px' }}>
            <RefreshCw size={18} style={{ animation: 'spin-slow 1s linear infinite' }} />
            Calculating Prashna chart…
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
                 Prashna Rasi Chart
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
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Prashna Lagna</div>
                    <div style={{ fontSize: '17px', fontWeight: 800, color: '#06b6d4' }}>{lagna.rasi.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {Math.floor(lagna.rasi.deg)}° {Math.floor((lagna.rasi.deg % 1) * 60)}' in {lagna.rasi.name}
                    </div>
                  </div>
                  <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>Moon in</div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#c084fc' }}>
                      {planets['Moon'].rasi.symbol} {planets['Moon'].rasi.name}
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {planets['Moon'].nakshatra.name}
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
                     Current Panchang
                  </div>
                  <PanchangRow label="Vara (Weekday)" value={panchang.vara} />
                  <PanchangRow label="Tithi" value={`${panchang.tithi.paksha} ${panchang.tithi.name} (${Math.round(panchang.tithi.percent)}%)`} />
                  <PanchangRow label="Nakshatra" value={panchang.nakshatra} />
                  <PanchangRow label="Yoga" value={panchang.yoga} />
                  <PanchangRow label="Karana" value={panchang.karana} />
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
                     Key Positions Now
                  </div>
                  {['Sun','Moon','Mars','Mercury','Jupiter','Venus','Saturn','Rahu'].map(name => {
                    const p = planets[name];
                    if (!p) return null;
                    return (
                      <div key={name} style={{
                        display: 'flex', justifyContent: 'space-between',
                        padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.03)'
                      }}>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, minWidth: '65px' }}>{name}</span>
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                          {p.rasi.symbol} {p.rasi.name} {Math.floor(p.rasi.deg)}°
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
          <strong>Prashna Jyotish</strong>: The Prashna (question) chart is cast for the exact moment a question arises in the mind or is put to an astrologer. The Lagna and Moon placement at this moment reveal the answer. This chart reflects the cosmic moment you opened this page — a Prashna cannot be recast for the same question.
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
                <Map size={16} /> Choose Prashna Location
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
                  placeholder="Search city or place…"
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
                Search
              </button>
            </form>

            {mapError && <div style={{ color: '#f87171', fontSize: '12px' }}>{mapError}</div>}

            <div
              id="prashna-leaflet-container"
              style={{ height: '320px', width: '100%', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: '#1a1a1a', zIndex: 1 }}
            />

            <div style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              📍 Click on map or drag marker. The timezone will be estimated from longitude — please verify for unusual locations.
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={() => setShowMapModal(false)}
                style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}>
                Cancel
              </button>
              <button onClick={handleConfirmLocation}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 20px', borderRadius: '8px', background: '#06b6d4', color: 'black', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                <Check size={14} /> Use This Location
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
