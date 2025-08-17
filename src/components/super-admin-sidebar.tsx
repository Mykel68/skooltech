"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Building, Users, DollarSign } from "lucide-react";

export default function SuperAdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "All Schools", href: "/superadmin/schools", icon: Building },
    { name: "All Users", href: "/superadmin/users", icon: Users },
    { name: "Billing", href: "/superadmin/billing", icon: DollarSign },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-72 bg-gray-900 border-r flex flex-col">
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
                  ? "bg-gray-700 text-white"
                  : "text-gray-300 hover:bg-gray-800"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
