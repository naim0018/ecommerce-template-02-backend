import { Document, Types } from 'mongoose';

// Vendor Information
export interface IVendor extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  logo?: string;
  description?: string;
  rating: number;
  totalSales: number;
  isVerified: boolean;
  status: 'active' | 'inactive' | 'suspended';
  commissionRate: number;
  bankDetails?: {
    accountName: string;
    accountNumber: string;
    bankName: string;
    swiftCode?: string;
  };
  documents?: {
    type: string;
    url: string;
    verified: boolean;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

// Product Interfaces
export interface IProductVariant {
  _id?: Types.ObjectId;
  sku: string;
  name: string;
  price: number;
  stock: number;
  images: string[];
  attributes: Record<string, string>;
}

export interface IProductReview {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  rating: number;
  comment: string;
  images?: string[];
  isVerified: boolean;
  createdAt: Date;
}

export interface IProductSeller {
  vendorId: Types.ObjectId;
  price: number;
  stock: number;
  sku: string;
  condition: 'new' | 'used' | 'refurbished';
  warranty?: string;
  shippingInfo: {
    cost: number;
    processingTime: string;
    shippingTime: string;
    restrictions?: string[];
  };
  discount?: {
    type: 'percentage' | 'fixed';
    value: number;
    startDate?: Date;
    endDate?: Date;
  };
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  category: Types.ObjectId;
  subCategory?: Types.ObjectId;
  brand?: Types.ObjectId;
  images: string[];
  thumbnail: string;
  basePrice: number;
  
  // Variants and Options
  hasVariants: boolean;
  variants?: IProductVariant[];
  
  // Sellers Information
  sellers: IProductSeller[];
  
  // Product Details
  specifications?: Array<{
    name: string;
    value: string;
  }>;
  
  // Reviews and Ratings
  reviews: Types.DocumentArray<IProductReview>;
  rating: {
    average: number;
    count: number;
    distribution: Record<number, number>;
  };
  
  // SEO and Visibility
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    slug: string;
  };
  
  // Status and Flags
  status: {
    isActive: boolean;
    isApproved: boolean;
    isFeatured: boolean;
    visibility: 'public' | 'private' | 'draft';
  };
  
  // Stats
  stats: {
    totalSales: number;
    totalRevenue: number;
    viewCount: number;
  };
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  
  // Methods
  calculateFinalPrice(): number;
  updateInventory(quantity: number): Promise<void>;
  addReview(review: Partial<IProductReview>): Promise<void>;
  updateRating(): Promise<void>;
}
