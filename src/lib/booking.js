// Pure booking logic: dates are ISO strings (YYYY-MM-DD), arithmetic in UTC to avoid DST drift.
const DAY = 86400000;
const toMs = (iso) => Date.parse(iso + 'T00:00:00Z');
export const toIso = (ms) => new Date(ms).toISOString().slice(0, 10);
export const addDays = (iso, n) => toIso(toMs(iso) + n * DAY);
export const nightsBetween = (a, b) => Math.round((toMs(b) - toMs(a)) / DAY);
export const weekday = (iso) => new Date(toMs(iso)).getUTCDay();

function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295;
}

/** Seeded "already reserved" nights: one block of 2-5 nights in ~60% of weeks, stable per room. */
export function isSeededBooked(slug, iso) {
  const base = Math.floor(toMs(iso) / DAY);
  for (let back = 0; back <= 4; back++) {
    const start = base - back;
    const week = Math.floor(start / 7);
    if (hash(`${slug}:${week}`) > 0.6) continue;
    const startDay = week * 7 + Math.floor(hash(`${slug}:s:${week}`) * 7);
    const len = 2 + Math.floor(hash(`${slug}:l:${week}`) * 4);
    if (start === startDay && back < len) return true;
  }
  return false;
}

export function isNightFree(slug, iso, mine = []) {
  if (isSeededBooked(slug, iso)) return false;
  return !mine.some((b) => b.slug === slug && iso >= b.from && iso < b.to);
}

export function isRangeFree(slug, from, to, mine = []) {
  const n = nightsBetween(from, to);
  if (n < 1) return false;
  for (let i = 0; i < n; i++) if (!isNightFree(slug, addDays(from, i), mine)) return false;
  return true;
}

export function nextFreeStay(slug, afterIso, nights = 2, mine = [], limit = 120) {
  for (let i = 0; i < limit; i++) {
    const from = addDays(afterIso, i);
    if (isRangeFree(slug, from, addDays(from, nights), mine)) return from;
  }
  return null;
}

/** Fri/Sat +15 %; Dec-Feb and July +20 % (stackable). */
export function nightRate(room, iso) {
  const d = weekday(iso);
  const m = Number(iso.slice(5, 7));
  let pct = 100; // integer percent avoids float drift
  if (d === 5 || d === 6) pct = (pct * 115) / 100;
  if (m === 12 || m <= 2 || m === 7) pct = (pct * 120) / 100;
  return Math.round((room.rate * pct) / 100);
}

export const MIN_STAY_WEEKEND = 2;
export const MAX_NIGHTS = 14;

export function validateStay(room, from, to, guests, today) {
  if (!from || !to) return 'Choose your dates.';
  const n = nightsBetween(from, to);
  if (n < 1) return 'Check-out must be after check-in.';
  if (n > MAX_NIGHTS) return `Stays are limited to ${MAX_NIGHTS} nights online.`;
  if (today && from < today) return 'Check-in cannot be in the past.';
  if (guests < 1 || guests > room.guests) return `${room.name} sleeps up to ${room.guests} guests.`;
  const hasSaturday = Array.from({ length: n }, (_, i) => weekday(addDays(from, i))).some((d) => d === 6);
  if (hasSaturday && n < MIN_STAY_WEEKEND) return 'Saturday nights require a 2-night minimum stay.';
  return null;
}

export function quote(room, from, to) {
  const n = nightsBetween(from, to);
  const lines = Array.from({ length: n }, (_, i) => {
    const date = addDays(from, i);
    return { date, price: nightRate(room, date) };
  });
  const subtotal = lines.reduce((s, l) => s + l.price, 0);
  const discount = n >= 5 ? Math.round(subtotal * 0.1) : 0;
  const tax = Math.round((subtotal - discount) * 0.03);
  return { nights: n, lines, subtotal, discount, tax, total: subtotal - discount + tax };
}

export const brl = (v) => 'R$ ' + v.toLocaleString('pt-BR');

export function reference(room, from, seed = Date.now()) {
  const code = Math.floor(hash(`${room.slug}${from}${seed}`) * 36 ** 5).toString(36).toUpperCase().padStart(5, '0');
  return `SI-${code}`;
}
