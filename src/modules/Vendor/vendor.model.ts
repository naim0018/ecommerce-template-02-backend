import mongoose from 'mongoose';
import { IVendorDocument } from './vendor.interface';
import slugify from 'slugify';

const vendorSchema = new mongoose.Schema<IVendorDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    zipCode: { type: String, required: true }
  },
  logo: String,
  description: String,
  rating: { type: Number, default: 0 },
  totalSales: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: false },
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'suspended'],
    default: 'inactive'
  },
  commissionRate: { type: Number, required: true },
  bankDetails: {
    accountName: String,
    accountNumber: String,
    bankName: String,
    swiftCode: String
  },
  documents: [{
    type: String,
    url: String,
    verified: { type: Boolean, default: false }
  }],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  storeSettings: {
    storeName: { type: String, required: true },
    storeSlug: { type: String, unique: true },
    storeLogo: String,
    storeBanner: String,
    storeDescription: String,
    shippingMethods: [{
      name: String,
      cost: Number,
      estimatedDays: String
    }],
    returnPolicy: String
  }
}, {
  timestamps: true
});

// Indexes
vendorSchema.index({ name: 'text', email: 'text', 'storeSettings.storeName': 'text' });
vendorSchema.index({ status: 1, isVerified: 1 });
vendorSchema.index({ userId: 1 });

// Pre-save hook to generate store slug
vendorSchema.pre('save', function(next) {
  if (this.isModified('storeSettings.storeName') && this.storeSettings) {
    this.storeSettings.storeSlug = slugify(this.storeSettings.storeName, { lower: true });
  }
  next();
});

const VendorModel = mongoose.model<IVendorDocument>('Vendor', vendorSchema);
export default VendorModel; 