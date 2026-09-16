"use client";

import { useEffect, useState, useRef } from "react";
import { AnimatedCounter } from "./animated-counter";

const stats = [
  {
    value: 68,
    suffix: "%",
    prefix: "",
    label: "de domiciliarios ha sufrido o presenciado un robo en su zona de trabajo",
  },
  {
    value: 4,
    suffix: " de cada 10",
    prefix: "",
    label: "turnos incluyen paso por una zona considerada de alto riesgo",
  },
  {
    value: 120,
    suffix: "+",
    prefix: "",
    label: "reportes de inseguridad recibidos por la comunidad este mes",
  },
  {
    value: 15,
    suffix: " min",
    prefix: "",
    label: "promedio que toma decidir una ruta más segura sin información clara",
  },
];

export function StatsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

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
    <section id="estadisticas" ref={sectionRef} className="relative py-24 lg:py-32 border-y border-foreground/10">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="mb-16 lg:mb-24">
          <h2
            className={`text-4xl lg:text-6xl font-display tracking-tight mb-8 transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Repartir en Bogotá no debería ser un riesgo.
            <br />
            <span className="text-muted-foreground">Pero hoy, lo es.</span>
          </h2>
          <p
            className={`text-xl text-muted-foreground leading-relaxed max-w-2xl transition-all duration-700 delay-100 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Cada turno, miles de domiciliarios entran a zonas sin saber qué tan seguras
            son. La falta de información en tiempo real los deja expuestos a robos,
            agresiones y rutas peligrosas — muchas veces evitables.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-foreground/10">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`bg-background p-8 lg:p-12 transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <AnimatedCounter
                end={stat.value}
                suffix={stat.suffix}
                prefix={stat.prefix}
                className="text-5xl font-display tracking-tight"
              />
              <div className="mt-4 text-lg text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        <p className="mt-8 text-xs text-muted-foreground">
          *Cifras ilustrativas para efectos de este prototipo.
        </p>
      </div>
    </section>
  );
}
