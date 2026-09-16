import { Navigation } from "@/components/landing/navigation";
import { HeroSection } from "@/components/landing/hero-section";
import { StatsSection } from "@/components/landing/stats-section";
import { SolutionSection } from "@/components/landing/solution-section";
import { TeamSection } from "@/components/landing/team-section";
import { ContactSection } from "@/components/landing/contact-section";
import { FooterSection } from "@/components/landing/footer-section";

export default function Home() {
  return (
    <main className="relative min-h-screen noise-overlay">
      <Navigation />
      <HeroSection />
      <StatsSection />
      <SolutionSection />
      <TeamSection />
      <ContactSection />
      <FooterSection />
    </main>
  );
}
