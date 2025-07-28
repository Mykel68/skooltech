import React from "react";
import { FaqSectionWithCategories } from "./faq-with-categories";
import { FAQS } from "@/constants/faq";

export default function FAQ() {
  return (
    <FaqSectionWithCategories
      title="Frequently Asked Questions"
      description="Quick answers about how SkoolTech helps you manage exams and users effectively."
      items={FAQS}
      contactInfo={{
        title: "Need further assistance?",
        buttonText: "Contact SkoolTech Support",
        // onContact: () => {
        //   // Navigate to contact page or open modal
        //   window.location.href = "/contact";
        // },
      }}
    />
  );
}
