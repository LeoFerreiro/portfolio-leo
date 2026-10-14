import { useEffect, useRef, useState } from "react";

function HeroScene3D() {
  const mountRef = useRef(null);
  const [state, setState] = useState("loading");

  useEffect(() => {
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
        return;
      }
      const start = () => {
        pending = undefined;
        if (cancelled) return;
        import("./lunarScene.js").then(({ mountLunarScene }) => {
          if (cancelled) return;
          dispose = mountLunarScene(host, {
            onReady: () => { if (!cancelled) setState("ready"); },
            onError: (reason) => {
              if (cancelled) return;
              host.dataset.reason = reason;
              setState("fallback");
            },
          });
        }).catch(() => {
          if (!cancelled) {
            host.dataset.reason = "module-error";
            setState("fallback");
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
    };
  }, []);

  return <div ref={mountRef} className="lunar-scene" data-state={state} aria-hidden="true" />;
}

export default HeroScene3D;
