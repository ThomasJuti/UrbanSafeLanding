"use client";

import { useRef } from "react";
import { ArrowUpRight, Instagram, Twitter, Linkedin } from "lucide-react";
import { AnimatedWave } from "./animated-wave";
import { VisitorCounter } from "./visitor-counter";
import { useParallax } from "@/hooks/use-parallax";

const footerLinks = {
  Producto: [
    { name: "Cómo funciona", href: "#solucion" },
    { name: "Estadísticas", href: "#estadisticas" },
    { name: "Regístrate", href: "#registro" },
  ],
  "En las noticias": [
    { name: "El Tiempo — Inseguridad de domiciliarios", href: "#" },
    { name: "Semana — Riesgos de la última milla", href: "#" },
    { name: "RCN — Domiciliarios piden protección", href: "#" },
  ],
  Equipo: [
    { name: "Quiénes somos", href: "#equipo" },
    { name: "Contacto", href: "#registro" },
  ],
};

const socialLinks = [
  { name: "Instagram", href: "#", icon: Instagram },
  { name: "Twitter", href: "#", icon: Twitter },
  { name: "LinkedIn", href: "#", icon: Linkedin },
];

export function FooterSection() {
  const waveRef = useRef<HTMLDivElement>(null);
  const waveOffset = useParallax(waveRef, 0.1);

  return (
    <footer
      className="relative border-t border-foreground/10"
      style={{ "--glyph-rgb": "16 185 129" } as React.CSSProperties}
    >
      {/* Animated wave background */}
      <div className="absolute inset-0 h-64 opacity-20 pointer-events-none overflow-hidden">
        <div ref={waveRef} className="w-full h-full" style={{ transform: `translateY(${waveOffset}px)` }}>
          <AnimatedWave />
        </div>
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Main Footer */}
        <div className="py-16 lg:py-24">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-12 lg:gap-8">
            {/* Brand Column */}
            <div className="col-span-2">
              <a href="#" className="inline-flex items-center gap-2 mb-6">
                <span className="text-2xl font-display">UrbanSafe</span>
              </a>

              <p className="text-muted-foreground leading-relaxed mb-8 max-w-xs">
                Información en tiempo real sobre zonas de riesgo para domiciliarios en
                Bogotá. Construida con y para la comunidad.
              </p>

              {/* Social Links */}
              <div className="flex gap-6">
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    aria-label={link.name}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 group"
                  >
                    <link.icon className="w-4 h-4" />
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </a>
                ))}
              </div>
            </div>

            {/* Link Columns */}
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h3 className="text-sm font-medium mb-6">{title}</h3>
                <ul className="space-y-4">
                  {links.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-8 border-t border-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} UrbanSafe. Todos los derechos reservados.
          </p>

          <VisitorCounter />
        </div>
      </div>
    </footer>
  );
}
