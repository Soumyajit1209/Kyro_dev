import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Landmark, Shield, Clock, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BannerCard } from "@/components/ui/banner-card";
import { CurrencyCalculator } from "@/components/currency/currency-calculator";
import { ExchangeRateCard } from "@/components/exchange-rate-card";
import { TestimonialsCarousel } from "@/components/testimonials-carousel";
import { FAQAccordion } from "@/components/faq-accordion";
import { BlogPreviewCard } from "@/components/blog-preview-card";
import { client } from "@/lib/sanity";
import { homePageQuery, blogPostsQuery } from "@/lib/queries";
import { getCountryByCode } from "@/data/countries";
import { urlFor } from "@/lib/sanity";
import { HomePage, BlogPost } from "@/types";

// Generate static params for static site generation
export async function generateStaticParams() {
  return [
    { country: 'us' },
    { country: 'in' },
    { country: 'gb' },
    { country: 'ca' },
    { country: 'au' },
  ];
}

// Generate metadata for the page
export async function generateMetadata({ 
  params 
}: { 
  params: { country: string } 
}): Promise<Metadata> {
  const country = getCountryByCode(params.country);
  if (!country) return notFound();
  
  const { pageData } = await getPageData(params.country);
  const countryName = country.name;
  const seo = pageData?.seo || {};

  return {
    title: seo.title || `Send money from ${countryName} | Kyro`,
    description: seo.description || `Send money from ${countryName} with Kyro. Fast, secure, and low fees.`,
    keywords: seo.keywords || ["money transfer", "send money", countryName],
    openGraph: {
      title: seo.title || `Send money from ${countryName} | Kyro`,
      description: seo.description || `Send money from ${countryName} with Kyro. Fast, secure, and low fees.`,
      images: [
        {
          url: seo.ogImage ? urlFor(seo.ogImage).url() : '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: `Send money from ${countryName}`,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title || `Send money from ${countryName} | Kyro`,
      description: seo.description || `Send money from ${countryName} with Kyro. Fast, secure, and low fees.`,
      images: [seo.ogImage ? urlFor(seo.ogImage).url() : '/og-image.jpg'],
    },
    alternates: {
      canonical: `https://kyro.com/${params.country}`,
    },
  };
}

// Sample data (until Sanity integration is complete)
const demoData: HomePage = {
  country: "us",
  title: "Fast & Secure Money Transfers | Kyro",
  subtitle: "Send money globally with competitive rates and low fees",
  hero: {
    heading: "Send Money Abroad Quickly & Securely",
    subheading: "Transfer money to friends and family worldwide with great rates and low fees",
    image: {
      _type: "image",
      asset: {
        _ref: "image-123",
        _type: "reference"
      },
      alt: "Global money transfer"
    },
    ctaText: "Get Started",
    ctaLink: "/us/send-money"
  },
  features: [
    {
      title: "Trusted Worldwide",
      description: "Over 10 million customers trust us for international transfers",
      icon: "Landmark"
    },
    {
      title: "Bank-Level Security",
      description: "Your money and data are protected with advanced encryption",
      icon: "Shield"
    },
    {
      title: "Fast Transfers",
      description: "Money arrives within minutes for most destinations",
      icon: "Clock"
    },
    {
      title: "Competitive Rates",
      description: "Get the best exchange rates with low, transparent fees",
      icon: "TrendingUp"
    }
  ],
  banners: [
    {
      _key: "banner1",
      title: "No Hidden Fees",
      subtitle: "We're transparent about our fees. What you see is what you pay.",
      image: {
        _type: "image",
        asset: {
          _ref: "image-456",
          _type: "reference"
        }
      },
      ctaText: "Learn More",
      ctaLink: "/us/fees",
      backgroundColor: "bg-blue-50 dark:bg-blue-950"
    },
    {
      _key: "banner2",
      title: "Send Money to India",
      subtitle: "Great rates, fast delivery, and multiple payout options.",
      image: {
        _type: "image",
        asset: {
          _ref: "image-789",
          _type: "reference"
        }
      },
      ctaText: "Send Now",
      ctaLink: "/us/send-to/in",
      backgroundColor: "bg-green-50 dark:bg-green-950"
    }
  ],
  exchangeRates: [
    {
      _key: "rate1",
      sourceCurrency: "USD",
      targetCurrency: "INR",
      rate: 83.5,
      lastUpdated: new Date().toISOString()
    },
    {
      _key: "rate2",
      sourceCurrency: "USD",
      targetCurrency: "GBP",
      rate: 0.785,
      lastUpdated: new Date().toISOString()
    },
    {
      _key: "rate3",
      sourceCurrency: "USD",
      targetCurrency: "EUR",
      rate: 0.92,
      lastUpdated: new Date().toISOString()
    },
    {
      _key: "rate4",
      sourceCurrency: "USD",
      targetCurrency: "PHP",
      rate: 57.23,
      lastUpdated: new Date().toISOString()
    }
  ],
  testimonials: [
    {
      _key: "testimonial1",
      name: "Sarah Johnson",
      quote: "I've been using Kyro for sending money to my family in India for over a year now. The transfers are consistently fast, and the rates are better than my bank.",
      rating: 5,
      location: "California, USA",
      image: {
        _type: "image",
        asset: {
          _ref: "image-abc",
          _type: "reference"
        }
      }
    },
    {
      _key: "testimonial2",
      name: "David Chen",
      quote: "The app is so easy to use. I can send money to my parents in minutes, and they receive it directly in their bank account. Highly recommend!",
      rating: 5,
      location: "New York, USA",
      image: {
        _type: "image",
        asset: {
          _ref: "image-def",
          _type: "reference"
        }
      }
    },
    {
      _key: "testimonial3",
      name: "Maria Rodriguez",
      quote: "Customer service is excellent. When I had an issue with my transfer, they resolved it immediately. The best money transfer service I've used.",
      rating: 4,
      location: "Texas, USA",
      image: {
        _type: "image",
        asset: {
          _ref: "image-ghi",
          _type: "reference"
        }
      }
    }
  ],
  faqs: [
    {
      _key: "faq1",
      question: "How long does it take to send money?",
      answer: "Most transfers arrive within minutes, though some destinations and payment methods may take 1-2 business days."
    },
    {
      _key: "faq2",
      question: "What are the fees for sending money?",
      answer: "Our fees depend on the amount sent, destination country, and payment method. You'll always see the exact fee before confirming your transfer."
    },
    {
      _key: "faq3",
      question: "Is Kyro safe to use?",
      answer: "Yes, Kyro uses bank-level encryption and security protocols to protect your data and money. We're also regulated in all countries where we operate."
    },
    {
      _key: "faq4",
      question: "What payment methods can I use?",
      answer: "You can pay for transfers using bank transfers, debit cards, credit cards, and digital wallets depending on your country."
    },
    {
      _key: "faq5",
      question: "How do I track my transfer?",
      answer: "Once you send money, you'll receive updates via email and SMS. You can also track your transfer in real-time through our app or website."
    }
  ],
  seo: {
    title: "Fast & Secure Money Transfers | Kyro",
    description: "Send money globally with competitive rates and low fees. Fast, secure international transfers to 100+ countries.",
    keywords: ["money transfer", "send money", "international transfer", "remittance"],
    ogImage: {
      _type: "image",
      asset: {
        _ref: "image-seo",
        _type: "reference"
      }
    }
  }
};

const demoBlogPosts: BlogPost[] = [
  {
    _id: "blog1",
    title: "5 Tips for Saving Money on International Transfers",
    slug: { current: "saving-money-international-transfers" },
    excerpt: "Learn how to reduce fees and get better exchange rates when sending money abroad.",
    mainImage: {
      _type: "image",
      asset: {
        _ref: "image-blog1",
        _type: "reference"
      }
    },
    publishedAt: new Date().toISOString(),
    categories: [{ title: "Money Tips" }, { title: "International Transfers" }]
  },
  {
    _id: "blog2",
    title: "Understanding Currency Fluctuations: What Affects Your Transfer Rate",
    slug: { current: "understanding-currency-fluctuations" },
    excerpt: "An in-depth look at how global events and market forces impact currency exchange rates.",
    mainImage: {
      _type: "image",
      asset: {
        _ref: "image-blog2",
        _type: "reference"
      }
    },
    publishedAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    categories: [{ title: "Finance" }, { title: "Currency Exchange" }]
  },
  {
    _id: "blog3",
    title: "The Future of International Money Transfers",
    slug: { current: "future-international-money-transfers" },
    excerpt: "How technology is transforming the way we send money across borders.",
    mainImage: {
      _type: "image",
      asset: {
        _ref: "image-blog3",
        _type: "reference"
      }
    },
    publishedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    categories: [{ title: "Technology" }, { title: "Industry Trends" }]
  }
];

async function getPageData(countryCode: string) {
  try {
    const data = await client.fetch(homePageQuery, { 
      country: countryCode 
    });
    
    const blogPosts = await client.fetch(blogPostsQuery, {
      country: countryCode
    });
    
    return { pageData: data, blogPosts };
    
    // Return demo data
    return { 
      pageData: { ...demoData, country: countryCode }, 
      blogPosts: demoBlogPosts 
    };
  } catch (error) {
    console.error("Error fetching data from Sanity:", error);
    return { 
      pageData: { ...demoData, country: countryCode }, 
      blogPosts: demoBlogPosts 
    };
  }
}

export default async function CountryHomePage({ 
  params 
}: { 
  params: { country: string } 
}) {
  const countryCode = params.country.toLowerCase();
  const country = getCountryByCode(countryCode);
  
  // If country doesn't exist in our list, return 404
  if (!country) {
    return notFound();
  }
  
  const { pageData, blogPosts } = await getPageData(countryCode);
  
  // Defensive: fallback to empty arrays if any section is missing
  const features = pageData.features ?? [];
  const banners = pageData.banners ?? [];
  const exchangeRates = pageData.exchangeRates ?? [];
  const testimonials = pageData.testimonials ?? [];
  const faqs = pageData.faqs ?? [];
  const blogPostsSafe = blogPosts ?? [];

  // Define icon components for features
  const iconComponents = {
    Landmark: <Landmark className="h-8 w-8 text-blue-600" />,
    Shield: <Shield className="h-8 w-8 text-blue-600" />,
    Clock: <Clock className="h-8 w-8 text-blue-600" />,
    TrendingUp: <TrendingUp className="h-8 w-8 text-blue-600" />
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="pt-28 pb-16 md:pt-32 md:pb-20 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                {pageData.hero.heading}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                {pageData.hero.subheading}
              </p>
              <Button asChild size="lg" className="rounded-full px-8">
                <Link href={pageData.hero.ctaLink || "#"}>
                  {pageData.hero.ctaText}
                </Link>
              </Button>
            </div>
            
            <div className="flex justify-center lg:justify-end">
              <CurrencyCalculator 
                defaultSourceCountry={countryCode}
                className="w-full max-w-md shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Why Choose Kyro</h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              The smarter way to send money internationally
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {(features as Array<{title: string; description: string; icon: string}>).map((feature, index) => (
              <div 
                key={index} 
                className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg text-center"
              >
                <div className="flex justify-center mb-4">
                  {iconComponents[feature.icon as keyof typeof iconComponents]}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Banner Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container space-y-16">
          {(banners as Array<{_key: string; title: string; subtitle: string; image: any; ctaText: string; ctaLink: string; backgroundColor: string}>).map((banner) => (
            <BannerCard
              key={banner._key}
              title={banner.title}
              subtitle={banner.subtitle}
              image={banner.image}
              ctaText={banner.ctaText}
              ctaLink={banner.ctaLink || "#"}
              backgroundColor={banner.backgroundColor}
              direction={banner._key === "banner1" ? "row" : "row-reverse"}
            />
          ))}
        </div>
      </section>
      
      {/* Exchange Rates & Testimonials Section */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2">
              <ExchangeRateCard rates={exchangeRates} />
            </div>
            
            <div className="lg:col-span-3">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold">What Our Customers Say</h2>
              </div>
              <TestimonialsCarousel testimonials={testimonials} />
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQs Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container max-w-3xl">
          <FAQAccordion faqs={faqs} />
        </div>
      </section>
      
      {/* Blog Section */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Latest Articles</h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Tips and insights about international money transfers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(blogPostsSafe as import("@/types").BlogPost[]).map((post) => (
              <BlogPreviewCard key={post._id} post={post} />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button variant="outline" asChild>
              <Link href={`/${countryCode}/blog`}>View All Articles</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}