"use client";
import { motion } from "framer-motion";
import {
  BarChart3,
  Calendar,
  FileText,
  GraduationCap,
  LineChart,
  MessageSquare,
  ShieldCheck,
  Smartphone,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: FileText,
      title: "Instant Report Cards",
      description:
        "Create and share student reports in seconds — no more manual formatting.",
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-500/10 to-cyan-500/10",
      category: "Reports",
    },
    {
      icon: BarChart3,
      title: "Performance Insights",
      description:
        "See how students are doing at a glance with clear graphs and summaries.",
      color: "from-purple-500 to-pink-500",
      bgColor: "from-purple-500/10 to-pink-500/10",
      category: "Analytics",
    },
    {
      icon: Calendar,
      title: "Exam Timetables",
      description:
        "Plan and publish exams with auto alerts — no more conflicts or confusion.",
      color: "from-emerald-500 to-teal-500",
      bgColor: "from-emerald-500/10 to-teal-500/10",
      category: "Scheduling",
    },
    {
      icon: ShieldCheck,
      title: "Safe Student Data",
      description:
        "All records are securely stored with cloud backups and encryption.",
      color: "from-orange-500 to-red-500",
      bgColor: "from-orange-500/10 to-red-500/10",
      category: "Security",
    },
    {
      icon: Smartphone,
      title: "Use Anywhere",
      description: "Works on any device — phone, tablet, or computer.",
      color: "from-indigo-500 to-purple-500",
      bgColor: "from-indigo-500/10 to-purple-500/10",
      category: "Mobile",
    },
    {
      icon: MessageSquare,
      title: "Parent Updates",
      description:
        "Send automatic messages to parents about results, fees, and events.",
      color: "from-green-500 to-emerald-500",
      bgColor: "from-green-500/10 to-emerald-500/10",
      category: "Communication",
    },
    {
      icon: LineChart,
      title: "Progress Charts",
      description:
        "See academic progress over time — clear and easy to understand.",
      color: "from-yellow-500 to-orange-500",
      bgColor: "from-yellow-500/10 to-orange-500/10",
      category: "Tracking",
    },
    {
      icon: GraduationCap,
      title: "Flexible Grading",
      description:
        "Set up grading rules that match your school’s style and standards.",
      color: "from-rose-500 to-pink-500",
      bgColor: "from-rose-500/10 to-pink-500/10",
      category: "Custom",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.6, -0.05, 0.01, 0.99],
      },
    },
  };

  const cardHoverVariants = {
    hover: {
      y: -8,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  return (
    <section
      id="features"
      className="relative py-24 md:px-6 lg:px-12 overflow-hidden bg-gradient-to-b from-white via-slate-50/50 to-blue-50/30 dark:from-slate-900 dark:via-slate-900/95 dark:to-indigo-950/20"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-800/50 bg-[size:80px_80px] opacity-20" />
      <div className="absolute top-1/4 -right-32 w-64 h-64 bg-gradient-to-l from-blue-400/20 to-purple-600/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -left-32 w-64 h-64 bg-gradient-to-r from-emerald-400/20 to-cyan-600/20 rounded-full blur-3xl" />

      <div className="relative container mx-auto px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          className="text-center space-y-6 mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium shadow-lg shadow-indigo-500/25">
            <Sparkles className="w-4 h-4" />
            Features
          </div>

          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-slate-900 via-indigo-800 to-purple-800 dark:from-white dark:via-indigo-200 dark:to-purple-200 bg-clip-text text-transparent">
              Powerful Tools for
            </span>
            <br />
            <span className="text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text">
              Modern Schools
            </span>
          </h2>

          <p className="max-w-3xl mx-auto text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
            Our comprehensive suite of features is designed to streamline school
            operations and enhance educational outcomes with cutting-edge
            technology.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature, i) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover="hover"
                className="group relative"
              >
                <motion.div
                  variants={cardHoverVariants}
                  className="relative h-full"
                >
                  {/* Glow Effect */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${feature.bgColor} rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500`}
                  />

                  {/* Card */}
                  <div className="relative h-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500">
                    {/* Category Badge */}
                    <div className="absolute top-4 right-4">
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full">
                        {feature.category}
                      </span>
                    </div>

                    {/* Icon */}
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>

                    {/* Content */}
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
                        {feature.title}
                      </h3>

                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>

                    {/* Hover Arrow */}
                    <div className="flex items-center justify-between mt-6 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                        Learn more
                      </span>
                      <ArrowRight className="w-4 h-4 text-indigo-600 dark:text-indigo-400 transform translate-x-0 group-hover:translate-x-1 transition-transform" />
                    </div>

                    {/* Bottom Border Animation */}
                    <div
                      className={`absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r ${feature.color} rounded-full transition-all duration-500 group-hover:w-[calc]`}
                    />
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <Sparkles className="w-4 h-4" />
            And many more features to discover
          </div>
        </motion.div>
      </div>
    </section>
  );
}
