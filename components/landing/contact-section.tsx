"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const localidades = [
  "Usaquén",
  "Chapinero",
  "Santa Fe",
  "San Cristóbal",
  "Kennedy",
  "Engativá",
  "Suba",
  "Fontibón",
  "Puente Aranda",
  "Ciudad Bolívar",
];

const registroSchema = z.object({
  nombre: z.string().min(2, "Ingresá tu nombre completo"),
  correo: z.string().email("Ingresá un correo válido"),
  localidad: z.string().min(1, "Seleccioná tu localidad"),
});

type RegistroValues = z.infer<typeof registroSchema>;

export function ContactSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const form = useForm<RegistroValues>({
    resolver: zodResolver(registroSchema),
    defaultValues: { nombre: "", correo: "", localidad: "" },
  });

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

  // Sin backend todavía: el registro solo confirma en pantalla y resetea el
  // formulario. Falta conectar este onSubmit a un endpoint real.
  function onSubmit(values: RegistroValues) {
    toast.success("¡Listo! Te avisamos apenas UrbanSafe esté disponible.");
    form.reset();
  }

  return (
    <section id="registro" ref={sectionRef} className="relative py-24 lg:py-32">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div
          className={`max-w-md mx-auto transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="text-center mb-10">
            <h2 className="text-4xl lg:text-5xl font-display tracking-tight mb-4">
              Regístrate
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Sé de los primeros en probar UrbanSafe y ayudanos a mapear tu localidad.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
              <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="Tu nombre completo" className="h-12" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="correo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo electrónico</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="tucorreo@ejemplo.com"
                        className="h-12"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="localidad"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Localidad en Bogotá</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12 w-full">
                          <SelectValue placeholder="Seleccioná tu localidad" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {localidades.map((localidad) => (
                          <SelectItem key={localidad} value={localidad}>
                            {localidad}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                size="lg"
                className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full text-base"
              >
                Registrarme Gratis
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
}
