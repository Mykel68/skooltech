"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, MoveRight, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

type NavSubItem = {
  title: string;
  href: string;
};

type NavItem = {
  id: string;
  title: React.ReactNode; // instead of JSX.Element
  image?: React.ReactNode | null;
  href?: string;
  description: string;
  items?: NavSubItem[];
};

export function Header1() {
  const [isOpen, setOpen] = useState(false);

  const navigationItems: NavItem[] = [
    {
      id: "logo",
      title: (
        <Link href="/">
          <img src="/images/logo.png" alt="Skooltech Logo" className="h-24" />
        </Link>
      ),
      image: null,
      href: "/",
      description: "",
    },
    {
      id: "solutions",
      title: "Solutions",
      description: "Tools for managing students, teachers, and performance.",
      items: [
        { title: "Student Portal", href: "/students" },
        { title: "Teacher Dashboard", href: "/teachers" },
        { title: "Admin Panel", href: "/admins" },
        { title: "Performance Reports", href: "/reports" },
      ],
    },
    {
      id: "company",
      title: "Company",
      description: "Learn about our mission to transform school operations.",
      items: [
        { title: "About Skooltech", href: "/about" },
        { title: "Careers", href: "/careers" },
        { title: "Blog", href: "/blog" },
        { title: "Contact", href: "/contact" },
      ],
    },
  ];

  return (
    <header className="w-full z-40 fixed top-0 left-0 bg-background shadow-sm">
      <div className="container mx-auto min-h-20 flex flex-row lg:grid lg:grid-cols-2 items-center justify-between gap-4">
        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-4">
          <NavigationMenu>
            <NavigationMenuList className="flex gap-4">
              {navigationItems.map((item) => (
                <NavigationMenuItem key={item.id}>
                  {item.href ? (
                    <NavigationMenuLink asChild>
                      <Link href={item.href}>
                        {item.image ? (
                          item.image
                        ) : (
                          <Button variant="ghost">{item.title}</Button>
                        )}
                      </Link>
                    </NavigationMenuLink>
                  ) : (
                    <>
                      <NavigationMenuTrigger className="font-medium text-sm">
                        {item.title}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent className="!w-[450px] p-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex flex-col justify-between">
                            <div>
                              <p className="text-base">{item.title}</p>
                              <p className="text-muted-foreground text-sm">
                                {item.description}
                              </p>
                            </div>
                            <Button size="sm" className="mt-10">
                              Book a call today
                            </Button>
                          </div>
                          <div className="flex flex-col gap-2 text-sm">
                            {item.items?.map((subItem) => (
                              <NavigationMenuLink key={subItem.title} asChild>
                                <Link
                                  href={subItem.href}
                                  className="flex justify-between items-center hover:bg-muted py-2 px-4 rounded"
                                >
                                  <span>{subItem.title}</span>
                                  <MoveRight className="w-4 h-4 text-muted-foreground" />
                                </Link>
                              </NavigationMenuLink>
                            ))}
                          </div>
                        </div>
                      </NavigationMenuContent>
                    </>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Mobile Logo */}
        <div className="md:hidden flex justify-center w-full">
          <Link href="/">
            <img
              src="/images/logo.png"
              alt="logo"
              className="h-16 p-2 object-contain"
            />
          </Link>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end w-full items-center gap-4">
          <Button variant="ghost" className="hidden md:inline">
            Book a demo
          </Button>
          <div className="border-r h-6 hidden md:inline"></div>
          <Button variant="outline">Sign in</Button>
          <Button>Get started</Button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="lg:hidden flex items-center justify-end">
          <Button
            variant="ghost"
            onClick={() => setOpen(!isOpen)}
            aria-label="Toggle mobile menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Content */}
      {isOpen && (
        <div className="absolute top-20 border-t w-full right-0 bg-background shadow-lg py-4 px-6 z-50 flex flex-col gap-6 lg:hidden">
          {navigationItems.map((item) => (
            <div key={item.id}>
              {item.href ? (
                <Link
                  href={item.href}
                  className="flex justify-between items-center text-lg font-medium"
                >
                  {typeof item.title === "string" ? item.title : ""}
                  <MoveRight className="w-4 h-4 text-muted-foreground" />
                </Link>
              ) : (
                <div className="text-lg font-medium">{item.title}</div>
              )}
              <div className="flex flex-col gap-2 mt-2">
                {item.items?.map((subItem) => (
                  <Link
                    key={subItem.title}
                    href={subItem.href}
                    className="flex justify-between items-center text-muted-foreground pl-2"
                  >
                    {subItem.title}
                    <MoveRight className="w-4 h-4 stroke-1" />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </header>
  );
}
