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
import { getCountryByCode } from "@/data/countries";
import { getBrowserCountry } from "@/lib/utils";
import { client } from "@/lib/sanity";

// Query to get available countries from CMS
const availableCountriesQuery = `
  *[_type == "country" && isAvailable == true] | order(name asc) {
    code,
    name,
    flag,
    isAvailable
  }
`;

interface CMSCountry {
  code: string;
  name: string;
  flag: string;
  isAvailable: boolean;
}

export function CountrySelector() {
  const router = useRouter();
  const pathname = usePathname();
  
  // Parse the current URL to extract the country code
  const pathSegments = pathname.split('/').filter(Boolean);
  const countryCode = pathSegments[0]?.toLowerCase() || '';
  
  // State for available countries from CMS
  const [availableCountries, setAvailableCountries] = useState<CMSCountry[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Set the initial country from URL or browser detection
  const [selectedCountry, setSelectedCountry] = useState<string>(
    countryCode || getBrowserCountry()
  );

  // Fetch available countries from CMS on component mount
  useEffect(() => {
    async function fetchAvailableCountries() {
      try {
        setLoading(true);
        const countries = await client.fetch(availableCountriesQuery);
        setAvailableCountries(countries || []);
      } catch (error) {
        console.error("Error fetching available countries:", error);
        // Fallback to predefined countries if CMS fails
        setAvailableCountries([]);
      } finally {
        setLoading(false);
      }
    }

    fetchAvailableCountries();
  }, []);

  // Update selected country when URL changes
  useEffect(() => {
    const newCountryCode = pathSegments[0]?.toLowerCase() || '';
    if (newCountryCode !== selectedCountry) {
      setSelectedCountry(newCountryCode || 'default');
    }
  }, [pathname, pathSegments, selectedCountry]);

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

  // Get display name for selected country
  const getSelectedCountryDisplay = () => {
    if (selectedCountry === 'default' || !selectedCountry) {
      return "🌎 Global (Default)";
    }
    
    // First check CMS countries
    const cmsCountry = availableCountries.find(c => c.code.toLowerCase() === selectedCountry.toLowerCase());
    if (cmsCountry) {
      return `${cmsCountry.flag} ${cmsCountry.name}`;
    }
    
    // Fallback to predefined countries
    const predefinedCountry = getCountryByCode(selectedCountry);
    if (predefinedCountry) {
      return `${predefinedCountry.flag} ${predefinedCountry.name}`;
    }
    
    return "Select country";
  };
  
  if (loading) {
    return (
      <div className="w-full md:w-[180px] h-10 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-md"></div>
    );
  }

  return (
    <Select value={selectedCountry || 'default'} onValueChange={handleCountryChange}>
      <SelectTrigger className="w-full md:w-[180px] h-10">
        <SelectValue>
          {getSelectedCountryDisplay()}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="default">
          <div className="flex items-center">
            <span className="mr-2">🌎</span>
            <span>Global (Default)</span>
          </div>
        </SelectItem>
        
        {availableCountries.length > 0 ? (
          <>
            <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Available Countries
            </div>
            {availableCountries.map((country) => (
              <SelectItem key={country.code} value={country.code.toLowerCase()}>
                <div className="flex items-center">
                  <span className="mr-2">{country.flag}</span>
                  <span>{country.name}</span>
                </div>
              </SelectItem>
            ))}
          </>
        ) : (
          <SelectItem value="no-countries" disabled>
            <div className="flex items-center text-gray-500">
              <span className="mr-2">⚠️</span>
              <span>No countries available</span>
            </div>
          </SelectItem>
        )}
        
        {/* Show coming soon countries if any */}
        <div className="px-2 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wide border-t">
          More Countries Coming Soon
        </div>
        <SelectItem value="coming-soon" disabled>
          <div className="flex items-center text-gray-400">
            <span className="mr-2">🚀</span>
            <span>Expanding globally...</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}

// Hook for checking if current country is available in CMS
export function useCountryAvailability(countryCode: string) {
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAvailability() {
      if (!countryCode) {
        setIsAvailable(false);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const countries = await client.fetch(availableCountriesQuery);
        const available = countries.some((c: CMSCountry) => 
          c.code.toLowerCase() === countryCode.toLowerCase() && c.isAvailable
        );
        setIsAvailable(available);
      } catch (error) {
        console.error("Error checking country availability:", error);
        setIsAvailable(false);
      } finally {
        setLoading(false);
      }
    }

    checkAvailability();
  }, [countryCode]);

  return { isAvailable, loading };
}