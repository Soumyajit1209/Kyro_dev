import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ 
  subsets: ['latin'], 
  display: 'swap',
  variable: '--font-inter'
});

export const metadata: Metadata = {
  metadataBase: new URL('https://kyro.com'),
  title: {
    template: '%s | Kyro - Global Money Transfers',
    default: 'Kyro - Fast, Secure International Money Transfers',
  },
  description: 'Send money globally with competitive rates, low fees, and fast delivery times. Secure international transfers to 100+ countries.',
  keywords: ['money transfer', 'international remittance', 'send money online', 'global payments', 'forex transfer', 'cross-border payments'],
  authors: [{ name: 'Kyro' }],
  creator: 'Kyro',
  publisher: 'Kyro',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://kyro.com',
    siteName: 'Kyro Money Transfer',
    title: 'Kyro - Fast, Secure International Money Transfers',
    description: 'Send money globally with competitive rates, low fees, and fast delivery times.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Kyro Money Transfer'
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kyro - Fast, Secure International Money Transfers',
    description: 'Send money globally with competitive rates, low fees, and fast delivery times.',
    images: ['/og-image.jpg'],
    creator: '@kyro',
    site: '@kyro',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
  alternates: {
    canonical: 'https://kyro.com',
  },
  colorScheme: 'dark light',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' }
  ]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="color-scheme" content="dark light" />
      </head>
      <body className={`${inter.className} antialiased min-h-screen bg-background text-foreground`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          <div className="relative flex min-h-screen flex-col bg-background">
            <Header />
            <main className="flex-1 relative">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}