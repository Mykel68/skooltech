import React from "react";
import { CTASection } from "./cta-with-glow";

export default function CTA() {
  return (
    <CTASection
      title="School Management with SkoolTech"
      // description="Say goodbye to paperwork — manage exams, scores, and users in one place."
      action={{
        text: "Get Started",
        href: "/get-started", // You can adjust this path to match your actual onboarding route
        variant: "default",
      }}
    />
  );
}
