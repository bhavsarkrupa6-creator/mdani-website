export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
};

export const getEffectivePrice = (price: number, discountPrice?: number | null): number => {
  return discountPrice && discountPrice > 0 && discountPrice < price ? discountPrice : price;
};

export const getDiscountPercent = (price: number, discountPrice?: number | null): number | null => {
  if (!discountPrice || discountPrice >= price) return null;
  return Math.round(((price - discountPrice) / price) * 100);
};

const STORE_NAME = 'Mdani Games & Sales Service';

export const buildWhatsAppLink = (whatsappNumber: string, productName?: string): string => {
  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');
  let message = `Hello ${STORE_NAME},\n\n`;
  if (productName) {
    message += `I am interested in:\n\nProduct Name: ${productName}\n\nPlease provide availability and pricing.`;
  } else {
    message += `I would like to know more about your products and services.`;
  }
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
};

export const PLACEHOLDER_IMAGE = '/placeholder-product.svg';

export const getProductImage = (image?: string | null): string => {
  return image && image.trim().length > 0 ? image : PLACEHOLDER_IMAGE;
};
