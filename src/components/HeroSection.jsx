import { useEffect, useLayoutEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const LETTERS = "ITZFIZZ".split("");

const LETTER_TRAJECTORIES = [
  { x: -350, y: -300, rotation: -65, scale: 0.2 },
  { x: 200, y: -400, rotation: 80, scale: 0.15 },
  { x: -250, y: 350, rotation: -120, scale: 0.3 },
  { x: 500, y: -150, rotation: 160, scale: 0.1 },
  { x: -400, y: 200, rotation: -180, scale: 0.25 },
  { x: 300, y: 350, rotation: 95, scale: 0.15 },
  { x: 450, y: -350, rotation: -50, scale: 0.1 },
];

const stats = [
  { value: "58%", label: "Increase in engagement", icon: "▲" },
  { value: "23%", label: "Reduction in bounce rate", icon: "▼" },
  { value: "27%", label: "Growth in conversions", icon: "◆" },
  { value: "40%", label: "Faster load times", icon: "⚡" },
];

const RING_COUNT = 6;
const PARTICLE_COUNT = 30;
const ORBIT_COUNT = 5;

const HeroSection = () => {
  const wrapperRef = useRef(null);
  const heroRef = useRef(null);
  const lettersRef = useRef([]);
  const ringsRef = useRef([]);
  const coreRef = useRef(null);
  const statsRef = useRef([]);
  const particlesRef = useRef([]);
  const mouseLayerRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if (!mouseLayerRef.current) return;
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    gsap.to(mouseLayerRef.current, { x, y, duration: 0.8, ease: "power2.out" });
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  useLayoutEffect(() => {
    if (!wrapperRef.current || !heroRef.current) return;

    const ctx = gsap.context(() => {
      const hero = heroRef.current;
      const wrapper = wrapperRef.current;
      const letters = lettersRef.current.filter(Boolean);
      const rings = ringsRef.current.filter(Boolean);
      const core = coreRef.current;
      const statEls = statsRef.current.filter(Boolean);
      const particles = particlesRef.current.filter(Boolean);

      const introTl = gsap.timeline({ delay: 0.3 });
      introTl.from(letters, {
        y: -120,
        scale: 0,
        opacity: 0,
        rotationX: 90,
        duration: 1,
        stagger: 0.08,
        ease: "elastic.out(1, 0.5)",
      });
      if (core) {
        introTl.from(core, { scale: 0, opacity: 0, duration: 1.2, ease: "power3.out" }, "-=0.8");
      }
      rings.forEach((ring, i) => {
        introTl.from(ring, { scale: 0, opacity: 0, rotation: 180, duration: 0.8, ease: "power2.out" }, `-=${0.7 - i * 0.05}`);
      });

      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapper,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.5,
        },
      });

      letters.forEach((letter, i) => {
        const t = LETTER_TRAJECTORIES[i];
        scrollTl.to(
          letter,
          {
            x: t.x,
            y: t.y,
            rotation: t.rotation,
            scale: t.scale,
            opacity: 0,
            filter: "blur(8px)",
            duration: 0.35,
            ease: "power3.in",
          },
          0,
        );
      });
      if (core) scrollTl.to(core, { scale: 4, opacity: 1, duration: 0.35 }, 0);
      rings.forEach((ring, i) => {
        scrollTl.to(ring, { scale: 2.5 + i * 0.9, opacity: 0.4 - i * 0.06, rotation: i % 2 === 0 ? 45 : -45, duration: 0.35 }, 0);
      });
      particles.forEach((p, i) => {
        const angle = (i / PARTICLE_COUNT) * Math.PI * 2;
        const dist = 250 + Math.random() * 350;
        scrollTl.to(p, { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist, opacity: 0.8, scale: 0.5 + Math.random() * 1.5, duration: 0.35 }, 0);
      });

      if (core) scrollTl.to(core, { scale: 0, opacity: 0, duration: 0.15 }, 0.35);
      rings.forEach((ring) => scrollTl.to(ring, { scale: 0, opacity: 0, duration: 0.15 }, 0.35));
      particles.forEach((p) => scrollTl.to(p, { x: 0, y: 0, opacity: 0, scale: 0, duration: 0.15 }, 0.35));

      scrollTl.fromTo(hero, { backgroundColor: "hsl(240, 15%, 5%)" }, { backgroundColor: "hsl(240, 15%, 7%)", duration: 0.05 }, 0.5);
      scrollTl.to(hero, { backgroundColor: "hsl(240, 15%, 5%)", duration: 0.1 }, 0.55);
      statEls.forEach((stat, i) => {
        const fromY = i < 2 ? -200 : 200;
        const fromX = i % 2 === 0 ? -300 : 300;
        scrollTl.fromTo(
          stat,
          { x: fromX, y: fromY, opacity: 0, scale: 0.5, rotation: i % 2 === 0 ? -15 : 15 },
          { x: 0, y: 0, opacity: 1, scale: 1, rotation: 0, duration: 0.2, ease: "back.out(1.4)" },
          0.55 + i * 0.04,
        );
      });
      statEls.forEach((stat, i) => {
        const numEl = stat.querySelector(".stat-number");
        if (numEl) {
          scrollTl.fromTo(numEl, { scale: 1.5, opacity: 0.5 }, { scale: 1, opacity: 1, duration: 0.1, ease: "power2.out" }, 0.7 + i * 0.03);
        }
      });

      statEls.forEach((stat, i) => {
        scrollTl.to(stat, { y: -60, opacity: 0, duration: 0.15 }, 0.85 + i * 0.02);
      });
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapperRef} style={{ height: "400vh" }} className="relative">
      <div
        ref={heroRef}
        className="sticky top-0 h-screen w-full flex items-center justify-center bg-background select-none overflow-hidden"
      >
        <div className="grid-bg" />
        <div className="noise-overlay" />
        <div className="scanline" />

        <div className="h-line top-[20%] left-[10%] w-[30%]" />
        <div className="h-line top-[80%] right-[10%] w-[25%]" style={{ left: "auto" }} />

        <div ref={mouseLayerRef} className="absolute inset-0 pointer-events-none">
          {Array.from({ length: RING_COUNT }).map((_, i) => (
            <div
              key={`ring-${i}`}
              ref={(el) => {
                ringsRef.current[i] = el;
              }}
              className="glow-ring"
              style={{
                width: `${100 + i * 90}px`,
                height: `${100 + i * 90}px`,
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
          ))}

          <div ref={coreRef} className="glow-core" style={{ width: "220px", height: "220px", left: "50%", top: "50%", transform: "translate(-50%, -50%)" }} />

          {Array.from({ length: ORBIT_COUNT }).map((_, i) => (
            <div
              key={`orbit-${i}`}
              className="orbit-particle"
              style={{
                width: `${4 + i * 2}px`,
                height: `${4 + i * 2}px`,
                background: i % 2 === 0 ? "hsl(var(--glow))" : "hsl(var(--glow-secondary))",
                boxShadow: `0 0 ${8 + i * 4}px ${i % 2 === 0 ? "hsl(var(--glow) / 0.6)" : "hsl(var(--glow-secondary) / 0.6)"}`,
                "--orbit-radius": `${80 + i * 50}px`,
                animation: `float-orbit ${6 + i * 2}s linear infinite${i % 2 === 0 ? "" : " reverse"}`,
                opacity: 0.7,
              }}
            />
          ))}

          {Array.from({ length: PARTICLE_COUNT }).map((_, i) => {
            const size = 2 + Math.random() * 5;
            return (
              <div
                key={`particle-${i}`}
                ref={(el) => {
                  particlesRef.current[i] = el;
                }}
                className="particle"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  left: "50%",
                  top: "50%",
                  background: i % 3 === 0 ? "hsl(var(--glow))" : i % 3 === 1 ? "hsl(var(--glow-secondary))" : "hsl(var(--ember))",
                  boxShadow: `0 0 ${size * 2}px currentColor`,
                  opacity: 0,
                }}
              />
            );
          })}
        </div>

        <div className="glitch-layer glitch-layer-1 z-[5]">
          <div className="flex items-center gap-2 md:gap-4 lg:gap-6">
            {LETTERS.map((letter, i) => (
              <span key={i} className="text-7xl md:text-9xl lg:text-[12rem] font-bold" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                {letter}
              </span>
            ))}
          </div>
        </div>
        <div className="glitch-layer glitch-layer-2 z-[5]">
          <div className="flex items-center gap-2 md:gap-4 lg:gap-6">
            {LETTERS.map((letter, i) => (
              <span key={i} className="text-7xl md:text-9xl lg:text-[12rem] font-bold" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                {letter}
              </span>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-2 md:gap-4 lg:gap-6">
          {LETTERS.map((letter, i) => (
            <span
              key={i}
              ref={(el) => {
                lettersRef.current[i] = el;
              }}
              className="hero-letter text-7xl md:text-9xl lg:text-[12rem] font-bold cursor-default"
            >
              {letter}
            </span>
          ))}
        </div>

        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <div className="grid grid-cols-2 gap-4 md:gap-6 max-w-2xl w-full px-6">
            {stats.map((stat, i) => (
              <div
                key={i}
                ref={(el) => {
                  statsRef.current[i] = el;
                }}
                className="stat-card p-5 md:p-7 text-center opacity-0"
              >
                <div className="text-accent text-lg mb-1 opacity-60">{stat.icon}</div>
                <div className="stat-number text-4xl md:text-6xl mb-1">{stat.value}</div>
                <div className="stat-text">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
