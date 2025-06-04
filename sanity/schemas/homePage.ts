import { defineType, defineField } from 'sanity';

export const homePage = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  fields: [
    defineField({
      name: 'country',
      title: 'Country',
      type: 'string',
      description: 'Country code (e.g., "us", "in", "gb")',
      validation: rule => rule.required()
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: rule => rule.required()
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string'
    }),
    defineField({
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
    }),
    defineField({
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
    }),
    defineField({
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
    }),
    defineField({
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
    }),
    defineField({
      name: 'testimonials',
      title: 'Testimonials',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', title: 'Name', type: 'string' },
            { name: 'quote', title: 'Quote', type: 'text' },
            { name: 'rating', title: 'Rating', type: 'number', validation: rule => rule.min(1).max(5) },
            { name: 'location', title: 'Location', type: 'string' },
            { name: 'image', title: 'Image', type: 'image', options: { hotspot: true } }
          ]
        }
      ]
    }),
    defineField({
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
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        { name: 'title', title: 'Title', type: 'string' },
        { name: 'description', title: 'Description', type: 'text' },
        { name: 'keywords', title: 'Keywords', type: 'array', of: [{ type: 'string' }] },
        { name: 'ogImage', title: 'Open Graph Image', type: 'image', options: { hotspot: true } }
      ]
    })
  ]
});