
import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { type Container, type ISourceOptions } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export const ParticlesBackground = () => {
  const [init, setInit] = useState(false);
  const { settings } = useSiteSettings();

  // Initialize particles engine
  useEffect(() => {
    const initEngine = async () => {
      await initParticlesEngine(async (engine) => {
        await loadSlim(engine);
      });
      setInit(true);
    };
    initEngine();
  }, []);

  // Set up particles options
  const particlesOptions: ISourceOptions = {
    particles: {
      number: {
        value: settings.navBar.particlesDensity,
        density: {
          enable: true,
          value_area: 800 // Fixed: changed 'area' to 'value_area'
        }
      },
      color: {
        value: settings.navBar.particlesColor
      },
      opacity: {
        value: 0.3
      },
      size: {
        value: 3
      },
      links: {
        enable: true,
        distance: 150,
        color: settings.navBar.particlesColor,
        opacity: 0.2,
        width: 1
      },
      move: {
        enable: true,
        speed: 1,
        direction: "none",
        random: true,
        straight: false,
        outModes: "out"
      }
    },
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: "grab"
        },
        onClick: {
          enable: true,
          mode: "push"
        }
      },
      modes: {
        grab: {
          distance: 140,
          links: {
            opacity: 0.3
          }
        },
        push: {
          quantity: 3
        }
      }
    },
    detectRetina: true // Fixed: changed 'retina_detect' to 'detectRetina'
  };

  if (!init || !settings.navBar.enableParticles) {
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <Particles
        id="tsparticles"
        options={particlesOptions}
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
};
