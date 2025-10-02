"use client";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Play,
  Users,
  Award,
  TrendingUp,
  Sparkles,
  CheckCircle,
  Star,
  Rocket,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();
  //   const stats = [
  //     { value: "500+", label: "Schools", icon: Users },
  //     { value: "250K+", label: "Students", icon: TrendingUp },
  //     { value: "99.9%", label: "Uptime", icon: Award },
  //   ];
  const stats = [
    { icon: Star, label: "Schools wanted", value: "Open for Beta" },
    { icon: Users, label: "Seats available", value: "Limited slots" },
    { icon: Rocket, label: "Launch stage", value: "Early Access" },
  ];

  const features = [
    "Automated Report Generation",
    "Real-time Analytics",
    "Secure Data Management",
    "Mobile Access",
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
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99],
      },
    },
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <section className="relative flex items-center min-h-screen py-16 overflow-hidden md:px-6 lg:px-12 bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-100/30 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/30">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-800/50 bg-[size:60px_60px] opacity-30" />

      {/* Animated Background Orbs */}
      <motion.div
        className="absolute rounded-full top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-blue-400/20 via-purple-500/20 to-pink-500/20 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <motion.div
        className="absolute rounded-full bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-tr from-emerald-400/20 via-cyan-500/20 to-blue-500/20 blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          rotate: [360, 180, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Floating Elements */}
      <motion.div
        className="absolute w-4 h-4 rounded-full top-20 left-20 bg-gradient-to-r from-blue-500 to-purple-500 opacity-60"
        variants={floatingVariants}
        animate="animate"
      />
      <motion.div
        className="absolute w-6 h-6 rounded-full top-40 right-32 bg-gradient-to-r from-emerald-500 to-cyan-500 opacity-60"
        variants={floatingVariants}
        animate="animate"
        transition={{ delay: 2 }}
      />
      <motion.div
        className="absolute w-3 h-3 rounded-full bottom-32 left-1/3 bg-gradient-to-r from-pink-500 to-rose-500 opacity-60"
        variants={floatingVariants}
        animate="animate"
        transition={{ delay: 4 }}
      />

      <div className="container relative z-10 px-4 mx-auto lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 ">
          {/* Left Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div variants={itemVariants}>
              <div className="inline-flex items-center gap-2 px-4 py-2 border rounded-full bg-gradient-to-r from-blue-600/10 to-purple-600/10 border-blue-600/20 backdrop-blur-sm">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  #1 School Management Platform
                </span>
              </div>
            </motion.div>

            {/* Main Headline */}
            <motion.div variants={itemVariants} className="space-y-6">
              <h1 className="text-4xl font-bold leading-tight md:text-5xl">
                <span className="text-transparent bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text">
                  Revolutionizing
                </span>
                <br />
                <span className="text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                  School Management
                </span>
                <br />
                <span className="text-transparent bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text">
                  with Technology
                </span>
              </h1>

              <p className="max-w-2xl text-lg leading-relaxed md:text-xl lg:text-2xl text-slate-600 dark:text-slate-300">
                Simplify exams, results, and parent communication — all in one
                place. Civerit is built for schools looking to digitize without
                the stress.
              </p>
            </motion.div>

            {/* Feature List */}
            <motion.div variants={itemVariants}>
              <div className="grid grid-cols-2 gap-3">
                {features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div variants={itemVariants}>
              <div className="flex flex-col gap-4 sm:flex-row">
                <button
                  className="relative px-8 py-4 overflow-hidden text-lg font-semibold text-white transition-all duration-300 shadow-lg group bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40"
                  onClick={() => {
                    router.push("/register");
                  }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Get Started Free
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </span>
                  <div className="absolute inset-0 transition-opacity opacity-0 bg-gradient-to-r from-blue-700 to-purple-700 group-hover:opacity-100" />
                </button>

                <button className="flex items-center justify-center gap-3 px-8 py-4 text-lg font-semibold transition-all duration-300 border group bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-2xl hover:bg-white dark:hover:bg-slate-800">
                  <div className="flex items-center justify-center w-10 h-10 transition-transform rounded-full bg-gradient-to-r from-blue-600 to-purple-600 group-hover:scale-110">
                    <Play className="w-4 h-4 text-white ml-0.5" />
                  </div>
                  Watch Demo
                </button>
              </div>
            </motion.div>

            {/* Social Proof */}
            <motion.div variants={itemVariants}>
              <div className="flex items-center gap-6">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="flex items-center justify-center w-12 h-12 font-bold text-white border-white rounded-full shadow-lg border-3 dark:border-slate-800 bg-gradient-to-br from-blue-400 to-purple-600"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-yellow-400 fill-yellow-400"
                      />
                    ))}
                    <span className="ml-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                      4.9/5
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Early access available for schools ready to go digital
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div variants={itemVariants}>
              <div className="flex flex-wrap md:gap-6">
                {stats.map((stat, i) => {
                  const IconComponent = stat.icon;
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600">
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-xl font-bold md:text-2xl text-slate-900 dark:text-white">
                          {stat.value}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          {stat.label}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{
              duration: 1,
              delay: 0.5,
              ease: "easeOut",
            }}
            className="relative"
          >
            <div className="relative">
              {/* Main Dashboard Mockup */}
              <div className="relative p-8 transition-shadow duration-500 border shadow-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-slate-200 dark:border-slate-700 rounded-3xl hover:shadow-3xl h-[23rem]">
                <Image
                  src={"/images/hero-img.png"}
                  alt="Hero Image"
                  fill
                  className=""
                />

                {/* Header */}
                {/* <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600" />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      Civerit Dashboard
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full" />
                    <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                    <div className="w-3 h-3 bg-green-400 rounded-full" />
                  </div>
                </div> */}

                {/* Content Grid */}
                {/* <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      {
                        color: "from-blue-500 to-cyan-500",
                        height: "h-20",
                      },
                      {
                        color: "from-purple-500 to-pink-500",
                        height: "h-16",
                      },
                      {
                        color: "from-emerald-500 to-teal-500",
                        height: "h-24",
                      },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className={`bg-gradient-to-br ${item.color} ${item.height} rounded-xl opacity-80`}
                      />
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-32 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl opacity-80" />
                    <div className="space-y-2">
                      <div className="h-6 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 opacity-80" />
                      <div className="h-6 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 opacity-60" />
                      <div className="h-6 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 opacity-40" />
                    </div>
                  </div>
                </div> */}
              </div>

              {/* Floating Cards */}
              <motion.div
                className="absolute p-4 bg-white border shadow-xl -top-6 -right-6 dark:bg-slate-800 rounded-2xl border-slate-200 dark:border-slate-700"
                animate={{ y: [-5, 5, -5] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500">
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      +25% Growth
                    </div>
                    <div className="text-xs text-slate-500">This month</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="absolute p-4 bg-white border shadow-xl -bottom-6 -left-6 dark:bg-slate-800 rounded-2xl border-slate-200 dark:border-slate-700"
                animate={{ y: [5, -5, 5] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      1,250 Active
                    </div>
                    <div className="text-xs text-slate-500">
                      Students online
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
