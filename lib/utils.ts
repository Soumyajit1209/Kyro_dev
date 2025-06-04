import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { countries } from '@/data/countries';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Get browser language or country (fallback to 'us')
export function getBrowserCountry(): string {
  if (typeof navigator === 'undefined') return 'us';
  
  // Try to get from language
  const language = navigator.language || '';
  const countryFromLang = language.split('-')[1]?.toLowerCase() || '';
  
  // Check if country exists in our list
  if (countryFromLang && countries.some(c => c.code.toLowerCase() === countryFromLang)) {
    return countryFromLang;
  }
  
  return 'us'; // Default fallback
}

// Format currency with proper locale
export function formatCurrency(amount: number, currencyCode: string, locale = 'en-US'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Format number with thousands separator
export function formatNumber(num: number, locale = 'en-US'): string {
  return new Intl.NumberFormat(locale).format(num);
}

// Simple function to calculate transfer amount with rate and fee
export function calculateTransferAmount(
  amount: number,
  exchangeRate: number,
  fee: number
): { sendAmount: number; receiveAmount: number; fee: number } {
  const sendAmount = amount;
  const receiveAmount = (amount - fee) * exchangeRate;
  
  return {
    sendAmount,
    receiveAmount,
    fee,
  };
}

// Get estimated delivery time string
export function getEstimatedDelivery(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} minutes`;
  }
  if (minutes < 1440) { // Less than 24 hours
    const hours = Math.floor(minutes / 60);
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  }
  // Days
  const days = Math.floor(minutes / 1440);
  return `${days} day${days > 1 ? 's' : ''}`;
}

// Generate a country flag emoji from country code
export function getCountryFlagEmoji(countryCode: string): string {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  
  return String.fromCodePoint(...codePoints);
}