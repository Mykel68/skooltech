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
  BookOpen,
  Send,
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
    // badge: 12, // Example count badge
  },
  {
    name: "Teachers",
    href: "/teachers",
    icon: UserCheck,
  },
  {
    name: "Classroom",
    href: "/classes",
    icon: Calendar,
  },
  {
    name: "Subjects",
    href: "/subjects",
    icon: BookOpen,
  },
  {
    name: "Sessions",
    href: "/sessions",
    icon: Calendar,
  },
  {
    name: "Attendance",
    href: "/attendance",
    icon: Shield,
  },
  {
    name: "Communication",
    href: "/communication",
    icon: Send,
  },
  {
    name: "Reports",
    href: "/report",
    icon: FileText,
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
    subItems: [
      {
        name: "School",
        href: "/settings/profile/school",
      },
      {
        name: "Admin",
        href: "/settings/profile/admin",
      },
      {
        name: "App",
        href: "/settings/app",
      },
    ],
  },
  {
    name: "Admin Privileges",
    href: "/admin/roles",
    icon: Shield,
  },
];
