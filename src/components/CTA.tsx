import React from "react";
import { CTASection } from "./cta-with-glow";

export default function CTA() {
  return (
    <CTASection
      title="Start building today"
      action={{
        text: "Get Started",
        href: "/docs",
        variant: "default",
      }}
    />
  );
}
