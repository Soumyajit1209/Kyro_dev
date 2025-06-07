# Kyro Money Transfer

## Overview

Kyro Money Transfer is a modern web application for fast, secure, and affordable international money transfers. Built with Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui, and Sanity CMS, it provides a seamless user experience for sending money globally.

## Features

- **Send Money**: Transfer funds between countries with real-time exchange rates and low fees.
- **Country & Currency Support**: Select source and target countries/currencies dynamically.
- **Content Management**: Sanity CMS integration for dynamic content, blog, and FAQ management.
- **Modern UI**: Built with shadcn/ui and Tailwind CSS for a responsive, accessible interface.
- **PWA Ready**: Includes manifest and offline support for a native-like experience.
- **Testimonials & FAQ**: Dynamic testimonials carousel and FAQ accordion powered by CMS.
- **Exchange Rate Calculator**: Real-time currency conversion and fee calculation.
- **Admin Studio**: Integrated Sanity Studio at `/studio` for content management.

## Tech Stack

- **Next.js (App Router, TypeScript)**
- **Tailwind CSS**
- **Sanity CMS**
- **shadcn/ui**

## Project Structure

```
├── app/                  # Next.js app directory (routing, pages, layouts)
│   ├── [country]/        # Dynamic country routes
│   │   └── send-to/      # Nested dynamic routes for transfers
│   ├── (admin)/studio/   # Sanity Studio integration (admin route)
│   └── globals.css       # Global styles (Tailwind)
├── components/           # Reusable UI and feature components
│   ├── country/          # Country selector components
│   ├── currency/         # Currency calculator components
│   ├── layout/           # Header, Footer, etc.
│   └── ui/               # shadcn/ui components (Accordion, Button, Card, etc.)
├── data/                 # Static data (e.g., country list)
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and Sanity client setup
├── public/               # Static assets (manifest, robots.txt, icons)
├── sanity/               # Sanity schemas and config
│   └── schemas/          # Document and object schemas for CMS
├── types/                # TypeScript type definitions
├── tailwind.config.ts    # Tailwind CSS configuration
├── next.config.js        # Next.js configuration
├── package.json          # Project dependencies and scripts
└── readme.md             # Project documentation
```

## Getting Started

1. **Install dependencies**
   ```sh
   npm install
   # or
   pnpm install
   ```
2. **Run the development server**
   ```sh
   npm run dev
   # or
   pnpm dev
   ```
3. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

## Sanity Studio

- Access the CMS at `/studio` route after running the dev server.
- Schemas are defined in `sanity/schemas/`.

## Customization

- Add or update UI components in `components/ui/` (shadcn/ui based).
- Update country/currency data in `data/`.
- Utility functions in `lib/`.
- Update Sanity schemas in `sanity/schemas/` for new content types.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is for demonstration and educational purposes only.
