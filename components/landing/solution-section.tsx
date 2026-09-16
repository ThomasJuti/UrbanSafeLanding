"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Bell, Users, Route, MapPinned } from "lucide-react";
import { AnimatedShield } from "./animated-shield";
import { GpsNetwork } from "./gps-network";
import { useParallax } from "@/hooks/use-parallax";

const solutions = [
  {
    number: "01",
    title: "Alertas en tiempo real",
    description:
      "Recibí notificaciones al acercarte a una zona reportada como peligrosa, antes de que sea tarde.",
    visual: "alert",
    icon: Bell,
  },
  {
    number: "02",
    title: "Reportes verificados por la comunidad",
    description:
      "Otros domiciliarios reportan robos, asaltos y zonas sospechosas. Entre todos construimos el mapa.",
    visual: "community",
    icon: Users,
  },
  {
    number: "03",
    title: "Rutas seguras sugeridas",
    description: "Te proponemos el trayecto con menor riesgo, no solo el más corto.",
    visual: "route",
    icon: Route,
  },
  {
    number: "04",
    title: "Mapa de calor de Bogotá",
    description:
      "Visualizá zonas verdes, amarillas y rojas por localidad, actualizadas por la comunidad.",
    visual: "heatmap",
    icon: MapPinned,
  },
] as const;

