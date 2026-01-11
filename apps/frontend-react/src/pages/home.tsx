import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/sections/hero-section";


export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main>
        <HeroSection />
        {/* <FeaturesSection />
        <StatsSection />
        <TestimonialsSection />
        <CTASection /> */}
      </main>

      <Footer />
    </div>
  );
}
