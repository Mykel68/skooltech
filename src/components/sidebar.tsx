"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "./sidebar-provider";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Wallet,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

// Main Sidebar component
export function Sidebar() {
  const pathname = usePathname();
  const { isOpen, toggle } = useSidebar();

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden",
          isOpen ? "block" : "hidden"
        )}
        onClick={toggle}
      />

      {/* Sidebar panel */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-emerald-50 border-r border-emerald-50",
          "transition-transform duration-300 ease-in-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center border-b border-emerald-100 px-4">
          <span className="text-xl font-semibold text-green-950">
            Skooltech
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto text-green-950 lg:hidden"
            onClick={toggle}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>

        {/* Navigation links */}
        <div className="flex flex-col h-[calc(100vh-64px)]">
          <nav className="flex-1 overflow-auto py-4 px-3 space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium",
                    isActive
                      ? "bg-green-700 text-white"
                      : "text-green-950 hover:bg-emerald-100"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                  {item.badge && (
                    <span className="ml-auto inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer / Settings */}
          <div className="border-t border-emerald-100 p-3">
            <nav className="space-y-1">
              {footerItems.map((item) => (
                <div key={item.name}>
                  {item.subItems ? (
                    <details className="group">
                      <summary
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium cursor-pointer",
                          pathname.startsWith(item.href)
                            ? "bg-green-700 text-white"
                            : "text-green-950 hover:bg-emerald-100"
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.name}</span>
                        <span className="ml-auto transition-transform group-open:rotate-180">
                          ▼
                        </span>
                      </summary>
                      <div className="mt-1 space-y-1 pl-8">
                        {item.subItems.map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            className={cn(
                              "block rounded-lg px-3 py-1.5 text-sm",
                              pathname === sub.href
                                ? "bg-sky-200 text-green-950"
                                : "text-green-950 hover:bg-emerald-100"
                            )}
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    </details>
                  ) : (
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium",
                        pathname === item.href
                          ? "bg-sky-500 text-white"
                          : "text-sky-700 hover:bg-emerald-100"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>
      </aside>
    </>
  );
}

// Navigation data
const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Students", href: "/students", icon: Users, badge: "12" },
  { name: "Fees", href: "/fees", icon: Wallet },
  { name: "Reports", href: "/reports", icon: BarChart3 },
];

// Footer and Settings items
const footerItems = [
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
    subItems: [
      { name: "Profile", href: "/settings/profile" },
      { name: "Security", href: "/settings/security" },
      { name: "Communication", href: "/settings/communication" },
      { name: "Permissions", href: "/settings/permissions" },
    ],
  },
  { name: "Help", href: "/help", icon: HelpCircle },
  { name: "Logout", href: "/logout", icon: LogOut },
];

// Settings page with cards
export function SettingsPage() {
  const sections =
    footerItems.find((i) => i.name === "Settings")?.subItems || [];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-sky-700">Settings</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((sec) => (
          <Card key={sec.href} className="border-sky-100 shadow-sm">
            <CardHeader>
              <CardTitle>{sec.name}</CardTitle>
              <CardDescription>Manage {sec.name.toLowerCase()}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={sec.href}>
                <Button variant="outline" className="w-full">
                  Go to {sec.name}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
