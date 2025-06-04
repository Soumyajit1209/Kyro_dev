import { defineType, defineField } from 'sanity';

export const country = defineType({
  name: 'country',
  title: 'Country',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: rule => rule.required()
    }),
    defineField({
      name: 'code',
      title: 'Code',
      type: 'string',
      description: 'Two-letter country code (e.g., "us", "in")',
      validation: rule => rule.required()
    }),
    defineField({
      name: 'flag',
      title: 'Flag',
      type: 'string',
      description: 'Flag emoji'
    }),
    defineField({
      name: 'currency',
      title: 'Currency',
      type: 'object',
      fields: [
        { name: 'code', title: 'Code', type: 'string' },
        { name: 'symbol', title: 'Symbol', type: 'string' },
        { name: 'name', title: 'Name', type: 'string' }
      ]
    }),
    defineField({
      name: 'isAvailable',
      title: 'Is Available',
      type: 'boolean',
      description: 'Whether this country is available for transfers',
      initialValue: true
    })
  ]
});