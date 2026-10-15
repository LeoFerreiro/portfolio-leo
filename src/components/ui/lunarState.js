/** Pure clock core; one timestamp and one cancellable timer per published snapshot. */
export function createLunarClock({ calculate, now = Date.now, setTimer = setTimeout, clearTimer = clearTimeout }) {
  let snapshot = { phase: null, error: null, active: false };
  const listeners = new Set();
  let active = false;
  let timer;
  let generation = 0;
  async function refresh() {
    clearTimer(timer);
    timer = undefined;
    const token = ++generation;
    if (!active) return;
    const timestamp = now();
    try {
      const phase = await calculate(timestamp);
      if (token !== generation || !active) return;
      snapshot = { phase, error: null, active };
    } catch {
      if (token !== generation || !active) return;
      snapshot = { ...snapshot, error: 'ephemeris-error' };
    }
    listeners.forEach((listener) => listener());
    if (active && token === generation) timer = setTimer(refresh, 60000);
  }
  return {
    getSnapshot: () => snapshot,
    subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); },
    setActive(value) {
      if (active === value) return;
      active = value;
      snapshot = { ...snapshot, active };
      listeners.forEach((listener) => listener());
      if (active) refresh();
      else { ++generation; clearTimer(timer); timer = undefined; }
    },
  };
}

const clock = createLunarClock({ calculate: async (time) => {
  const { getLunarEphemeris } = await import('./lunarEphemeris.js');
  return getLunarEphemeris(time);
} });
let users = 0;
let stopBrowser;
export const getLunarSnapshot = clock.getSnapshot;
export function subscribeLunar(listener) {
  const unsubscribe = clock.subscribe(listener);
  if (++users === 1) {
    const hero = document.getElementById('hero');
    let visible = false;
    const update = () => clock.setActive(visible && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update(); });
    if (hero) observer.observe(hero);
    document.addEventListener('visibilitychange', update);
    stopBrowser = () => { observer.disconnect(); document.removeEventListener('visibilitychange', update); clock.setActive(false); };
  }
  return () => { unsubscribe(); if (--users === 0) stopBrowser?.(); };
}

/** Editorial visibility against lunar light, not a physical change of stellar brightness. */
export function faintStarOpacity(k) {
  const t = Math.max(0, Math.min(1, k));
  return 1 - 0.72 * t * t * (3 - 2 * t);
}
