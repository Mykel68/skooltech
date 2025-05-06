import type React from "react";
// import { Sidebar } from "@/components/sidebar";
import { SidebarProvider } from "@/components/sidebar-provider";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
// import ClientLayout from "./client-layout";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background">
        <Sidebar />
        <div className="lg:pl-72">
          <Header />
          <main className="p-4 md:p-6 lg:p-8">
            {/* <ClientLayout> */}
            {children}
            {/* </ClientLayout> */}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
