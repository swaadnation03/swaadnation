export const defaultSeoConfig = {
  title: "Swaad Nation - Taste of Champaran",
  description: "Authentic Bihari snacks and delicacies delivered to your doorstep. Thekua, Nimki, Litti Chokha, and more traditional flavors from Champaran.",
  keywords: "Bihari snacks, Thekua, Champaran food, traditional Indian snacks, authentic Bihari cuisine",
  author: "Swaad Nation",
  siteUrl: "https://swaadnation.com",
  twitterHandle: "@swaadnation03",
  instagramHandle: "@swaadnation03",
  images: {
    default: "/images/og-image.jpg",
    logo: "/images/logo.png",
  },
  contactInfo: {
    email: "swaadnation03@gmail.com",
    phone: "+91 7754037920",
    address: "Motihari, East Champaran, Bihar, 845401, India",
  },
  socialLinks: {
    instagram: "https://instagram.com/swaadnation03",
    facebook: "https://facebook.com/swaadnation",
    twitter: "https://twitter.com/swaadnation03",
  },
};

export const productSeoConfig = (product: any) => ({
  title: `${product.name} - Swaad Nation | Traditional Bihari Snacks`,
  description: product.description?.substring(0, 160) || `Buy authentic ${product.name} online. Traditional Bihari snack made with love.`,
  openGraph: {
    title: `${product.name} - Swaad Nation`,
    description: product.description?.substring(0, 160),
    images: [
      {
        url: product.imageFront ? `https://swaadnation.com${product.imageFront}` : "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: product.name,
      },
    ],
    type: "product",
    price: product.price,
    currency: "INR",
    availability: product.stock > 0 ? "in stock" : "out of stock",
  },
});