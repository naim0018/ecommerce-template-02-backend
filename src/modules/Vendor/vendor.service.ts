import { FilterQuery } from 'mongoose';
import VendorModel from './vendor.model';
import { IVendorDocument } from './vendor.interface';
import ApiError from '@/app/error/AppError';
import QueryBuilder from '@/app/builder/QueryBuilder';
import ProductModel from '../Product/product.model';
import slugify from 'slugify';

const createVendor = async (vendorData: Partial<IVendorDocument>): Promise<IVendorDocument> => {
  const existingVendor = await VendorModel.findOne({
    $or: [
      { email: vendorData.email },
      { 'storeSettings.storeSlug': slugify(vendorData.storeSettings?.storeName || '', { lower: true }) }
    ]
  });

  if (existingVendor) {
    throw new ApiError(400, 'Vendor with this email or store name already exists');
  }

  const vendor = await VendorModel.create(vendorData);
  return vendor;
};

const getVendors = async (query: Record<string, unknown>) => {
  const vendorQuery = new QueryBuilder(VendorModel, query)
    .search(['name', 'email', 'storeSettings.storeName'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await vendorQuery.execute();
  const meta = await vendorQuery.countTotal();

  return {
    meta,
    data: result
  };
};

const getVendorById = async (id: string): Promise<IVendorDocument> => {
  const vendor = await VendorModel.findById(id);
  if (!vendor) {
    throw new ApiError(404, 'Vendor not found');
  }
  return vendor;
};

const getVendorByUserId = async (userId: string): Promise<IVendorDocument> => {
  const vendor = await VendorModel.findOne({ userId });
  if (!vendor) {
    throw new ApiError(404, 'Vendor not found');
  }
  return vendor;
};

const updateVendor = async (
  id: string,
  updateData: Partial<IVendorDocument>
): Promise<IVendorDocument> => {
  const vendor = await VendorModel.findByIdAndUpdate(id, updateData, { new: true });
  if (!vendor) {
    throw new ApiError(404, 'Vendor not found');
  }
  return vendor;
};

const deleteVendor = async (id: string): Promise<void> => {
  const vendor = await VendorModel.findById(id);
  if (!vendor) {
    throw new ApiError(404, 'Vendor not found');
  }

  // Delete all products associated with this vendor
  await ProductModel.deleteMany({ 'sellers.vendorId': id });
  await vendor.deleteOne();
};

const getVendorStats = async (vendorId: string) => {
  const products = await ProductModel.find({ 'sellers.vendorId': vendorId });
  const vendor = await VendorModel.findById(vendorId);

  if (!vendor) {
    throw new ApiError(404, 'Vendor not found');
  }

  return {
    totalProducts: products.length,
    totalSales: vendor.totalSales,
    rating: vendor.rating,
    isVerified: vendor.isVerified,
    status: vendor.status
  };
};

export const VendorService = {
  createVendor,
  getVendors,
  getVendorById,
  getVendorByUserId,
  updateVendor,
  deleteVendor,
  getVendorStats
}; 