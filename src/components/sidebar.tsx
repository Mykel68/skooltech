"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSidebar } from "./sidebar-provider";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/stores/userStore";
import { footerItems, navItems } from "@/constants/sidebar";
import { restoreUserFromCookie } from "@/utils/restoreAuth";

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { isOpen, toggle } = useSidebar();

  // pull only what we need
  const userId = useUserStore((s) => s.userId);
  const schoolImage = useUserStore((s) => s.schoolImage);
  const schoolName = useUserStore((s) => s.schoolName);

  // track that we've run restoreUserFromCookie once
  const [ready, setReady] = useState(false);

  // —————————————————————————————————————————————
  // 1) Restore session once on mount
  // —————————————————————————————————————————————
  useEffect(() => {
    restoreUserFromCookie();
    setReady(true);
  }, []);

  // —————————————————————————————————————————————
  // 2) After restore completes, redirect if no user
  // —————————————————————————————————————————————
  useEffect(() => {
    if (ready && userId === null) {
      router.push("/login");
    }
  }, [ready, userId, router]);

  // no more “return null” — static sidebar shows immediately
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
          "fixed inset-y-0 left-0 z-50 w-72 bg-green-700 border-r",
          "transition-transform duration-300 ease-in-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center border-b px-4">
          <img
            src={schoolImage ?? "/images/default-logo.png"}
            alt="logo"
            className="h-12 w-12 rounded-full object-cover"
          />
          <p className="ml-2 text-lg font-semibold text-white">
            {schoolName ?? "Loading school…"}
          </p>
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto text-white lg:hidden"
            onClick={toggle}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col h-[calc(100vh-64px)] overflow-auto py-4 px-3 space-y-2">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-semibold",
                  active
                    ? "bg-green-400 text-white"
                    : "text-white hover:bg-emerald-600"
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
        <div className="border-t border-emerald-600 p-3">
          {footerItems.map((item) =>
            item.subItems ? (
              <details key={item.name} className="group">
                <summary
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-4 py-2 text-sm text-white cursor-pointer",
                    pathname.startsWith(item.href)
                      ? "bg-green-400"
                      : "hover:bg-emerald-600"
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
                        "block rounded px-3 py-1 text-sm text-white",
                        pathname === sub.href
                          ? "bg-sky-700"
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
                  "flex items-center gap-3 rounded-lg px-4 py-2 text-sm text-white",
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
      </aside>
    </>
  );
}
