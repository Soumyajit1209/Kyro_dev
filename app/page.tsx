import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, ArrowRight, Clock, CreditCard, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CurrencyCalculator } from "@/components/currency/currency-calculator";
import { FAQAccordion } from "@/components/faq-accordion";
import { client, urlFor } from "@/lib/sanity";
import { sendMoneyPageQuery } from "@/lib/queries";
import { getCountryByCode, getCountryCurrency } from "@/data/countries";
import type { SendMoneyPage } from "@/types";
import { formatCurrency } from "@/lib/utils";

// Sample data (until Sanity integration is complete)
const demoData: SendMoneyPage = {
  sourceCountry: "us",
  targetCountry: "in",
  title: "Send Money from USA to India | Kyro",
  subtitle: "Fast, secure money transfers from the United States to India",
  hero: {
    heading: "Send Money from USA to India",
    subheading: "Fast transfers with great exchange rates and low fees",
    image: {
      _type: "image",
      asset: {
        _ref: "image-123",
        _type: "reference"
      },
      alt: "USA to India money transfer"
    },
    ctaText: "Get Started",
    ctaLink: "#calculator"
  },
  calculator: {
    defaultAmount: 1000,
    fee: 3.99,
    exchangeRate: 83.5, // USD to INR
    deliveryOptions: [
      {
        _key: "option1",
        name: "Bank Transfer",
        duration: "Within 24 hours",
        fee: 3.99
      },
      {
        _key: "option2",
        name: "Cash Pickup",
        duration: "Within 30 minutes",
        fee: 4.99
      },
      {
        _key: "option3",
        name: "Mobile Wallet",
        duration: "Instant",
        fee: 2.99
      }
    ]
  },
  benefitBanners: [
    {
      _key: "benefit1",
      title: "Guaranteed Best Rates",
      description: "We match or beat any competitor's exchange rate",
      icon: "Percent"
    },
    {
      _key: "benefit2",
      title: "Fast Delivery",
      description: "Money typically arrives within minutes",
      icon: "Clock"
    },
    {
      _key: "benefit3",
      title: "Secure Transfers",
      description: "Bank-level encryption protects your money",
      icon: "BadgeCheck"
    },
    {
      _key: "benefit4",
      title: "Multiple Payment Options",
      description: "Pay with bank transfer, card, or digital wallet",
      icon: "CreditCard"
    }
  ],
  faqs: [
    {
      _key: "faq1",
      question: "How long does it take to send money from USA to India?",
      answer: "Most transfers arrive within minutes to a few hours. Bank transfers may take up to 24 hours during business days."
    },
    {
      _key: "faq2",
      question: "What's the maximum amount I can send?",
      answer: "You can send up to $10,000 per transaction and up to $30,000 per month, depending on verification level."
    },
    {
      _key: "faq3",
      question: "What information do I need to send money to India?",
      answer: "You'll need your recipient's full name, bank account number, IFSC code (for bank transfers), or mobile number (for wallet transfers)."
    },
    {
      _key: "faq4",
      question: "Is there a minimum amount I can send?",
      answer: "The minimum transfer amount is $10 or equivalent."
    },
    {
      _key: "faq5",
      question: "Are there any documents required to send money?",
      answer: "For amounts over $1,000, you may need to provide ID verification and information about the source of funds."
    }
  ],
  seo: {
    title: "Send Money from USA to India | Best Rates | Kyro",
    description: "Fast and secure money transfers from USA to India with competitive exchange rates and low fees. Send money to bank accounts, cash pickup, or mobile wallets.",
    keywords: ["send money to India", "USA to India transfer", "remittance", "rupee transfer"],
    ogImage: {
      _type: "image",
      asset: {
        _ref: "image-seo",
        _type: "reference"
      }
    }
  }
};

