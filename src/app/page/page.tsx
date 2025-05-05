import CTA from "@/components/CTA";
import FAQ from "@/components/FAQ";
import Feature from "@/components/Feature";
import Footer from "@/components/Footer";
import Header from "@/components/Navbar";
import { HeroSection } from "@/components/hero-section-dark";
import Pricing from "@/components/Pricing";
import Testimonial from "@/components/Testimonial";
import TrustedBrand from "@/components/TrustedBrand";
import React from "react";

export default function page() {
  return (
    <div className="overflow-x-hidden">
      <Header />
      <HeroSection
        title="Empowering Schools with Smart Technology"
        subtitle={{
          regular: "Digitize, Simplify, and Transform ",
          gradient: "your entire school system",
        }}
        description="Skooltech helps schools go digital—manage students, teachers, scores, and records effortlessly with our intuitive platform."
        ctaText="Get Started"
        ctaHref="/signup"
        bottomImage={{
          light: "https://www.launchuicomponents.com/app-light.png",
          dark: "https://www.launchuicomponents.com/app-dark.png",
        }}
        gridOptions={{
          angle: 65,
          opacity: 0.4,
          cellSize: 50,
          lightLineColor: "#4a4a4a",
          darkLineColor: "#2a2a2a",
        }}
      />
      <TrustedBrand />
      <Feature />
      <Testimonial />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
}
