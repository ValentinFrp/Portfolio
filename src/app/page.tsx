import IntroOverlay from "@/components/intro/IntroOverlay";
import Header from "@/components/layout/Header";
import SmoothScroll from "@/components/layout/SmoothScroll";
import ParticleField from "@/components/scene/ParticleField";
import Contact from "@/components/sections/Contact";
import Hero from "@/components/sections/Hero";
import Pipeline from "@/components/sections/Pipeline";
import Work from "@/components/sections/Work";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <IntroOverlay />
      <ParticleField />
      <Header />
      <main>
        <Hero />
        <Pipeline />
        <Work />
        <Contact />
      </main>
    </>
  );
}
