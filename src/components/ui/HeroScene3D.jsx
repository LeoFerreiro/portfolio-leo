import { useEffect, useRef, useState } from "react";

function HeroScene3D({ phase, onFrame, onFailure, enabled = true }) {
  const mountRef = useRef(null);
  const latest = useRef({ phase, onFrame, onFailure });
  const disposeRef = useRef(null);
  const hasPhase = !!phase && enabled;
  const [state, setState] = useState("loading");

  useEffect(() => {
    latest.current = { phase, onFrame, onFailure };
    if (phase) disposeRef.current?.updatePhase?.(phase);
  }, [phase, onFrame, onFailure]);

  useEffect(() => {
    if (!hasPhase) return;
    const host = mountRef.current;
    let cancelled = false;
    let dispose;
    let pending;
    let idle = false;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const limited = navigator.connection?.saveData
        || (navigator.deviceMemory !== undefined && navigator.deviceMemory <= 2)
        || (navigator.hardwareConcurrency !== undefined && navigator.hardwareConcurrency <= 2);
      if (limited) {
        host.dataset.reason = "limited-resources";
        setState("fallback");
        latest.current.onFailure?.();
        return;
      }
      const start = () => {
        pending = undefined;
        if (cancelled) return;
        // Avoid downloading Three.js at all when WebGL2 cannot be created.
        const probe = document.createElement("canvas");
        let context;
        try {
          context = probe.getContext("webgl2", { powerPreference: "low-power", failIfMajorPerformanceCaveat: true });
        } catch { /* Renderer initialization remains guarded below. */ }
        if (!context) {
          host.dataset.reason = "webgl-unavailable";
          setState("fallback");
          latest.current.onFailure?.();
          return;
        }
        context.getExtension("WEBGL_lose_context")?.loseContext();
        probe.width = probe.height = 1;
        import("./lunarScene.js").then(({ mountLunarScene }) => {
          if (cancelled) return;
          dispose = mountLunarScene(host, {
            initialPhase: latest.current.phase,
            onFrame: (time) => { if (!cancelled) latest.current.onFrame?.(time); },
            onReady: () => { if (!cancelled) setState("ready"); },
            onError: (reason) => {
              if (cancelled) return;
              host.dataset.reason = reason;
              setState("fallback");
              latest.current.onFailure?.();
            },
          });
          disposeRef.current = dispose;
        }).catch(() => {
          if (!cancelled) {
            host.dataset.reason = "module-error";
            setState("fallback");
            latest.current.onFailure?.();
          }
        });
      };
      idle = typeof window.requestIdleCallback === "function";
      pending = idle ? window.requestIdleCallback(start, { timeout: 1500 }) : window.setTimeout(start, 100);
    });
    observer.observe(host);
    return () => {
      cancelled = true;
      observer.disconnect();
      if (pending !== undefined) {
        if (idle) window.cancelIdleCallback(pending);
        else window.clearTimeout(pending);
      }
      dispose?.();
      disposeRef.current = null;
    };
  }, [hasPhase]);

  return <div ref={mountRef} className="lunar-scene" data-state={state} aria-hidden="true" />;
}

export default HeroScene3D;
