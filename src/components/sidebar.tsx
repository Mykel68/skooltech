"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  ChevronDown,
  Crown,
  Zap,
  Users,
  Calendar,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useSidebar } from "./sidebar-provider";
import { useUserStore } from "@/stores/userStore";
import { footerItems, navItems } from "@/constants/sidebar";
import { restoreUserFromCookie } from "@/utils/restoreAuth";
import { AnimatedUpgradeFooter } from "./SIdebarFooter";
import { usePlanStore } from "@/stores/planStore";
import { Skeleton } from "./ui/skeleton";

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { isOpen, toggle } = useSidebar();

  const userId = useUserStore((s) => s.userId);
  const schoolImage = useUserStore((s) => s.schoolImage);
  const schoolName = useUserStore((s) => s.schoolName);

  // Add these to your user store or get from your user data
  const currentPlan = usePlanStore((p) => p.currentPlan) || "Free Trial";
  const studentCount = usePlanStore((p) => p.studentCount) || 0;
  const studentLimit = usePlanStore((p) => p.studentLimit) || 50; // Free trial limit
  const trialDaysLeft = usePlanStore((p) => p.trialDaysLeft) || 14;

  const [ready, setReady] = useState(false);

  useEffect(() => {
    restoreUserFromCookie();
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready && !userId) {
      router.push("/login");
    }
  }, [ready, userId, router]);

  const getUsagePercentage = () => {
    return Math.min((studentCount / studentLimit) * 100, 100);
  };

  const getUsageColor = () => {
    const percentage = getUsagePercentage();
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 70) return "bg-yellow-500";
    return "bg-blue-500";
  };

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden",
          isOpen ? "block" : "hidden"
        )}
        onClick={toggle}
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-green-700 border-r flex flex-col",
          "transition-transform duration-300 ease-in-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center gap-3 border-b px-4 h-16 flex-shrink-0">
          {schoolImage ? (
            <img
              src={schoolImage ?? "/images/default-logo.png"}
              alt="logo"
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <Skeleton className="h-10 w-10 rounded-full object-cover" />
          )}

          <div className="flex flex-col flex-1">
            {schoolName ? (
              <p className="text-lg font-semibold text-white truncate">
                {schoolName}
              </p>
            ) : (
              <Skeleton className="h-6 w-1/2 mb-2" />
            )}

            <div className="flex items-center gap-1">
              {schoolName ? (
                <div className="flex items-center gap-1">
                  <Crown className="h-3 w-3 text-yellow-400" />
                  <span className="text-xs text-green-200">{currentPlan}</span>
                </div>
              ) : (
                <Skeleton className="h-4 w-1/2" />
              )}
            </div>
          </div>
          <Button
            variant="destructive"
            size="icon"
            className="ml-auto text-white lg:hidden"
            onClick={toggle}
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* Main Nav - Scrollable */}
        <div className="flex-1 overflow-auto">
          <nav className="flex flex-col py-4 px-3 space-y-2">
            {navItems.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-semibold transition-colors",
                    active
                      ? "bg-green-400 text-white"
                      : "text-white hover:bg-emerald-600"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                  {/* {item.badge && (
                    <span className="ml-auto inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                      {item.badge}
                    </span>
                  )} */}
                </Link>
              );
            })}
          </nav>

          {/* Footer Items */}
          <div className="border-t border-emerald-600 p-3 mt-4">
            {footerItems.map((item) =>
              item.subItems ? (
                <details key={item.name} className="group">
                  <summary
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-4 py-2 text-sm text-white cursor-pointer transition-colors",
                      pathname.startsWith(item.href)
                        ? "bg-green-400"
                        : "hover:bg-emerald-600"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                    <ChevronDown className="ml-auto h-4 w-4 group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="mt-1 space-y-1 pl-8">
                    {item.subItems.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className={cn(
                          "block rounded px-3 py-1 text-sm text-white transition-colors",
                          pathname === sub.href
                            ? "bg-emerald-600"
                            : "hover:bg-emerald-600"
                        )}
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                </details>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-4 py-2 text-sm text-white transition-colors",
                    pathname === item.href
                      ? "bg-green-400"
                      : "hover:bg-emerald-600"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              )
            )}
          </div>
        </div>

        {/* Sticky Upgrade Footer - Hover to Expand */}
        <AnimatedUpgradeFooter
          studentCount={studentCount}
          studentLimit={studentLimit}
          trialDaysLeft={trialDaysLeft}
          getUsageColor={getUsageColor}
          getUsagePercentage={getUsagePercentage}
        />
      </aside>
    </>
  );
}
