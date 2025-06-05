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
import { homePageQuery, blogPostsQuery, countriesListQuery } from "@/lib/queries";
import { getCountryByCode } from "@/data/countries";
import { HomePage, BlogPost } from "@/types";

// Force dynamic rendering for real-time data
export const dynamic = 'force-dynamic';
export const revalidate = 0; // Disable ISR caching

// Generate static params for available countries only
export async function generateStaticParams() {
  try {
    // Fetch available countries from Sanity CMS
    const countries = await client.fetch(countriesListQuery);
    return countries
      .filter((c: any) => c.isAvailable)
      .map((c: any) => ({ country: c.code.toLowerCase() }));
  } catch (error) {
    console.error("Error fetching countries for static params:", error);
    return [];
  }
}

// Generate metadata dynamically based on CMS data
export async function generateMetadata({ 
  params 
}: { 
  params: { country: string } 
}): Promise<Metadata> {
  const countryCode = params.country.toLowerCase();
  
  try {
    const pageData = await client.fetch(homePageQuery, { country: countryCode });
    
    if (pageData?.seo) {
      return {
        title: pageData.seo.title,
        description: pageData.seo.description,
        keywords: pageData.seo.keywords,
        openGraph: {
          title: pageData.seo.title,
          description: pageData.seo.description,
          images: pageData.seo.ogImage ? [pageData.seo.ogImage] : [],
        },
      };
    }
  } catch (error) {
    console.error("Error generating metadata:", error);
  }
  
  // Fallback metadata
  const country = getCountryByCode(countryCode);
  return {
    title: `Money Transfer Services - ${country?.name || 'Country'} | Kyro`,
    description: `Send money internationally from ${country?.name || 'your country'} with competitive rates and low fees.`,
  };
}

// Function to check if country exists in CMS and fetch data
async function getCountryPageData(countryCode: string) {
  try {
    // First check if country exists in CMS countries list
    const countries = await client.fetch(countriesListQuery);
    const countryExists = countries.find((c: any) => 
      c.code.toLowerCase() === countryCode.toLowerCase() && c.isAvailable
    );
    
    if (!countryExists) {
      return { 
        exists: false, 
        pageData: null, 
        blogPosts: [], 
        countryInfo: null 
      };
    }
    
    // Fetch homepage data for the country
    const [pageData, blogPosts] = await Promise.all([
      client.fetch(homePageQuery, { country: countryCode }),
      client.fetch(blogPostsQuery, { country: countryCode })
    ]);
    
    return { 
      exists: true, 
      pageData, 
      blogPosts: blogPosts || [], 
      countryInfo: countryExists 
    };
  } catch (error) {
    console.error("Error fetching country data:", error);
    return { 
      exists: false, 
      pageData: null, 
      blogPosts: [], 
      countryInfo: null 
    };
  }
}

