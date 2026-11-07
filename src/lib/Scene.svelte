<script>
  // Procedural illustration used in place of photography (the demo ships no stock images).
  let { kind = 'valley', palette = ['#e9dcc3', '#c9b48a', '#6f8a5a', '#2f4a36', '#b8683a'], seed = 1, label = '' } = $props();

  const uid = `sc${kind}${seed}${palette[0].slice(1)}${palette[4].slice(1)}`; // deterministic: SSR and client agree
  const rnd = (n) => {
    const x = Math.sin(seed * 9301 + n * 49297) * 233280;
    return x - Math.floor(x);
  };
  const [sky, glow, mid, deep, accent] = palette;

  function ridge(base, amp, n, k) {
    let d = `M0 ${base}`;
    for (let i = 0; i <= n; i++) {
      const x = (i / n) * 400;
      const y = base - rnd(k + i) * amp - Math.sin(i * 0.9 + k) * amp * 0.35;
      d += ` L${x.toFixed(1)} ${y.toFixed(1)}`;
    }
    return d + ' L400 300 L0 300 Z';
  }
  const trunks = Array.from({ length: 9 }, (_, i) => ({
    x: 20 + i * 44 + rnd(i) * 18,
    h: 150 + rnd(i + 20) * 90,
    r: 24 + rnd(i + 40) * 22
  }));
  const sunX = 90 + rnd(3) * 220;
</script>

<svg class="scene" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" role={label ? 'img' : 'presentation'} aria-label={label || undefined} aria-hidden={label ? undefined : 'true'}>
  <defs>
    <linearGradient id="{uid}-sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color={sky} />
      <stop offset="1" stop-color={glow} />
    </linearGradient>
    <radialGradient id="{uid}-sun">
      <stop offset="0" stop-color={accent} stop-opacity="0.95" />
      <stop offset="1" stop-color={accent} stop-opacity="0" />
    </radialGradient>
  </defs>
  <rect width="400" height="300" fill="url(#{uid}-sky)" />

  {#if kind === 'valley'}
    <circle cx={sunX} cy="118" r="70" fill="url(#{uid}-sun)" />
    <circle cx={sunX} cy="118" r="22" fill={accent} />
    <path d={ridge(190, 40, 10, 1)} fill={glow} opacity="0.7" />
    <path d={ridge(220, 46, 9, 5)} fill={mid} opacity="0.55" />
    <path d={ridge(250, 40, 8, 9)} fill={mid} />
    <path d={ridge(285, 34, 7, 14)} fill={deep} />
  {:else if kind === 'grove'}
    <circle cx={sunX} cy="90" r="60" fill="url(#{uid}-sun)" />
    <path d={ridge(240, 30, 8, 3)} fill={mid} opacity="0.5" />
    <rect y="248" width="400" height="52" fill={deep} />
    {#each trunks as t, i}
      <rect x={t.x} y={300 - t.h} width="5" height={t.h} fill={deep} opacity={0.65 + (i % 3) * 0.12} />
      <circle cx={t.x + 2.5} cy={300 - t.h} r={t.r} fill={accent} opacity="0.9" />
      <circle cx={t.x - t.r * 0.45} cy={300 - t.h + t.r * 0.4} r={t.r * 0.7} fill={glow} opacity="0.85" />
      <circle cx={t.x + t.r * 0.55} cy={300 - t.h + t.r * 0.35} r={t.r * 0.62} fill={accent} opacity="0.75" />
    {/each}
  {:else if kind === 'window'}
    <rect width="400" height="300" fill={glow} />
    <rect y="230" width="400" height="70" fill={deep} opacity="0.92" />
    <path d="M110 230 V110 a90 90 0 0 1 180 0 V230 Z" fill={sky} />
    <clipPath id="{uid}-w"><path d="M110 230 V110 a90 90 0 0 1 180 0 V230 Z" /></clipPath>
    <g clip-path="url(#{uid}-w)">
      <circle cx="240" cy="110" r="26" fill={accent} />
      <path d={ridge(215, 38, 8, 2)} fill={mid} />
      <path d={ridge(240, 30, 7, 7)} fill={deep} opacity="0.8" />
    </g>
    <path d="M110 230 V110 a90 90 0 0 1 180 0 V230 Z" fill="none" stroke={deep} stroke-width="6" />
    <path d="M200 20 V230 M110 140 H290" stroke={deep} stroke-width="3" />
    <rect x="46" y="196" width="130" height="44" rx="6" fill={accent} opacity="0.88" />
    <rect x="46" y="184" width="130" height="18" rx="9" fill={sky} />
    <rect x="300" y="198" width="54" height="42" rx="3" fill={mid} />
    <ellipse cx="327" cy="188" rx="20" ry="10" fill={accent} opacity="0.8" />
  {:else}
    <rect y="196" width="400" height="104" fill={mid} opacity="0.9" />
    <rect y="196" width="400" height="6" fill={deep} opacity="0.35" />
    <circle cx={sunX + 30} cy="96" r="52" fill={glow} opacity="0.8" />
    <path d="M110 214 q0 56 46 56 t46 -56 Z" fill={accent} />
    <ellipse cx="156" cy="214" rx="46" ry="8" fill={deep} opacity="0.5" />
    <rect x="236" y="196" width="46" height="74" rx="8" fill={deep} />
    <ellipse cx="259" cy="196" rx="23" ry="6" fill={sky} />
    <path d="M300 270 q10 -52 28 -80 q8 30 4 80 Z" fill={deep} opacity="0.85" />
    <path d="M60 270 q-6 -50 12 -86 q16 34 8 86 Z" fill={deep} opacity="0.75" />
  {/if}
</svg>

<style>
  .scene {
    display: block;
    width: 100%;
    height: 100%;
  }
</style>
