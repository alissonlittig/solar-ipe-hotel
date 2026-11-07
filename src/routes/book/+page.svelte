<script>
  import { onMount } from 'svelte';
  import { base } from '$app/paths';
  import Calendar from '$lib/Calendar.svelte';
  import { rooms, getRoom } from '$lib/rooms.js';
  import { addDays, brl, isRangeFree, nextFreeStay, quote, reference, toIso, validateStay } from '$lib/booking.js';
  import { reservations } from '$lib/store.svelte.js';

  let today = $state('');
  let slug = $state(rooms[0].slug);
  let from = $state('');
  let to = $state('');
  let guests = $state(2);
  let name = $state('');
  let email = $state('');
  let notes = $state('');
  let touched = $state(false);
  let done = $state(null);

  const room = $derived(getRoom(slug));
  const error = $derived(validateStay(room, from, to, guests, today));
  const free = $derived(from && to ? isRangeFree(slug, from, to, reservations.list) : false);
  const q = $derived(!error && free ? quote(room, from, to) : null);
  const emailOk = $derived(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email));
  const formOk = $derived(q && name.trim().length > 1 && emailOk);

  onMount(() => {
    reservations.init();
    today = toIso(Date.now());
    const p = new URLSearchParams(location.search);
    if (getRoom(p.get('room'))) slug = p.get('room');
    const g = Number(p.get('guests'));
    if (g >= 1 && g <= 4) guests = g;
    const f = p.get('from');
    const t = p.get('to');
    if (/^\d{4}-\d{2}-\d{2}$/.test(f ?? '') && /^\d{4}-\d{2}-\d{2}$/.test(t ?? '') && f >= today) {
      from = f;
      to = t;
    }
  });

  // Keep the guest count valid when switching to a smaller room.
  $effect(() => {
    if (guests > room.guests) guests = room.guests;
  });

  const long = (iso) => new Date(iso + 'T00:00:00Z').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });

  function suggest() {
    const f = nextFreeStay(slug, addDays(today, 1), 2, reservations.list);
    if (f) {
      from = f;
      to = addDays(f, 2);
    }
  }

  function confirm(e) {
    e.preventDefault();
    touched = true;
    if (!formOk) return;
    const ref = reference(room, from, Date.now());
    const r = { ref, slug, from, to, guests, name: name.trim(), total: q.total, nights: q.nights };
    reservations.add(r);
    done = r;
  }

  function ics(r) {
    const d = (iso) => iso.replaceAll('-', '');
    const body = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Solar Ipe//Demo//EN', 'BEGIN:VEVENT', `UID:${r.ref}@solar-ipe.demo`, `DTSTAMP:${d(today)}T000000Z`, `DTSTART;VALUE=DATE:${d(r.from)}`, `DTEND;VALUE=DATE:${d(r.to)}`, `SUMMARY:Solar Ipê · ${getRoom(r.slug).name} (${r.ref})`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([body], { type: 'text/calendar' }));
    a.download = `${r.ref}.ics`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function again() {
    done = null;
    from = to = notes = '';
    touched = false;
  }
</script>

<svelte:head>
  <title>Book your stay · Solar Ipê</title>
  <meta name="description" content="Pick a room, see live availability and book. Demo booking flow, nothing is charged." />
</svelte:head>

<div class="wrap page">
  <span class="eyebrow">Reservations</span>
  <h1>Book your stay</h1>
  <p class="lead">Choose a room and your dates. Prices include breakfast. This is a demo: nothing is charged and nothing leaves your browser.</p>

  {#if done}
    <section class="ok" aria-live="polite">
      <p class="eyebrow">Reservation confirmed</p>
      <h2>See you soon, {done.name.split(' ')[0]}.</h2>
      <p class="ref">{done.ref}</p>
      <p>{getRoom(done.slug).name} · {long(done.from)} → {long(done.to)} · {done.nights} night{done.nights > 1 ? 's' : ''} · {done.guests} guest{done.guests > 1 ? 's' : ''}</p>
      <p><strong>{brl(done.total)}</strong> to pay at the property.</p>
      <div class="acts">
        <button class="btn gold" onclick={() => ics(done)}>Add to calendar (.ics)</button>
        <button class="btn ghost" onclick={again}>Make another booking</button>
      </div>
    </section>
  {:else}
    <div class="layout">
      <div class="left">
        <fieldset class="rooms">
          <legend>1 · Room</legend>
          {#each rooms as r}
            <label class:on={slug === r.slug}>
              <input type="radio" name="room" value={r.slug} bind:group={slug} onchange={() => (to = from = '')} />
              <span class="n">{r.name}</span>
              <span class="k">{r.kind} · up to {r.guests}</span>
              <span class="p">{brl(r.rate)}</span>
            </label>
          {/each}
        </fieldset>

        <h2 class="step">2 · Dates</h2>
        {#if today}
          {#key slug}
            <Calendar {room} {today} mine={reservations.list} bind:from bind:to />
          {/key}
        {/if}
        <button type="button" class="link" onclick={suggest}>Find the next free 2-night stay</button>
      </div>

      <form class="right" onsubmit={confirm} novalidate>
        <h2 class="step">3 · Your stay</h2>
        <div class="sum">
          <div class="dates">
            <div><span>Check-in</span><strong>{from ? long(from) : '—'}</strong></div>
            <div><span>Check-out</span><strong>{to ? long(to) : '—'}</strong></div>
          </div>
          <label class="f">Guests
            <select bind:value={guests}>
              {#each Array.from({ length: room.guests }, (_, i) => i + 1) as g}<option value={g}>{g}</option>{/each}
            </select>
          </label>

          {#if from && to && error}
            <p class="msg" role="alert">{error}</p>
          {:else if from && to && !free}
            <p class="msg" role="alert">Those dates overlap a booked night. Pick other dates on the calendar.</p>
          {:else if !to}
            <p class="hint">{from ? 'Now choose your check-out date.' : 'Choose your check-in date on the calendar.'}</p>
          {/if}

          {#if q}
            <table>
              <tbody>
                <tr><td>{room.name} × {q.nights} night{q.nights > 1 ? 's' : ''}</td><td>{brl(q.subtotal)}</td></tr>
                {#if q.discount}<tr class="disc"><td>Long-stay discount (10%)</td><td>−{brl(q.discount)}</td></tr>{/if}
                <tr><td>Municipal tax (3%)</td><td>{brl(q.tax)}</td></tr>
                <tr class="tot"><td>Total</td><td>{brl(q.total)}</td></tr>
              </tbody>
            </table>
          {/if}
        </div>

        <label class="f">Full name<input bind:value={name} autocomplete="name" required aria-invalid={touched && name.trim().length < 2} /></label>
        <label class="f">Email<input type="email" bind:value={email} autocomplete="email" required aria-invalid={touched && !emailOk} /></label>
        <label class="f">Requests <span class="opt">(optional)</span><textarea bind:value={notes} rows="2" placeholder="Late arrival, dietary needs, celebrations…"></textarea></label>
        {#if touched && !formOk}
          <p class="msg" role="alert">{!q ? 'Select valid dates first.' : 'Please enter your name and a valid email.'}</p>
        {/if}
        <button class="btn gold full" type="submit">Confirm reservation</button>
        <p class="fine">Demo only. Free cancellation up to 7 days before arrival.</p>
      </form>
    </div>
  {/if}

  {#if reservations.list.length}
    <section class="mine">
      <h2>Your reservations</h2>
      <ul>
        {#each reservations.list as r (r.ref)}
          <li>
            <div><strong>{r.ref}</strong> · {getRoom(r.slug).name}<br /><span>{long(r.from)} → {long(r.to)} · {brl(r.total)}</span></div>
            <button class="btn ghost small" onclick={() => reservations.cancel(r.ref)}>Cancel</button>
          </li>
        {/each}
      </ul>
    </section>
  {/if}
</div>

<style>
  .page {
    padding-block: 3rem 6rem;
  }
  .lead {
    max-width: 58ch;
    color: var(--ink-soft);
    font-size: 1.15rem;
    margin-bottom: 2.5rem;
  }
  .layout {
    display: grid;
    grid-template-columns: 1.15fr 1fr;
    gap: 3rem;
    align-items: start;
  }
  .right {
    position: sticky;
    top: 96px;
    background: var(--paper);
    border: 1px solid var(--line);
    border-radius: 24px;
    padding: 1.75rem;
    box-shadow: var(--shadow);
  }
  .step {
    font-size: 1.15rem;
    font-family: var(--sans);
    font-weight: 800;
    letter-spacing: 0.04em;
    margin: 0 0 1rem;
  }
  fieldset {
    border: 0;
    padding: 0;
    margin: 0 0 2rem;
    display: grid;
    gap: 0.6rem;
  }
  legend {
    font-weight: 800;
    letter-spacing: 0.04em;
    margin-bottom: 0.9rem;
    padding: 0;
    font-size: 1.15rem;
  }
  .rooms label {
    display: grid;
    grid-template-columns: 1fr auto;
    grid-template-areas: 'n p' 'k k';
    padding: 0.9rem 1.1rem;
    border: 1.5px solid var(--line);
    border-radius: 14px;
    background: #fff;
    cursor: pointer;
    position: relative;
  }
  .rooms label.on {
    border-color: var(--forest);
    box-shadow: 0 0 0 3px rgba(31, 58, 46, 0.14);
  }
  .rooms input {
    position: absolute;
    opacity: 0;
    inset: 0;
    cursor: pointer;
  }
  .rooms label:has(input:focus-visible) {
    outline: 3px solid var(--gold);
    outline-offset: 2px;
  }
  .n {
    grid-area: n;
    font: 500 1.2rem var(--serif);
  }
  .p {
    grid-area: p;
    font-weight: 700;
  }
  .k {
    grid-area: k;
    font-size: 0.85rem;
    color: var(--ink-soft);
  }
  .link {
    background: none;
    border: 0;
    padding: 0.8rem 0;
    min-height: 44px;
    color: var(--forest);
    font: 700 0.95rem var(--sans);
    text-decoration: underline;
    text-underline-offset: 4px;
    cursor: pointer;
  }
  .dates {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.8rem;
    margin-bottom: 1rem;
  }
  .dates div {
    background: #fff;
    border: 1px solid var(--line);
    border-radius: 12px;
    padding: 0.6rem 0.8rem;
  }
  .dates span,
  .f {
    display: block;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--ink-soft);
  }
  .dates strong {
    display: block;
    font-size: 0.95rem;
    color: var(--ink);
    letter-spacing: 0;
    text-transform: none;
  }
  .f {
    margin-bottom: 0.9rem;
  }
  .opt {
    text-transform: none;
    letter-spacing: 0;
    font-weight: 500;
  }
  input:not([type='radio']),
  select,
  textarea {
    display: block;
    width: 100%;
    margin-top: 0.3rem;
    font: 600 1rem var(--sans);
    color: var(--ink);
    background: #fff;
    border: 1.5px solid var(--line);
    border-radius: 12px;
    padding: 0.7rem 0.8rem;
    min-height: 48px;
  }
  textarea {
    resize: vertical;
    font-weight: 500;
  }
  [aria-invalid='true'] {
    border-color: #b3261e !important;
  }
  .msg {
    background: #fbe9e6;
    color: #7a1a12;
    border-radius: 10px;
    padding: 0.7rem 0.9rem;
    font-size: 0.92rem;
    font-weight: 600;
  }
  .hint {
    color: var(--ink-soft);
    font-size: 0.92rem;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 0.5rem 0 1.3rem;
    font-size: 0.97rem;
  }
  td {
    padding: 0.4rem 0;
    border-bottom: 1px solid var(--line);
  }
  td:last-child {
    text-align: right;
    font-variant-numeric: tabular-nums;
  }
  .disc td {
    color: var(--forest-2);
  }
  .tot td {
    font: 500 1.35rem var(--serif);
    border-bottom: 0;
    padding-top: 0.8rem;
  }
  .full {
    width: 100%;
  }
  .fine {
    margin: 0.8rem 0 0;
    font-size: 0.8rem;
    color: var(--ink-soft);
    text-align: center;
  }
  .ok {
    background: var(--forest);
    color: var(--paper);
    padding: clamp(1.75rem, 5vw, 3.5rem);
    border-radius: 28px;
  }
  .ok .eyebrow {
    color: #f0c767;
  }
  .ref {
    font: 500 clamp(2rem, 8vw, 3.4rem) var(--serif);
    letter-spacing: 0.08em;
    color: #ffd98a;
    margin: 0.5rem 0 1rem;
  }
  .acts {
    display: flex;
    gap: 0.8rem;
    flex-wrap: wrap;
    margin-top: 1.5rem;
  }
  .ok .ghost {
    color: var(--paper);
    border-color: var(--paper);
  }
  .ok .ghost:hover {
    background: var(--paper);
    color: var(--forest);
  }
  .mine {
    margin-top: 4rem;
  }
  .mine h2 {
    font-size: 1.8rem;
  }
  .mine ul {
    list-style: none;
    padding: 0;
    display: grid;
    gap: 0.7rem;
  }
  .mine li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.3rem;
    background: #fff;
    border: 1px solid var(--line);
    border-radius: 14px;
  }
  .mine li span {
    color: var(--ink-soft);
    font-size: 0.9rem;
  }
  .small {
    min-height: 40px;
    padding: 0.4rem 1.1rem;
  }
  @media (max-width: 900px) {
    .layout {
      grid-template-columns: minmax(0, 1fr);
    }
    .right {
      position: static;
    }
  }
</style>
