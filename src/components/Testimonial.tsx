import React from "react";
import { TestimonialsSection } from "./testimonials-with-marquee";
import { testimonials } from "@/constants/testimonial";

export default function Testimonial() {
  return (
    <TestimonialsSection
      title="Trusted by developers worldwide"
      description="Join thousands of developers who are already building the future with our AI platform"
      testimonials={testimonials}
    />
  );
}
