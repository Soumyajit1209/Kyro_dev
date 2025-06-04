import { Country } from '@/types';

export const countries: Country[] = [
  {
    code: 'us',
    name: 'United States',
    flag: '🇺🇸',
    currency: {
      code: 'USD',
      symbol: '$',
      name: 'US Dollar'
    },
    isAvailable: true
  },
  {
    code: 'in',
    name: 'India',
    flag: '🇮🇳',
    currency: {
      code: 'INR',
      symbol: '₹',
      name: 'Indian Rupee'
    },
    isAvailable: true
  },
  {
    code: 'gb',
    name: 'United Kingdom',
    flag: '🇬🇧',
    currency: {
      code: 'GBP',
      symbol: '£',
      name: 'British Pound'
    },
    isAvailable: true
  },
  {
    code: 'ca',
    name: 'Canada',
    flag: '🇨🇦',
    currency: {
      code: 'CAD',
      symbol: 'C$',
      name: 'Canadian Dollar'
    },
    isAvailable: true
  },
  {
    code: 'au',
    name: 'Australia',
    flag: '🇦🇺',
    currency: {
      code: 'AUD',
      symbol: 'A$',
      name: 'Australian Dollar'
    },
    isAvailable: true
  },
  {
    code: 'eu',
    name: 'Europe',
    flag: '🇪🇺',
    currency: {
      code: 'EUR',
      symbol: '€',
      name: 'Euro'
    },
    isAvailable: true
  },
  {
    code: 'mx',
    name: 'Mexico',
    flag: '🇲🇽',
    currency: {
      code: 'MXN',
      symbol: 'Mex$',
      name: 'Mexican Peso'
    },
    isAvailable: true
  },
  {
    code: 'ph',
    name: 'Philippines',
    flag: '🇵🇭',
    currency: {
      code: 'PHP',
      symbol: '₱',
      name: 'Philippine Peso'
    },
    isAvailable: true
  },
  {
    code: 'sg',
    name: 'Singapore',
    flag: '🇸🇬',
    currency: {
      code: 'SGD',
      symbol: 'S$',
      name: 'Singapore Dollar'
    },
    isAvailable: true
  },
  {
    code: 'ae',
    name: 'United Arab Emirates',
    flag: '🇦🇪',
    currency: {
      code: 'AED',
      symbol: 'د.إ',
      name: 'UAE Dirham'
    },
    isAvailable: true
  }
];

export function getCountryByCode(code: string): Country | undefined {
  return countries.find(country => country.code.toLowerCase() === code.toLowerCase());
}

export function getCountryCurrency(code: string): string {
  const country = getCountryByCode(code);
  return country?.currency.code || 'USD';
}

export function getAvailableCountries(): Country[] {
  return countries.filter(country => country.isAvailable);
}