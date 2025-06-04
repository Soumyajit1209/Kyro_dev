"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { countries, getCountryByCode } from "@/data/countries";
import { getBrowserCountry } from "@/lib/utils";

export function CountrySelector() {
  const router = useRouter();
  const pathname = usePathname();
  
  // Parse the current URL to extract the country code
  const pathSegments = pathname.split('/').filter(Boolean);
  const countryCode = pathSegments[0]?.toLowerCase() || '';
  
  // Set the initial country from URL or browser detection
  const [selectedCountry, setSelectedCountry] = useState<string>(
    countryCode || getBrowserCountry()
  );
  
  // Handle country change
  const handleCountryChange = (value: string) => {
    setSelectedCountry(value);
    
    // Redirect to the corresponding country page
    if (value === "default") {
      router.push("/");
    } else {
      // Keep the rest of the path structure
      const restOfPath = pathSegments.length > 1 ? `/${pathSegments.slice(1).join('/')}` : '';
      router.push(`/${value}${restOfPath}`);
    }
  };
  
  return (
    <Select value={selectedCountry} onValueChange={handleCountryChange}>
      <SelectTrigger className="w-full md:w-[180px] h-10">
        <SelectValue placeholder="Select country" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="default">
          <div className="flex items-center">
            <span className="mr-2">🌎</span>
            <span>Global (Default)</span>
          </div>
        </SelectItem>
        
        {countries.map((country) => (
          <SelectItem key={country.code} value={country.code}>
            <div className="flex items-center">
              <span className="mr-2">{country.flag}</span>
              <span>{country.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}