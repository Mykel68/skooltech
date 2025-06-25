"use client";

import React, { useState, useEffect } from "react";

import { X, Check, Star, Users, Shield, BarChart3, Crown } from "lucide-react";
import { useRouter } from "next/navigation";

const PricingModalOverlay = ({ isOpen, onClose }) => {
  const [billingCycle, setBillingCycle] = useState("session");
  const [selectedPlan, setSelectedPlan] = useState(null);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle ESC key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const plans = [
    {
      name: "Starter",
      subtitle: "Perfect for small schools",
      userLimit: "Up to 200 students",
      sessionPrice: 45000,
      termPrice: 18000,
      color: "border-blue-200 bg-blue-50",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
      popular: false,
      features: [
        "Student Registration & Profiles",
        "Fee Payment Management",
        "Basic Attendance Tracking",
        "Simple Report Generation",
        "Parent SMS Notifications",
        "Basic Academic Records",
        "Email Support",
        "Single Campus Support",
      ],
      limitations: [
        "No Advanced Analytics",
        "No Exam Management",
        "No Bulk SMS",
        "No API Access",
      ],
    },
    {
      name: "Professional",
      subtitle: "Most popular for growing schools",
      userLimit: "Up to 500 students",
      sessionPrice: 85000,
      termPrice: 32000,
      color: "border-green-200 bg-green-50",
      buttonColor: "bg-green-600 hover:bg-green-700",
      popular: true,
      features: [
        "Everything in Starter",
        "Advanced Exam Management",
        "Comprehensive Result Processing",
        "Attendance Analytics",
        "Bulk SMS & Email",
        "Parent Portal Access",
        "Staff Management System",
        "Financial Reports & Analytics",
        "Multi-class Timetabling",
        "Assignment Management",
        "Priority Email Support",
        "Phone Support (Business Hours)",
      ],
      limitations: ["Limited API Calls", "No White-label Options"],
    },
    {
      name: "Enterprise",
      subtitle: "For large schools & school groups",
      userLimit: "Up to 2000 students",
      sessionPrice: 150000,
      termPrice: 58000,
      color: "border-purple-200 bg-purple-50",
      buttonColor: "bg-purple-600 hover:bg-purple-700",
      popular: false,
      features: [
        "Everything in Professional",
        "Multi-campus Management",
        "Advanced Analytics Dashboard",
        "Custom Report Builder",
        "API Access & Integrations",
        "White-label Branding",
        "Advanced Security Features",
        "Automated Backup & Recovery",
        "Custom Workflows",
        "Integration with Banks",
        "24/7 Priority Support",
        "Dedicated Account Manager",
        "On-site Training Available",
      ],
      limitations: [],
    },
    {
      name: "Premium",
      subtitle: "Unlimited scale for large institutions",
      userLimit: "Unlimited students",
      sessionPrice: 250000,
      termPrice: 95000,
      color: "border-orange-200 bg-orange-50",
      buttonColor: "bg-orange-600 hover:bg-orange-700",
      popular: false,
      features: [
        "Everything in Enterprise",
        "Unlimited Students & Staff",
        "Advanced AI Analytics",
        "Custom Mobile App",
        "Advanced Biometric Integration",
        "Custom Module Development",
        "Advanced Payment Gateway",
        "Multi-language Support",
        "Advanced Security & Compliance",
        "Dedicated Server Options",
        "24/7 Technical Support",
        "Quarterly Business Reviews",
        "Custom Training Programs",
      ],
      limitations: [],
    },
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handlePlanSelect = (planName) => {
    setSelectedPlan(planName);
    // Here you would typically handle the plan selection logic
    console.log(`Selected plan: ${planName}`);
    // You might want to redirect to payment or show a confirmation
  };

  return (
    <div
      className="fixed inset-0 z-[9999] overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-headline"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div className="relative h-full flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl h-full max-h-[95vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <div>
              <h1 className="text-3xl font-bold">
                Upgrade Your School Management
              </h1>
              <p className="text-blue-100 mt-1">
                Choose the perfect plan for your institution
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto">
            <div className="p-8">
              {/* Current Plan Status */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="bg-amber-500 p-2 rounded-full">
                    <Crown className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-amber-900">
                      You're currently on Free Trial
                    </h3>
                    <p className="text-amber-700 text-sm">
                      14 days remaining • 45/50 students used
                    </p>
                  </div>
                  <div className="ml-auto">
                    <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Upgrade Now
                    </span>
                  </div>
                </div>
              </div>

              {/* Billing Toggle */}
              <div className="flex items-center justify-center mb-8">
                <div className="bg-gray-100 rounded-lg p-1 shadow-sm">
                  <button
                    onClick={() => setBillingCycle("session")}
                    className={`px-6 py-2 rounded-md font-medium transition-all ${
                      billingCycle === "session"
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Per Session (Save 15%)
                  </button>
                  <button
                    onClick={() => setBillingCycle("term")}
                    className={`px-6 py-2 rounded-md font-medium transition-all ${
                      billingCycle === "term"
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Per Term
                  </button>
                </div>
              </div>

              {/* Pricing Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {plans.map((plan, index) => (
                  <div
                    key={plan.name}
                    className={`relative rounded-xl border-2 p-6 hover:shadow-lg transition-all duration-300 ${
                      plan.color
                    } ${plan.popular ? "scale-105 ring-2 ring-green-500" : ""}`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          Most Popular
                        </div>
                      </div>
                    )}

                    <div className="text-center mb-4">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {plan.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        {plan.subtitle}
                      </p>
                      <div className="mb-3">
                        <div className="text-3xl font-bold text-gray-900">
                          {formatPrice(
                            billingCycle === "session"
                              ? plan.sessionPrice
                              : plan.termPrice
                          )}
                        </div>
                        <div className="text-gray-600 text-sm">
                          per {billingCycle} • {plan.userLimit}
                        </div>
                      </div>
                      <button
                        onClick={() => handlePlanSelect(plan.name)}
                        className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${plan.buttonColor} text-white`}
                      >
                        {selectedPlan === plan.name
                          ? "Selected"
                          : "Select Plan"}
                      </button>
                    </div>

                    <div className="space-y-2 text-sm">
                      <h4 className="font-semibold text-gray-900 flex items-center gap-1">
                        <Check className="w-3 h-3 text-green-500" />
                        Key Features:
                      </h4>
                      {plan.features.slice(0, 4).map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <Check className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 text-xs">
                            {feature}
                          </span>
                        </div>
                      ))}
                      {plan.features.length > 4 && (
                        <div className="text-xs text-gray-500 italic">
                          +{plan.features.length - 4} more features
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Feature Comparison */}
              <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                  Why Upgrade from Free Trial?
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Unlimited Students
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Scale beyond the 50 student trial limit
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                      <BarChart3 className="w-6 h-6 text-green-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Advanced Analytics
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Deep insights into school performance
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Shield className="w-6 h-6 text-purple-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Priority Support
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Get help when you need it most
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t bg-gray-50 p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <p className="text-gray-600 text-sm">
                  Need help choosing?{" "}
                  <span className="text-blue-600 font-medium cursor-pointer hover:underline">
                    Contact our sales team
                  </span>
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Maybe Later
                </button>
                <button
                  onClick={() => {
                    if (selectedPlan) {
                      // Handle upgrade process
                      console.log("Proceeding with upgrade:", selectedPlan);
                    }
                  }}
                  disabled={!selectedPlan}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    selectedPlan
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {selectedPlan
                    ? `Upgrade to ${selectedPlan}`
                    : "Select a Plan"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Usage example component showing how to trigger the modal
const DashboardWithPricingModal = () => {
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(true);
  const router = useRouter();

  return (
    <div className="min-h-screen ">
      {/* Your existing dashboard content */}
      {/* <div className="p-8"> */}
      {/* <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <p className="text-gray-600 mb-4">
          Your existing dashboard content goes here...
        </p> */}

      {/* Trigger button */}
      {/* <button
          onClick={() => setIsPricingModalOpen(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          View Pricing Plans
        </button> */}
      {/* </div> */}

      {/* Pricing Modal Overlay */}
      <PricingModalOverlay
        isOpen={isPricingModalOpen}
        onClose={() => {
          setIsPricingModalOpen(false);
          if (window.history.length > 1) {
            router.back();
          } else {
            router.push("/");
          }
        }}
      />
    </div>
  );
};

export default DashboardWithPricingModal;
