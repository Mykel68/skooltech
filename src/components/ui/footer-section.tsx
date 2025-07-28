"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Facebook,
  Instagram,
  Linkedin,
  Moon,
  Send,
  Sun,
  Twitter,
} from "lucide-react";

function Footerdemo() {
  const [isDarkMode, setIsDarkMode] = React.useState(true);

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  return (
    <footer className="relative border-t bg-background text-foreground transition-colors duration-300">
      <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Newsletter */}
          <div className="relative">
            <h2 className="mb-4 text-3xl font-bold tracking-tight">
              Stay Updated
            </h2>
            <p className="mb-6 text-muted-foreground">
              Subscribe to get updates on SkoolTech features, tips, and offers.
            </p>
            <form className="relative">
              <Input
                type="email"
                placeholder="Enter your email"
                className="pr-12"
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-1 top-1 h-8 w-8 rounded-full bg-primary text-primary-foreground hover:scale-105"
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Subscribe</span>
              </Button>
            </form>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Explore</h3>
            <nav className="space-y-2 text-sm">
              <a href="#" className="block hover:text-primary">
                Home
              </a>
              <a href="#" className="block hover:text-primary">
                Features
              </a>
              <a href="#" className="block hover:text-primary">
                Pricing
              </a>
              <a href="#" className="block hover:text-primary">
                Docs
              </a>
              <a href="#" className="block hover:text-primary">
                Contact
              </a>
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Get in Touch</h3>
            <address className="space-y-2 text-sm not-italic">
              <p>SkoolTech HQ</p>
              <p>45 EduTech Drive, Lagos</p>
              <p>Phone: +234 812 345 6789</p>
              <p>Email: support@skooltech.ng</p>
            </address>
          </div>

          {/* Socials & Dark Mode */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Connect With Us</h3>
            <div className="mb-6 flex space-x-4">
              {[
                {
                  icon: Facebook,
                  label: "Facebook",
                },
                {
                  icon: Twitter,
                  label: "Twitter",
                },
                {
                  icon: Instagram,
                  label: "Instagram",
                },
                {
                  icon: Linkedin,
                  label: "LinkedIn",
                },
              ].map(({ icon: Icon, label }) => (
                <TooltipProvider key={label}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full"
                      >
                        <Icon className="h-4 w-4" />
                        <span className="sr-only">{label}</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Follow us on {label}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <Moon className="h-4 w-4" />
              <Switch checked={isDarkMode} onCheckedChange={setIsDarkMode} />
              <Sun className="h-4 w-4" />
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} SkoolTech. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footerdemo;
