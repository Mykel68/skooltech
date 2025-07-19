"use client";

import React, { useState } from "react";
import {
  ArrowRight,
  Mail,
  MessageSquare,
  Phone,
  X,
  Send,
  Sparkles,
  Calendar,
  Users,
  Zap,
  CheckCircle,
  Star,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function ModernCTAUI() {
  const router = useRouter();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    school: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Simulate form submission
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setIsFormVisible(false);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        school: "",
        message: "",
      });
    }, 2000);
  };

  const toggleForm = () => {
    setIsFormVisible(!isFormVisible);
  };

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Support",
      description: "Launching soon...",
      color: "from-blue-500 to-cyan-500",
      action: "Coming Soon",
    },
    {
      icon: Phone,
      title: "Call Us",
      description: "+1 (555) 123-4567",
      color: "from-green-500 to-emerald-500",
      action: "Call Now",
    },
    {
      icon: MessageSquare,
      title: "Live Chat",
      description: "Available Monday-Friday, 9am-5pm",
      color: "from-purple-500 to-pink-500",
      action: "Start Chat",
    },
  ];

  const features = [
    { icon: Users, text: "Join Early Access Schools" },
    { icon: Zap, text: "Setup in less than a week" },
    { icon: Star, text: "5-Star Support Rating" },
    { icon: CheckCircle, text: "99.9% Uptime Guarantee" },
  ];

  return (
    <div className="min-h-screen md:px-6 lg:px-12 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute -bottom-20 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      {/* Floating sparkles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          >
            <Sparkles className="w-4 h-4 text-white/20" />
          </div>
        ))}
      </div>

      <div className="relative z-10 px-6 py-20">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 mb-6">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-white">
              Transform Your School Today
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Ready to
            </span>
            <br />
            <span className="text-white">Transform Your School?</span>
          </h1>

          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-12">
            Be among the first to transform your institution with SkoolTech — a
            smarter way to manage schools in Nigeria.
          </p>

          {/* Feature highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-16">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300"
              >
                <feature.icon className="w-6 h-6 text-purple-400" />
                <span className="text-sm text-white font-medium text-center">
                  {feature.text}
                </span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <button
              onClick={() => {
                router.push("/register");
              }}
              className="group relative overflow-hidden px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-3">
                <span>Get Started Free</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </button>

            <button
              className="group px-8 py-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/20 text-white font-semibold text-lg hover:bg-white/10 transition-all duration-300 hover:scale-105"
              onClick={toggleForm}
            >
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5" />
                <span>Schedule Demo</span>
              </div>
            </button>
          </div>
        </div>

        {/* Contact Methods */}
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Get in Touch</h2>
            <p className="text-gray-300 text-lg">
              Choose your preferred way to connect with our team
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
            {contactMethods.map((method, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-8 hover:bg-white/10 transition-all duration-500 hover:scale-105 cursor-pointer"
              >
                {/* Gradient overlay */}
                <div
                  className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br ${method.color}`}
                />

                <div className="relative">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${method.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <method.icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-xl font-semibold text-white mb-2">
                    {method.title}
                  </h3>
                  <p className="text-gray-300 mb-6">{method.description}</p>

                  <div
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${method.color} text-white font-medium text-sm group-hover:shadow-lg transition-all duration-300`}
                  >
                    <span>{method.action}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust indicators */}
        <div className="text-center">
          <p className="text-gray-400 mb-6">
            Trusted by leading educational institutions worldwide
          </p>
          <div className="flex justify-center items-center gap-8 opacity-50">
            {/* Mock school logos */}
            <div className="w-24 h-12 bg-white/10 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-semibold">SCHOOL</span>
            </div>
            <div className="w-24 h-12 bg-white/10 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-semibold">ACADEMY</span>
            </div>
            <div className="w-24 h-12 bg-white/10 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-semibold">COLLEGE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Form Overlay */}
      {isFormVisible && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-md">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-8 shadow-2xl">
              {/* Close button */}
              <button
                onClick={toggleForm}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300"
              >
                <X className="w-4 h-4" />
              </button>

              {!isSubmitted ? (
                <>
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      Let's Get Started
                    </h3>
                    <p className="text-gray-300">
                      Tell us about your school and we'll be in touch within 24
                      hours
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <input
                          type="text"
                          name="firstName"
                          placeholder="First name"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-300"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          name="lastName"
                          placeholder="Last name"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-300"
                        />
                      </div>
                    </div>

                    <input
                      type="email"
                      name="email"
                      placeholder="Email address"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-300"
                    />

                    <input
                      type="text"
                      name="school"
                      placeholder="School/Institution"
                      value={formData.school}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-300"
                    />

                    <textarea
                      name="message"
                      placeholder="Tell us about your school and requirements..."
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-300 resize-none"
                    />

                    <button
                      onClick={handleSubmit}
                      className="w-full group relative overflow-hidden px-6 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative flex items-center justify-center gap-2">
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
                      </div>
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-gray-300">
                    Thank you for your interest. We'll get back to you within 24
                    hours.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
