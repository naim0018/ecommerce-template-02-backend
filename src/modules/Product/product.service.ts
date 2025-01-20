import { FilterQuery } from 'mongoose';
import ProductModel from './product.model';
import ApiError from '../../utils/ApiError';
import QueryBuilder from '../../app/builder/QueryBuilder';

const createProduct = async (productData: Record<string, any>) => {
  // Generate product code if not provided
  if (!productData.productCode) {
    productData.productCode = generateProductCode();
  }

  const product = await ProductModel.create(productData);
  return product;
};

const getProducts = async (query: Record<string, unknown>) => {
  const productQuery = new QueryBuilder(ProductModel, query)
    .search(['title', 'description', 'brand'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await productQuery.execute();
  const meta = await productQuery.countTotal();

  return {
    meta,
    data: result
  };
};

const getProductById = async (id: string) => {
  const product = await ProductModel.findById(id);
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }
  return product;
};

const updateProduct = async (id: string, updateData: Record<string, any>) => {
  const product = await ProductModel.findById(id);
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  // Prevent updating certain fields
  delete updateData.productCode;
  delete updateData.storeId;
  delete updateData.sellerId;

  const updatedProduct = await ProductModel.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true }
  );

  return updatedProduct;
};

const deleteProduct = async (id: string) => {
  const product = await ProductModel.findById(id);
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  await ProductModel.findByIdAndDelete(id);
  return product;
};

const getProductsByStore = async (
  storeId: string,
  query: Record<string, unknown>
) => {
  query.storeId = storeId;
  return getProducts(query);
};

const getProductsBySeller = async (
  sellerId: string,
  query: Record<string, unknown>
) => {
  query.sellerId = sellerId;
  return getProducts(query);
};

const updateProductStock = async (id: string, quantity: number) => {
  const product = await ProductModel.findById(id);
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  if (product.stock < quantity) {
    throw new ApiError(400, 'Insufficient stock');
  }

  product.stock -= quantity;
  await product.save();

  return product;
};

const generateProductCode = () => {
  // Generate a unique product code
  // Format: PRD-YYYYMMDD-XXXXX
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
  
  return `PRD-${year}${month}${day}-${random}`;
};

const searchProducts = async (searchTerm: string, query: Record<string, unknown>) => {
  const searchQuery: FilterQuery<typeof ProductModel> = {
    $or: [
      { title: { $regex: searchTerm, $options: 'i' } },
      { description: { $regex: searchTerm, $options: 'i' } },
      { brand: { $regex: searchTerm, $options: 'i' } },
      { manufacturer: { $regex: searchTerm, $options: 'i' } }
    ]
  };

  return getProducts({ ...query, ...searchQuery });
};

const getProductsByCategory = async (categoryId: string, query: Record<string, unknown>) => {
  query.category = categoryId;
  return getProducts(query);
};

export const ProductService = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsByStore,
  getProductsBySeller,
  updateProductStock,
  searchProducts,
  getProductsByCategory
};
