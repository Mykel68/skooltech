import React from "react";
import { FaqSectionWithCategories } from "./faq-with-categories";
import { FAQS } from "@/constants/faq";

export default function FAQ() {
  return (
    <FaqSectionWithCategories
      title="Frequently Asked Questions"
      description="Find answers to common questions about our services"
      items={FAQS}
      contactInfo={{
        title: "Still have questions?",
        buttonText: "Contact Support",
        // onContact: () => console.log("Contact support clicked"),
      }}
    />
  );
}
