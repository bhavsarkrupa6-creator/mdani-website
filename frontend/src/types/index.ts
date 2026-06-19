export type StockStatus = 'IN_STOCK' | 'OUT_OF_STOCK';
export type RepairStatus = 'PENDING' | 'CONTACTED' | 'IN_PROGRESS' | 'COMPLETED';
export type ContactMethod = 'PHONE' | 'EMAIL' | 'WHATSAPP';
export type BannerLocation = 'AFTER_HERO' | 'AFTER_PRODUCTS';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  parentId?: string | null;
  children?: Category[];
  order: number;
  isActive: boolean;
  _count?: { products: number };
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  specifications?: Record<string, string> | null;
  features: string[];
  price: number;
  discountPrice?: number | null;
  stockStatus: StockStatus;
  isPublished: boolean;
  isFeatured: boolean;
  image?: string | null;
  galleryImages: string[];
  categoryId: string;
  category?: Category | { name: string; slug: string };
  brand?: string | null;
  createdAt?: string;
}

export interface Banner {
  id: string;
  title?: string | null;
  subtitle?: string | null;
  image: string;
  ctaText?: string | null;
  ctaLink?: string | null;
  location: BannerLocation;
  displayOrder: number;
  isActive: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  message: string;
  rating: number;
  image?: string | null;
  isActive: boolean;
  order: number;
}

export interface ContactInfo {
  id: string;
  phone?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  address?: string | null;
  googleMapsUrl?: string | null;
}

export interface SiteContent {
  id: string;
  heroTitle?: string | null;
  heroSubtitle?: string | null;
  heroCtaText?: string | null;
  homepageContent?: string | null;
  footerContent?: string | null;
  aboutUsContent?: string | null;
}

export interface RepairRequest {
  id: string;
  name: string;
  phone: string;
  email: string;
  deviceType: string;
  brand: string;
  model: string;
  problemDescription: string;
  images: string[];
  preferredContact: ContactMethod;
  status: RepairStatus;
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  email: string;
  productId?: string | null;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface PaginatedProducts {
  products: Product[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  pendingRepairs: number;
  totalRepairs: number;
  unreadMessages: number;
  totalMessages: number;
  outOfStockCount: number;
}
