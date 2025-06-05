export const homePageQuery = `
  *[_type == "homePage" && country == $country][0] {
    country,
    title,
    subtitle,
    hero {
      heading,
      subheading,
      image,
      ctaText,
      ctaLink
    },
    features[] {
      title,
      description,
      icon
    },
    banners[] {
      _key,
      title,
      subtitle,
      image,
      ctaText,
      ctaLink,
      backgroundColor
    },
    exchangeRates[] {
      _key,
      sourceCurrency,
      targetCurrency,
      rate,
      lastUpdated
    },
    testimonials[] {
      _key,
      name,
      quote,
      rating,
      location,
      image
    },
    faqs[] {
      _key,
      question,
      answer
    },
    seo {
      title,
      description,
      keywords,
      ogImage
    }
  }
`;

export const sendMoneyPageQuery = `
  *[_type == "sendMoneyPage" && sourceCountry == $sourceCountry && targetCountry == $targetCountry][0] {
    sourceCountry,
    targetCountry,
    title,
    subtitle,
    hero {
      heading,
      subheading,
      image,
      ctaText,
      ctaLink
    },
    calculator {
      defaultAmount,
      fee,
      exchangeRate,
      deliveryOptions[] {
        _key,
        name,
        duration,
        fee
      }
    },
    benefitBanners[] {
      _key,
      title,
      description,
      icon
    },
    faqs[] {
      _key,
      question,
      answer
    },
    seo {
      title,
      description,
      keywords,
      ogImage
    }
  }
`;

export const countriesListQuery = `
  *[_type == "country"] | order(name asc) {
    code,
    name,
    flag,
    currency {
      code,
      symbol,
      name
    },
    isAvailable
  }
`;

export const blogPostsQuery = `
  *[_type == "blogPost" && references(*[_type == "country" && code == $country]._id)] | order(publishedAt desc)[0...3] {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    publishedAt,
    categories[]->{ title }
  }
`;