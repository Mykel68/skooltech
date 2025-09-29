"use client";

import React, { useState } from "react";
import {
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Mail,
  MapPin,
  Phone,
  Send,
  ArrowUp,
} from "lucide-react";
import Image from "next/image";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const currentYear = new Date().getFullYear();

  const handleSubscribe = (e: any) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail("");
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const footerLinks = [
    {
      title: "Product",
      links: [
        { name: "Features", href: "#features" },
        { name: "Services", href: "#services" },
        { name: "Pricing", href: "#pricing" },
        { name: "Demo", href: "#demo" },
        { name: "Roadmap", href: "#roadmap" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "#about" },
        { name: "Careers", href: "#careers" },
        { name: "Blog", href: "#blog" },
        { name: "Press", href: "#press" },
        { name: "Partners", href: "#partners" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Documentation", href: "#docs" },
        { name: "Tutorials", href: "#tutorials" },
        { name: "Support", href: "#support" },
        { name: "FAQ", href: "#faq" },
        { name: "Community", href: "#community" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "#privacy" },
        { name: "Terms of Service", href: "#terms" },
        { name: "Cookie Policy", href: "#cookies" },
        { name: "GDPR", href: "#gdpr" },
        { name: "Contact", href: "#contact" },
      ],
    },
  ];

  return (
    <footer className="relative md:px-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>

      {/* Floating geometric shapes */}
      <div className="absolute top-10 right-10 w-20 h-20 bg-blue-500/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 left-10 w-16 h-16 bg-purple-500/10 rounded-full blur-lg animate-bounce"></div>

      <div className="relative container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Brand Section */}
          <div className="lg:col-span-4 space-y-8">
            <div className="group">
              <a
                href="/"
                className="flex items-center space-x-3 transition-transform "
              >
                {/* group-hover:scale-105 */}
                {/* <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-2 shadow-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-8 w-8 text-white"
                  >
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                    <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
                  </svg>
                </div>
                <span className="font-bold text-2xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Zuvia
                </span> */}

                <Image
                  src="/images/logo-white-2.png"
                  alt="Logo"
                  width={1000}
                  height={1000}
                  className="h-20 w-fit"
                />
              </a>
              <p className="text-slate-300 mb-8 text-md leading-relaxed">
                Revolutionizing school management with innovative technology
                solutions for exam management, result processing, and
                comprehensive educational administration.
              </p>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-slate-300 hover:text-blue-400 transition-colors">
                <MapPin className="h-5 w-5 text-blue-400" />
                <span>Lagos, Nigeria</span>
              </div>
              {/* <div className="flex items-center space-x-3 text-slate-300 hover:text-blue-400 transition-colors">
                <Phone className="h-5 w-5 text-blue-400" />
                <span>+234 (0) 800 SKOOL-TECH</span>
              </div> */}
              {/* <div className="flex items-center space-x-3 text-slate-300 hover:text-blue-400 transition-colors">
                <Mail className="h-5 w-5 text-blue-400" />
                <span>hello@Zuvia.com</span>
              </div> */}
            </div>

            {/* Newsletter */}
            {/* <div className='space-y-4'>
							<h3 className='text-lg font-semibold text-white'>
								Stay Updated
							</h3>
							<p className='text-slate-300 text-sm'>
								Get the latest updates on new features and
								educational insights.
							</p>
							<div className='flex gap-2'>
								<div className='flex-1 relative'>
									<input
										type='email'
										value={email}
										onChange={(e) =>
											setEmail(e.target.value)
										}
										placeholder='Enter your email'
										className='w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
										required
									/>
								</div>
								<button
									onClick={handleSubscribe}
									disabled={isSubscribed}
									className='px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2'
								>
									{isSubscribed ? (
										<>
											<span>✓</span>
											<span>Subscribed!</span>
										</>
									) : (
										<>
											<Send className='h-4 w-4' />
											<span>Subscribe</span>
										</>
									)}
								</button>
							</div>
						</div> */}

            {/* Social Links */}
            {/* <div className="flex space-x-4">
              {[
                {
                  icon: Facebook,
                  href: "#",
                  color: "hover:text-blue-500",
                },
                {
                  icon: Twitter,
                  href: "#",
                  color: "hover:text-sky-400",
                },
                {
                  icon: Instagram,
                  href: "#",
                  color: "hover:text-pink-500",
                },
                {
                  icon: Linkedin,
                  href: "#",
                  color: "hover:text-blue-600",
                },
              ].map(({ icon: Icon, href, color }, index) => (
                <a
                  key={index}
                  href={href}
                  className={`p-3 bg-slate-800/50 rounded-full text-slate-400 ${color} transition-all duration-300 hover:scale-110 hover:bg-slate-700/50 hover:shadow-lg`}
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div> */}
          </div>

          {/* Links Sections */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            {footerLinks.map((group, i) => (
              <div key={i} className="space-y-6">
                <h3 className="text-lg font-semibold text-white relative">
                  {group.title}
                  <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                </h3>
                <ul className="space-y-3">
                  {group.links.map((link, j) => (
                    <li key={j}>
                      <a
                        href={link.href}
                        className="text-slate-400 hover:text-white transition-colors duration-200 hover:translate-x-1 transform inline-block"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="my-12 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-8">
            <p className="text-slate-400 text-sm">
              © {currentYear} Zuvia. All rights reserved.
            </p>
            <p className="text-slate-400 text-sm flex items-center">
              Designed and developed with
              <span className="text-red-500 mx-1 animate-pulse">❤️</span>
              for educational institutions
            </p>
          </div>

          {/* Back to top button */}
          <button
            onClick={scrollToTop}
            className="p-3 bg-slate-800/50 hover:bg-slate-700/50 text-slate-400 hover:text-white rounded-full transition-all duration-300 hover:scale-110 hover:shadow-lg group"
          >
            <ArrowUp className="h-5 w-5 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>

        {/* Bottom decorative line */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>
      </div>
    </footer>
  );
}
