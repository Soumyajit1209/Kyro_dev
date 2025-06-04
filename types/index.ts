// Country types
export interface Country {
  code: string;
  name: string;
  flag: string;
  currency: Currency;
  isAvailable: boolean;
}

export interface Currency {
  code: string;
  symbol: string;
  name: string;
}

// Sanity image type
export interface SanityImage {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
  alt?: string;
}

// Generic content types
export interface Hero {
  heading: string;
  subheading: string;
  image: SanityImage;
  ctaText: string;
  ctaLink: string;
}

export interface Banner {
  _key: string;
  title: string;
  subtitle: string;
  image: SanityImage;
  ctaText: string;
  ctaLink: string;
  backgroundColor?: string;
}

export interface Feature {
  title: string;
  description: string;
  icon: string;
}

export interface ExchangeRate {
  _key: string;
  sourceCurrency: string;
  targetCurrency: string;
  rate: number;
  lastUpdated: string;
}

export interface Testimonial {
  _key: string;
  name: string;
  quote: string;
  rating: number;
  location: string;
  image: SanityImage;
}

export interface FAQ {
  _key: string;
  question: string;
  answer: string;
}

export interface SEO {
  title: string;
  description: string;
  keywords: string[];
  ogImage: SanityImage;
}

// Page types
export interface HomePage {
  country: string;
  title: string;
  subtitle: string;
  hero: Hero;
  features: Feature[];
  banners: Banner[];
  exchangeRates: ExchangeRate[];
  testimonials: Testimonial[];
  faqs: FAQ[];
  seo: SEO;
}

export interface SendMoneyPage {
  sourceCountry: string;
  targetCountry: string;
  title: string;
  subtitle: string;
  hero: Hero;
  calculator: {
    defaultAmount: number;
    fee: number;
    exchangeRate: number;
    deliveryOptions: DeliveryOption[];
  };
  benefitBanners: {
    _key: string;
    title: string;
    description: string;
    icon: string;
  }[];
  faqs: FAQ[];
  seo: SEO;
}

export interface DeliveryOption {
  _key: string;
  name: string;
  duration: string;
  fee: number;
}

export interface BlogPost {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt: string;
  mainImage: SanityImage;
  publishedAt: string;
  categories: { title: string }[];
}