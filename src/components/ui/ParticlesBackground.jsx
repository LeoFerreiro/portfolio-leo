import { useEffect, useRef } from "react";

/** Static shared sky with one infrequent, demand-scheduled meteor. */
function ParticlesBackground() {
  const meteorRef = useRef(null);

  useEffect(() => {
    const meteor = meteorRef.current;
    const hero = document.getElementById("hero");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!hero) return;
    let timer;
    let inView = false;
    let disposed = false;
    const stop = () => {
      clearTimeout(timer);
      timer = undefined;
      meteor.classList.remove("is-visible");
    };
    const schedule = () => {
      stop();
      if (disposed || reduced.matches || document.hidden || !inView) return;
      // Always wait again after returning to the Hero/tab: no catch-up bursts.
      timer = window.setTimeout(() => {
        timer = undefined;
        const top = hero.getBoundingClientRect().top;
        if (document.hidden || reduced.matches || !inView || top < -40) return;
        meteor.classList.add("is-visible");
      }, 22000 + Math.random() * 26000);
    };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      schedule();
    });
    observer.observe(hero);
    meteor.addEventListener("animationend", schedule);
    document.addEventListener("visibilitychange", schedule);
    reduced.addEventListener("change", schedule);
    return () => {
      disposed = true;
      stop();
      observer.disconnect();
      meteor.removeEventListener("animationend", schedule);
      document.removeEventListener("visibilitychange", schedule);
      reduced.removeEventListener("change", schedule);
    };
  }, []);

  return (
    <div className="eclipse-atmosphere" aria-hidden="true">
      <div className="space-stars" />
      <span ref={meteorRef} className="editorial-meteor" />
    </div>
  );
}

export default ParticlesBackground;
