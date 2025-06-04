import { defineType, defineField } from 'sanity';

export const sendMoneyPage = defineType({
  name: 'sendMoneyPage',
  title: 'Send Money Page',
  type: 'document',
  fields: [
    defineField({
      name: 'sourceCountry',
      title: 'Source Country',
      type: 'string',
      description: 'Country sending from (e.g., "us", "in")',
      validation: rule => rule.required()
    }),
    defineField({
      name: 'targetCountry',
      title: 'Target Country',
      type: 'string',
      description: 'Country sending to (e.g., "in", "us")',
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
    }),
    defineField({
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