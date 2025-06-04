// This is a sample Sanity.io schema for the Kyro money transfer platform
// Import these into your Sanity Studio when setting it up

export const homePage = {
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  fields: [
    {
      name: 'country',
      title: 'Country',
      type: 'string',
      description: 'Country code (e.g., "us", "in", "gb")',
      validation: Rule => Rule.required()
    },
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Page title',
      validation: Rule => Rule.required()
    },
    {
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
      description: 'Page subtitle or description'
    },
    {
      name: 'hero',
      title: 'Hero Section',
      type: 'object',
      fields: [
        { name: 'heading', title: 'Heading', type: 'string' },
        { name: 'subheading', title: 'Subheading', type: 'string' },
        { name: 'image', title: 'Image', type: 'image', options: { hotspot: true } },
        { name: 'ctaText', title: 'CTA Text', type: 'string' },
        { name: 'ctaLink', title: 'CTA Link', type: 'string' }
      ]
    },
    {
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', title: 'Title', type: 'string' },
            { name: 'description', title: 'Description', type: 'string' },
            { name: 'icon', title: 'Icon', type: 'string', description: 'Lucide icon name' }
          ]
        }
      ]
    },
    {
      name: 'banners',
      title: 'Banners',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', title: 'Title', type: 'string' },
            { name: 'subtitle', title: 'Subtitle', type: 'string' },
            { name: 'image', title: 'Image', type: 'image', options: { hotspot: true } },
            { name: 'ctaText', title: 'CTA Text', type: 'string' },
            { name: 'ctaLink', title: 'CTA Link', type: 'string' },
            { name: 'backgroundColor', title: 'Background Color', type: 'string' }
          ]
        }
      ]
    },
    {
      name: 'exchangeRates',
      title: 'Exchange Rates',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'sourceCurrency', title: 'Source Currency', type: 'string' },
            { name: 'targetCurrency', title: 'Target Currency', type: 'string' },
            { name: 'rate', title: 'Rate', type: 'number' },
            { name: 'lastUpdated', title: 'Last Updated', type: 'datetime' }
          ]
        }
      ]
    },
    {
      name: 'testimonials',
      title: 'Testimonials',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', title: 'Name', type: 'string' },
            { name: 'quote', title: 'Quote', type: 'text' },
            { name: 'rating', title: 'Rating', type: 'number', validation: Rule => Rule.min(1).max(5) },
            { name: 'location', title: 'Location', type: 'string' },
            { name: 'image', title: 'Image', type: 'image', options: { hotspot: true } }
          ]
        }
      ]
    },
    {
      name: 'faqs',
      title: 'FAQs',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'question', title: 'Question', type: 'string' },
            { name: 'answer', title: 'Answer', type: 'text' }
          ]
        }
      ]
    },
    {
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        { name: 'title', title: 'Title', type: 'string' },
        { name: 'description', title: 'Description', type: 'text' },
        { name: 'keywords', title: 'Keywords', type: 'array', of: [{ type: 'string' }] },
        { name: 'ogImage', title: 'Open Graph Image', type: 'image', options: { hotspot: true } }
      ]
    }
  ]
};

export const sendMoneyPage = {
  name: 'sendMoneyPage',
  title: 'Send Money Page',
  type: 'document',
  fields: [
    {
      name: 'sourceCountry',
      title: 'Source Country',
      type: 'string',
      description: 'Country sending from (e.g., "us", "in")',
      validation: Rule => Rule.required()
    },
    {
      name: 'targetCountry',
      title: 'Target Country',
      type: 'string',
      description: 'Country sending to (e.g., "in", "us")',
      validation: Rule => Rule.required()
    },
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string'
    },
    {
      name: 'hero',
      title: 'Hero Section',
      type: 'object',
      fields: [
        { name: 'heading', title: 'Heading', type: 'string' },
        { name: 'subheading', title: 'Subheading', type: 'string' },
        { name: 'image', title: 'Image', type: 'image', options: { hotspot: true } },
        { name: 'ctaText', title: 'CTA Text', type: 'string' },
        { name: 'ctaLink', title: 'CTA Link', type: 'string' }
      ]
    },
    {
      name: 'calculator',
      title: 'Calculator Settings',
      type: 'object',
      fields: [
        { name: 'defaultAmount', title: 'Default Amount', type: 'number' },
        { name: 'fee', title: 'Fee', type: 'number' },
        { name: 'exchangeRate', title: 'Exchange Rate', type: 'number' },
        {
          name: 'deliveryOptions',
          title: 'Delivery Options',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'name', title: 'Name', type: 'string' },
                { name: 'duration', title: 'Duration', type: 'string' },
                { name: 'fee', title: 'Fee', type: 'number' }
              ]
            }
          ]
        }
      ]
    },
    {
      name: 'benefitBanners',
      title: 'Benefit Banners',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', title: 'Title', type: 'string' },
            { name: 'description', title: 'Description', type: 'string' },
            { name: 'icon', title: 'Icon', type: 'string', description: 'Lucide icon name' }
          ]
        }
      ]
    },
    {
      name: 'faqs',
      title: 'FAQs',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'question', title: 'Question', type: 'string' },
            { name: 'answer', title: 'Answer', type: 'text' }
          ]
        }
      ]
    },
    {
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        { name: 'title', title: 'Title', type: 'string' },
        { name: 'description', title: 'Description', type: 'text' },
        { name: 'keywords', title: 'Keywords', type: 'array', of: [{ type: 'string' }] },
        { name: 'ogImage', title: 'Open Graph Image', type: 'image', options: { hotspot: true } }
      ]
    }
  ]
};

export const country = {
  name: 'country',
  title: 'Country',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'code',
      title: 'Code',
      type: 'string',
      description: 'Two-letter country code (e.g., "us", "in")',
      validation: Rule => Rule.required()
    },
    {
      name: 'flag',
      title: 'Flag',
      type: 'string',
      description: 'Flag emoji'
    },
    {
      name: 'currency',
      title: 'Currency',
      type: 'object',
      fields: [
        { name: 'code', title: 'Code', type: 'string' },
        { name: 'symbol', title: 'Symbol', type: 'string' },
        { name: 'name', title: 'Name', type: 'string' }
      ]
    },
    {
      name: 'isAvailable',
      title: 'Is Available',
      type: 'boolean',
      description: 'Whether this country is available for transfers',
      initialValue: true
    }
  ]
};

export const blogPost = {
  name: 'blogPost',
  title: 'Blog Post',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'mainImage',
      title: 'Main image',
      type: 'image',
      options: {
        hotspot: true
      }
    },
    {
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'category' } }]
    },
    {
      name: 'countries',
      title: 'Related Countries',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'country' } }],
      description: 'Which countries this blog post is relevant for'
    },
    {
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime'
    },
    {
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text'
    },
    {
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        {
          type: 'block'
        },
        {
          type: 'image',
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative text',
              description: 'Important for SEO and accessibility.'
            }
          ]
        }
      ]
    }
  ]
};

export const category = {
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text'
    }
  ]
};