// Google Analytics events
export const trackEvent = (action: string, category: string, label: string, value?: number) => {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Facebook Pixel events
export const trackFbEvent = (eventName: string, params?: any) => {
  if (typeof window !== "undefined" && (window as any).fbq) {
    (window as any).fbq("track", eventName, params);
  }
};

// Custom events for your store
export const trackAddToCart = (product: any, quantity: number) => {
  trackEvent("add_to_cart", "ecommerce", product.name, product.price * quantity);
  trackFbEvent("AddToCart", {
    content_name: product.name,
    content_ids: [product._id],
    content_type: "product",
    value: product.price * quantity,
    currency: "INR",
  });
};

export const trackBeginCheckout = (cartTotal: number, itemCount: number) => {
  trackEvent("begin_checkout", "ecommerce", "checkout", cartTotal);
  trackFbEvent("InitiateCheckout", {
    value: cartTotal,
    currency: "INR",
    num_items: itemCount,
  });
};

export const trackPurchase = (orderId: string, total: number, items: any[]) => {
  trackEvent("purchase", "ecommerce", orderId, total);
  trackFbEvent("Purchase", {
    value: total,
    currency: "INR",
    transaction_id: orderId,
    contents: items.map(item => ({
      id: item._id,
      quantity: item.qty,
    })),
  });
};

export const trackViewProduct = (product: any) => {
  trackEvent("view_item", "ecommerce", product.name, product.price);
  trackFbEvent("ViewContent", {
    content_name: product.name,
    content_ids: [product._id],
    content_type: "product",
    value: product.price,
    currency: "INR",
  });
};