<script>
  import { base } from '$app/paths';
  import Scene from '$lib/Scene.svelte';
  import { rooms } from '$lib/rooms.js';
  import { brl } from '$lib/booking.js';

  let { data } = $props();
  const room = $derived(data.room);
  const kinds = ['window', 'grove', 'valley', 'still', 'window'];
  const others = $derived(rooms.filter((r) => r.slug !== room.slug).slice(0, 3));
</script>

<svelte:head>
  <title>{room.name} · {room.kind} · Solar Ipê</title>
  <meta name="description" content={room.blurb} />
</svelte:head>

<div class="wrap page">
  <nav class="crumbs" aria-label="Breadcrumb"><a href="{base}/#rooms">Rooms</a> / <span>{room.name}</span></nav>
  <div class="top">
    <div>
      <span class="eyebrow">{room.kind}</span>
      <h1>{room.name}</h1>
      <p class="lead">{room.blurb}</p>
    </div>
    <aside class="card">
      <p class="from">from</p>
      <p class="price">{brl(room.rate)}<small> / night</small></p>
      <p class="note">Breakfast included · up to {room.guests} guests</p>
      <a class="btn gold" href="{base}/book/?room={room.slug}">Check dates &amp; book</a>
    </aside>
  </div>

  <div class="hero"><Scene kind={kinds[data.index]} palette={room.palette} seed={data.index + 2} label="Illustration of {room.name}" /></div>

  <div class="body">
    <div>
      <h2>The room</h2>
      <p>{room.long}</p>
    </div>
    <div>
      <h2>At a glance</h2>
      <dl class="spec">
        <div><dt>Size</dt><dd>{room.size} m²</dd></div>
        <div><dt>Sleeps</dt><dd>{room.guests}</dd></div>
        <div><dt>Bed</dt><dd>{room.bed}</dd></div>
        <div><dt>View</dt><dd>{room.view}</dd></div>
      </dl>
      <ul class="feat">
        {#each room.features as f}<li>{f}</li>{/each}
      </ul>
    </div>
  </div>

  <h2 class="more">Other rooms</h2>
  <div class="others">
    {#each others as r}
      <a href="{base}/rooms/{r.slug}/"><strong>{r.name}</strong><span>{r.kind} · {brl(r.rate)}</span></a>
    {/each}
  </div>
</div>

<style>
  .page {
    padding-block: 2rem 6rem;
  }
  .crumbs {
    font-size: 0.85rem;
    color: var(--ink-soft);
    margin-bottom: 2rem;
  }
  .top {
    display: grid;
    grid-template-columns: 1.6fr 1fr;
    gap: 3rem;
    align-items: end;
  }
  h1 {
    font-size: clamp(2.6rem, 6vw, 4.6rem);
  }
  .lead {
    font-size: 1.2rem;
    color: var(--ink-soft);
    max-width: 52ch;
  }
  .card {
    background: var(--paper);
    border: 1px solid var(--line);
    border-radius: 20px;
    padding: 1.6rem;
    box-shadow: var(--shadow);
  }
  .from,
  .note {
    margin: 0;
    font-size: 0.85rem;
    color: var(--ink-soft);
  }
  .price {
    font: 420 2.4rem var(--serif);
    margin: 0 0 0.3rem;
  }
  .price small {
    font: 500 0.9rem var(--sans);
    color: var(--ink-soft);
  }
  .card .btn {
    width: 100%;
    margin-top: 1.2rem;
  }
  .hero {
    aspect-ratio: 21 / 9;
    border-radius: 24px;
    overflow: hidden;
    margin: 2.5rem 0 3rem;
  }
  .body {
    display: grid;
    grid-template-columns: 1.3fr 1fr;
    gap: 3rem;
  }
  .body h2 {
    font-size: 1.8rem;
  }
  .spec {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin: 0 0 1.5rem;
  }
  .spec div {
    border-top: 1px solid var(--line);
    padding-top: 0.6rem;
  }
  .spec dt {
    font-size: 0.72rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    font-weight: 700;
    color: var(--ink-soft);
  }
  .spec dd {
    margin: 0;
    font-weight: 600;
  }
  .feat {
    margin: 0;
    padding: 0;
    list-style: none;
    display: grid;
    gap: 0.5rem;
  }
  .feat li {
    padding-left: 1.6rem;
    position: relative;
  }
  .feat li::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0.62em;
    width: 0.8rem;
    height: 2px;
    background: var(--gold);
  }
  .more {
    margin-top: 5rem;
    font-size: 1.8rem;
  }
  .others {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }
  .others a {
    display: flex;
    flex-direction: column;
    padding: 1.2rem 1.4rem;
    border: 1px solid var(--line);
    border-radius: 16px;
    background: #fff;
    text-decoration: none;
  }
  .others strong {
    font: 500 1.3rem var(--serif);
  }
  .others span {
    color: var(--ink-soft);
    font-size: 0.9rem;
  }
  .others a:hover {
    border-color: var(--forest);
  }
  @media (max-width: 860px) {
    .top,
    .body {
      grid-template-columns: 1fr;
      gap: 2rem;
    }
    .hero {
      aspect-ratio: 4 / 3;
    }
    .others {
      grid-template-columns: 1fr;
    }
  }
</style>