// Generate static params for static site generation
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
  
  if (!sourceCountry || !targetCountry) return notFound();
  
  const pageData = await getPageData(params.country ?? '', params.targetCountry ?? '');
  
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
          url: pageData.seo.ogImage ? urlFor(pageData.seo.ogImage).url() : '/og-image.jpg',
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
      images: [pageData.seo.ogImage ? urlFor(pageData.seo.ogImage).url() : '/og-image.jpg'],
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
    /*
    const data = await client.fetch(sendMoneyPageQuery, { 
      sourceCountry, 
      targetCountry 
    });
    
    return data;
    */
    
    // Return demo data with updated country codes
    return { 
      ...demoData,
      sourceCountry,
      targetCountry,
      // Update hero content based on countries
      hero: {
        ...demoData.hero,
        heading: `Send Money from ${getCountryByCode(sourceCountry)?.name || 'USA'} to ${getCountryByCode(targetCountry)?.name || 'India'}`,
        subheading: `Fast transfers with great exchange rates and low fees`
      },
      // Update SEO based on countries
      seo: {
        ...demoData.seo,
        title: `Send Money from ${getCountryByCode(sourceCountry)?.name || 'USA'} to ${getCountryByCode(targetCountry)?.name || 'India'} | Kyro`,
        description: `Fast and secure money transfers from ${getCountryByCode(sourceCountry)?.name || 'USA'} to ${getCountryByCode(targetCountry)?.name || 'India'} with competitive exchange rates and low fees.`
      }
    };
  } catch (error) {
    console.error("Error fetching data from Sanity:", error);
    return { ...demoData, sourceCountry, targetCountry };
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
      <section className="pt-28 pb-16 md:pt-32 md:pb-20 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center mb-6 text-sm">
                <Link href={`/${sourceCountryCode}`} className="text-gray-600 hover:text-blue-600">
                  {sourceCountry.name}
                </Link>
                <ArrowRight className="h-4 w-4 mx-2 text-gray-400" />
                <span className="font-medium">{targetCountry.name}</span>
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                {pageData.hero.heading}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
                {pageData.hero.subheading}
              </p>
              
              <div className="flex items-center space-x-4 mb-8">
                <div className="flex flex-col items-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <span className="text-sm text-gray-500">Send</span>
                  <div className="flex items-center">
                    <span className="mr-1">{sourceCountry.flag}</span>
                    <span className="font-semibold">{sourceCurrency}</span>
                  </div>
                </div>
                
                <ArrowRight className="h-5 w-5 text-gray-400" />
                
                <div className="flex flex-col items-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <span className="text-sm text-gray-500">Receive</span>
                  <div className="flex items-center">
                    <span className="mr-1">{targetCountry.flag}</span>
                    <span className="font-semibold">{targetCurrency}</span>
                  </div>
                </div>
                
                <div className="flex flex-col items-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <span className="text-sm text-gray-500">Rate</span>
                  <div className="font-semibold">
                    {pageData.calculator.exchangeRate.toFixed(2)}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg">
                  <Link href="#calculator">
                    {pageData.hero.ctaText}
                  </Link>
                </Button>
                
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </div>
            </div>
            
            <div className="hidden lg:block relative h-[400px]">
              <Image
                src="https://images.pexels.com/photos/3943882/pexels-photo-3943882.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Send money internationally"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Why Send Money with Kyro</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pageData.benefitBanners.map((benefit) => (
              <Card key={benefit._key} className="border-0 shadow-md">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4">
                      {iconComponents[benefit.icon as keyof typeof iconComponents]}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400">
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
      <section id="calculator" className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Calculate Your Transfer</h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              See how much your recipient will get in {targetCurrency}
            </p>
          </div>
          
          <div className="max-w-xl mx-auto">
            <CurrencyCalculator 
              defaultSourceCountry={sourceCountryCode}
              defaultTargetCountry={targetCountryCode}
              defaultAmount={pageData.calculator.defaultAmount}
              exchangeRate={pageData.calculator.exchangeRate}
              fee={pageData.calculator.fee}
              className="shadow-xl"
            />
          </div>
        </div>
      </section>
      
      {/* Delivery Options Section */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Delivery Options</h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Choose how your recipient gets their money
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {pageData.calculator.deliveryOptions.map((option) => (
              <Card key={option._key} className="border border-gray-200 dark:border-gray-800">
                <CardHeader>
                  <CardTitle className="text-center">{option.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-4">
                    <div>
                      <p className="text-gray-500">Delivery Time</p>
                      <p className="font-medium">{option.duration}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Fee</p>
                      <p className="font-medium">
                        {formatCurrency(option.fee, sourceCurrency)}
                      </p>
                    </div>
                    <Button className="w-full mt-4">Select</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Process Steps Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">How It Works</h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Send money in 3 simple steps
            </p>
          </div>
          
          <div className="relative">
            {/* Connecting line */}
            <div className="absolute top-12 left-[calc(50%-1px)] h-[calc(100%-80px)] w-0.5 bg-gray-200 dark:bg-gray-700 hidden md:block"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-6 mb-16">
              <div className="md:text-right md:pr-8 order-2 md:order-1">
                <h3 className="text-xl font-semibold mb-2">Enter Amount</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Tell us how much you want to send and choose your delivery method
                </p>
              </div>
              
              <div className="flex justify-center items-center order-1 md:order-2">
                <div className="rounded-full bg-blue-600 text-white h-10 w-10 flex items-center justify-center font-bold text-lg">
                  1
                </div>
              </div>
              
              <div className="order-3 hidden md:block"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-6 mb-16">
              <div className="hidden md:block order-1"></div>
              
              <div className="flex justify-center items-center order-1 md:order-2">
                <div className="rounded-full bg-blue-600 text-white h-10 w-10 flex items-center justify-center font-bold text-lg">
                  2
                </div>
              </div>
              
              <div className="md:pl-8 order-2 md:order-3">
                <h3 className="text-xl font-semibold mb-2">Enter Recipient Details</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Provide your recipient&apos;s information and payment details
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-6">
              <div className="md:text-right md:pr-8 order-2 md:order-1">
                <h3 className="text-xl font-semibold mb-2">Send Money</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Confirm and pay. Your recipient gets the money fast!
                </p>
              </div>
              
              <div className="flex justify-center items-center order-1 md:order-2">
                <div className="rounded-full bg-blue-600 text-white h-10 w-10 flex items-center justify-center font-bold text-lg">
                  3
                </div>
              </div>
              
              <div className="order-3 hidden md:block"></div>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQs Section */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="container max-w-3xl">
          <FAQAccordion faqs={pageData.faqs} />
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Send Money?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Get started with your first transfer from {sourceCountry.name} to {targetCountry.name} and enjoy great rates with low fees.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="#calculator">Send Money Now</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}