// Content Not Available Component
function ContentNotAvailable({ countryName }: { countryName: string }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="container py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <Landmark className="w-12 h-12 text-gray-400" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Service Not Available
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              We&apos;re not currently serving {countryName} yet, but we&apos;re working on expanding our services.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-semibold mb-4">Get Notified When We Launch</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Be the first to know when Kyro becomes available in {countryName}.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
              <Button className="px-6 py-2">
                Notify Me
              </Button>
            </div>
          </div>
          
          <div className="mt-12">
            <h3 className="text-lg font-semibold mb-4">Available Countries</h3>
            <div className="flex flex-wrap justify-center gap-2">
              <Button variant="outline" asChild>
                <Link href="/us">🇺🇸 United States</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/gb">🇬🇧 United Kingdom</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/ca">🇨🇦 Canada</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/au">🇦🇺 Australia</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function CountryHomePage({ 
  params 
}: { 
  params: { country: string } 
}) {
  const countryCode = params.country.toLowerCase();
  const country = getCountryByCode(countryCode);
  
  // If country doesn't exist in our predefined list, return 404
  if (!country) {
    return notFound();
  }
  
  // Fetch real-time data from CMS
  const { exists, pageData, blogPosts, countryInfo } = await getCountryPageData(countryCode);
  
  // If country doesn't exist in CMS or is not available, show content not available
  if (!exists || !pageData) {
    return <ContentNotAvailable countryName={country.name} />;
  }
  
  // Defensive: fallback empty arrays for missing sections
  const features = pageData.features || [];
  const banners = pageData.banners || [];
  const exchangeRates = pageData.exchangeRates || [];
  const testimonials = pageData.testimonials || [];
  const faqs = pageData.faqs || [];

  // Define icon components for features
  const iconComponents = {
    Landmark: <Landmark className="h-8 w-8 text-blue-600" />,
    Shield: <Shield className="h-8 w-8 text-blue-600" />,
    Clock: <Clock className="h-8 w-8 text-blue-600" />,
    TrendingUp: <TrendingUp className="h-8 w-8 text-blue-600" />
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      {/* Hero Section */}
      <section className="pt-32 pb-2 md:pt-20 md:pb-8 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-200 opacity-30 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-400 opacity-20 rounded-full blur-3xl" />
        </div>
        <div className="container relative z-10 flex flex-col items-center justify-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start w-full max-w-6xl mx-auto">
            
            <div className="text-center lg:text-center pt-20">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 text-blue-900 dark:text-white drop-shadow-lg">
                {pageData.hero?.heading || `Send Money from ${country.name}`}
              </h1>
              <p className="text-2xl text-blue-700 dark:text-blue-200 mb-10 font-medium">
                {pageData.hero?.subheading || `Transfer money internationally from ${country.name} with competitive rates and low fees`}
              </p>
              <div className="flex justify-center">
                <Button asChild size="lg" className="rounded-full px-10 py-5 text-lg shadow-lg">
                  <Link href={pageData.hero?.ctaLink || `/${countryCode}/send-money`}>
                    {pageData.hero?.ctaText || "Get Started"}
                  </Link>
                </Button>
              </div>
            </div>
            <div className="flex justify-center lg:justify-center">
              <div className="bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-2xl p-6 w-full max-w-md backdrop-blur-md mx-auto">
                <CurrencyCalculator 
                  defaultSourceCountry={countryCode}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      {features.length > 0 && (
        <section className="py-20 bg-gradient-to-r from-blue-100 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
          <div className="container flex flex-col items-center">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-blue-900 dark:text-white mb-2">Why Choose Kyro</h2>
              <p className="text-lg text-blue-700 dark:text-blue-200 mt-2">
                The smarter way to send money internationally
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 w-full max-w-6xl mx-auto">
              {features.map((feature: any, index: number) => (
                <div 
                  key={index} 
                  className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg text-center border border-blue-100 dark:border-gray-800 hover:scale-105 transition-transform duration-200"
                >
                  <div className="flex justify-center mb-5">
                    {iconComponents[feature.icon as keyof typeof iconComponents]}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-blue-800 dark:text-blue-200">{feature.title}</h3>
                  <p className="text-blue-700 dark:text-blue-300">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* Banner Section */}
      {banners.length > 0 && (
        <section className="py-20 bg-gradient-to-l from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
          <div className="container flex flex-col items-center">
            <div className="space-y-20 w-full max-w-6xl mx-auto">
              {banners.map((banner: any, index: number) => (
                <BannerCard
                  key={banner._key}
                  title={banner.title}
                  subtitle={banner.subtitle}
                  image={banner.image}
                  ctaText={banner.ctaText}
                  ctaLink={banner.ctaLink}
                  backgroundColor={banner.backgroundColor}
                  direction={index % 2 === 0 ? "row" : "row-reverse"}
                />
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* Exchange Rates & Testimonials Section */}
      {(exchangeRates.length > 0 || testimonials.length > 0) && (
        <section className="py-20 bg-white dark:bg-gray-950">
          <div className="container flex flex-col items-center">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 w-full max-w-6xl mx-auto">
              {exchangeRates.length > 0 && (
                <div className="lg:col-span-2 flex justify-center">
                  <ExchangeRateCard rates={exchangeRates} />
                </div>
              )}
              
              {testimonials.length > 0 && (
                <div className={exchangeRates.length > 0 ? "lg:col-span-3" : "lg:col-span-5"}>
                  <div className="text-center mb-10">
                    <h2 className="text-2xl md:text-3xl font-bold text-blue-900 dark:text-white">What Our Customers Say</h2>
                  </div>
                  <TestimonialsCarousel testimonials={testimonials} />
                </div>
              )}
            </div>
          </div>
        </section>
      )}
      
      {/* FAQs Section */}
      {faqs.length > 0 && (
        <section className="py-20 bg-gradient-to-r from-blue-50 via-white to-blue-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
          <div className="container max-w-3xl flex flex-col items-center">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-blue-900 dark:text-white">Frequently Asked Questions</h2>
            </div>
            <FAQAccordion faqs={faqs} />
          </div>
        </section>
      )}
      
      {/* Blog Section */}
      {blogPosts.length > 0 && (
        <section className="py-20 bg-white dark:bg-gray-950">
          <div className="container flex flex-col items-center">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-blue-900 dark:text-white">Latest Articles</h2>
              <p className="text-lg text-blue-700 dark:text-blue-200 mt-2">
                Tips and insights about international money transfers
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full max-w-6xl mx-auto">
              {blogPosts.map((post: any) => (
                <BlogPreviewCard key={post._id} post={post} />
              ))}
            </div>
            <div className="text-center mt-14">
              <Button variant="outline" asChild className="px-8 py-3 text-lg">
                <Link href={`/${countryCode}/blog`}>View All Articles</Link>
              </Button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}