import React, { useState, useEffect, useRef } from 'react';
import { PRESET_CITIES } from '../utils/cities';
import { Calendar, Clock, MapPin, Globe, Compass, RefreshCw, Search, Check, X, Map } from 'lucide-react';
import { translations } from '../utils/translations';

export default function BirthForm({ onSubmit, lang = 'en', defaultValues, collectExtra = false }) {
  const t = (key) => translations[lang]?.[key] || key;

  const [formData, setFormData] = useState({
    name: defaultValues?.name || '',
    gender: defaultValues?.gender || '',
    dateStr: defaultValues?.dateStr || '',
    timeHour: '',
    timeMinute: '',
    timeSecond: '00',
    timeAmpm: 'AM',
    lat: defaultValues?.lat ?? '',
    lon: defaultValues?.lon ?? '',
    timezoneOffset: defaultValues?.timezoneOffset ?? '',
    cityPreset: defaultValues?.cityPreset || ''
  });

  const [extraProfile, setExtraProfile] = useState({
    currentCity: '',
    relationshipStatus: '',
    careerField: '',
    concerns: '',
    birthTimeAccuracy: 'exact'
  });
  const [showExtra, setShowExtra] = useState(false);

  const [showMapModal, setShowMapModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mapError, setMapError] = useState('');
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const tempCoords = useRef({ lat: 20.5937, lon: 78.9629, name: '' });

  // Sync state when defaultValues changes
  useEffect(() => {
    if (defaultValues) {
      let hour = '';
      let minute = '';
      let second = '00';
      let ampm = 'AM';
      
      if (defaultValues.timeStr) {
        const parts = defaultValues.timeStr.split(':');
        let hr24 = parseInt(parts[0]) || 0;
        minute = parseInt(parts[1]) || 0;
        second = parseInt(parts[2]) || 0;
        
        if (hr24 >= 12) {
          ampm = 'PM';
          if (hr24 > 12) hr24 -= 12;
        } else {
          ampm = 'AM';
          if (hr24 === 0) hr24 = 12;
        }
        hour = hr24;
      }

      setFormData({
        name: defaultValues.name || '',
        gender: defaultValues.gender || '',
        dateStr: defaultValues.dateStr || '',
        timeHour: hour,
        timeMinute: minute,
        timeSecond: second,
        timeAmpm: ampm,
        lat: defaultValues.lat ?? '',
        lon: defaultValues.lon ?? '',
        timezoneOffset: defaultValues.timezoneOffset ?? '',
        cityPreset: defaultValues.cityPreset || ''
      });
    }
  }, [defaultValues]);

  // Handle preset city change
  const handleCityChange = (e) => {
    const cityName = e.target.value;
    if (!cityName) {
      setFormData(p => ({ ...p, cityPreset: '', lat: '', lon: '', timezoneOffset: '' }));
      return;
    }
    const city = PRESET_CITIES.find(c => c.name === cityName);
    if (city) {
      setFormData(p => ({
        ...p,
        cityPreset: cityName,
        lat: city.lat,
        lon: city.lon,
        timezoneOffset: city.timezone
      }));
    }
  };

  // Generic change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    // For numeric fields: allow intermediate typing states (minus sign, trailing dot)
    // We keep the raw string and let submit do final parsing
    setFormData(p => ({
      ...p,
      [name]: value
    }));
  };

  // Open Leaflet Map Modal
  const openMap = () => {
    setShowMapModal(true);
    setMapError('');
    const curLat = parseFloat(formData.lat) || 20.5937;
    const curLon = parseFloat(formData.lon) || 78.9629;
    tempCoords.current = { lat: curLat, lon: curLon, name: formData.cityPreset || '' };
  };

  // Initialize Map
  useEffect(() => {
    if (!showMapModal) return;

    const initTimer = setTimeout(() => {
      if (!window.L) {
        setMapError('Leaflet map library could not be loaded. Please check your internet connection.');
        return;
      }

      try {
        const { lat, lon } = tempCoords.current;
        const map = window.L.map('leaflet-picker-container').setView([lat, lon], 5);
        mapRef.current = map;

        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; OpenStreetMap'
        }).addTo(map);

        const marker = window.L.marker([lat, lon], { draggable: true }).addTo(map);
        markerRef.current = marker;

        const updateMarkerPos = (newLat, newLng, address = '') => {
          marker.setLatLng([newLat, newLng]);
          map.panTo([newLat, newLng]);
          tempCoords.current = {
            lat: parseFloat(newLat.toFixed(4)),
            lon: parseFloat(newLng.toFixed(4)),
            name: address
          };
        };

        map.on('click', (e) => {
          updateMarkerPos(e.latlng.lat, e.latlng.lng);
        });

        marker.on('dragend', (e) => {
          const pos = marker.getLatLng();
          updateMarkerPos(pos.lat, pos.lng);
        });
      } catch (err) {
        console.error(err);
        setMapError('Failed to initialize map.');
      }
    }, 250);

    return () => {
      clearTimeout(initTimer);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [showMapModal]);

  // Search address using Nominatim
  const handleMapSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
      const results = await response.json();
      if (results && results.length > 0) {
        const first = results[0];
        const lat = parseFloat(first.lat);
        const lon = parseFloat(first.lon);
        const displayName = first.display_name.split(',')[0] + ', ' + (first.display_name.split(',')[1] || '').trim();

        if (mapRef.current && markerRef.current) {
          mapRef.current.setView([lat, lon], 12);
          markerRef.current.setLatLng([lat, lon]);
          tempCoords.current = {
            lat: parseFloat(lat.toFixed(4)),
            lon: parseFloat(lon.toFixed(4)),
            name: displayName
          };
        }
      } else {
        alert('Place not found. Try a different query.');
      }
    } catch (err) {
      console.error(err);
      alert('Geocoding service error.');
    }
  };

  // Confirm selected coordinates
  const handleConfirmLocation = async () => {
    const { lat, lon, name } = tempCoords.current;
    
    // Try reverse geocode to get country code for better timezone estimation
    let tz = Math.round((lon / 15) * 2) / 2; // solar fallback
    let displayName = name || `${lat.toFixed(4)}°, ${lon.toFixed(4)}°`;
    
    try {
      const resp = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=5`
      );
      if (resp.ok) {
        const geo = await resp.json();
        const cc = geo?.address?.country_code?.toLowerCase();
        // Common country/region timezone offsets
        const TZ_MAP = {
          'in': 5.5, 'lk': 5.5, 'np': 5.75, 'bd': 6, 'pk': 5,
          'cn': 8, 'jp': 9, 'kr': 9, 'sg': 8, 'my': 8, 'th': 7,
          'id': 7, 'vn': 7, 'ph': 8, 'mm': 6.5, 'af': 4.5,
          'ae': 4, 'sa': 3, 'iq': 3, 'ir': 3.5, 'om': 4,
          'kw': 3, 'bh': 3, 'qa': 3, 'ye': 3,
          'gb': 0, 'ie': 0, 'pt': 0, 'is': 0,
          'fr': 1, 'de': 1, 'it': 1, 'es': 1, 'nl': 1, 'be': 1,
          'pl': 1, 'cz': 1, 'at': 1, 'ch': 1, 'dk': 1, 'no': 1, 'se': 1,
          'fi': 2, 'gr': 2, 'ro': 2, 'ua': 2, 'ee': 2, 'lv': 2, 'lt': 2,
          'ru': 3, // Moscow (approximate)
          'eg': 2, 'za': 2, 'ke': 3, 'et': 3,
          'us': Math.round((lon / 15) * 2) / 2, // US uses lon-based
          'ca': Math.round((lon / 15) * 2) / 2,
          'au': lon > 140 ? 10 : lon > 128 ? 9.5 : 8,
          'nz': 12,
        };
        if (cc && TZ_MAP[cc] !== undefined) {
          tz = TZ_MAP[cc];
        }
        if (geo?.display_name) {
          const parts = geo.display_name.split(',');
          displayName = (parts[0] + (parts[1] ? ', ' + parts[1].trim() : '')).trim();
        }
      }
    } catch (_) {
      // Silently fall back to solar timezone
    }

    setFormData(p => ({
      ...p,
      lat: parseFloat(lat.toFixed(4)),
      lon: parseFloat(lon.toFixed(4)),
      cityPreset: displayName,
      timezoneOffset: tz
    }));
    setShowMapModal(false);
  };

  // Submit and combine parts into unified structure
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.dateStr || !formData.timeHour || !formData.timeMinute || formData.lat === '' || formData.lon === '' || formData.timezoneOffset === '') {
      alert('Please fill out all fields before calculating.');
      return;
    }

    // Convert AM/PM time to 24 hour string format (HH:MM:SS)
    let hr = parseInt(formData.timeHour);
    const min = String(formData.timeMinute).padStart(2, '0');
    const sec = String(formData.timeSecond).padStart(2, '0');

    if (formData.timeAmpm === 'PM' && hr < 12) hr += 12;
    if (formData.timeAmpm === 'AM' && hr === 12) hr = 0;

    const timeStr24 = `${String(hr).padStart(2, '0')}:${min}:${sec}`;

    onSubmit(
      {
        name: formData.name || 'Subject',
        gender: formData.gender || 'other',
        dateStr: formData.dateStr,
        timeStr: timeStr24,
        lat: parseFloat(formData.lat),
        lon: parseFloat(formData.lon),
        timezoneOffset: parseFloat(formData.timezoneOffset),
        cityPreset: formData.cityPreset
      },
      collectExtra ? extraProfile : undefined
    );
  };

  return (
    <div className="birth-form-wrapper">
      <form onSubmit={handleSubmit} className="card birth-form">
        <div className="card-header">
          <h2 className="card-title text-gold" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Globe style={{ width: 18, height: 18, animation: 'pulse 2s infinite' }} />
            {t('birth_details')}
          </h2>
          <span className="subtitle">Jai Jagannath 🙏</span>
        </div>

        <div className="card-body">
          {/* Name */}
          <div className="form-group">
            <label className="form-label">{t('subject_name')}</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={t('enter_name')}
              className="form-input"
            />
          </div>

          {/* Gender */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ fontSize: '13px' }}>⚧</span> {t('gender')}
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[['male', `♂ ${t('male')}`], ['female', `♀ ${t('female')}`], ['other', `⊕ ${t('other')}`]].map(([val, lbl]) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setFormData(p => ({ ...p, gender: val }))}
                  style={{
                    flex: 1,
                    padding: '8px 4px',
                    borderRadius: '8px',
                    border: formData.gender === val ? '1.5px solid var(--gold)' : '1px solid rgba(255,255,255,0.1)',
                    background: formData.gender === val ? 'rgba(234,179,8,0.15)' : 'rgba(255,255,255,0.03)',
                    color: formData.gender === val ? 'var(--gold)' : 'var(--text-secondary)',
                    fontWeight: formData.gender === val ? 700 : 400,
                    cursor: 'pointer',
                    fontSize: '12px',
                    transition: 'all 0.2s'
                  }}
                >
                  {lbl}
                </button>
              ))}
            </div>
          </div>

          {/* Date of Birth */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Calendar style={{ width: 13, height: 13, color: 'var(--gold)' }} /> {t('date_of_birth')}
            </label>
            <input
              type="date"
              name="dateStr"
              value={formData.dateStr}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          {/* Time of Birth AM/PM Split Fields */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Clock style={{ width: 13, height: 13, color: 'var(--gold)' }} /> {t('time_of_birth')}
            </label>
            <div style={{ display: 'flex', gap: '6px' }}>
              {/* Hours */}
              <select
                name="timeHour"
                value={formData.timeHour}
                onChange={handleChange}
                required
                className="form-input"
                style={{ flex: 1, paddingRight: '4px' }}
              >
                <option value="">HH</option>
                {Array.from({ length: 12 }, (_, i) => i + 1).map(h => (
                  <option key={h} value={h}>{String(h).padStart(2, '0')}</option>
                ))}
              </select>

              {/* Minutes */}
              <select
                name="timeMinute"
                value={formData.timeMinute}
                onChange={handleChange}
                required
                className="form-input"
                style={{ flex: 1, paddingRight: '4px' }}
              >
                <option value="">MM</option>
                {Array.from({ length: 60 }, (_, i) => i).map(m => (
                  <option key={m} value={m}>{String(m).padStart(2, '0')}</option>
                ))}
              </select>

              {/* Seconds */}
              <select
                name="timeSecond"
                value={formData.timeSecond}
                onChange={handleChange}
                required
                className="form-input"
                style={{ flex: 1, paddingRight: '4px' }}
              >
                {Array.from({ length: 60 }, (_, i) => i).map(s => (
                  <option key={s} value={s}>{String(s).padStart(2, '0')}</option>
                ))}
              </select>

              {/* AM/PM */}
              <select
                name="timeAmpm"
                value={formData.timeAmpm}
                onChange={handleChange}
                className="form-input"
                style={{ width: '70px' }}
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
          </div>

          {/* City Preset */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <MapPin style={{ width: 13, height: 13, color: 'var(--gold)' }} /> {t('city_preset')}
            </label>
            <select
              value={formData.cityPreset}
              onChange={handleCityChange}
              className="form-input"
              style={{ cursor: 'pointer', colorScheme: 'dark' }}
            >
              <option value="">{t('manual_entry')}</option>
              {PRESET_CITIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
            </select>
          </div>

          {/* Map Location Picker Button */}
          <button
            type="button"
            onClick={openMap}
            className="btn btn-secondary"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              padding: '10px',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              marginBottom: '16px'
            }}
          >
            <Map size={15} style={{ color: 'var(--gold)' }} />
            {t('choose_map')}
          </button>

          {/* Coordinates panel */}
          <div className="form-row" style={{ background: 'rgba(4,5,10,0.6)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(100,116,139,0.15)' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Compass style={{ width: 13, height: 13, color: 'var(--gold)' }} /> {t('latitude')}
              </label>
              <input
                type="number"
                name="lat"
                step="0.0001"
                value={formData.lat}
                onChange={handleChange}
                className="form-input"
                required
              />
              <span className="input-helper">
                {formData.lat !== '' && (parseFloat(formData.lat) >= 0 ? `${parseFloat(formData.lat).toFixed(2)}° N` : `${Math.abs(parseFloat(formData.lat)).toFixed(2)}° S`)}
              </span>
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Compass style={{ width: 13, height: 13, color: 'var(--gold)' }} /> {t('longitude')}
              </label>
              <input
                type="number"
                name="lon"
                step="0.0001"
                value={formData.lon}
                onChange={handleChange}
                className="form-input"
                required
              />
              <span className="input-helper">
                {formData.lon !== '' && (parseFloat(formData.lon) >= 0 ? `${parseFloat(formData.lon).toFixed(2)}° E` : `${Math.abs(parseFloat(formData.lon)).toFixed(2)}° W`)}
              </span>
            </div>
          </div>

          {/* Timezone */}
          <div className="form-group" style={{ marginTop: '12px' }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Globe style={{ width: 13, height: 13, color: 'var(--gold)' }} /> {t('timezone')}
            </label>
            <input
              type="number"
              name="timezoneOffset"
              step="0.5"
              value={formData.timezoneOffset}
              onChange={handleChange}
              className="form-input"
              required
            />
            <span className="input-helper">
              {formData.timezoneOffset !== '' && (parseFloat(formData.timezoneOffset) >= 0 ? `UTC +${formData.timezoneOffset}` : `UTC ${formData.timezoneOffset}`)}
            </span>
          </div>
          {/* ── EXTRA PROFILE FOR DEEP KUNDALI REPORT ── */}
          {collectExtra && (
            <div style={{ marginTop: '8px', border: '1px solid rgba(234,179,8,0.18)', borderRadius: '10px', overflow: 'hidden' }}>
              <button
                type="button"
                onClick={() => setShowExtra(o => !o)}
                style={{
                  width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '11px 14px', background: 'rgba(234,179,8,0.05)', border: 'none', cursor: 'pointer',
                  color: 'var(--gold)', fontWeight: 700, fontSize: '12px'
                }}
              >
                <span>🔮 Deep Kundali Profile (Optional but Recommended)</span>
                <span>{showExtra ? '▲' : '▼'}</span>
              </button>
              {showExtra && (
                <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '12px', background: 'rgba(0,0,0,0.2)' }}>
                  {/* Birth Time Accuracy */}
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">⏱ Birth Time Accuracy</label>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {[['exact','Exact'],['approx','Approx'],['unknown','Unknown']].map(([val, lbl]) => (
                        <button key={val} type="button"
                          onClick={() => setExtraProfile(p => ({ ...p, birthTimeAccuracy: val }))}
                          style={{
                            flex: 1, padding: '7px 4px', borderRadius: '7px', border: extraProfile.birthTimeAccuracy === val ? '1.5px solid var(--gold)' : '1px solid rgba(255,255,255,0.1)',
                            background: extraProfile.birthTimeAccuracy === val ? 'rgba(234,179,8,0.15)' : 'rgba(255,255,255,0.03)',
                            color: extraProfile.birthTimeAccuracy === val ? 'var(--gold)' : 'var(--text-secondary)',
                            fontWeight: extraProfile.birthTimeAccuracy === val ? 700 : 400, cursor: 'pointer', fontSize: '11px', transition: 'all 0.2s'
                          }}>{lbl}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Current City */}
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">🏙 Current City of Residence</label>
                    <input
                      type="text" value={extraProfile.currentCity}
                      onChange={e => setExtraProfile(p => ({ ...p, currentCity: e.target.value }))}
                      placeholder="e.g. Bhubaneswar, Odisha" className="form-input"
                    />
                  </div>

                  {/* Relationship Status */}
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">💑 Relationship Status</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                      {[['single','Single'],['dating','Dating'],['married','Married'],['divorced','Divorced']].map(([val, lbl]) => (
                        <button key={val} type="button"
                          onClick={() => setExtraProfile(p => ({ ...p, relationshipStatus: val }))}
                          style={{
                            flex: '1 0 80px', padding: '7px 6px', borderRadius: '7px',
                            border: extraProfile.relationshipStatus === val ? '1.5px solid var(--gold)' : '1px solid rgba(255,255,255,0.1)',
                            background: extraProfile.relationshipStatus === val ? 'rgba(234,179,8,0.15)' : 'rgba(255,255,255,0.03)',
                            color: extraProfile.relationshipStatus === val ? 'var(--gold)' : 'var(--text-secondary)',
                            fontWeight: extraProfile.relationshipStatus === val ? 700 : 400, cursor: 'pointer', fontSize: '11px', transition: 'all 0.2s'
                          }}>{lbl}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Career Field */}
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">💼 Career Field / Profession</label>
                    <input
                      type="text" value={extraProfile.careerField}
                      onChange={e => setExtraProfile(p => ({ ...p, careerField: e.target.value }))}
                      placeholder="e.g. Software Engineer, Business, Student..." className="form-input"
                    />
                  </div>

                  {/* Major Concerns */}
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">🎯 Major Life Concerns</label>
                    <textarea
                      value={extraProfile.concerns}
                      onChange={e => setExtraProfile(p => ({ ...p, concerns: e.target.value }))}
                      placeholder="e.g. Career growth, marriage timing, health, financial stability, mental peace..."
                      className="form-input" rows={3}
                      style={{ resize: 'vertical', minHeight: '70px', fontFamily: 'inherit', fontSize: '12px' }}
                    />
                  </div>

                  <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', background: 'rgba(234,179,8,0.04)', padding: '8px 10px', borderRadius: '6px', border: '1px solid rgba(234,179,8,0.1)' }}>
                    💡 These details help contextualise the Kundali Report with more personalised insights. They are not shared and remain local to your browser.
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <button type="submit" className="btn btn-gold" style={{ width: '100%', marginTop: '4px' }}>
          <RefreshCw style={{ width: 15, height: 15, animation: 'spin-slow 2s linear infinite' }} />
          {t('calc_button')}
        </button>
      </form>

      {/* Map Modal dialog */}
      {showMapModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.85)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '650px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, color: 'var(--gold)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Map size={18} /> {t('map_modal_title')}
              </h3>
              <button
                onClick={() => setShowMapModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Geocoder Search form */}
            <form onSubmit={handleMapSearch} style={{ display: 'flex', gap: '8px' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <input
                  type="text"
                  placeholder={t('search_placeholder')}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 36px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)',
                    background: 'rgba(255,255,255,0.03)',
                    color: 'var(--text-primary)'
                  }}
                />
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
              </div>
              <button
                type="submit"
                style={{
                  padding: '10px 16px',
                  borderRadius: '8px',
                  background: 'var(--gold)',
                  color: 'black',
                  fontWeight: 'bold',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Search
              </button>
            </form>

            {mapError && (
              <div style={{ color: 'var(--red)', fontSize: '12px' }}>
                {mapError}
              </div>
            )}

            {/* Leaflet div */}
            <div
              id="leaflet-picker-container"
              style={{
                height: '350px',
                width: '100%',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                background: '#1a1a1a',
                zIndex: 1
              }}
            />

            <div style={{ fontSize: '11px', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
              📍 Click anywhere on the map or drag the marker to pinpoint location. Coordinates and solar timezone will calculate automatically.
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                onClick={() => setShowMapModal(false)}
                className="btn"
                style={{ background: 'none', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', cursor: 'pointer', padding: '10px 20px', borderRadius: '8px' }}
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleConfirmLocation}
                className="btn btn-gold"
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 20px', borderRadius: '8px' }}
              >
                <Check size={16} />
                {t('confirm_loc')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
