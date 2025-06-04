import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, ArrowRight, Clock, CreditCard, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CurrencyCalculator } from "@/components/currency/currency-calculator";
import { FAQAccordion } from "@/components/faq-accordion";
import { client } from "@/lib/sanity";
import { urlFor } from "@/lib/sanity";
import { sendMoneyPageQuery } from "@/lib/queries";
import { getCountryByCode, getCountryCurrency } from "@/data/countries";
import type { SendMoneyPage } from "@/types";
import { formatCurrency } from "@/lib/utils";

export async function generateStaticParams() {
  return [
    { country: 'us', targetCountry: 'in' },
    { country: 'us', targetCountry: 'gb' },
    { country: 'in', targetCountry: 'us' },
    { country: 'gb', targetCountry: 'us' },
    // Add favicon param for static export
    { country: 'favicon.ico', targetCountry: '' },
  ];
}

// Generate metadata for the page
export async function generateMetadata({ 
  params 
}: { 
  params: { country?: string, targetCountry?: string } 
}): Promise<Metadata> {
  const sourceCountryCode = params.country ? params.country.toLowerCase() : '';
  const targetCountryCode = params.targetCountry ? params.targetCountry.toLowerCase() : '';

  const sourceCountry = getCountryByCode(sourceCountryCode);
  const targetCountry = getCountryByCode(targetCountryCode);

  // Only call getPageData if both params are valid strings
  let pageData = null;
  if (sourceCountryCode && targetCountryCode) {
    pageData = await getPageData(sourceCountryCode, targetCountryCode);
  }
  
  if (!sourceCountry || !targetCountry) return notFound();
  
  const title = `Send Money from ${sourceCountry.name} to ${targetCountry.name} | Best Rates | Kyro`;
  const description = `Fast and secure money transfers from ${sourceCountry.name} to ${targetCountry.name}. Great exchange rates, low fees, and multiple payout options. Send money online today!`;
  
  return {
    title,
    description,
    keywords: [
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
          url: pageData?.seo.ogImage ? urlFor(pageData.seo.ogImage).url() : '/og-image.jpg',
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
      images: [pageData?.seo.ogImage ? urlFor(pageData.seo.ogImage).url() : '/og-image.jpg'],
    },
    alternates: {
      canonical: `https://kyro.com/${params.country}/send-to/${params.targetCountry}`,
    },
  };
}

// Function to fetch data from Sanity
async function getPageData(sourceCountry: string, targetCountry: string) {
  try {
    // For demo purposes, return the demo data
    // In production, uncomment the following to fetch from Sanity
    
    const data = await client.fetch(sendMoneyPageQuery, { 
      sourceCountry, 
      targetCountry 
    });
    
    return data;
    
    
    // Return demo data with updated country codes
  } catch (error) {
    console.error("Error fetching data from Sanity:", error);
    return { sourceCountry, targetCountry };
  }
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
  
  // If either country doesn't exist in our list, return 404
  if (!sourceCountry || !targetCountry) {
    return notFound();
  }
  
  const pageData = await getPageData(sourceCountryCode, targetCountryCode);
  
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
                <Link href={`/${sourceCountryCode}`} className="text-gray-600 hover:text-blue-600 transition-colors duration-200">
                  {sourceCountry.name}
                </Link>
                <ArrowRight className="h-4 w-4 mx-2 text-gray-400" />
                <span className="font-medium text-blue-600">{targetCountry.name}</span>
              </div>
              
              <div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent leading-tight">
                  {pageData.hero.heading}
                </h1>
                <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                  {pageData.hero.subheading}
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
                    {pageData.calculator.exchangeRate.toFixed(2)}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-6">
                <Button asChild size="lg" className="text-lg px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg">
                  <Link href="#calculator">
                    {pageData.hero.ctaText}
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
                <Image
                  src="https://images.pexels.com/photos/3943882/pexels-photo-3943882.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Send money internationally"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Send Money with Kyro</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Experience the fastest, most secure way to send money internationally
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pageData.benefitBanners.map((benefit: SendMoneyPage["benefitBanners"][number]) => (
              <Card key={benefit._key} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2">
                <CardContent className="pt-8 pb-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-full group-hover:scale-110 transition-transform duration-300">
                      {iconComponents[benefit.icon as keyof typeof iconComponents]}
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
                defaultAmount={pageData.calculator.defaultAmount}
                exchangeRate={pageData.calculator.exchangeRate}
                fee={pageData.calculator.fee}
                className="border-0 shadow-none"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Delivery Options Section */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Delivery Options</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Choose how your recipient gets their money
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pageData.calculator.deliveryOptions.map(
              (option: SendMoneyPage["calculator"]["deliveryOptions"][number]) => (
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
                  <h3 className="text-2xl font-semibold mb-4">Send Money</h3>
                  <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                    Confirm and pay. Your recipient gets the money fast!
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
      
      {/* FAQs Section */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Everything you need to know about sending money
            </p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-2xl shadow-lg">
            <FAQAccordion faqs={pageData.faqs} />
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold">Ready to Send Money?</h2>
            <p className="text-xl md:text-2xl opacity-90 leading-relaxed">
              Get started with your first transfer from {sourceCountry.name} to {targetCountry.name} and enjoy great rates with low fees.
            </p>
            <Button size="lg" variant="secondary" asChild className="text-lg px-8 py-4 bg-white text-blue-600 hover:bg-gray-100 shadow-lg">
              <Link href="#calculator">
                Send Money Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}