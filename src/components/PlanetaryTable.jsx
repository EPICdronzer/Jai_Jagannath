import React, { useState } from 'react';
import { translations } from '../utils/translations';

const PLANET_EMOJIS = {
  Lagna: '🌀',
  Sun: '☀️',
  Moon: '🌙',
  Mars: '🔴',
  Mercury: '🟢',
  Jupiter: '🟡',
  Venus: '⚪',
  Saturn: '🪐',
  Rahu: '🐉',
  Ketu: '🐍',
  Uranus: '🔵',
  Neptune: '🌊',
  Pluto: '💀'
};

export default function PlanetaryTable({ planets, lang = 'en' }) {
  const [showOuterPlanets, setShowOuterPlanets] = useState(false);

  const t = (key) => translations[lang]?.[key] || key;
  const translatePlanet = (name) => translations[lang]?.planets?.[name] || name;
  const translateZodiac = (name) => translations[lang]?.zodiacs?.[name] || name;
  const translateNakshatra = (name) => translations[lang]?.nakshatras?.[name] || name;

  if (!planets) return null;

  const standardOrder = ['Lagna', 'Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
  const outerPlanets = ['Uranus', 'Neptune', 'Pluto'];
  
  const displayPlanets = showOuterPlanets 
    ? [...standardOrder, ...outerPlanets] 
    : standardOrder;

  const formatDegMinSec = (deg) => {
    const totalSec = Math.round(deg * 3600);
    const d = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `${d}° ${m}' ${s}"`;
  };

  return (
    <div className="card planetary-table-card">
      <div className="card-header flex-row justify-between">
        <h3 className="card-title text-gold">
          {lang === 'hi' ? 'ग्रहों के स्पष्ट रेखांश और निर्देशांक' : 'Planetary Longitudes & Coordinates'}
        </h3>
        <label className="checkbox-container flex-row text-xs cursor-pointer select-none">
          <input
            type="checkbox"
            checked={showOuterPlanets}
            onChange={(e) => setShowOuterPlanets(e.target.checked)}
            className="custom-checkbox"
          />
          {lang === 'hi' ? 'बाहरी ग्रह दिखाएं (अरुण, वरुण, यम)' : 'Show Outer Planets (Uranus, Neptune, Pluto)'}
        </label>
      </div>

      <div className="table-responsive">
        <table className="astro-table">
          <thead>
            <tr>
              <th>{lang === 'hi' ? 'ग्रह' : 'Planet'}</th>
              <th className="text-center">{lang === 'hi' ? 'स्थिति' : 'Type'}</th>
              <th>{lang === 'hi' ? 'रेखांश (डिग्री)' : 'Longitude'}</th>
              <th>{lang === 'hi' ? 'राशि (Zodiac)' : 'Zodiac Sign (Rasi)'}</th>
              <th>{lang === 'hi' ? 'नक्षत्र (चरण)' : 'Nakshatra (Pada)'}</th>
              <th>{lang === 'hi' ? 'नक्षत्र स्वामी' : 'Nakshatra Lord'}</th>
            </tr>
          </thead>
          <tbody>
            {displayPlanets.map((name) => {
              const p = planets[name];
              if (!p) return null;

              const isLagna = name === 'Lagna';
              const isRetro = p.isRetrograde;

              return (
                <tr 
                  key={name} 
                  className={isLagna ? 'row-lagna' : ''}
                >
                  {/* Planet Name */}
                  <td className="cell-planet font-semibold">
                    <span className="emoji-space">{PLANET_EMOJIS[name] || '✨'}</span>
                    <span className={isLagna ? 'text-gold font-bold' : ''}>
                      {translatePlanet(name)}
                    </span>
                  </td>

                  {/* Retrograde Status */}
                  <td className="text-center">
                    {isLagna ? (
                      <span className="text-slate-500 text-xs">{lang === 'hi' ? 'लग्न' : 'Asc'}</span>
                    ) : isRetro ? (
                      <span className="badge badge-retro" title="Retrograde">
                        {lang === 'hi' ? 'व' : 'R'}
                      </span>
                    ) : (
                      <span className="badge badge-direct" title="Direct">
                        {lang === 'hi' ? 'मा' : 'D'}
                      </span>
                    )}
                  </td>

                  {/* Longitude inside Sign */}
                  <td className="font-mono text-xs text-light-slate">
                    {formatDegMinSec(p.rasi.deg)}
                  </td>

                  {/* Rasi Sign */}
                  <td>
                    <div className="flex-row gap-1">
                      <span className="sign-symbol text-gold" title={translateZodiac(p.rasi.name)}>
                        {p.rasi.symbol}
                      </span>
                      <span>
                        {translateZodiac(p.rasi.name)}
                      </span>
                      {lang !== 'hi' && (
                        <span className="hindi-label">
                          ({p.rasi.hindi})
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Nakshatra (Pada) */}
                  <td className="text-xs">
                    <span className="font-semibold text-slate-100">{translateNakshatra(p.nakshatra.name)}</span>
                    <span className="badge-pada">
                      {lang === 'hi' ? `चरण ${p.nakshatra.pada}` : `Pada ${p.nakshatra.pada}`}
                    </span>
                  </td>

                  {/* Nakshatra Lord */}
                  <td className="text-xs text-slate-400">
                    {translatePlanet(p.nakshatra.lord)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
