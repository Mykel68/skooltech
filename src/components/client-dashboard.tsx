"use client";

import { useUserStore } from "@/stores/userStore";
import React from "react";
import { Sidebar } from "./sidebar";
import SuperAdminSidebar from "./super-admin-sidebar";
import Head from "./Head";

export default function ClientDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { role } = useUserStore();
  const isSuperAdmin = role === "Super Admin";

  return (
    <div className="min-h-screen bg-background">
      {isSuperAdmin ? <SuperAdminSidebar /> : <Sidebar />}
      <div className="lg:pl-72">
        <Head />
        <main className="p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
