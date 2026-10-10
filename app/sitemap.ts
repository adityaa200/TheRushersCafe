import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://therusherscafe.com', lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: 'https://therusherscafe.com/menu', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: 'https://therusherscafe.com/admin', lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ];
}
