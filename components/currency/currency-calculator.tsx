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
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-center text-xl md:text-2xl">
          Send Money Internationally
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="send">Send Money</TabsTrigger>
            <TabsTrigger value="receive">Receive Money</TabsTrigger>
          </TabsList>
          
          <TabsContent value="send" className="space-y-6">
            {/* From (Source) */}
            <div>
              <Label htmlFor="from-country">From</Label>
              <Select
                value={sourceCountry}
                onValueChange={setSourceCountry}
              >
                <SelectTrigger id="from-country" className="w-full">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {countries
                    .filter(c => c.isAvailable)
                    .map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        <div className="flex items-center">
                          <span className="mr-2">{country.flag}</span>
                          <span>{country.name}</span>
                          <span className="ml-1 text-gray-500">
                            ({country.currency.code})
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Switch Countries Button */}
            <div className="flex justify-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSwitchCountries}
                disabled={isLoading}
                className="rounded-full h-8 w-8 rotate-90 md:rotate-0"
              >
                {isLoading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <ArrowRight className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            {/* To (Target) */}
            <div>
              <Label htmlFor="to-country">To</Label>
              <Select
                value={targetCountry}
                onValueChange={setTargetCountry}
              >
                <SelectTrigger id="to-country" className="w-full">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {countries
                    .filter(c => c.isAvailable && c.code !== sourceCountry)
                    .map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        <div className="flex items-center">
                          <span className="mr-2">{country.flag}</span>
                          <span>{country.name}</span>
                          <span className="ml-1 text-gray-500">
                            ({country.currency.code})
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={handleAmountChange}
                min={1}
                className="text-lg"
              />
            </div>
            
            {/* Exchange Rate Info */}
            {!isLoading && (
              <motion.div 
                className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Exchange Rate</span>
                  <span>{formattedRate}</span>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Fee</span>
                  <span>{formatCurrency(transferFee, sourceCurrency)}</span>
                </div>
                
                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">They Receive</span>
                    <span className="font-bold text-lg">
                      {formatCurrency(receiveAmount, targetCurrency)}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
            
            {isLoading && (
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg h-[120px] flex items-center justify-center">
                <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
              </div>
            )}
            
            {/* CTA Button */}
            <Button className="w-full">Continue</Button>
            
            {/* Transfer Time Info */}
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              Money will typically arrive within minutes
            </p>
          </TabsContent>
          
          <TabsContent value="receive" className="space-y-4 pt-2">
            <div className="text-center p-4">
              <p>Request money from friends and family abroad.</p>
              <Button className="mt-4">Request Money</Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}