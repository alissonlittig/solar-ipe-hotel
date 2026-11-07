import { describe, it, expect } from 'vitest';
import { addDays, nightsBetween, nightRate, quote, validateStay, isRangeFree, isSeededBooked, nextFreeStay, reference } from '../src/lib/booking.js';
import { rooms, getRoom } from '../src/lib/rooms.js';

const room = getRoom('jabuticaba');

describe('dates', () => {
  it('adds days across month boundaries', () => {
    expect(addDays('2026-02-27', 3)).toBe('2026-03-02');
    expect(addDays('2026-11-01', 1)).toBe('2026-11-02');
    expect(nightsBetween('2026-10-30', '2026-11-03')).toBe(4);
  });
});

describe('pricing', () => {
  it('applies weekend and season surcharges', () => {
    expect(nightRate(room, '2026-09-09')).toBe(690); // Wednesday, off season
    expect(nightRate(room, '2026-09-11')).toBe(794); // Friday +15 %
    expect(nightRate(room, '2026-12-09')).toBe(828); // Wednesday, summer +20 %
  });
  it('quotes totals with long-stay discount and tax', () => {
    const q = quote(room, '2026-09-07', '2026-09-12');
    expect(q.nights).toBe(5);
    expect(q.discount).toBe(Math.round(q.subtotal * 0.1));
    expect(q.total).toBe(q.subtotal - q.discount + q.tax);
    expect(quote(room, '2026-09-07', '2026-09-09').discount).toBe(0);
  });
});

describe('validation', () => {
  it('rejects bad stays', () => {
    expect(validateStay(room, '2026-09-10', '2026-09-10', 2, '2026-09-01')).toMatch(/after/);
    expect(validateStay(room, '2026-08-01', '2026-08-03', 2, '2026-09-01')).toMatch(/past/);
    expect(validateStay(room, '2026-09-10', '2026-09-12', 3, '2026-09-01')).toMatch(/sleeps up to 2/);
    expect(validateStay(room, '2026-09-12', '2026-09-13', 2, '2026-09-01')).toMatch(/2-night/);
    expect(validateStay(room, '2026-09-01', '2026-09-30', 2, '2026-09-01')).toMatch(/limited/);
    expect(validateStay(room, '2026-09-14', '2026-09-16', 2, '2026-09-01')).toBeNull();
  });
});

describe('availability', () => {
  it('is deterministic and leaves a realistic share of nights free', () => {
    let booked = 0;
    for (let i = 0; i < 365; i++) if (isSeededBooked('mirante', addDays('2026-11-01', i))) booked++;
    expect(booked).toBeGreaterThan(40);
    expect(booked).toBeLessThan(200);
    expect(isSeededBooked('mirante', '2026-12-05')).toBe(isSeededBooked('mirante', '2026-12-05'));
  });
  it('respects the guest own bookings and finds a next free stay', () => {
    for (const r of rooms) {
      const from = nextFreeStay(r.slug, '2026-11-10', 2);
      expect(from).not.toBeNull();
      expect(isRangeFree(r.slug, from, addDays(from, 2))).toBe(true);
      const mine = [{ slug: r.slug, from, to: addDays(from, 2) }];
      expect(isRangeFree(r.slug, from, addDays(from, 2), mine)).toBe(false);
    }
  });
  it('makes stable references', () => {
    expect(reference(room, '2026-09-14', 1)).toBe(reference(room, '2026-09-14', 1));
    expect(reference(room, '2026-09-14', 1)).toMatch(/^SI-[0-9A-Z]{5}$/);
  });
});
