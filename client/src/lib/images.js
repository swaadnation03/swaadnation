export const getOptimizedImage = (url, options = {}) => {
  if (!url) return null;
  if (!url.includes('cloudinary')) return url;
  
  const { width = 600, quality = 'auto:best' } = options;
  
  // Add transformation parameters
  return url.replace('/upload/', `/upload/w_${width},q_${quality}/`);
};