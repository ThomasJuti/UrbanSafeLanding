"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { AnimatedSphere } from "./animated-sphere";
import { useParallax } from "@/hooks/use-parallax";

const highlighted = "tiempo real";

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sphereRef = useRef<HTMLDivElement>(null);
  const sphereOffset = useParallax(sphereRef, 0.15);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
      style={{ "--glyph-rgb": "148 163 184" } as React.CSSProperties}
    >
      {/* Animated sphere background */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] lg:w-[800px] lg:h-[800px] opacity-40 pointer-events-none">
        <div ref={sphereRef} className="w-full h-full" style={{ transform: `translateY(${sphereOffset}px)` }}>
          <AnimatedSphere />
        </div>
      </div>

      {/* Subtle grid lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        {[...Array(8)].map((_, i) => (
          <div
            key={`h-${i}`}
            className="absolute h-px bg-foreground/10"
            style={{
              top: `${12.5 * (i + 1)}%`,
              left: 0,
              right: 0,
            }}
          />
        ))}
        {[...Array(12)].map((_, i) => (
          <div
            key={`v-${i}`}
            className="absolute w-px bg-foreground/10"
            style={{
              left: `${8.33 * (i + 1)}%`,
              top: 0,
              bottom: 0,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12 py-32 lg:py-40">
        {/* Main headline */}
        <div className="mb-12">
          <h1
            className={`text-[clamp(2.25rem,8vw,4.5rem)] font-display leading-[1.05] tracking-tight max-w-4xl transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Rutas y zonas de entrega seguras en{" "}
            <span className="inline-flex">
              {highlighted.split("").map((char, i) => (
                <span
                  key={i}
                  className="inline-block animate-char-in"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  {char === " " ? " " : char}
                </span>
              ))}
            </span>{" "}
            para domiciliarios en Bogotá.
          </h1>
        </div>

        {/* Description + CTA */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-end">
          <p
            className={`text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-xl transition-all duration-700 delay-200 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Antes de salir a rodar, sabé qué zonas evitar. Alertas comunitarias, mapas de
            riesgo y rutas recomendadas, directo en tu celular.
          </p>

          <div
            className={`flex flex-col sm:flex-row items-start gap-4 transition-all duration-700 delay-300 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground px-8 h-14 text-base rounded-full group"
            >
              <a href="#registro">
                Registrarme Gratis
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
            <a
              href="#solucion"
              className="h-14 flex items-center px-2 text-base text-foreground/70 hover:text-foreground transition-colors"
            >
              Ver cómo funciona
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
