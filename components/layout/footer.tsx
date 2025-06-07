import React from "react";
import Link from "next/link";
import { Globe, Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = {
    company: [
      { label: "About Us", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Press", href: "/press" },
      { label: "Blog", href: "/blog" },
    ],
    products: [
      { label: "Send Money", href: "/send-money" },
      { label: "Receive Money", href: "/receive-money" },
      { label: "Currency Exchange", href: "/exchange" },
      { label: "Business Solutions", href: "/business" },
    ],
    support: [
      { label: "Help Center", href: "/help" },
      { label: "Contact Us", href: "/contact" },
      { label: "FAQs", href: "/faqs" },
      { label: "Security", href: "/security" },
    ],
    legal: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms of Use", href: "/terms" },
      { label: "Cookies", href: "/cookies" },
      { label: "Licenses", href: "/licenses" },
    ],
  };

  const socialLinks = [
    { icon: <Facebook className="h-5 w-5" />, href: "https://facebook.com", label: "Facebook" },
    { icon: <Twitter className="h-5 w-5" />, href: "https://twitter.com", label: "Twitter" },
    { icon: <Instagram className="h-5 w-5" />, href: "https://instagram.com", label: "Instagram" },
    { icon: <Linkedin className="h-5 w-5" />, href: "https://linkedin.com", label: "LinkedIn" },
    { icon: <Youtube className="h-5 w-5" />, href: "https://youtube.com", label: "YouTube" },
  ];

  return (
    <footer className="bg-gray-100 dark:bg-gray-900">
      <div className="container pt-12 pb-8 flex flex-col items-center">
        {/* Top section with columns */}
        <div className="flex flex-col items-center w-full">
          {/* Brand column */}
          <Link href="/" className="flex items-center space-x-2 justify-center">
            <div className="rounded-full bg-blue-600 p-1.5">
              <Globe className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">Kyro</span>
          </Link>
          <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm text-center max-w-xl">
            Fast, secure, and affordable money transfers to over 100+ countries worldwide. Send money to your loved ones with confidence.
          </p>
          <div className="mt-6 flex flex-col items-center">
            <p className="text-sm font-medium mb-2">Get the app</p>
            <div className="flex space-x-3">
              <Button variant="outline" size="sm" className="rounded-lg">
                App Store
              </Button>
              <Button variant="outline" size="sm" className="rounded-lg">
                Google Play
              </Button>
            </div>
          </div>
        </div>

        {/* Centralized links */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 justify-items-center text-center w-full max-w-4xl">
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Products</h3>
            <ul className="space-y-3">
              {footerLinks.products.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8 w-full max-w-4xl" />

        {/* Bottom section with social and copyright */}
        <div className="flex flex-col items-center w-full">
          <div className="flex space-x-4 mb-4">
            {socialLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
              >
                {link.icon}
              </a>
            ))}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
            © {currentYear} Kyro. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}