<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import Scene from '$lib/Scene.svelte';
  import { rooms, experiences, reviews } from '$lib/rooms.js';
  import { addDays, brl, nextFreeStay, toIso } from '$lib/booking.js';

  let today = $state('');
  let from = $state('');
  let to = $state('');
  let guests = $state(2);
  let nextFree = $state({});

  onMount(() => {
    today = toIso(Date.now());
    from = addDays(today, 14);
    to = addDays(today, 16);
    nextFree = Object.fromEntries(rooms.map((r) => [r.slug, nextFreeStay(r.slug, today, 2)]));
  });

  const fmt = (iso) => new Date(iso + 'T00:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' });

  function onFrom() {
    if (to <= from) to = addDays(from, 1);
  }
  function search(e) {
    e.preventDefault();
    goto(`${base}/book/?from=${from}&to=${to}&guests=${guests}`);
  }

  const gallery = [
    { kind: 'valley', room: 2, seed: 4, cap: 'Sunrise from the Mirante deck', cls: 'g1' },
    { kind: 'window', room: 0, seed: 2, cap: 'Jabuticaba, morning light', cls: 'g2' },
    { kind: 'grove', room: 1, seed: 7, cap: 'The ipê grove in August', cls: 'g3' },
    { kind: 'still', room: 4, seed: 3, cap: 'Breakfast table, Casarão', cls: 'g4' },
    { kind: 'valley', room: 3, seed: 9, cap: 'Stream path to Araucária', cls: 'g5' },
    { kind: 'window', room: 4, seed: 5, cap: 'Casarão Master, arched window', cls: 'g6' },
    { kind: 'still', room: 0, seed: 8, cap: 'Coffee from our own terraces', cls: 'g7' },
    { kind: 'grove', room: 3, seed: 1, cap: 'Orchard at dusk', cls: 'g8' }
  ];
  let dlg;
  let current = $state(0);
  const show = (i) => {
    current = i;
    dlg.showModal();
  };
  const step = (d) => (current = (current + d + gallery.length) % gallery.length);
  const onKey = (e) => {
    if (e.key === 'ArrowRight') step(1);
    if (e.key === 'ArrowLeft') step(-1);
  };
</script>

<svelte:head>
  <title>Solar Ipê · Boutique hotel in the Serra da Mantiqueira</title>
  <meta name="description" content="Five rooms in a restored 1912 coffee farmhouse. Breakfast from the garden, wood-fired suppers and a view of the valley. Fictional demo hotel." />
</svelte:head>

