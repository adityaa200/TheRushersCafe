import './globals.css';
import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export const metadata: Metadata = {
  title: 'The Rushers Cafe | Modern European • Artisan Coffee',
  description:
    'Experience handcrafted food, signature flavors and unforgettable moments at The Rushers Cafe, Pune. Crafted with passion, served with soul.',
  keywords: ['restaurant', 'pune', 'coffee', 'european cuisine', 'fine dining', 'artisan coffee', 'koregaon park'],
  openGraph: {
    title: 'The Rushers Cafe | Modern European • Artisan Coffee',
    description: 'Experience handcrafted food, signature flavors and unforgettable moments.',
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Rushers Cafe',
    description: 'Crafted with passion. Served with soul.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: 'The Rushers Cafe',
    servesCuisine: 'Modern European, Artisan Coffee',
    priceRange: '₹₹₹',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '123 MG Road, Koregaon Park',
      addressLocality: 'Pune',
      addressRegion: 'Maharashtra',
      postalCode: '411001',
      addressCountry: 'IN',
    },
    telephone: '+91 98765 43210',
    openingHours: 'Mo-Th 09:00-23:00, Fr-Sa 09:00-00:00, Su 10:00-23:00',
  };

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {children}
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: 'hsl(0 0% 9%)',
              color: 'hsl(40 28% 92%)',
              border: '1px solid hsl(0 0% 14%)',
            },
          }}
        />
      </body>
    </html>
  );
}
