import Hero from "@/components/Hero";
import About from "@/components/About";
import ProofResults from "@/components/ProofResults";
import ScaleTiers from "@/components/ScaleTiers";
import WhyUs from "@/components/WhyUs";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <ProofResults />
      <ScaleTiers />
      <WhyUs />
      <FAQ />
      <Footer />
    </>
  );
}