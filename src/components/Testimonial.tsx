import React from "react";
import { TestimonialsSection } from "./testimonials-with-marquee";
import { testimonials } from "@/constants/testimonial";

export default function Testimonial() {
  return (
    <TestimonialsSection
      title="Trusted by schools, loved by educators"
      description="Teachers and school admins across the country trust SkoolTech to simplify their work and improve student outcomes."
      testimonials={testimonials}
    />
  );
}
