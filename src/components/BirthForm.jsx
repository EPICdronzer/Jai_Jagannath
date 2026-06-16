import React, { useState } from 'react';
import { PRESET_CITIES } from '../utils/cities';
import { Calendar, Clock, MapPin, Globe, Compass, RefreshCw } from 'lucide-react';

export default function BirthForm({ onSubmit, defaultValues }) {
  const [formData, setFormData] = useState(defaultValues || {
    name: '',
    dateStr: '2026-06-15',
    timeStr: '17:30:00',
    lat: 19.8135,
    lon: 85.8312,
    timezoneOffset: 5.5,
    cityPreset: 'Puri, Odisha, India (Jagannath Temple)'
  });

  const handleCityChange = (e) => {
    const cityName = e.target.value;
    if (!cityName) { setFormData(p => ({ ...p, cityPreset: '' })); return; }
    const city = PRESET_CITIES.find(c => c.name === cityName);
    if (city) setFormData(p => ({ ...p, cityPreset: cityName, lat: city.lat, lon: city.lon, timezoneOffset: city.timezone }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(p => ({
      ...p,
      [name]: ['lat', 'lon', 'timezoneOffset'].includes(name) ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = (e) => { e.preventDefault(); onSubmit(formData); };

  return (
    <form onSubmit={handleSubmit} className="card birth-form">
      <div className="card-header">
        <h2 className="card-title text-gold" style={{ display:'flex', alignItems:'center', gap:'8px' }}>
          <Globe style={{ width:18, height:18, animation:'pulse 2s infinite' }} />
          Birth Details (Kundli)
        </h2>
        <span className="subtitle">Jagannatha Hora</span>
      </div>

      <div className="card-body">
        {/* Name */}
        <div className="form-group">
          <label className="form-label">Name / Subject</label>
          <input
            type="text" name="name" value={formData.name}
            onChange={handleChange} placeholder="Enter name"
            className="form-input"
          />
        </div>

        {/* Date & Time row */}
        <div className="form-row">
          <div className="form-group" style={{ flex:1 }}>
            <label className="form-label" style={{ display:'flex', alignItems:'center', gap:'5px' }}>
              <Calendar style={{ width:13, height:13, color:'var(--gold)' }} /> Date of Birth
            </label>
            <input type="date" name="dateStr" value={formData.dateStr} onChange={handleChange} required className="form-input" />
          </div>
          <div className="form-group" style={{ flex:1 }}>
            <label className="form-label" style={{ display:'flex', alignItems:'center', gap:'5px' }}>
              <Clock style={{ width:13, height:13, color:'var(--gold)' }} /> Time of Birth
            </label>
            <input type="time" name="timeStr" step="1" value={formData.timeStr} onChange={handleChange} required className="form-input" />
          </div>
        </div>

        {/* City Preset */}
        <div className="form-group">
          <label className="form-label" style={{ display:'flex', alignItems:'center', gap:'5px' }}>
            <MapPin style={{ width:13, height:13, color:'var(--gold)' }} /> City Preset
          </label>
          <select value={formData.cityPreset} onChange={handleCityChange} className="form-input" style={{ cursor:'pointer', colorScheme:'dark' }}>
            <option value="">-- Manual Entry --</option>
            {PRESET_CITIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
          </select>
        </div>

        {/* Coordinates panel */}
        <div className="form-row" style={{ background:'rgba(4,5,10,0.6)', padding:'12px', borderRadius:'8px', border:'1px solid rgba(100,116,139,0.15)' }}>
          <div className="form-group" style={{ flex:1 }}>
            <label className="form-label" style={{ display:'flex', alignItems:'center', gap:'5px' }}>
              <Compass style={{ width:13, height:13, color:'var(--gold)' }} /> Latitude
            </label>
            <input type="number" name="lat" step="0.0001" value={formData.lat} onChange={handleChange} className="form-input" />
            <span className="input-helper">
              {formData.lat >= 0 ? `${formData.lat.toFixed(2)}° N` : `${Math.abs(formData.lat).toFixed(2)}° S`}
            </span>
          </div>
          <div className="form-group" style={{ flex:1 }}>
            <label className="form-label" style={{ display:'flex', alignItems:'center', gap:'5px' }}>
              <Compass style={{ width:13, height:13, color:'var(--gold)' }} /> Longitude
            </label>
            <input type="number" name="lon" step="0.0001" value={formData.lon} onChange={handleChange} className="form-input" />
            <span className="input-helper">
              {formData.lon >= 0 ? `${formData.lon.toFixed(2)}° E` : `${Math.abs(formData.lon).toFixed(2)}° W`}
            </span>
          </div>
        </div>

        {/* Timezone */}
        <div className="form-group">
          <label className="form-label" style={{ display:'flex', alignItems:'center', gap:'5px' }}>
            <Globe style={{ width:13, height:13, color:'var(--gold)' }} /> Timezone Offset (Hours from UTC)
          </label>
          <input type="number" name="timezoneOffset" step="0.5" value={formData.timezoneOffset} onChange={handleChange} className="form-input" />
          <span className="input-helper">
            {formData.timezoneOffset >= 0 ? `UTC +${formData.timezoneOffset}` : `UTC ${formData.timezoneOffset}`}
            {formData.timezoneOffset === 5.5 ? ' (IST – India)' : formData.timezoneOffset === 0 ? ' (GMT – UK)' : ''}
          </span>
        </div>
      </div>

      <button type="submit" className="btn btn-gold" style={{ width:'100%', marginTop:'4px' }}>
        <RefreshCw style={{ width:15, height:15, animation:'spin-slow 2s linear infinite' }} />
        Calculate Kundli (Lagna & Vargas)
      </button>
    </form>
  );
}
