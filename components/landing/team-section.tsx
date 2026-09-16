"use client";

import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const team = [
  { name: "Camilo Andrés Angarita Ramírez", role: "Producto", initials: "CA" },
  { name: "Thomas Alejandro Jutinico Jaramillo", role: "Tecnología", initials: "TJ" },
  { name: "Cristian Manuel Rivera Trujillo", role: "Comunidad", initials: "CR" },
];

export function TeamSection() {
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
    <section id="equipo" ref={sectionRef} className="relative py-24 lg:py-32 bg-foreground/[0.02]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div
          className={`max-w-2xl mx-auto text-center transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <h2 className="text-4xl lg:text-5xl font-display tracking-tight mb-6">
            Quiénes somos
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Somos un equipo de Bogotá construyendo tecnología para quienes hacen posible
            la última milla. UrbanSafe nace de conversaciones reales con domiciliarios
            sobre los riesgos que enfrentan cada día.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-8 mt-16">
          {team.map((member, index) => (
            <div
              key={member.name + index}
              className={`flex flex-col items-center gap-3 transition-all duration-500 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: `${index * 100 + 200}ms` }}
            >
              <Avatar className="size-20 sm:size-24">
                <AvatarFallback className="bg-secondary text-secondary-foreground text-xl font-display">
                  {member.initials}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <div className="text-sm font-medium">{member.name}</div>
                <div className="text-xs text-muted-foreground">{member.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
