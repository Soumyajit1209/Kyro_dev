"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Globe, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CountrySelector } from "@/components/country/country-selector";
import { getCountryByCode } from "@/data/countries";
import { cn } from "@/lib/utils";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  
  // Extract country code from the URL if available
  const countryFromPath = pathname.split('/')[1] || '';
  const country = getCountryByCode(countryFromPath);
  
  // Handle scroll effect for transparent to solid header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: `/${country?.code || ''}`, label: "Send Money" },
    { href: `/${country?.code || ''}/how-it-works`, label: "How It Works" },
    { href: `/${country?.code || ''}/fees`, label: "Fees" },
    { href: `/${country?.code || ''}/help`, label: "Help" },
  ];

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled 
          ? "bg-white dark:bg-gray-950 shadow-md py-3" 
          : "bg-transparent py-5"
      )}
    >
      <div className="container flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="rounded-full bg-blue-600 p-1.5">
            <Globe className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">Kyro</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                pathname === link.href
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
              )}
            >
              {link.label}
            </Link>
          ))}
          
          <div className="ml-2">
            <CountrySelector />
          </div>
        </nav>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center space-x-3">
          <Button variant="outline" size="sm">Log in</Button>
          <Button size="sm">Sign up</Button>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden flex items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[350px]">
              <nav className="flex flex-col gap-4 mt-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-lg font-medium px-1 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    {link.label}
                  </Link>
                ))}
                
                <div className="py-4">
                  <p className="text-sm font-medium mb-2 text-gray-500">Select Country</p>
                  <CountrySelector />
                </div>
                
                <div className="flex flex-col gap-2 mt-4">
                  <Button variant="outline" className="w-full justify-start">
                    Log in
                  </Button>
                  <Button className="w-full justify-start">
                    Sign up
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}