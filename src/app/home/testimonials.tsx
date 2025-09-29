"use client";

import React, { useState, useEffect } from "react";
import {
  Quote,
  Star,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function ModernTestimonialsUI() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);

  const testimonials = [
    {
      quote:
        "Zuvia has helped us move from paper-based report cards to digital ones — parents now receive results instantly.",
      author: "Mrs. Adeola James",
      role: "Principal, Bright Future School, Ibadan",
      avatar: "AJ",
      rating: 5,
      color: "from-purple-500 to-pink-500",
    },
    {
      quote:
        "The communication with parents has improved a lot. They now get timely updates on their child’s academic progress.",
      author: "Mr. Chukwuemeka Obi",
      role: "Vice Principal, Sunrise College, Enugu",
      avatar: "CO",
      rating: 5,
      color: "from-blue-500 to-cyan-500",
    },
    {
      quote:
        "Setting up exams and generating results is now so simple. Zuvia saved us hours of admin work.",
      author: "Mrs. Amina Bello",
      role: "Admin Officer, Harmony School, Abuja",
      avatar: "AB",
      rating: 5,
      color: "from-green-500 to-emerald-500",
    },
    {
      quote:
        "Support is always responsive and helpful. Our teachers quickly got the hang of it.",
      author: "Mr. Tunde Ayodeji",
      role: "ICT Coordinator, Royal Crest Academy, Lagos",
      avatar: "TA",
      rating: 5,
      color: "from-orange-500 to-red-500",
    },
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  return (
    <div className="min-h-screen md:px-6 lg:px-12 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute -bottom-20 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-20 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 px-6 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 mb-4">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium text-white">
              5-Star Reviews
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Built for
            </span>
            <br />
            <span className="text-white">Modern Nigerian Schools</span>
          </h1>

          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Hear from real school leaders using Zuvia to simplify results,
            engage parents, and manage academics better — with less stress.
          </p>
        </div>

        {/* Main testimonial showcase */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="relative">
            {/* Featured testimonial */}
            <div className="bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10 p-8 md:p-12 shadow-2xl">
              <div className="flex items-start gap-6">
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${testimonials[activeIndex].color} flex items-center justify-center text-white font-bold text-xl shadow-lg`}
                >
                  {testimonials[activeIndex].avatar}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>

                  <Quote className="w-8 h-8 text-purple-400 mb-4 opacity-60" />

                  <blockquote className="text-2xl md:text-3xl text-white leading-relaxed mb-6 font-light">
                    "{testimonials[activeIndex].quote}"
                  </blockquote>

                  <div>
                    <p className="text-lg font-semibold text-white mb-1">
                      {testimonials[activeIndex].author}
                    </p>
                    <p className="text-gray-400">
                      {testimonials[activeIndex].role}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation controls */}
            <div className="flex items-center justify-between mt-8">
              <div className="flex items-center gap-4">
                <button
                  onClick={prevTestimonial}
                  className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  onClick={nextTestimonial}
                  className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                <button
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                  className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
                >
                  {isAutoPlaying ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Dots indicator */}
              <div className="flex items-center gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === activeIndex
                        ? "bg-white w-8"
                        : "bg-white/30 hover:bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Testimonial grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`group cursor-pointer transition-all duration-500 ${
                index === activeIndex ? "scale-105" : "hover:scale-105"
              }`}
              onMouseEnter={() => setHoveredCard(null)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => setActiveIndex(index)}
            >
              <div
                className={`relative overflow-hidden rounded-2xl border transition-all duration-500 ${
                  index === activeIndex
                    ? "bg-white/10 border-white/30 shadow-xl"
                    : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                }`}
              >
                {/* Gradient overlay */}
                <div
                  className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-br ${testimonial.color}`}
                />

                <div className="relative p-6 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${testimonial.color} flex items-center justify-center text-white font-semibold text-sm shadow-lg`}
                    >
                      {testimonial.avatar}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium text-sm">
                        {testimonial.author}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-3 h-3 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>

                  <p className="text-gray-300 text-sm leading-relaxed line-clamp-4">
                    "{testimonial.quote}"
                  </p>

                  {/* Hover effect indicator */}
                  <div
                    className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${
                      testimonial.color
                    } transition-all duration-500 ${
                      hoveredCard === index ? "w-full" : "w-0"
                    }`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center mt-20">
          <div
            className="inline-flex items-center gap-4 px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer"
            onClick={() => {
              router.push("/register");
            }}
          >
            <span>
              <span>Not 10,000 schools yet — but yours could be.</span>
            </span>
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
