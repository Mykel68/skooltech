"use client";

import { motion } from "framer-motion";
import {
  CheckCircle,
  Target,
  Eye,
  Zap,
  Globe,
  TrendingUp,
  Users,
  Shield,
} from "lucide-react";

export default function About() {
  const stats = [
    {
      value: "Beta",
      label: "Now Live",
      icon: Users,
      color: "from-blue-500 to-cyan-500",
    },
    {
      value: "For",
      label: "Schools & Parents",
      icon: TrendingUp,
      color: "from-purple-500 to-pink-500",
    },
    {
      value: "Focus",
      label: "Results & Reports",
      icon: Target,
      color: "from-emerald-500 to-teal-500",
    },
    {
      value: "Coming",
      label: "Parent Messaging",
      icon: Shield,
      color: "from-orange-500 to-red-500",
    },
  ];

  const missionPoints = [
    { text: "Simplify school administration", icon: Zap },
    { text: "Enhance teaching efficiency", icon: TrendingUp },
    { text: "Improve student performance tracking", icon: Target },
    { text: "Streamline communication", icon: Users },
  ];

  const visionPoints = [
    { text: "Global accessibility", icon: Globe },
    { text: "Continuous innovation", icon: Zap },
    { text: "Data-driven insights", icon: TrendingUp },
    { text: "Seamless integration", icon: Target },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.6, -0.05, 0.01, 0.99],
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <section
      id="about"
      className="relative py-24 md:px-6 lg:px-12 overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/20"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-800 bg-[size:60px_60px] opacity-30" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-purple-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-emerald-400/10 to-cyan-600/10 rounded-full blur-3xl" />

      <div className="relative container mx-auto px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center space-y-16"
        >
          {/* Header Section */}
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium shadow-lg shadow-blue-500/25">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              About SkoolTech
            </div>

            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent leading-tight">
              Transforming Education
              <br />
              <span className="text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                Management
              </span>
            </h2>

            <p className="max-w-3xl mx-auto text-lg md:text-xl text-slate-600 text-balance text-wrap dark:text-slate-300 leading-relaxed">
              SkoolTech is a comprehensive school management system designed to
              streamline administrative tasks and enhance educational outcomes
              through cutting-edge technology.
            </p>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-6"
          >
            {stats.map((stat, i) => {
              const IconComponent = stat.icon;
              return (
                <motion.div
                  key={i}
                  variants={cardVariants}
                  whileHover={{
                    scale: 1.05,
                    transition: { duration: 0.2 },
                  }}
                  className="group relative"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity`}
                  />

                  <div className="relative bg-white/80 cursor-pointer h-full dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center mb-4 mx-auto`}
                    >
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-2">
                      {stat.value}
                    </div>
                    <div className="text-sm font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      {stat.label}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Mission & Vision Section */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Mission */}
            <motion.div variants={itemVariants} className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-3xl p-8 lg:p-10 shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">
                    Our Mission
                  </h3>
                </div>

                <p className="text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                  To simplify school operations and communication using modern,
                  intuitive technology — helping teachers teach, parents stay
                  informed, and admins stay in control.
                </p>

                <div className="space-y-4">
                  {missionPoints.map((item, i) => {
                    const IconComponent = item.icon;
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{
                          opacity: 1,
                          x: 0,
                        }}
                        viewport={{ once: true }}
                        transition={{
                          delay: i * 0.1,
                          duration: 0.5,
                        }}
                        className="flex items-center gap-4 group/item"
                      >
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center group-hover/item:scale-110 transition-transform">
                          <IconComponent className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-slate-700 dark:text-slate-300 font-medium">
                          {item.text}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* Vision */}
            <motion.div variants={itemVariants} className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-3xl p-8 lg:p-10 shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">
                    Our Vision
                  </h3>
                </div>

                <p className="text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                  To become the go-to platform for digital school management in
                  Africa, offering tools that empower schools of all sizes to
                  thrive.
                </p>

                <div className="space-y-4">
                  {visionPoints.map((item, i) => {
                    const IconComponent = item.icon;
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{
                          opacity: 1,
                          x: 0,
                        }}
                        viewport={{ once: true }}
                        transition={{
                          delay: i * 0.1,
                          duration: 0.5,
                        }}
                        className="flex items-center gap-4 group/item"
                      >
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center group-hover/item:scale-110 transition-transform">
                          <IconComponent className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-slate-700 dark:text-slate-300 font-medium">
                          {item.text}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
