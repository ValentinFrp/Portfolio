import IntroOverlay from "@/components/intro/IntroOverlay";
import Journey from "@/components/journey/Journey";
import Header from "@/components/layout/Header";
import SmoothScroll from "@/components/layout/SmoothScroll";
import ParticleField from "@/components/scene/ParticleField";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <IntroOverlay />
      <ParticleField />
      <Header />
      <Journey />
    </>
  );
}
