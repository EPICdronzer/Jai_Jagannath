import React, { useState } from 'react';
import { calculateVimshottariDasha } from '../utils/astrology';
import { Calendar, ChevronDown, ChevronRight, Zap } from 'lucide-react';
import { translations } from '../utils/translations';

export default function DashaView({ moonLong, birthDate, lang = 'en' }) {
  const [expandedDasha, setExpandedDasha] = useState(null);

  const translatePlanet = (name) => translations[lang]?.planets?.[name] || name;

  if (!moonLong || !birthDate) return null;

  const birthDateObj = new Date(birthDate);
  const dashas = calculateVimshottariDasha(moonLong, birthDateObj);
  const now = new Date();

  const formatDate = (date) => {
    return date.toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isCurrentDasha = (start, end) => {
    return now >= start && now <= end;
  };

  const toggleExpand = (idx) => {
    if (expandedDasha === idx) {
      setExpandedDasha(null);
    } else {
      setExpandedDasha(idx);
    }
  };

  return (
    <div className="card dasha-card max-width-lg">
      <div className="card-header flex-row justify-between">
        <h3 className="card-title text-gold flex-row">
          <Zap className="icon-pulse" />
          {lang === 'hi' ? 'विंशोत्तरी दशा' : 'Vimshottari Dasha'}
        </h3>
        <span className="subtitle">
          {lang === 'hi' ? '120 वर्ष का महादशा चक्र' : '120 Years Planetary Cycles'}
        </span>
      </div>

      <div className="dasha-list-container custom-scrollbar">
        {dashas.map((d, idx) => {
          const isActive = isCurrentDasha(d.start, d.end);
          const isExpanded = expandedDasha === idx;

          return (
            <div
              key={idx}
              className={`dasha-item-wrapper ${isActive ? 'active' : ''}`}
            >
              {/* Maha Dasha Row */}
              <div
                onClick={() => toggleExpand(idx)}
                className="dasha-row flex-row justify-between select-none cursor-pointer"
              >
                <div className="flex-row gap-2">
                  {isExpanded ? (
                    <ChevronDown className="chevron-icon" />
                  ) : (
                    <ChevronRight className="chevron-icon" />
                  )}
                  <span className={`dasha-lord-label ${isActive ? 'text-gold' : ''}`}>
                    {translatePlanet(d.lord)} {lang === 'hi' ? 'महादशा' : 'Maha Dasha'}
                  </span>
                  {isActive && (
                    <span className="badge badge-active icon-pulse flex-row">
                      {lang === 'hi' ? 'वर्तमान में सक्रिय' : 'Active Now'}
                    </span>
                  )}
                </div>
                
                <div className="dasha-dates-label flex-row gap-1 font-mono text-xs">
                  <Calendar className="calendar-icon" />
                  <span>{formatDate(d.start)}</span>
                  <span className="date-arrow">→</span>
                  <span>{formatDate(d.end)}</span>
                </div>
              </div>

              {/* Nested Antar Dashas (Sub-dashas) */}
              {isExpanded && (
                <div className="antar-dasha-container">
                  <div className="antar-title font-bold">
                    {lang === 'hi' ? 'अंतर्दशा (उप-अवधि)' : 'Antar Dashas (Sub-periods)'}
                  </div>
                  <div className="antar-list divide-y-subtle">
                    {d.antarDashas.map((sub, sIdx) => {
                      const isSubActive = isCurrentDasha(sub.start, sub.end);
                      return (
                        <div
                          key={sIdx}
                          className={`antar-row flex-row justify-between text-sm ${
                            isSubActive ? 'text-cyan active' : 'text-muted'
                          }`}
                        >
                          <div className="flex-row gap-2">
                            <span className="bullet-dot" />
                            <span>{translatePlanet(d.lord)} – {translatePlanet(sub.lord)}</span>
                            {isSubActive && (
                              <span className="badge badge-current-sub text-xs">
                                {lang === 'hi' ? 'वर्तमान' : 'Current'}
                              </span>
                            )}
                          </div>
                          <div className="antar-date font-mono text-xs text-slate-500">
                            {formatDate(sub.start)} {lang === 'hi' ? 'से' : 'to'} {formatDate(sub.end)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
