export const dynamic = "force-dynamic";

import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, ArrowRight, Clock, CreditCard, Percent, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CurrencyCalculator } from "@/components/currency/currency-calculator";
import { FAQAccordion } from "@/components/faq-accordion";
import { client } from "@/lib/sanity";
import { urlFor } from "@/lib/sanity";
import { sendMoneyPageQuery, countriesListQuery } from "@/lib/queries";
import { getCountryByCode, getCountryCurrency } from "@/data/countries";
import type { SendMoneyPage } from "@/types";
import { formatCurrency } from "@/lib/utils";

export async function generateStaticParams() {
  try {
    const countries = await client.fetch(countriesListQuery);
    
    // Generate all valid pairs (excluding self-pairs)
    const pairs = [];
    for (const source of countries) {
      if (!source.isAvailable) continue;
      for (const target of countries) {
        if (!target.isAvailable) continue;
        if (source.code !== target.code) {
          pairs.push({ country: source.code, targetCountry: target.code });
        }
      }
    }
    return pairs;
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export async function generateMetadata({ 
  params 
}: { 
  params: { country?: string, targetCountry?: string } 
}): Promise<Metadata> {
  const sourceCountryCode = params.country ? params.country.toLowerCase() : '';
  const targetCountryCode = params.targetCountry ? params.targetCountry.toLowerCase() : '';

  const sourceCountry = getCountryByCode(sourceCountryCode);
  const targetCountry = getCountryByCode(targetCountryCode);

  if (!sourceCountry || !targetCountry) {
    return notFound();
  }

  let pageData = null;
  if (sourceCountryCode && targetCountryCode) {
    try {
      const result = await getPageData(sourceCountryCode, targetCountryCode);
      if (result.success) {
        pageData = result.data;
      }
    } catch (error) {
      console.error("Error fetching page data for metadata:", error);
    }
  }
  
  const title = pageData?.seo?.title || `Send Money from ${sourceCountry.name} to ${targetCountry.name} | Best Rates | Kyro`;
  const description = pageData?.seo?.description || `Fast and secure money transfers from ${sourceCountry.name} to ${targetCountry.name}. Great exchange rates, low fees, and multiple payout options. Send money online today!`;
  
  return {
    title,
    description,
    keywords: pageData?.seo?.keywords || [
      `send money to ${targetCountry.name}`,
      `${sourceCountry.name} to ${targetCountry.name} transfer`,
      'international money transfer',
      'online money transfer',
      `send ${targetCountry.currency.code}`,
      'remittance',
      'forex transfer'
    ],
    openGraph: {
      title,
      description,
      images: [
        {
          url: pageData?.seo?.ogImage ? urlFor(pageData.seo.ogImage).url() : '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: `Send money from ${sourceCountry.name} to ${targetCountry.name}`,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [pageData?.seo?.ogImage ? urlFor(pageData.seo.ogImage).url() : '/og-image.jpg'],
    },
    alternates: {
      canonical: `https://kyro.com/${params.country}/send-to/${params.targetCountry}`,
    },
  };
}

// Enhanced real-time data fetching function
async function getPageData(sourceCountry: string, targetCountry: string) {
  try {
    // Force fresh data fetch by disabling cache
    const countries = await client.fetch(
      countriesListQuery, 
      {}, 
      { 
        cache: 'no-store',
        next: { 
          revalidate: 0,
          tags: ['countries'] 
        }
      }
    );
    
    // Real-time check for source country availability
    const sourceExists = countries.find((c: any) => 
      c.code.toLowerCase() === sourceCountry.toLowerCase() && 
      c.isAvailable === true
    );

    // Real-time check for target country availability
    const targetExists = countries.find((c: any) => 
      c.code.toLowerCase() === targetCountry.toLowerCase() && 
      c.isAvailable === true
    );
    
    if (!sourceExists) {
      return { 
        success: false, 
        error: 'SOURCE_NOT_AVAILABLE',
        message: `We currently don't support sending money from ${getCountryByCode(sourceCountry)?.name || sourceCountry.toUpperCase()}.`
      };
    }

    if (!targetExists) {
      return { 
        success: false, 
        error: 'TARGET_NOT_AVAILABLE',
        message: `${getCountryByCode(targetCountry)?.name || targetCountry.toUpperCase()} is currently not accepting money transfers through our system.`
      };
    }

    // Fetch the send money page data with real-time updates
    const data = await client.fetch(
      sendMoneyPageQuery, 
      { 
        sourceCountry: sourceCountry.toLowerCase(), 
        targetCountry: targetCountry.toLowerCase()
      },
      { 
        cache: 'no-store',
        next: { 
          revalidate: 0,
          tags: ['send-money-page', `${sourceCountry}-${targetCountry}`] 
        }
      }
    );
    
    // If no specific page data found, return error
    if (!data) {
      return { 
        success: false, 
        error: 'NO_PAGE_DATA',
        message: `Money transfer service from ${getCountryByCode(sourceCountry)?.name} to ${getCountryByCode(targetCountry)?.name} is currently not available.`
      };
    }
    
    return { success: true, data };
    
  } catch (error) {
    console.error("Error fetching data from Sanity:", error);
    return { 
      success: false, 
      error: 'FETCH_ERROR',
      message: 'Unable to load transfer information at the moment. Please try again later.'
    };
  }
}

// Enhanced real-time country availability check
async function checkCountryAvailability(sourceCountry: string, targetCountry: string) {
  try {
    // Real-time query to check both countries
    const countryCheckQuery = `
      *[_type == "country" && (code match "${sourceCountry.toUpperCase()}" || code match "${targetCountry.toUpperCase()}")] {
        code,
        isAvailable,
        name
      }
    `;
    
    const countries = await client.fetch(
      countryCheckQuery,
      {},
      { 
        cache: 'no-store',
        next: { 
          revalidate: 0,
          tags: ['country-availability'] 
        }
      }
    );
    
    const sourceCountryData = countries.find((c: any) => c.code.toLowerCase() === sourceCountry.toLowerCase());
    const targetCountryData = countries.find((c: any) => c.code.toLowerCase() === targetCountry.toLowerCase());
    
    return {
      sourceAvailable: sourceCountryData?.isAvailable === true,
      targetAvailable: targetCountryData?.isAvailable === true,
      sourceCountryData,
      targetCountryData
    };
    
  } catch (error) {
    console.error("Error checking country availability:", error);
    return {
      sourceAvailable: false,
      targetAvailable: false,
      sourceCountryData: null,
      targetCountryData: null
    };
  }
}

// Component for unavailable service message
function UnavailableServiceMessage({ 
  sourceCountry, 
  targetCountry, 
  message,
  errorType
}: { 
  sourceCountry: any, 
  targetCountry: any, 
  message: string,
  errorType?: string 
}) {
  const getErrorTitle = () => {
    switch (errorType) {
      case 'TARGET_NOT_AVAILABLE':
        return `${targetCountry.name} Not Available`;
      case 'SOURCE_NOT_AVAILABLE':
        return `${sourceCountry.name} Not Supported`;
      default:
        return 'Service Not Available';
    }
  };

  const getErrorDescription = () => {
    switch (errorType) {
      case 'TARGET_NOT_AVAILABLE':
        return `${targetCountry.name} is currently not accepting money transfers through our system. This could be due to regulatory changes, maintenance, or temporary service suspension.`;
      case 'SOURCE_NOT_AVAILABLE':
        return `We currently don't support sending money from ${sourceCountry.name}. We're working to expand our services to more countries.`;
      default:
        return 'This service is temporarily unavailable. Please try again later or contact our support team.';
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <section className="pt-28 pb-16 md:pt-32 md:pb-20 bg-gradient-to-br from-red-50 via-orange-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-950">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center mb-6 text-sm justify-center">
              <Link href={`/${sourceCountry.code.toLowerCase()}`} className="text-gray-600 hover:text-blue-600 transition-colors duration-200">
                {sourceCountry.name}
              </Link>
              <ArrowRight className="h-4 w-4 mx-2 text-gray-400" />
              <span className="font-medium text-orange-600">{targetCountry.name}</span>
            </div>

            <div className="mb-8">
              <AlertCircle className="h-24 w-24 text-orange-500 mx-auto mb-6" />
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
                {getErrorTitle()}
              </h1>
            </div>

            <Alert className="max-w-2xl mx-auto mb-8 border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-lg text-orange-800 dark:text-orange-200">
                {message}
              </AlertDescription>
            </Alert>

            <div className="space-y-6">
              <p className="text-xl text-gray-600 dark:text-gray-300">
                {getErrorDescription()}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="text-lg px-8 py-4">
                  <Link href={`/${sourceCountry.code.toLowerCase()}`}>
                    <ArrowRight className="mr-2 h-5 w-5 rotate-180" />
                    Back to {sourceCountry.name}
                  </Link>
                </Button>
                
                <Button variant="outline" size="lg" asChild className="text-lg px-8 py-4">
                  <Link href="/countries">
                    View All Countries
                  </Link>
                </Button>
              </div>
            </div>

            {/* Real-time status indicator */}
            <div className="mt-16 p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50">
              <h3 className="text-2xl font-semibold mb-4">Popular Destinations from {sourceCountry.name}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Explore our most popular money transfer destinations with real-time availability
              </p>
              <Button asChild variant="outline">
                <Link href={`/${sourceCountry.code.toLowerCase()}#destinations`}>
                  View Available Countries
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default async function SendMoneyPage({ 
  params 
}: { 
  params: { country: string, targetCountry: string } 
}) {
  const sourceCountryCode = params.country.toLowerCase();
  const targetCountryCode = params.targetCountry.toLowerCase();
  
  const sourceCountry = getCountryByCode(sourceCountryCode);
  const targetCountry = getCountryByCode(targetCountryCode);
  
  if (!sourceCountry || !targetCountry) {
    return notFound();
  }
  
  // Real-time country availability check
  const availability = await checkCountryAvailability(sourceCountryCode, targetCountryCode);
  
  // If target country is not available, show unavailable message immediately
  if (!availability.targetAvailable) {
    return (
      <UnavailableServiceMessage 
        sourceCountry={sourceCountry}
        targetCountry={targetCountry}
        message={`${targetCountry.name} is currently not accepting money transfers through our system.`}
        errorType="TARGET_NOT_AVAILABLE"
      />
    );
  }

  // If source country is not available, show unavailable message
  if (!availability.sourceAvailable) {
    return (
      <UnavailableServiceMessage 
        sourceCountry={sourceCountry}
        targetCountry={targetCountry}
        message={`We currently don't support sending money from ${sourceCountry.name}.`}
        errorType="SOURCE_NOT_AVAILABLE"
      />
    );
  }
  
  // Fetch page data with real-time updates
  const result = await getPageData(sourceCountryCode, targetCountryCode);
  
  // If service is not available, show unavailable message
  if (!result.success) {
    return (
      <UnavailableServiceMessage 
        sourceCountry={sourceCountry}
        targetCountry={targetCountry}
        message={result.message ?? "Service is currently unavailable."}
        errorType={result.error}
      />
    );
  }

  const pageData = result.data;
  
  // Get currency codes
  const sourceCurrency = sourceCountry.currency.code;
  const targetCurrency = targetCountry.currency.code;
  
  // Define icon components for benefits
  const iconComponents = {
    BadgeCheck: <BadgeCheck className="h-8 w-8 text-green-600" />,
    Clock: <Clock className="h-8 w-8 text-blue-600" />,
    CreditCard: <CreditCard className="h-8 w-8 text-purple-600" />,
    Percent: <Percent className="h-8 w-8 text-orange-600" />
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="pt-28 pb-16 md:pt-32 md:pb-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-950">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-center mb-6 text-sm">
                <Link href={`/${sourceCountryCode}`} className="text-white hover:text-blue-600 transition-colors duration-200">
                  {sourceCountry.name}
                </Link>
                <ArrowRight className="h-4 w-4 mx-2 text-gray-400" />
                <span className="font-medium text-blue-600">{targetCountry.name}</span>
                {/* Real-time availability indicator */}
                <div className="ml-2 flex items-center">
                  <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="ml-1 text-xs text-green-600 font-medium">Live</span>
                </div>
              </div>
              
              <div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent leading-tight">
                  {pageData.hero?.heading || `Send Money to ${targetCountry.name}`}
                </h1>
                <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                  {pageData.hero?.subheading || `Fast and secure money transfers from ${sourceCountry.name} to ${targetCountry.name}`}
                </p>
              </div>
              
              <div className="flex items-center space-x-6 mb-8 p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <span className="text-sm text-gray-500 mb-1">Send</span>
                  <div className="flex items-center">
                    <span className="mr-2 text-2xl">{sourceCountry.flag}</span>
                    <span className="font-bold text-lg">{sourceCurrency}</span>
                  </div>
                </div>
                
                <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-full">
                  <ArrowRight className="h-6 w-6 text-blue-600" />
                </div>
                
                <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <span className="text-sm text-gray-500 mb-1">Receive</span>
                  <div className="flex items-center">
                    <span className="mr-2 text-2xl">{targetCountry.flag}</span>
                    <span className="font-bold text-lg">{targetCurrency}</span>
                  </div>
                </div>
                
                <div className="flex flex-col items-center p-4 bg-green-50 dark:bg-green-900/50 rounded-xl">
                  <span className="text-sm text-gray-500 mb-1">Rate</span>
                  <div className="font-bold text-lg text-green-600">
                    {pageData.calculator?.exchangeRate?.toFixed(2) || '1.00'}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-6">
                <Button asChild size="lg" className="text-lg text-white px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg">
                  <Link href="#calculator">
                    {pageData.hero?.ctaText || 'Send Money Now'}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                
                <Button variant="outline" size="lg" className="text-lg px-8 py-4 border-2 hover:bg-gray-50 dark:hover:bg-gray-800">
                  Learn More
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                {pageData.hero?.image ? (
                  <Image
                    src={urlFor(pageData.hero.image).url()}
                    alt="Send money internationally"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <Image
                    src="https://images.pexels.com/photos/3943882/pexels-photo-3943882.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                    alt="Send money internationally"
                    fill
                    className="object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      {pageData.benefitBanners && pageData.benefitBanners.length > 0 && (
        <section className="py-20 bg-white dark:bg-gray-950">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Why Send Money with Kyro</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Experience the fastest, most secure way to send money internationally
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {pageData.benefitBanners.map((benefit: any) => (
                <Card key={benefit._key} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2">
                  <CardContent className="pt-8 pb-6">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-full group-hover:scale-110 transition-transform duration-300">
                        {iconComponents[benefit.icon as keyof typeof iconComponents] || iconComponents.BadgeCheck}
                      </div>
                      <h3 className="text-xl font-semibold group-hover:text-blue-600 transition-colors duration-300">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* Calculator Section */}
      <section id="calculator" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Calculate Your Transfer</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              See how much your recipient will get in {targetCurrency}
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700">
              <CurrencyCalculator 
                defaultSourceCountry={sourceCountryCode}
                defaultTargetCountry={targetCountryCode}
                defaultAmount={pageData.calculator?.defaultAmount || 1000}
                exchangeRate={pageData.calculator?.exchangeRate || 1.0}
                fee={pageData.calculator?.fee || 5}
                className="border-0 shadow-none"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Delivery Options Section */}
      {pageData.calculator?.deliveryOptions && pageData.calculator.deliveryOptions.length > 0 && (
        <section className="py-20 bg-white dark:bg-gray-950">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Delivery Options</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Choose how your recipient gets their money
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {pageData.calculator.deliveryOptions.map((option: any) => (
                <Card key={option._key} className="border border-gray-200 dark:border-gray-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-2xl group-hover:text-blue-600 transition-colors duration-300">{option.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center space-y-6">
                      <div className="space-y-4">
                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <p className="text-sm text-gray-500 mb-1">Delivery Time</p>
                          <p className="font-semibold text-lg text-green-600">{option.duration}</p>
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <p className="text-sm text-gray-500 mb-1">Fee</p>
                          <p className="font-semibold text-lg">
                            {formatCurrency(option.fee, sourceCurrency)}
                          </p>
                        </div>
                      </div>
                      <Button className="w-full py-3 text-lg bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600">
                        Select
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* Process Steps Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Send money in 3 simple steps
            </p>
          </div>
          
          <div className="relative">
            {/* Connecting line */}
            <div className="absolute top-16 left-[calc(50%-1px)] h-[calc(100%-160px)] w-0.5 bg-gradient-to-b from-blue-300 to-indigo-300 dark:from-blue-600 dark:to-indigo-600 hidden md:block"></div>
            
            <div className="space-y-16">
              <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-8 items-center">
                <div className="md:text-right md:pr-8 order-2 md:order-1">
                  <h3 className="text-2xl font-semibold mb-4">Enter Amount</h3>
                  <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                    Tell us how much you want to send and choose your delivery method
                  </p>
                </div>
                
                <div className="flex justify-center items-center order-1 md:order-2">
                  <div className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white h-16 w-16 flex items-center justify-center font-bold text-2xl shadow-lg">
                    1
                  </div>
                </div>
                
                <div className="order-3 hidden md:block"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-8 items-center">
                <div className="hidden md:block order-1"></div>
                
                <div className="flex justify-center items-center order-1 md:order-2">
                  <div className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white h-16 w-16 flex items-center justify-center font-bold text-2xl shadow-lg">
                    2
                  </div>
                </div>
                
                <div className="md:pl-8 order-2 md:order-3">
                  <h3 className="text-2xl font-semibold mb-4">Enter Recipient Details</h3>
                  <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                    Provide your recipient&apos;s information and payment details
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-8 items-center">
                <div className="md:text-right md:pr-8 order-2 md:order-1">
                  <h3 className="text-2xl font-semibold mb-4">Pay & Send</h3>
                  <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                    Complete your payment and we&apos;ll send your money securely
                  </p>
                </div>
                
                <div className="flex justify-center items-center order-1 md:order-2">
                  <div className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white h-16 w-16 flex items-center justify-center font-bold text-2xl shadow-lg">
                    3
                  </div>
                </div>
                
                <div className="order-3 hidden md:block"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Country Information Section */}
      {pageData.countryInfo && (
        <section className="py-20 bg-white dark:bg-gray-950">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-4">
                  Sending Money to {targetCountry.name}
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300">
                  Everything you need to know about money transfers to {targetCountry.name}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: pageData.countryInfo.description }} />
                  </div>
                </div>
                
                <div className="space-y-6">
                  <Card className="p-6 border border-gray-200 dark:border-gray-800">
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <span className="text-2xl mr-3">{targetCountry.flag}</span>
                      Quick Facts
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Currency:</span>
                        <span className="font-medium">{targetCurrency}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Exchange Rate:</span>
                        <span className="font-medium text-green-600">
                          1 {sourceCurrency} = {pageData.calculator?.exchangeRate?.toFixed(4) || '1.0000'} {targetCurrency}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Transfer Fee:</span>
                        <span className="font-medium">
                          {formatCurrency(pageData.calculator?.fee || 5, sourceCurrency)}
                        </span>
                      </div>
                    </div>
                  </Card>
                  
                  {pageData.countryInfo.requirements && (
                    <Card className="p-6 border border-gray-200 dark:border-gray-800">
                      <h3 className="text-xl font-semibold mb-4 flex items-center">
                        <BadgeCheck className="h-6 w-6 mr-2 text-green-600" />
                        Requirements
                      </h3>
                      <ul className="space-y-2">
                        {pageData.countryInfo.requirements.map((req: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <div className="h-2 w-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            <span className="text-gray-600 dark:text-gray-400">{req}</span>
                          </li>
                        ))}
                      </ul>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      
      {/* FAQ Section */}
      {pageData.faqs && pageData.faqs.length > 0 && (
        <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
                <p className="text-xl text-gray-600 dark:text-gray-300">
                  Get answers to common questions about sending money to {targetCountry.name}
                </p>
              </div>
              
              <FAQAccordion faqs={pageData.faqs} />
            </div>
          </div>
        </section>
      )}
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Send Money to {targetCountry.name}?
            </h2>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Join thousands of customers who trust Kyro for their international transfers
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-4 bg-white text-blue-600 hover:bg-gray-100">
                <Link href="#calculator">
                  Send Money Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              
              <div className="flex items-center space-x-4 text-white/80">
                <div className="flex items-center">
                  <BadgeCheck className="h-5 w-5 mr-2 text-green-300" />
                  <span>Secure & Licensed</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-blue-300" />
                  <span>Fast Transfers</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Trust Indicators */}
      <section className="py-16 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                Trusted by customers worldwide for secure money transfers
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-800 dark:text-gray-200">500K+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-800 dark:text-gray-200">150+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Countries</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-800 dark:text-gray-200">$10B+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Transferred</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-800 dark:text-gray-200">24/7</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}