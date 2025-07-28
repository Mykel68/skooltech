import type React from "react";
// import { Sidebar } from "@/components/sidebar";
import { SidebarProvider } from "@/components/sidebar-provider";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/sidebar";
import Head from "@/components/Head";
import InstallPrompt from "@/components/InstallPrompt";
import { Metadata, Viewport } from "next";
// import ClientLayout from "./client-layout";

const APP_NAME = "SkoolTech";
const APP_DEFAULT_TITLE = "SkoolTech";
const APP_TITLE_TEMPLATE = "%s - SkoolTech";
const APP_DESCRIPTION =
  "SkoolTech is an all-in-one school management platform that simplifies student records, teacher tasks, exams, and admin operations — built for modern Nigerian schools.";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
};

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
          <Head />
          <main className="p-4 md:p-6 lg:p-8">
            {/* <ClientLayout> */}
            {children}
            {/* </ClientLayout> */}
          </main>
        </div>
      </div>
      <InstallPrompt />
    </SidebarProvider>
  );
}
