"use client";

import React, { useState } from "react";
import {
  Check,
  X,
  Star,
  Users,
  Calendar,
  Shield,
  Headphones,
  Award,
  BookOpen,
  CreditCard,
  FileText,
  UserCheck,
  BarChart3,
  Bell,
  MessageSquare,
} from "lucide-react";

const PricingPage = () => {
  const [billingCycle, setBillingCycle] = useState("session");
  const [selectedPlan, setSelectedPlan] = useState(null);

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

  const addOns = [
    {
      name: "Additional Students",
      price: "₦150 per student",
      period: "per session",
      description: "Add more students beyond your plan limit",
    },
    {
      name: "Biometric Integration",
      price: "₦25,000",
      period: "one-time setup",
      description: "Fingerprint attendance system integration",
    },
    {
      name: "Custom Reports",
      price: "₦15,000",
      period: "per report",
      description: "Tailored reporting solutions for your needs",
    },
    {
      name: "Extra SMS Credits",
      price: "₦8,000",
      period: "per 1000 SMS",
      description: "Additional SMS notifications beyond included quota",
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

  return (
    <div className="min-h-screen py-12 ">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your School Management Plan
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Transform your school with our comprehensive management system. From
            fee collection to result processing, we've got you covered.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center mb-8">
            <div className="bg-white rounded-lg p-1 shadow-sm border">
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
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border-2 p-8 shadow-lg hover:shadow-xl transition-all duration-300 ${
                plan.color
              } ${plan.popular ? "scale-105 ring-2 ring-green-500" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-600 mb-4">{plan.subtitle}</p>
                <div className="mb-4">
                  <div className="text-4xl font-bold text-gray-900">
                    {formatPrice(
                      billingCycle === "session"
                        ? plan.sessionPrice
                        : plan.termPrice
                    )}
                  </div>
                  <div className="text-gray-600">
                    per {billingCycle} • {plan.userLimit}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPlan(plan.name)}
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${plan.buttonColor} text-white`}
                >
                  Start Free Trial
                </button>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Features Included:
                </h4>
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}

                {plan.limitations.length > 0 && (
                  <>
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2 mt-4">
                      <X className="w-4 h-4 text-red-500" />
                      Not Included:
                    </h4>
                    {plan.limitations.map((limitation, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <X className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-500">
                          {limitation}
                        </span>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Add-ons Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Optional Add-ons
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {addOns.map((addon, index) => (
              <div
                key={index}
                className="border rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold text-gray-900 mb-2">
                  {addon.name}
                </h3>
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {addon.price}
                </div>
                <div className="text-sm text-gray-600 mb-3">{addon.period}</div>
                <p className="text-sm text-gray-700">{addon.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Features Overview */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white p-12 mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Why Schools Choose Our Platform
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-90" />
              <h3 className="text-xl font-semibold mb-2">Student Management</h3>
              <p className="opacity-90">
                Complete student profiles, enrollment, and tracking
              </p>
            </div>
            <div className="text-center">
              <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-90" />
              <h3 className="text-xl font-semibold mb-2">Fee Management</h3>
              <p className="opacity-90">
                Automated fee collection and payment tracking
              </p>
            </div>
            <div className="text-center">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-90" />
              <h3 className="text-xl font-semibold mb-2">Result Processing</h3>
              <p className="opacity-90">
                Comprehensive exam and result management
              </p>
            </div>
            <div className="text-center">
              <UserCheck className="w-12 h-12 mx-auto mb-4 opacity-90" />
              <h3 className="text-xl font-semibold mb-2">Attendance</h3>
              <p className="opacity-90">
                Real-time attendance tracking and reporting
              </p>
            </div>
            <div className="text-center">
              <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-90" />
              <h3 className="text-xl font-semibold mb-2">Analytics</h3>
              <p className="opacity-90">
                Detailed insights and performance metrics
              </p>
            </div>
            <div className="text-center">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-90" />
              <h3 className="text-xl font-semibold mb-2">Communication</h3>
              <p className="opacity-90">
                SMS and email notifications to parents
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Can I upgrade my plan anytime?
              </h3>
              <p className="text-gray-700 mb-4">
                Yes, you can upgrade your plan at any time. The price difference
                will be prorated for the remaining period.
              </p>

              <h3 className="font-semibold text-gray-900 mb-2">
                What happens if I exceed my student limit?
              </h3>
              <p className="text-gray-700 mb-4">
                You can purchase additional student slots or upgrade to a higher
                plan. We'll notify you before you reach your limit.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Is there a free trial?
              </h3>
              <p className="text-gray-700 mb-4">
                Yes, all plans come with a 14-day free trial. No credit card
                required to start.
              </p>

              <h3 className="font-semibold text-gray-900 mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-700 mb-4">
                We accept bank transfers, online payments, and can arrange
                direct debit for enterprise customers.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl text-white p-12">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your School?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of schools already using our platform to streamline
            their operations
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Start Free Trial
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-blue-600 transition-colors">
              Schedule Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
