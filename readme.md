# Kyro Money Transfer - Documentation

## Overview

Kyro Money Transfer is a modern web application for fast, secure, and affordable international money transfers. Built with Next.js, TypeScript, Tailwind CSS, and Sanity CMS, it provides a seamless user experience for sending money globally.

## Features

- **Send Money**: Transfer funds between countries with real-time exchange rates and low fees.
- **Country & Currency Support**: Select source and target countries/currencies.
- **Calculator**: Estimate transfer amounts, fees, and delivery times.
- **Exchange Rate Cards**: View current rates for popular corridors.
- **Testimonials**: Carousel of customer reviews.
- **FAQ Accordion**: Frequently asked questions section.
- **Blog**: Preview cards for blog posts.
- **Theme Support**: Light/dark mode with system preference.
- **Responsive UI**: Mobile-first, accessible, and fast.

## Tech Stack

- **Next.js 13+** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Sanity CMS** (content management)
- **Radix UI** (accessible UI primitives)
- **Framer Motion** (animations)
- **Lucide Icons**

## Project Structure

```
app/                # Next.js app directory (routing, pages, layouts)
  globals.css       # Global styles (Tailwind)
  layout.tsx        # Root layout (header, footer, theme)
  page.tsx          # Home page
  [country]/        # Dynamic country pages
    page.tsx        # Country-specific send money page
    send-to/        # Nested routes for target country
      [targetCountry]/page.tsx
components/         # Reusable React components
  ui/               # UI primitives (button, card, accordion, etc.)
  layout/           # Header, Footer
  country/          # Country selector
  currency/         # Currency calculator
  ...
data/               # Static data (countries, etc.)
hooks/              # Custom React hooks
lib/                # Utilities, Sanity client, queries
public/             # Static assets (manifest, robots.txt, images)
sanity/             # Sanity schemas
styles/             # (if present) Additional styles
types/              # TypeScript types
```

## Key Files

- `app/layout.tsx`: Root layout, theme provider, header/footer.
- `app/page.tsx`: Home page, main entry.
- `app/[country]/page.tsx`: Dynamic country page.
- `app/[country]/send-to/[targetCountry]/page.tsx`: Nested dynamic route for sending money between countries.
- `components/`: UI and feature components (cards, accordions, carousels, etc.).
- `lib/sanity.ts`: Sanity CMS client setup.
- `lib/queries.ts`: GROQ queries for fetching content.
- `data/countries.ts`: List of supported countries and currencies.
- `types/index.ts`: TypeScript interfaces for data models.
- `tailwind.config.ts`: Tailwind CSS configuration.
- `sanity/schema.js`: Sanity content schemas (pages, testimonials, faqs, etc.).

## Setup & Development

1. **Install dependencies**:
   ```sh
   pnpm install
   # or
   npm install
   ```
2. **Run the development server**:
   ```sh
   pnpm dev
   # or
   npm run dev
   ```
3. **Build for production**:
   ```sh
   pnpm build
   # or
   npm run build
   ```
4. **Start production server**:
   ```sh
   pnpm start
   # or
   npm start
   ```

## Content Management

- Content (pages, testimonials, faqs, blogs) is managed via [Sanity.io](https://www.sanity.io/).
- Update schemas in `sanity/schema.js` as needed.

## Customization

- **Add countries/currencies**: Edit `data/countries.ts`.
- **UI changes**: Edit components in `components/` and styles in `app/globals.css`.
- **Add new pages**: Use the Next.js App Router conventions in `app/`.

## Contributing

- Use consistent code style (TypeScript, Prettier, ESLint).
- Write reusable, accessible components.
- Document new features and components.

---

For questions or support, contact the Kyro team.
