import { MetadataRoute } from "next";

// Make this route dynamic to avoid build-time fetching
export const dynamic = 'force-dynamic';

async function getProducts() {
  // Use absolute URL with environment variable
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  
  try {
    const res = await fetch(`${apiUrl}/products`, {
      // Add cache control for production
      cache: 'no-store',
      // Add timeout to avoid hanging
      signal: AbortSignal.timeout(5000),
    });
    
    if (!res.ok) {
      console.error('Failed to fetch products:', res.status);
      return [];
    }
    
    const products = await res.json();
    return Array.isArray(products) ? products : [];
  } catch (error) {
    console.error('Error fetching products for sitemap:', error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://swaadnation.vercel.app';
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/my-orders`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/cart`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    },
  ];
  
  // Dynamic product pages - fetch at runtime, not build time
  let productPages: MetadataRoute.Sitemap = [];
  
  try {
    const products = await getProducts();
    productPages = products.map((product: any) => ({
      url: `${baseUrl}/product/${product._id}`,
      lastModified: new Date(product.updatedAt || Date.now()),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
  } catch (error) {
    console.error('Error generating product sitemap entries:', error);
  }
  
  return [...staticPages, ...productPages];
}