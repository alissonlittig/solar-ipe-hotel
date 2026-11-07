<script>
  import '../app.css';
  import { base } from '$app/paths';
  import { page } from '$app/state';

  let { children } = $props();
  let open = $state(false);
  const links = [
    ['/#rooms', 'Rooms'],
    ['/#experiences', 'Experiences'],
    ['/#gallery', 'Gallery'],
    ['/#visit', 'Visit']
  ];
  const solid = $derived(page.url.pathname !== base + '/');
</script>

<a class="skip" href="#main">Skip to content</a>

<header class:solid>
  <div class="wrap bar">
    <a class="brand" href="{base}/" aria-label="Solar Ipê, home">
      <svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true"><circle cx="16" cy="12" r="6" fill="currentColor" /><path d="M16 17v11M16 22l-6-4M16 24l6-5" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" /></svg>
      <span>Solar Ipê</span>
    </a>
    <button class="menu" aria-expanded={open} aria-controls="nav" onclick={() => (open = !open)}>{open ? 'Close' : 'Menu'}</button>
    <nav id="nav" class:open aria-label="Main">
      {#each links as [href, label]}
        <a href="{base}{href}" onclick={() => (open = false)}>{label}</a>
      {/each}
      <a class="btn gold small" href="{base}/book/" onclick={() => (open = false)}>Book a stay</a>
    </nav>
  </div>
</header>

<main id="main">
  {@render children()}
</main>

<footer>
  <div class="wrap foot">
    <div>
      <p class="logo">Solar Ipê</p>
      <p>Boutique hotel in a restored 1912 coffee farmhouse.<br />Serra da Mantiqueira, Minas Gerais.</p>
    </div>
    <div>
      <p class="h">Stay</p>
      <p><a href="{base}/#rooms">Rooms</a><br /><a href="{base}/book/">Book online</a><br /><a href="{base}/#gallery">Gallery</a></p>
    </div>
    <div>
      <p class="h">Good to know</p>
      <p>Check-in from 3 p.m., check-out by noon.<br />Breakfast included. Pets in the cottage only.</p>
    </div>
  </div>
  <div class="wrap legal">
    <p>Solar Ipê is a fictional hotel created as a website and booking-flow demo. Names, prices, reviews and availability are made up; reservations never leave your browser.</p>
  </div>
</footer>

<style>
  header {
    position: absolute;
    inset: 0 0 auto 0;
    z-index: 20;
    color: var(--paper);
  }
  header.solid {
    position: sticky;
    background: color-mix(in srgb, var(--cream) 92%, transparent);
    backdrop-filter: blur(10px);
    color: var(--forest);
    border-bottom: 1px solid var(--line);
  }
  .bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 76px;
  }
  .brand {
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    font: 500 1.5rem var(--serif);
    text-decoration: none;
    letter-spacing: -0.01em;
  }
  nav {
    display: flex;
    align-items: center;
    gap: 2rem;
  }
  nav a:not(.btn) {
    text-decoration: none;
    font-weight: 600;
    font-size: 0.95rem;
    padding: 0.5rem 0;
    border-bottom: 1.5px solid transparent;
  }
  nav a:not(.btn):hover {
    border-color: currentColor;
  }
  .small {
    min-height: 42px;
    padding: 0.5rem 1.2rem;
  }
  .menu {
    display: none;
    background: none;
    color: inherit;
    border: 1.5px solid currentColor;
    border-radius: 999px;
    padding: 0.5rem 1.1rem;
    font: 700 0.9rem var(--sans);
    min-height: 44px;
    cursor: pointer;
  }
  @media (max-width: 820px) {
    .menu {
      display: block;
    }
    nav {
      display: none;
      position: absolute;
      inset: 76px 0 auto 0;
      flex-direction: column;
      align-items: stretch;
      gap: 0;
      background: var(--paper);
      color: var(--forest);
      padding: 0.5rem 1.25rem 1.5rem;
      border-bottom: 1px solid var(--line);
      box-shadow: var(--shadow);
    }
    nav.open {
      display: flex;
    }
    nav a:not(.btn) {
      padding: 1rem 0;
      border-bottom: 1px solid var(--line);
    }
    nav .btn {
      margin-top: 1rem;
    }
  }
  footer {
    background: var(--forest);
    color: #e7e0cf;
    padding-top: 4rem;
    font-size: 0.97rem;
  }
  .foot {
    display: grid;
    grid-template-columns: 1.4fr 1fr 1.2fr;
    gap: 2.5rem;
  }
  .logo {
    font: 500 1.9rem var(--serif);
    color: var(--paper);
    margin-bottom: 0.4rem;
  }
  .h {
    font-size: 0.78rem;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    font-weight: 700;
    color: var(--gold);
  }
  footer a {
    text-decoration: none;
  }
  footer a:hover {
    text-decoration: underline;
  }
  .legal {
    border-top: 1px solid rgba(255, 255, 255, 0.14);
    margin-top: 3rem;
    padding-block: 1.5rem 2rem;
    font-size: 0.85rem;
    color: #c4bda9;
  }
  .legal p {
    margin: 0;
    max-width: 70ch;
  }
  @media (max-width: 760px) {
    .foot {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
  }
</style>
