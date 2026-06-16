import * as Astronomy from 'astronomy-engine';

const date = new Date(Date.UTC(2026, 5, 15, 12, 0, 0)); // June 15, 2026, 12:00:00 UTC (17:30 IST)
const astroTime = Astronomy.MakeTime(date);
const ut_days = astroTime.ut; // Days since J2000.0

const T = ut_days / 36525;
const ayanamsa = 23.858083 + 1.39697128 * T + 0.00030878 * T * T;

// Coordinates for New Delhi: Lat 28.6139 N, Lon 77.2090 E
const lat = 28.6139;
const lon = 77.2090;

// GMST calculation using Meeus formula where ut_days is days since J2000
const gmst = (280.46061837 + 360.98564736629 * ut_days + 0.000387933 * T * T - (T * T * T) / 38710000) % 360;
const normalized_gmst = (gmst + 360) % 360;
const lmst = (normalized_gmst + lon + 360) % 360;

const theta_L = (lmst * Math.PI) / 180;
const eps = (23.4392911 - 0.0130041667 * T - 0.00000016389 * T * T + 0.0000005036 * T * T * T) * Math.PI / 180;
const phi = (lat * Math.PI) / 180;

const y = Math.cos(theta_L);
const x = -Math.sin(theta_L) * Math.cos(eps) - Math.tan(phi) * Math.sin(eps);
let ascTropical = Math.atan2(y, x) * 180 / Math.PI;
ascTropical = (ascTropical + 360) % 360;
const ascSidereal = (ascTropical - ayanamsa + 360) % 360;

console.log("ut_days since J2000:", ut_days);
console.log("T:", T);
console.log("Ayanamsa Lahiri:", ayanamsa);
console.log("GMST:", normalized_gmst);
console.log("LMST:", lmst);
console.log("Ascendant Tropical:", ascTropical);
console.log("Ascendant Sidereal:", ascSidereal);
console.log("Ascendant Sidereal Rasi:", Math.floor(ascSidereal / 30));
console.log("Ascendant Sidereal Deg inside Rasi:", ascSidereal % 30);
