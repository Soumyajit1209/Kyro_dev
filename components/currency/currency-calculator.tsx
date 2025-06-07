"use client";

import { useState, useEffect } from "react";
import { ArrowRight, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { countries, getCountryByCode, getCountryCurrency } from "@/data/countries";
import { calculateTransferAmount, formatCurrency } from "@/lib/utils";

interface CurrencyCalculatorProps {
  defaultSourceCountry?: string;
  defaultTargetCountry?: string;
  defaultAmount?: number;
  exchangeRate?: number;
  fee?: number;
  className?: string;
}

export function CurrencyCalculator({
  defaultSourceCountry = "us",
  defaultTargetCountry = "in",
  defaultAmount = 1000,
  exchangeRate = 83.5, // Default USD to INR
  fee = 3.99,
  className,
}: CurrencyCalculatorProps) {
  // State for form values
  const [sourceCountry, setSourceCountry] = useState(defaultSourceCountry);
  const [targetCountry, setTargetCountry] = useState(defaultTargetCountry);
  const [amount, setAmount] = useState(defaultAmount);
  const [activeTab, setActiveTab] = useState<string>("send");
  const [isLoading, setIsLoading] = useState(false);
  
  // Get currency codes
  const sourceCurrency = getCountryCurrency(sourceCountry);
  const targetCurrency = getCountryCurrency(targetCountry);
  
  // Calculate the transfer details
  const { sendAmount, receiveAmount, fee: transferFee } = calculateTransferAmount(
    amount,
    exchangeRate,
    fee
  );
  
  // Format the rate display (e.g., "1 USD = 83.50 INR")
  const formattedRate = `1 ${sourceCurrency} = ${exchangeRate.toFixed(2)} ${targetCurrency}`;
  
  // Simulate fetching updated rates when countries change
  useEffect(() => {
    if (sourceCountry && targetCountry) {
      setIsLoading(true);
      
      // Simulate API call delay
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [sourceCountry, targetCountry]);
  
  // Handle amount input change
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value > 0) {
      setAmount(value);
    } else if (e.target.value === "") {
      setAmount(0);
    }
  };
  
  // Switch countries
  const handleSwitchCountries = () => {
    setIsLoading(true);
    setSourceCountry(targetCountry);
    setTargetCountry(sourceCountry);
    
    // Simulate API call delay
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };

  return (
    <Card className={`shadow-2xl rounded-3xl border-0 bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-center text-2xl font-bold tracking-tight text-blue-900 dark:text-white">
          <span className="inline-flex items-center gap-2">
            <ArrowRight className="h-6 w-6 text-blue-500" />
            Send Money Internationally
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 px-4 md:px-8 pb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-blue-100 dark:bg-gray-800 rounded-xl">
            <TabsTrigger value="send" className="rounded-xl data-[state=active]:bg-blue-600 data-[state=active]:text-white">Send Money</TabsTrigger>
            <TabsTrigger value="receive" className="rounded-xl data-[state=active]:bg-blue-600 data-[state=active]:text-white">Receive Money</TabsTrigger>
          </TabsList>
          <TabsContent value="send" className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="from-country" className="text-blue-900 dark:text-blue-200">From</Label>
                <Select value={sourceCountry} onValueChange={setSourceCountry}>
                  <SelectTrigger id="from-country" className="w-full bg-white dark:bg-gray-900 border-blue-200 dark:border-gray-800 rounded-lg shadow-sm">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.filter(c => c.isAvailable).map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        <div className="flex items-center">
                          <span className="mr-2">{country.flag}</span>
                          <span>{country.name}</span>
                          <span className="ml-1 text-gray-500">({country.currency.code})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col justify-end items-center pb-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSwitchCountries}
                  disabled={isLoading}
                  className="rounded-full h-10 w-10 bg-blue-100 dark:bg-gray-800 hover:bg-blue-200 dark:hover:bg-gray-700 border border-blue-200 dark:border-gray-800 shadow"
                  aria-label="Switch countries"
                >
                  {isLoading ? (
                    <RefreshCw className="h-5 w-5 animate-spin text-blue-600" />
                  ) : (
                    <ArrowRight className="h-5 w-5 text-blue-600 rotate-90 md:rotate-0" />
                  )}
                </Button>
              </div>
              <div className="flex-1">
                <Label htmlFor="to-country" className="text-blue-900 dark:text-blue-200">To</Label>
                <Select value={targetCountry} onValueChange={setTargetCountry}>
                  <SelectTrigger id="to-country" className="w-full bg-white dark:bg-gray-900 border-blue-200 dark:border-gray-800 rounded-lg shadow-sm">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.filter(c => c.isAvailable && c.code !== sourceCountry).map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        <div className="flex items-center">
                          <span className="mr-2">{country.flag}</span>
                          <span>{country.name}</span>
                          <span className="ml-1 text-gray-500">({country.currency.code})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-blue-900 dark:text-blue-200">Amount</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={handleAmountChange}
                min={1}
                className="text-lg bg-white dark:bg-gray-900 border-blue-200 dark:border-gray-800 rounded-lg shadow-sm"
              />
            </div>
            {/* Exchange Rate Info */}
            {!isLoading && (
              <motion.div 
                className="bg-blue-50 dark:bg-gray-800 p-4 rounded-xl space-y-3 border border-blue-100 dark:border-gray-800"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Exchange Rate</span>
                  <span className="font-semibold text-blue-900 dark:text-blue-200">{formattedRate}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Fee</span>
                  <span className="font-semibold text-blue-900 dark:text-blue-200">{formatCurrency(transferFee, sourceCurrency)}</span>
                </div>
                <div className="pt-2 border-t border-blue-100 dark:border-gray-800">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-blue-900 dark:text-blue-200">They Receive</span>
                    <span className="font-bold text-lg text-blue-700 dark:text-blue-300">
                      {formatCurrency(receiveAmount, targetCurrency)}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
            {isLoading && (
              <div className="bg-blue-50 dark:bg-gray-800 p-4 rounded-xl h-[100px] flex items-center justify-center border border-blue-100 dark:border-gray-800">
                <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
              </div>
            )}
            <Button className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-lg py-3 mt-2 shadow-lg">Continue</Button>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
              Money will typically arrive within minutes
            </p>
          </TabsContent>
          <TabsContent value="receive" className="space-y-4 pt-2">
            <div className="text-center p-4">
              <p>Request money from friends and family abroad.</p>
              <Button className="mt-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white">Request Money</Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}