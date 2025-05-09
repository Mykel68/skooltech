import {
  BarChart3,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
  Wallet,
} from "lucide-react";

// Navigation data
export const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Teachers", href: "/teachers", icon: Users, badge: "7" },
  { name: "Students", href: "/students", icon: Users, badge: "12" },
  { name: "Classes", href: "/classes", icon: Users, badge: "5" },
  { name: "Fees", href: "/fees", icon: Wallet },
  { name: "Reports", href: "/reports", icon: BarChart3 },
];

// Footer and Settings items
export const footerItems = [
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
