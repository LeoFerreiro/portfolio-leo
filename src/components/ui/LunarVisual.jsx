import { useCallback, useEffect, useRef, useState } from 'react';
import HeroScene3D from './HeroScene3D';
import { useLunarState } from './useLunarState';

export default function LunarVisual() {
  const { phase, active } = useLunarState();
  const canvas = useRef(null);
  const release = useRef(null);
  useEffect(() => () => release.current?.(), []);
  const [fallbackTime, setFallbackTime] = useState(null);
  const [fallbackFailed, setFallbackFailed] = useState(false);
  const [frameTime, setFrameTime] = useState(null);
  const onFrame = useCallback((time) => setFrameTime(time), []);
  const onFailure = useCallback(() => setFrameTime(null), []);
  const current3D = !!phase && frameTime === phase.timestampMs;
  useEffect(() => {
    if (!phase || !active) return;
    const controller = new AbortController();
    const host = canvas.current;
    import('./lunarFallback.js').then(({ renderLunarFallback, releaseLunarFallbackCache }) => {
      release.current = releaseLunarFallbackCache;
      return renderLunarFallback(host, phase, {
        signal: controller.signal, width: window.innerWidth < 700 ? 320 : 384,
      });
    }).then((stats) => {
      if (controller.signal.aborted) return;
      host.dataset.metrics = JSON.stringify(stats);
      setFallbackTime(phase.timestampMs);
    }).catch((error) => {
      if (error.name !== 'AbortError') { host.dataset.reason = 'canvas-fallback-error'; setFallbackFailed(true); }
    });
    return () => controller.abort();
  }, [phase, active]);
  return (
    <div className="lunar-visual" data-phase-timestamp={phase?.timestampMs} data-show-3d={current3D} aria-hidden="true">
      <span className="lunar-placeholder" />
      <canvas ref={canvas} className="lunar-fallback" data-ready={fallbackTime !== null} />
      <HeroScene3D enabled={fallbackTime !== null || fallbackFailed} phase={phase} onFrame={onFrame} onFailure={onFailure} />
    </div>
  );
}