function AlertVisual() {
  return (
    <svg viewBox="0 0 200 160" className="w-full h-full">
      {[0, 1, 2].map((i) => (
        <circle
          key={i}
          cx="100"
          cy="80"
          r="10"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          opacity="0"
        >
          <animate
            attributeName="r"
            values="10;60"
            dur="2.4s"
            begin={`${i * 0.8}s`}
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.6;0"
            dur="2.4s"
            begin={`${i * 0.8}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}
      <circle cx="100" cy="80" r="10" fill="currentColor">
        <animate attributeName="r" values="10;12;10" dur="1.2s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

function CommunityVisual() {
  const pins = [
    { x: 60, y: 60, delay: 0 },
    { x: 130, y: 45, delay: 0.4 },
    { x: 100, y: 110, delay: 0.8 },
  ];
  return (
    <svg viewBox="0 0 200 160" className="w-full h-full">
      <line x1="60" y1="60" x2="130" y2="45" stroke="currentColor" strokeWidth="1" strokeDasharray="3 4" opacity="0.3" />
      <line x1="60" y1="60" x2="100" y2="110" stroke="currentColor" strokeWidth="1" strokeDasharray="3 4" opacity="0.3" />
      <line x1="130" y1="45" x2="100" y2="110" stroke="currentColor" strokeWidth="1" strokeDasharray="3 4" opacity="0.3" />
      {pins.map((pin, i) => (
        <g key={i} transform={`translate(${pin.x}, ${pin.y})`}>
          <path
            d="M 0 -14 C 8 -14 14 -8 14 0 C 14 9 0 22 0 22 C 0 22 -14 9 -14 0 C -14 -8 -8 -14 0 -14 Z"
            fill="currentColor"
            opacity="0.15"
          />
          <circle r="5" fill="currentColor">
            <animate
              attributeName="opacity"
              values="0.4;1;0.4"
              dur="2s"
              begin={`${pin.delay}s`}
              repeatCount="indefinite"
            />
          </circle>
        </g>
      ))}
    </svg>
  );
}

function RouteVisual() {
  return (
    <svg viewBox="0 0 200 160" className="w-full h-full">
      <path
        id="routePath"
        d="M 35 125 C 70 125 60 60 100 60 C 140 60 130 35 165 35"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="5 6"
        opacity="0.35"
      />
      <circle cx="35" cy="125" r="6" fill="currentColor" />
      <circle cx="165" cy="35" r="6" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle r="5" fill="currentColor">
        <animateMotion dur="2.5s" repeatCount="indefinite">
          <mpath href="#routePath" />
        </animateMotion>
      </circle>
    </svg>
  );
}

function HeatmapVisual() {
  const dots = [
    { x: 40, y: 40, color: "var(--safe)" },
    { x: 90, y: 35, color: "var(--safe)" },
    { x: 140, y: 55, color: "var(--caution)" },
    { x: 55, y: 85, color: "var(--caution)" },
    { x: 110, y: 95, color: "var(--danger)" },
    { x: 155, y: 110, color: "var(--caution)" },
    { x: 75, y: 130, color: "var(--safe)" },
    { x: 130, y: 135, color: "var(--danger)" },
  ];
  return (
    <svg viewBox="0 0 200 160" className="w-full h-full">
      <rect x="20" y="20" width="160" height="120" rx="4" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.2" />
      {dots.map((dot, i) => (
        <circle key={i} cx={dot.x} cy={dot.y} r="9" fill={dot.color} opacity="0.7">
          <animate
            attributeName="opacity"
            values="0.5;0.85;0.5"
            dur="2.5s"
            begin={`${i * 0.2}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}
    </svg>
  );
}

function SolutionVisual({ type }: { type: string }) {
  switch (type) {
    case "alert":
      return <AlertVisual />;
    case "community":
      return <CommunityVisual />;
    case "route":
      return <RouteVisual />;
    case "heatmap":
      return <HeatmapVisual />;
    default:
      return <AlertVisual />;
  }
}

function SolutionRow({
  solution,
  index,
  isActiveDesktop,
  onCenterChange,
}: {
  solution: (typeof solutions)[number];
  index: number;
  isActiveDesktop: boolean;
  onCenterChange: (index: number) => void;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const revealObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2 }
    );
    if (rowRef.current) revealObserver.observe(rowRef.current);

    // Thin band at viewport center — whichever row crosses it becomes "active".
    const centerObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onCenterChange(index);
      },
      { threshold: 0, rootMargin: "-45% 0px -45% 0px" }
    );
    if (rowRef.current) centerObserver.observe(rowRef.current);

    return () => {
      revealObserver.disconnect();
      centerObserver.disconnect();
    };
  }, [index, onCenterChange]);

  return (
    <div
      ref={rowRef}
      className={`group relative border-b border-foreground/10 lg:border-b-0 lg:min-h-[40vh] lg:flex lg:flex-col lg:justify-center transition-all duration-700 lg:transition-none lg:opacity-100 lg:translate-y-0 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div
        className={`flex flex-col gap-8 py-6 lg:py-0 transition-opacity duration-500 ${
          isActiveDesktop ? "lg:opacity-100" : "lg:opacity-40"
        }`}
      >
        <div className="flex gap-8">
          {/* Number */}
          <div className="shrink-0">
            <span className="font-mono text-sm text-muted-foreground">{solution.number}</span>
          </div>

          {/* Content */}
          <div className={`flex-1 transition-transform duration-500 ${isActiveDesktop ? "lg:translate-x-2" : ""}`}>
            <div className="flex items-center gap-3 mb-4">
              <span className="shrink-0 w-9 h-9 flex items-center justify-center border border-foreground/10 text-primary">
                <solution.icon className="w-4 h-4" />
              </span>
              <h3 className="text-2xl lg:text-3xl font-display">{solution.title}</h3>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-md">
              {solution.description}
            </p>
          </div>
        </div>

        {/* Visual — inline on mobile only; desktop uses the shared sticky panel */}
        <div className="flex justify-center lg:hidden">
          <div className="w-48 h-40 text-foreground/70">
            <SolutionVisual type={solution.visual} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function SolutionSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const shieldRef = useRef<HTMLDivElement>(null);
  const shieldOffset = useParallax(shieldRef, 0.12);

  const handleCenterChange = useCallback((index: number) => setActiveIndex(index), []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="solucion"
      ref={sectionRef}
      className="relative py-24 lg:py-32"
      style={{ "--glyph-rgb": "234 88 12" } as React.CSSProperties}
    >
      {/* GPS network background */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{ "--glyph-rgb": "148 163 184" } as React.CSSProperties}
      >
        <GpsNetwork />
      </div>

      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="mb-16 lg:mb-24">
          <h2
            className={`text-4xl lg:text-6xl font-display tracking-tight transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Todo lo que necesitás para rodar más seguro.
            <br />
            <span className="text-muted-foreground">En una sola app.</span>
          </h2>
        </div>

        {/* Scrollytelling grid — desktop pins the visual while the text list scrolls past */}
        <div className="lg:grid lg:grid-cols-2 lg:gap-16">
          <div>
            {solutions.map((solution, index) => (
              <SolutionRow
                key={solution.number}
                solution={solution}
                index={index}
                isActiveDesktop={activeIndex === index}
                onCenterChange={handleCenterChange}
              />
            ))}
          </div>

          <div className="hidden lg:block relative">
            <div className="lg:sticky lg:top-32 relative h-[60vh] flex items-center justify-center">
              {/* Decorative shield accent */}
              <div
                ref={shieldRef}
                className="absolute -top-10 right-0 w-[220px] h-[220px] lg:w-[280px] lg:h-[280px] opacity-20 pointer-events-none"
                style={{ transform: `translateY(${shieldOffset}px)` }}
              >
                <AnimatedShield />
              </div>

              <div className="relative w-64 h-56 text-foreground/70">
                {solutions.map((solution, index) => (
                  <div
                    key={solution.number}
                    className={`absolute inset-0 transition-all duration-500 ${
                      activeIndex === index ? "opacity-100 scale-100" : "opacity-0 scale-95"
                    }`}
                  >
                    <SolutionVisual type={solution.visual} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
