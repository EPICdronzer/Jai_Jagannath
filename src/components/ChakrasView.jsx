import React from 'react';
import { Compass, ShieldAlert, Sparkles, AlertTriangle } from 'lucide-react';

const SPECIAL_LAGNA_DESCS = {
  pranapada_lagna: 'Pranapada Lagna - Relates to breath, life-force, vitality and biological clock.',
  indu_lagna: 'Indu Lagna - Signifies wealth, prosperity, financial resources and unexpected fortune.',
  bhrigu_bindhu_lagna: 'Bhrigu Bindu - The midpoint of Rahu and Moon; represents destiny points and key life developments.',
  sree_lagna: 'Sree Lagna - Signifies prosperity, general well-being and spouse-related fortunes.',
  kunda_lagna: 'Kunda Lagna - Verification point for birth time rectification.',
  bhava_lagna: 'Bhava Lagna - Calculated from sunrise time; denotes physical health and vitality.',
  hora_lagna: 'Hora Lagna - Denotes financial potential and prosperity.',
  ghati_lagna: 'Ghati Lagna - Denotes power, fame, authority and social status.',
  vighati_lagna: 'Vighati Lagna - Highly sensitive sub-division used in micro-rectification.'
};

const UPAGRAHA_DESCS = {
  dhuma: 'Dhuma (Ketu Secondary) - A malefic shadow point.',
  vyatipaata: 'Vyatipaata - Shadow point representing obstacles or sudden transformations.',
  parivesha: 'Parivesha - Represents protective shield or boundaries.',
  indrachaapa: 'Indrachaapa - Shadow point indicating career or public changes.',
  upaketu: 'Upaketu - Shadow node related to spiritual endings.',
  kaala: 'Kaala (Sun Shadow) - Obstruction point.',
  mrityu: 'Mrityu (Mars Shadow) - Point of conflict or physical challenge.',
  artha_praharaka: 'Artha Praharaka (Mercury Shadow) - Point of material challenges.',
  yama_ghantaka: 'Yama Ghantaka (Jupiter Shadow) - Point of moral or financial tests.',
  gulika: 'Gulika (Saturn Shadow) - Saturnian shadow point of delay and duty.',
  maandi: 'Maandi (Saturn Shadow) - Highly critical shadow point showing pending karmas.'
};

export default function ChakrasView({ rawData }) {
  const specialLagnas = rawData?.special_lagnas;
  const upagrahas = rawData?.upagrahas;

  if (!specialLagnas && !upagrahas) {
    return (
      <div className="card" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <ShieldAlert size={48} style={{ color: 'var(--gold)', marginBottom: '16px' }} />
        <h3>Chakras & Special Lagna details not loaded.</h3>
        <p style={{ marginTop: '8px', fontSize: '13px' }}>
          Please fill out the birth form and fetch high-precision data from the API first.
        </p>
      </div>
    );
  }

  const renderLagnaTable = () => {
    if (!specialLagnas) return null;
    return (
      <div>
        <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', marginBottom: '12px', fontSize: '14px' }}>
          <Sparkles size={16} style={{ color: 'var(--gold)' }} />
          Special Lagnas (Reflective Ascendants)
        </h4>
        <div style={{ overflowX: 'auto' }}>
          <table className="astro-table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', width: '150px' }}>Lagna Name</th>
                <th style={{ textAlign: 'center', width: '100px' }}>Sign</th>
                <th style={{ textAlign: 'center', width: '100px' }}>Longitude</th>
                <th style={{ textAlign: 'left' }}>Significance</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(specialLagnas).map(([key, val]) => (
                <tr key={key}>
                  <td style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
                    {key.replace(/_/g, ' ')}
                  </td>
                  <td style={{ textAlign: 'center', color: 'var(--gold)', fontWeight: 'bold' }}>
                    {val.sign}
                  </td>
                  <td style={{ textAlign: 'center', fontFamily: 'JetBrains Mono, monospace' }}>
                    {val.longitude?.toFixed(2)}°
                  </td>
                  <td style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {SPECIAL_LAGNA_DESCS[key] || 'Calculated mathematical point.'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderUpagrahaTable = () => {
    if (!upagrahas) return null;
    return (
      <div style={{ marginTop: '24px' }}>
        <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', marginBottom: '12px', fontSize: '14px' }}>
          <AlertTriangle size={16} style={{ color: 'var(--cyan)' }} />
          Upagrahas (Shadow Planets)
        </h4>
        <div style={{ overflowX: 'auto' }}>
          <table className="astro-table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', width: '150px' }}>Upagraha Name</th>
                <th style={{ textAlign: 'center', width: '100px' }}>Sign</th>
                <th style={{ textAlign: 'center', width: '100px' }}>Longitude</th>
                <th style={{ textAlign: 'left' }}>Significance</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(upagrahas).map(([key, val]) => (
                <tr key={key}>
                  <td style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
                    {key.replace(/_/g, ' ')}
                  </td>
                  <td style={{ textAlign: 'center', color: 'var(--cyan)', fontWeight: 'bold' }}>
                    {val.sign}
                  </td>
                  <td style={{ textAlign: 'center', fontFamily: 'JetBrains Mono, monospace' }}>
                    {val.longitude?.toFixed(2)}°
                  </td>
                  <td style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {UPAGRAHA_DESCS[key] || 'Shadow planet position.'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="card" style={{ width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="card-header">
        <h3 className="card-title text-gold">Special Lagnas & Upagrahas</h3>
        <span className="subtitle">Secondary mathematical Ascendants and shadow planet coordinates</span>
      </div>

      {renderLagnaTable()}
      {renderUpagrahaTable()}
    </div>
  );
}