<section class="hero">
  <div class="art"><Scene kind="valley" palette={['#f5d9b0', '#f0a56b', '#7d5a73', '#2c2c44', '#ffcf6b']} seed={11} /></div>
  <div class="shade"></div>
  <div class="wrap copy">
    <span class="eyebrow">Boutique hotel · Serra da Mantiqueira</span>
    <h1>Slow mornings in a <em>coffee farmhouse</em></h1>
    <p>Five rooms, one long table and a valley that does the talking. Built in 1912, restored with lime, oak and patience.</p>
    <form class="search" onsubmit={search} aria-label="Check availability">
      <label>Check-in<input type="date" bind:value={from} min={today} onchange={onFrom} required /></label>
      <label>Check-out<input type="date" bind:value={to} min={from ? addDays(from, 1) : today} required /></label>
      <label>Guests
        <select bind:value={guests}>
          {#each [1, 2, 3, 4] as g}<option value={g}>{g} guest{g > 1 ? 's' : ''}</option>{/each}
        </select>
      </label>
      <button class="btn gold" type="submit">Check availability</button>
    </form>
  </div>
</section>

<section class="section story wrap">
  <div>
    <span class="eyebrow">The house</span>
    <h2>A farmhouse that learned to <em>host</em></h2>
  </div>
  <div>
    <p>For ninety years Solar Ipê dried coffee for the valley. Today the terraces are quiet, the old drying deck is a sunrise loft, and the kitchen cooks what the garden gives.</p>
    <p>We keep it small on purpose: five rooms, a single breakfast sitting, and a team that knows your name by the second morning.</p>
    <dl class="facts">
      <div><dt>5</dt><dd>rooms &amp; cottage</dd></div>
      <div><dt>1912</dt><dd>year built</dd></div>
      <div><dt>1,150 m</dt><dd>altitude</dd></div>
    </dl>
  </div>
</section>

<section id="rooms" class="section tint">
  <div class="wrap">
    <span class="eyebrow">Rooms</span>
    <h2>Five ways to <em>wake up</em> here</h2>
    <div class="rooms">
      {#each rooms as r, i}
        <a class="room" href="{base}/rooms/{r.slug}/">
          <div class="pic"><Scene kind={['window', 'grove', 'valley', 'still', 'window'][i]} palette={r.palette} seed={i + 2} /></div>
          <div class="info">
            <p class="kind">{r.kind} · {r.size} m² · up to {r.guests}</p>
            <h3>{r.name}</h3>
            <p>{r.blurb}</p>
            <div class="foot">
              <span class="price">{brl(r.rate)}<small> / night</small></span>
              <span class="avail">{nextFree[r.slug] ? `Next free: ${fmt(nextFree[r.slug])}` : ' '}</span>
            </div>
          </div>
        </a>
      {/each}
    </div>
  </div>
</section>

<section id="experiences" class="section wrap">
  <span class="eyebrow">Experiences</span>
  <h2>Reasons to <em>leave the room</em></h2>
  <ul class="xp">
    {#each experiences as x}
      <li>
        <span class="tag">{x.tag}</span>
        <h3>{x.title}</h3>
        <p>{x.text}</p>
      </li>
    {/each}
  </ul>
</section>

<section id="gallery" class="section dark">
  <div class="wrap">
    <span class="eyebrow">Gallery</span>
    <h2>Light, lime &amp; <em>leaves</em></h2>
    <div class="grid">
      {#each gallery as g, i}
        <button class="tile {g.cls}" onclick={() => show(i)} aria-label="Open image: {g.cap}">
          <Scene kind={g.kind} palette={rooms[g.room].palette} seed={g.seed} />
          <span class="cap">{g.cap}</span>
        </button>
      {/each}
    </div>
  </div>
</section>

<dialog bind:this={dlg} class="lightbox" onkeydown={onKey} onclick={(e) => e.target === dlg && dlg.close()} aria-label="Gallery image">
  <div class="stage"><Scene kind={gallery[current].kind} palette={rooms[gallery[current].room].palette} seed={gallery[current].seed} label={gallery[current].cap} /></div>
  <p class="lcap">{gallery[current].cap} <span>{current + 1} / {gallery.length}</span></p>
  <div class="ctl">
    <button class="btn ghost" onclick={() => step(-1)} aria-label="Previous image">←</button>
    <button class="btn ghost" onclick={() => dlg.close()}>Close</button>
    <button class="btn ghost" onclick={() => step(1)} aria-label="Next image">→</button>
  </div>
</dialog>

<section class="section wrap">
  <span class="eyebrow">Guests say</span>
  <h2>Kind words, <em>unedited</em></h2>
  <div class="reviews">
    {#each reviews as v}
      <figure>
        <blockquote>“{v.quote}”</blockquote>
        <figcaption><strong>{v.who}</strong> · {v.trip}</figcaption>
      </figure>
    {/each}
  </div>
</section>

<section id="visit" class="section tint">
  <div class="wrap visit">
    <div>
      <span class="eyebrow">Visit</span>
      <h2>Three hours from São Paulo, <em>a world away</em></h2>
      <p>Drive up the Serra road to km 142, turn at the yellow gate and follow the coffee terraces. Transfers from São Paulo and Campinas on request.</p>
      <ul class="how">
        <li><strong>São Paulo</strong> · 3 h by car</li>
        <li><strong>Campinas</strong> · 2 h by car</li>
        <li><strong>Airport transfer</strong> · from R$&nbsp;380</li>
      </ul>
    </div>
    <div class="cta">
      <p class="big">Ready when you are.</p>
      <a class="btn gold" href="{base}/book/">Book your stay</a>
      <p class="fine">Free cancellation up to 7 days before arrival.</p>
    </div>
  </div>
</section>

<style>
  .hero {
    position: relative;
    min-height: min(100svh, 880px);
    display: flex;
    align-items: flex-end;
    color: var(--paper);
    isolation: isolate;
  }
  .art,
  .shade {
    position: absolute;
    inset: 0;
    z-index: -2;
  }
  .shade {
    z-index: -1;
    background: linear-gradient(180deg, rgba(20, 22, 38, 0.55) 0%, rgba(20, 22, 38, 0.1) 35%, rgba(20, 22, 38, 0.78) 100%);
  }
  .copy {
    padding-block: 8rem 3.5rem;
  }
  .hero h1 {
    max-width: 14ch;
  }
  .hero em {
    color: #ffd98a;
  }
  .hero .copy > p {
    max-width: 46ch;
    font-size: 1.15rem;
    margin-bottom: 2rem;
  }
  .hero .eyebrow {
    color: #ffd98a;
  }
  .search {
    display: grid;
    grid-template-columns: 1fr 1fr 0.8fr auto;
    gap: 0.75rem;
    align-items: end;
    background: rgba(251, 247, 239, 0.96);
    color: var(--ink);
    padding: 1rem;
    border-radius: 24px;
    box-shadow: var(--shadow);
    max-width: 860px;
  }
  label {
    display: grid;
    gap: 0.25rem;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--ink-soft);
  }
  input,
  select {
    font: 600 1rem var(--sans);
    color: var(--ink);
    background: #fff;
    border: 1.5px solid var(--line);
    border-radius: 12px;
    padding: 0.7rem 0.8rem;
    min-height: 48px;
    width: 100%;
  }
  .story {
    display: grid;
    grid-template-columns: 1fr 1.1fr;
    gap: 4rem;
    align-items: start;
  }
  .facts {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin: 2.5rem 0 0;
    padding-top: 1.5rem;
    border-top: 1px solid var(--line);
  }
  .facts dt {
    font: 420 2.1rem var(--serif);
    color: var(--forest);
  }
  .facts dd {
    margin: 0;
    font-size: 0.85rem;
    color: var(--ink-soft);
  }
  .tint {
    background: var(--paper);
    border-block: 1px solid var(--line);
  }
  .rooms {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 1.5rem;
    margin-top: 3rem;
  }
  .room {
    grid-column: span 2;
    display: flex;
    flex-direction: column;
    background: #fff;
    border-radius: var(--radius);
    overflow: hidden;
    text-decoration: none;
    box-shadow: var(--shadow);
    transition: transform 0.25s;
  }
  .room:nth-child(n + 4) {
    grid-column: span 3;
  }
  .room:hover {
    transform: translateY(-4px);
  }
  .pic {
    aspect-ratio: 16 / 10;
    overflow: hidden;
  }
  .info {
    padding: 1.4rem 1.5rem 1.5rem;
    display: flex;
    flex-direction: column;
    flex: 1;
  }
  .kind {
    font-size: 0.78rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    font-weight: 700;
    color: var(--gold-deep);
    margin-bottom: 0.4rem;
  }
  .info h3 {
    margin-bottom: 0.4rem;
  }
  .info p {
    color: var(--ink-soft);
    font-size: 0.97rem;
  }
  .foot {
    margin-top: auto;
    padding-top: 0.9rem;
    border-top: 1px solid var(--line);
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
  .price {
    font: 500 1.35rem var(--serif);
  }
  .price small {
    font: 500 0.8rem var(--sans);
    color: var(--ink-soft);
  }
  .avail {
    font-size: 0.82rem;
    font-weight: 700;
    color: var(--forest-2);
  }
  .xp {
    list-style: none;
    padding: 0;
    margin: 3rem 0 0;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0;
    border-top: 1px solid var(--line);
  }
  .xp li {
    padding: 1.75rem 1.5rem 1rem 0;
    border-right: 1px solid var(--line);
    padding-left: 1.5rem;
  }
  .xp li:first-child {
    padding-left: 0;
  }
  .xp li:last-child {
    border-right: 0;
  }
  .tag {
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--clay);
  }
  .xp h3 {
    margin-top: 0.6rem;
  }
  .xp p {
    color: var(--ink-soft);
    font-size: 0.97rem;
  }
  .dark {
    background: var(--forest);
    color: var(--paper);
  }
  .dark em,
  .dark .eyebrow {
    color: #f0c767;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-auto-rows: 180px;
    grid-auto-flow: dense;
    gap: 0.9rem;
    margin-top: 2.5rem;
  }
  .tile {
    position: relative;
    padding: 0;
    border: 0;
    border-radius: 16px;
    overflow: hidden;
    cursor: zoom-in;
    background: #000;
  }
  .g1 {
    grid-column: span 2;
    grid-row: span 2;
  }
  .g4,
  .g6 {
    grid-row: span 2;
  }
  .g5,
  .g7,
  .g8 {
    grid-column: span 2;
  }
  .cap {
    position: absolute;
    inset: auto 0 0 0;
    padding: 2rem 1rem 0.8rem;
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
    color: #fff;
    font: 600 0.85rem var(--sans);
    text-align: left;
    opacity: 0;
    transition: opacity 0.25s;
  }
  .tile:hover .cap,
  .tile:focus-visible .cap {
    opacity: 1;
  }
  .lightbox {
    border: 0;
    border-radius: 20px;
    padding: 1rem;
    width: min(880px, 94vw);
    background: var(--paper);
  }
  .lightbox::backdrop {
    background: rgba(12, 20, 16, 0.82);
  }
  .stage {
    aspect-ratio: 4 / 3;
    border-radius: 12px;
    overflow: hidden;
  }
  .lcap {
    display: flex;
    justify-content: space-between;
    margin: 0.9rem 0.2rem;
    font-weight: 600;
  }
  .lcap span {
    color: var(--ink-soft);
    font-weight: 500;
  }
  .ctl {
    display: flex;
    justify-content: space-between;
    gap: 0.5rem;
  }
  .reviews {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
    margin-top: 2.5rem;
  }
  figure {
    margin: 0;
    padding: 2rem;
    background: #fff;
    border-radius: var(--radius);
    box-shadow: var(--shadow);
  }
  blockquote {
    margin: 0 0 1.2rem;
    font: 420 1.3rem/1.35 var(--serif);
  }
  figcaption {
    font-size: 0.88rem;
    color: var(--ink-soft);
  }
  .visit {
    display: grid;
    grid-template-columns: 1.3fr 1fr;
    gap: 4rem;
    align-items: center;
  }
  .how {
    list-style: none;
    padding: 0;
    margin: 1.5rem 0 0;
  }
  .how li {
    padding: 0.7rem 0;
    border-bottom: 1px solid var(--line);
  }
  .cta {
    background: var(--forest);
    color: var(--paper);
    padding: 2.5rem;
    border-radius: 24px;
    text-align: center;
  }
  .big {
    font: 420 2rem/1.15 var(--serif);
  }
  .fine {
    margin: 1rem 0 0;
    font-size: 0.85rem;
    color: #cfc8b4;
  }

  @media (max-width: 980px) {
    .search {
      grid-template-columns: 1fr 1fr;
    }
    .search .btn {
      grid-column: 1 / -1;
    }
    .story,
    .visit {
      grid-template-columns: 1fr;
      gap: 2rem;
    }
    .rooms {
      grid-template-columns: 1fr 1fr;
    }
    .room,
    .room:nth-child(n + 4) {
      grid-column: span 1;
    }
    .xp {
      grid-template-columns: 1fr 1fr;
    }
    .xp li:nth-child(2) {
      border-right: 0;
    }
    .xp li:nth-child(3) {
      padding-left: 0;
    }
    .reviews {
      grid-template-columns: 1fr;
    }
    .grid {
      grid-template-columns: repeat(2, 1fr);
      grid-auto-rows: 150px;
    }
    .g5,
    .g7,
    .g8 {
      grid-column: span 2;
    }
  }
  @media (max-width: 620px) {
    .rooms,
    .xp {
      grid-template-columns: 1fr;
    }
    .xp li {
      border-right: 0;
      padding-left: 0;
      border-bottom: 1px solid var(--line);
    }
    .search {
      grid-template-columns: 1fr;
    }
    .copy {
      padding-top: 6rem;
    }
    .facts dt {
      font-size: 1.6rem;
    }
    .cap {
      opacity: 1;
    }
  }
</style>
