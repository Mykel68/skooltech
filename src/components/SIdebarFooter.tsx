"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Zap, Users, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

export function AnimatedUpgradeFooter({
  studentCount,
  studentLimit,
  trialDaysLeft,
  getUsageColor,
  getUsagePercentage,
}: {
  studentCount: number;
  studentLimit: number;
  trialDaysLeft: number;
  getUsageColor: () => string;
  getUsagePercentage: () => number;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      layout
      initial={{ height: 56 }}
      animate={{ height: hovered ? "auto" : 56 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="overflow-hidden bg-green-800/50 backdrop-blur-sm border-t border-emerald-600 "
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <AnimatePresence initial={false}>
        {!hovered ? (
          <motion.div
            key="collapsed"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center justify-center h-14 text-xs text-green-100 px-4"
          >
            <Zap className="h-4 w-4 mr-1 text-yellow-400" />
            <span>Upgrade Now — ₦1000 per student</span>
          </motion.div>
        ) : (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 1 }}
            className="p-4 space-y-4"
          >
            {/* Usage Stats */}
            <div>
              <div className="flex items-center justify-between text-xs text-green-200 mb-1">
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  Students
                </span>
                <span>
                  {studentCount}/{studentLimit}
                </span>
              </div>
              <div className="w-full bg-green-900/50 rounded-full h-2">
                <div
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    getUsageColor()
                  )}
                  style={{ width: `${getUsagePercentage()}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-green-200">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Trial Days Left
              </span>
              <span className="font-medium">{trialDaysLeft} days</span>
            </div>

            {/* Upgrade CTA */}
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg p-3 text-center cursor-pointer">
              <div className="flex items-center justify-center gap-1 mb-2">
                <Zap className="h-4 w-4 text-white animate-pulse" />
                <span className="text-sm font-semibold text-white">
                  Upgrade Now
                </span>
              </div>
              <p className="text-xs text-white/90 mb-3">
                Unlock unlimited students & premium features
              </p>
              <Link href="/pricing">
                <Button
                  size="sm"
                  className="w-full bg-white text-orange-600 hover:bg-gray-100 font-medium"
                >
                  View Plans
                </Button>
              </Link>
              <div className="mt-2 text-[10px] text-white/80">
                Starting from ₦3000 per student
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
