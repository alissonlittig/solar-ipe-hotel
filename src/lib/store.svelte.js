// Reservations live in the visitor's browser only (localStorage); nothing is sent anywhere.
const KEY = 'solar-ipe:reservations:v1';

function load() {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? '[]');
    return Array.isArray(v) ? v : [];
  } catch {
    return []; // corrupted storage: start clean rather than crash the booking page
  }
}

class Reservations {
  list = $state([]);
  ready = $state(false);

  init() {
    this.list = load();
    this.ready = true;
  }
  add(r) {
    this.list = [...this.list, r];
    localStorage.setItem(KEY, JSON.stringify(this.list));
  }
  cancel(ref) {
    this.list = this.list.filter((r) => r.ref !== ref);
    localStorage.setItem(KEY, JSON.stringify(this.list));
  }
}

export const reservations = new Reservations();
