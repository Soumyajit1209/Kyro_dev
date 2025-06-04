import { createClient } from 'next-sanity';
import imageUrlBuilder from '@sanity/image-url';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-04-15';

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === 'production',
});

// Helper function for generating image URLs
const builder = imageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// Custom hook for prefixing country paths
export function getCountryPath(country?: string) {
  if (!country) return '/';
  return `/${country.toLowerCase()}`;
}

// Helper to format a full route for country transfer
export function getTransferPath(sourceCountry: string, targetCountry: string) {
  return `/${sourceCountry.toLowerCase()}/send-to/${targetCountry.toLowerCase()}`;
}