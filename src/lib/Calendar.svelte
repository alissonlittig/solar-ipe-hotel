<script>
  import { addDays, isNightFree, isRangeFree, nightRate, toIso, weekday } from './booking.js';
  import { brl } from './booking.js';

  let { room, today, mine = [], from = $bindable(''), to = $bindable('') } = $props();

  let cursor = $state(today.slice(0, 7) + '-01');
  const monthLabel = $derived(new Date(cursor + 'T00:00:00Z').toLocaleDateString('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' }));
  const canPrev = $derived(cursor > today.slice(0, 7) + '-01');

  const days = $derived.by(() => {
    const first = cursor;
    const lead = (weekday(first) + 6) % 7; // week starts Monday
    const d = new Date(first + 'T00:00:00Z');
    const count = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)).getUTCDate();
    return [...Array(lead).fill(null), ...Array.from({ length: count }, (_, i) => addDays(first, i))];
  });

  function shift(n) {
    const d = new Date(cursor + 'T00:00:00Z');
    cursor = toIso(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + n, 1));
  }

  const free = (iso) => iso >= today && isNightFree(room.slug, iso, mine);
  function selectable(iso) {
    if (iso < today) return false;
    if (from && !to && iso > from) return isRangeFree(room.slug, from, iso, mine) || free(iso);
    return free(iso);
  }
  function pick(iso) {
    if (from && !to && iso > from && isRangeFree(room.slug, from, iso, mine)) {
      to = iso;
    } else {
      from = iso;
      to = '';
    }
  }
  const inRange = (iso) => from && to && iso > from && iso < to;
</script>

<div class="cal" role="group" aria-label="Availability for {room.name}">
  <div class="head">
    <button type="button" class="nav" onclick={() => shift(-1)} disabled={!canPrev} aria-label="Previous month">‹</button>
    <strong aria-live="polite">{monthLabel}</strong>
    <button type="button" class="nav" onclick={() => shift(1)} aria-label="Next month">›</button>
  </div>
  <div class="dow" aria-hidden="true">{#each ['M', 'T', 'W', 'T', 'F', 'S', 'S'] as d}<span>{d}</span>{/each}</div>
  <div class="days">
    {#each days as iso}
      {#if iso}
        {@const ok = selectable(iso)}
        <button
          type="button"
          class:sel={iso === from || iso === to}
          class:mid={inRange(iso)}
          class:booked={iso >= today && !free(iso)}
          disabled={!ok}
          aria-pressed={iso === from || iso === to}
          aria-label="{new Date(iso + 'T00:00:00Z').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' })}, {iso < today ? 'past' : free(iso) ? brl(nightRate(room, iso)) : 'unavailable'}"
          onclick={() => pick(iso)}
        >
          <span>{Number(iso.slice(8))}</span>
          {#if free(iso)}<small>{Math.round(nightRate(room, iso) / 10) / 100}k</small>{/if}
        </button>
      {:else}
        <span></span>
      {/if}
    {/each}
  </div>
  <p class="legend"><i class="a"></i> Available <i class="b"></i> Booked <i class="c"></i> Your stay · nightly rate in thousands of R$</p>
</div>

<style>
  .cal {
    background: #fff;
    border: 1px solid var(--line);
    border-radius: var(--radius);
    padding: 1.25rem;
  }
  .head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
    font-family: var(--serif);
    font-size: 1.25rem;
  }
  .nav {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: 1.5px solid var(--line);
    background: var(--paper);
    font-size: 1.4rem;
    cursor: pointer;
    color: var(--forest);
  }
  .nav:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
  .dow,
  .days {
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    gap: 3px;
  }
  .dow span {
    text-align: center;
    font-size: 0.72rem;
    font-weight: 700;
    color: var(--ink-soft);
    padding-bottom: 0.3rem;
  }
  .days button {
    aspect-ratio: 1 / 0.92;
    min-height: 44px;
    border: 0;
    border-radius: 10px;
    background: #f1ecdf;
    color: var(--ink);
    font: 700 0.95rem var(--sans);
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    line-height: 1.1;
    padding: 0;
  }
  .days button small {
    font-size: 0.62rem;
    font-weight: 600;
    color: var(--ink-soft);
  }
  .days button:hover:not(:disabled) {
    background: #e2d8bf;
  }
  .days button:disabled {
    background: transparent;
    color: #8d928c;
    cursor: not-allowed;
  }
  .days button.booked:disabled {
    text-decoration: line-through;
    background: repeating-linear-gradient(135deg, #ece5d4 0 4px, #f6f0e2 4px 8px);
  }
  .days button.mid {
    background: #f2dfa8;
    border-radius: 0;
  }
  .days button.sel {
    background: var(--forest);
    color: #fff;
  }
  .days button.sel small {
    color: #e6dcc0;
  }
  .legend {
    margin: 1rem 0 0;
    font-size: 0.78rem;
    color: var(--ink-soft);
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem 0.9rem;
    align-items: center;
  }
  .legend i {
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 3px;
    margin-right: 0.3rem;
    vertical-align: -1px;
  }
  .a {
    background: #f1ecdf;
  }
  .b {
    background: repeating-linear-gradient(135deg, #ddd3bb 0 3px, #f6f0e2 3px 6px);
  }
  .c {
    background: var(--forest);
  }
</style>
