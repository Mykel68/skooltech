import {
  Home,
  Users,
  Calendar,
  FileText,
  Settings,
  LogOut,
  UserPlus,
  UserCheck,
  Shield,
} from "lucide-react";

export const navItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    name: "Students",
    href: "/students",
    icon: Users,
    badge: 12, // Example count badge
  },
  {
    name: "Teachers",
    href: "/teachers",
    icon: UserCheck,
  },
  {
    name: "Subjects",
    href: "/subjects",
    icon: FileText,
  },
  {
    name: "Sessions",
    href: "/sessions",
    icon: Calendar,
  },
];

export const footerItems = [
  {
    name: "Manage Users",
    href: "/users",
    icon: UserPlus,
    subItems: [
      {
        name: "Admins",
        href: "/users/admins",
      },
      {
        name: "Teachers",
        href: "/users/teachers",
      },
      {
        name: "Students",
        href: "/users/students",
      },
    ],
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
  {
    name: "Admin Privileges",
    href: "/admin/roles",
    icon: Shield,
  },
  {
    name: "Logout",
    href: "/logout",
    icon: LogOut,
  },
];
