"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Building,
  Users,
  DollarSign,
  LayoutDashboard,
  BarChart3,
  FileText,
  Settings,
  X,
  Crown,
} from "lucide-react";
import { Button } from "./ui/button";
import { useSidebar } from "./sidebar-provider";

export default function SuperAdminSidebar() {
  const pathname = usePathname();
  const { isOpen, toggle } = useSidebar();

  const navItems = [
    { name: "Dashboard", href: "/superadmin", icon: LayoutDashboard },
    { name: "All Schools", href: "/superadmin/schools", icon: Building },
    { name: "All Users", href: "/superadmin/users", icon: Users },
    { name: "Billing", href: "/superadmin/billing", icon: DollarSign },
    { name: "Reports", href: "/superadmin/reports", icon: BarChart3 },
    { name: "Audit Logs", href: "/superadmin/audit-logs", icon: FileText },
    { name: "System Settings", href: "/superadmin/settings", icon: Settings },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-72 bg-green-700 border-r flex flex-col">
      <div className="flex items-center gap-3 border-b px-4 h-20 md:h-21 flex-shrink-0">
        <img
          src={"/images/logo.png"}
          alt="logo"
          className="h-14 w-14 rounded-full object-cover"
        />

        <div className="flex flex-col flex-1">
          <p className="text-lg md:text-xl font-semibold text-white truncate">
            SkoolTech
          </p>

          <div className="flex items-center gap-1">
            <div className="flex items-center gap-1">
              <Crown className="h-3 w-3 text-yellow-400" />
              <span className="text-xs text-green-200">Global Admin</span>
            </div>
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
      <div className="flex-1 overflow-auto py-4 px-3 space-y-2">
        {navItems.map((item) => {
          const active = pathname.startsWith(item.href);
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
            </Link>
          );
        })}
      </div>
      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-sidebar-accent/30">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <Crown className="w-4 h-4 text-primary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              Super Admin
            </p>
            <p className="text-xs text-sidebar-foreground/70 truncate">
              Global Access
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
