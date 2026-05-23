"use client";

import Head from "next/head";
import { usePathname } from "next/navigation";
import { defaultSeoConfig } from "@/config/seo.config";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "product" | "article";
  product?: any;
}

export default function SEO({ 
  title, 
  description, 
  image, 
  url, 
  type = "website",
  product 
}: SEOProps) {
  const pathname = usePathname();
  const fullUrl = `${defaultSeoConfig.siteUrl}${pathname}${url || ""}`;
  const seoTitle = title ? `${title} | Swaad Nation` : defaultSeoConfig.title;
  const seoDescription = description || defaultSeoConfig.description;
  const seoImage = image || defaultSeoConfig.images.default;

  // Product Schema Markup
  const productSchema = product ? {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": product.imageFront ? `${defaultSeoConfig.siteUrl}${product.imageFront}` : seoImage,
    "sku": product._id,
    "mpn": product._id,
    "offers": {
      "@type": "Offer",
      "priceCurrency": "INR",
      "price": product.price,
      "priceValidUntil": new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "Swaad Nation"
      }
    },
    "brand": {
      "@type": "Brand",
      "name": "Swaad Nation"
    },
    "aggregateRating": product.averageRating > 0 ? {
      "@type": "AggregateRating",
      "ratingValue": product.averageRating,
      "reviewCount": product.totalReviews || 0
    } : undefined
  } : null;

  // Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "FoodEstablishment",
    "name": "Swaad Nation",
    "url": defaultSeoConfig.siteUrl,
    "logo": `${defaultSeoConfig.siteUrl}/images/logo.png`,
    "description": defaultSeoConfig.description,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": defaultSeoConfig.contactInfo.address,
      "addressLocality": "Motihari",
      "addressRegion": "Bihar",
      "postalCode": "845401",
      "addressCountry": "IN"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": defaultSeoConfig.contactInfo.phone,
      "contactType": "customer service",
      "email": defaultSeoConfig.contactInfo.email
    },
    "sameAs": [
      defaultSeoConfig.socialLinks.instagram,
      defaultSeoConfig.socialLinks.facebook,
      defaultSeoConfig.socialLinks.twitter
    ]
  };

  // Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": defaultSeoConfig.siteUrl
      },
      ...(pathname !== "/" ? [
        {
          "@type": "ListItem",
          "position": 2,
          "name": title || "Products",
          "item": fullUrl
        }
      ] : [])
    ]
  };

  return (
    <Head>
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <meta name="keywords" content={defaultSeoConfig.keywords} />
      <meta name="author" content={defaultSeoConfig.author} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:site_name" content="Swaad Nation" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={seoImage} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
      
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      {productSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(productSchema),
          }}
        />
      )}
    </Head>
  );
}