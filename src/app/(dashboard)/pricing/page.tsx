"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Check,
  Star,
  Users,
  Shield,
  BarChart3,
  Crown,
  Calculator,
} from "lucide-react";
import { useRouter } from "next/navigation";

const PricingModalOverlay = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [billingCycle, setBillingCycle] = useState("session");
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [studentCount, setStudentCount] = useState(50);
  const [expandedPlan, setExpandedPlan] = useState<string | null>(null);

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
    const handleEscape = (e: KeyboardEvent) => {
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
      name: "Reports Only",
      subtitle: "Basic reporting for small schools",
      pricePerStudent: {
        session: 3000,
        term: 1000,
      },
      minStudents: 1,
      maxStudents: 200,
      color: "border-blue-200 bg-blue-50",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
      popular: false,
      features: [
        "Student Registration & Profiles",
        "Teacher Registration & Profiles",
        "Basic Attendance Tracking",
        "Simple Report Generation",
        "Academic Records Reports",
        "Export to PDF/Excel",
        "Email Support",
        "Single Campus Support",
      ],
      limitations: [
        "No Payment Processing",
        "No SMS Notifications",
        "No Advanced Analytics",
        "No Exam Management",
      ],
    },
    {
      name: "Reports + Payment",
      subtitle: "Reports with payment management",
      pricePerStudent: {
        session: 4800,
        term: 1600,
      },
      minStudents: 1,
      maxStudents: 500,
      color: "border-green-200 bg-green-50",
      buttonColor: "bg-green-600 hover:bg-green-700",
      popular: true,
      features: [
        "Everything in Reports Only",
        "Fee Payment Management",
        "Payment Tracking & Reports",
        "Outstanding Fees Alerts",
        "Receipt Generation",
        "Payment History",
        "Financial Reports",
        "Parent Payment Portal",
        "Multiple Payment Methods",
        "Automated Payment Reminders",
      ],
      limitations: [
        "No Advanced Exam Management",
        "No Bulk SMS",
        "Limited Analytics",
      ],
    },
    {
      name: "Complete School",
      subtitle: "Full school management system",
      pricePerStudent: {
        session: 6000,
        term: 2000,
      },
      minStudents: 1,
      maxStudents: 1000,
      color: "border-purple-200 bg-purple-50",
      buttonColor: "bg-purple-600 hover:bg-purple-700",
      popular: false,
      features: [
        "Everything in Reports + Payment",
        "Advanced Exam Management",
        "Comprehensive Result Processing",
        "Bulk SMS & Email",
        "Staff Management System",
        "Multi-class Timetabling",
        "Assignment Management",
        "Parent Portal Access",
        "Attendance Analytics",
        "Student Behavior Tracking",
        "Library Management",
        "Inventory Management",
        "Priority Support",
      ],
      limitations: ["No Multi-campus Support", "No API Access"],
    },
    {
      name: "Enterprise",
      subtitle: "Advanced features for large institutions",
      pricePerStudent: {
        session: 9000,
        term: 3000,
      },
      minStudents: 100,
      maxStudents: 5000,
      color: "border-orange-200 bg-orange-50",
      buttonColor: "bg-orange-600 hover:bg-orange-700",
      popular: false,
      features: [
        "Everything in Complete School",
        "Multi-campus Management",
        "Advanced Analytics Dashboard",
        "Custom Report Builder",
        "API Access & Integrations",
        "White-label Branding",
        "Advanced Security Features",
        "Automated Backup & Recovery",
        "Custom Workflows",
        "Integration with Banks",
        "Biometric Integration",
        "24/7 Priority Support",
        "Dedicated Account Manager",
        "On-site Training Available",
      ],
      limitations: [],
    },
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const calculateTotalPrice = (plan: any) => {
    const pricePerStudent =
      billingCycle === "session"
        ? plan.pricePerStudent.session
        : plan.pricePerStudent.term;

    const effectiveStudentCount = Math.max(
      Math.min(studentCount, plan.maxStudents),
      plan.minStudents
    );

    return pricePerStudent * effectiveStudentCount;
  };

  const getValidPlansForStudentCount = () => {
    return plans.filter(
      (plan) =>
        studentCount >= plan.minStudents && studentCount <= plan.maxStudents
    );
  };

  const handlePlanSelect = (planName: string) => {
    setSelectedPlan(planName);
    console.log(`Selected plan: ${planName} for ${studentCount} students`);
  };

  const handleStudentCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const count = parseInt(e.target.value) || 0;
    setStudentCount(Math.max(1, count));
    // Reset selected plan if it's no longer valid
    if (selectedPlan) {
      const selectedPlanData = plans.find((p) => p.name === selectedPlan);
      if (
        selectedPlanData &&
        (count < selectedPlanData.minStudents ||
          count > selectedPlanData.maxStudents)
      ) {
        setSelectedPlan(null);
      }
    }
  };

  const validPlans = getValidPlansForStudentCount();

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
          <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <div>
              <h1 className="text-xl font-bold">
                Choose Your School Management Plan
              </h1>
              <p className="text-blue-100 mt-1">
                Pay only for the students you need
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

              {/* Student Count Input */}
              <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-6 mb-8">
                <div className="flex items-center justify-center gap-6">
                  <div className="flex items-center gap-3">
                    <Calculator className="w-6 h-6 text-blue-600" />
                    <label className="text-lg font-semibold text-gray-900">
                      Number of Students:
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={studentCount}
                      onChange={handleStudentCountChange}
                      min="1"
                      max="5000"
                      className="w-24 p-2 border border-gray-300 rounded-lg text-center font-bold text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <span className="text-gray-600">students</span>
                  </div>
                </div>
                <p className="text-center text-gray-600 text-sm mt-2">
                  Pricing is calculated per student. Enter your current or
                  expected student count.
                </p>
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
                {plans.map((plan) => {
                  const isExpanded = expandedPlan === plan.name;
                  const isPlanValid = validPlans.includes(plan);
                  const totalPrice = calculateTotalPrice(plan);
                  const pricePerStudent =
                    billingCycle === "session"
                      ? plan.pricePerStudent.session
                      : plan.pricePerStudent.term;

                  return (
                    <div
                      key={plan.name}
                      className={`relative rounded-xl border-2 p-6 transition-all duration-300 ${
                        plan.color
                      } ${
                        plan.popular ? "scale-105 ring-2 ring-green-500" : ""
                      } ${
                        !isPlanValid
                          ? "opacity-50 pointer-events-none"
                          : "hover:shadow-lg"
                      }`}
                    >
                      {plan.popular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                            <Star className="w-3 h-3" /> Most Popular
                          </div>
                        </div>
                      )}

                      {!isPlanValid && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                            Not Available
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
                        <div className="mb-2">
                          <div className="text-3xl font-bold text-gray-900">
                            {formatPrice(totalPrice)}
                          </div>
                          <div className="text-gray-600 text-sm">
                            for {studentCount} students per {billingCycle}
                          </div>
                          <div className="text-gray-500 text-xs mt-1">
                            {formatPrice(pricePerStudent)} per student
                          </div>
                          {billingCycle === "session" && (
                            <div className="text-emerald-600 text-xs font-medium mt-1">
                              Save 15% compared to per term
                            </div>
                          )}
                        </div>

                        <div className="text-xs text-gray-500 mb-3">
                          Valid for {plan.minStudents}-{plan.maxStudents}{" "}
                          students
                        </div>

                        {isPlanValid && (
                          <button
                            onClick={() => handlePlanSelect(plan.name)}
                            className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${plan.buttonColor} text-white`}
                          >
                            {selectedPlan === plan.name
                              ? "Selected"
                              : "Select Plan"}
                          </button>
                        )}

                        <button
                          onClick={() =>
                            setExpandedPlan(isExpanded ? null : plan.name)
                          }
                          className="text-blue-600 text-xs mt-2 hover:underline"
                        >
                          {isExpanded
                            ? "Hide full plan details"
                            : "View all features"}
                        </button>
                      </div>

                      <div className="space-y-2 text-sm">
                        <h4 className="font-semibold text-gray-900 flex items-center gap-1">
                          <Check className="w-3 h-3 text-green-500" /> Features:
                        </h4>
                        {(isExpanded
                          ? plan.features
                          : plan.features.slice(0, 4)
                        ).map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <Check className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700 text-xs">
                              {feature}
                            </span>
                          </div>
                        ))}
                        {!isExpanded && plan.features.length > 4 && (
                          <div className="text-xs text-gray-500 italic">
                            +{plan.features.length - 4} more features
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Feature Comparison */}
              <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                  Why Choose Our School Management System?
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Pay Per Student
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Only pay for the students you actually have
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                      <BarChart3 className="w-6 h-6 text-green-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Scalable Features
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Choose features that match your school's needs
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Shield className="w-6 h-6 text-purple-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Reliable Support
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
          <div className="border-t bg-gray-50 p-4">
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
                      const selectedPlanData = plans.find(
                        (p) => p.name === selectedPlan
                      );
                      const totalPrice = calculateTotalPrice(selectedPlanData);
                      console.log("Proceeding with upgrade:", {
                        plan: selectedPlan,
                        studentCount,
                        totalPrice,
                        billingCycle,
                      });
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

// Usage example component
const DashboardWithPricingModal = () => {
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(true);
  const router = useRouter();

  return (
    <div className="min-h-screen ">
      {/* Pricing Modal Overlay */}
      <PricingModalOverlay
        isOpen={isPricingModalOpen}
        onClose={() => {
          setIsPricingModalOpen(false);
          router.back();
        }}
      />
    </div>
  );
};

export default DashboardWithPricingModal;
