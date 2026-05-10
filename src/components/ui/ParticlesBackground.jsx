import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

function ParticlesBackground() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  if (!init) return null;

  return (
    <Particles
      id="tsparticles"
      options={{
        fullScreen: {
          enable: true,
          zIndex: -1,
        },

        background: {
          color: {
            value: "#020617",
          },
        },

        fpsLimit: 60,

        particles: {
          color: {
            value: ["#3B82F6", "#8B5CF6", "#06B6D4"],
          },

          links: {
            color: "#3B82F6",
            distance: 120,
            enable: true,
            opacity: 0.2,
            width: 1,
          },

          move: {
            direction: "none",
            enable: true,
            outModes: {
              default: "bounce",
            },
            random: false,
            speed: 1,
            straight: false,
          },

          number: {
            density: {
              enable: true,
            },
            value: 60,
          },

          opacity: {
            value: 0.5,
          },

          shape: {
            type: "circle",
          },

          size: {
            value: { min: 1, max: 4 },
          },
        },

        detectRetina: true,
      }}
    />
  );
}

export default ParticlesBackground;