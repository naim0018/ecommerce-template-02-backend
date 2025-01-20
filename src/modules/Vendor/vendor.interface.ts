import { Document, Types } from 'mongoose';

export interface IVendorDocument extends Document {
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
  documents?: Array<{
    type: string;
    url: string;
    verified: boolean;
  }>;
  userId: Types.ObjectId;
  storeSettings?: {
    storeName: string;
    storeSlug: string;
    storeLogo?: string;
    storeBanner?: string;
    storeDescription?: string;
    shippingMethods?: Array<{
      name: string;
      cost: number;
      estimatedDays: string;
    }>;
    returnPolicy?: string;
    createdAt: Date;
    updatedAt: Date;
  };
} 