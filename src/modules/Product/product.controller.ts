import { Request, Response } from 'express';
import { ProductService } from './product.service';
import { IProduct } from './product.interface';
import { FilterQuery } from 'mongoose';
import catchAsync from '@/app/utils/catchAsync';

const createProduct = catchAsync(async (req: Request, res: Response) => {
  try {
    console.log('Creating product with data:', req.body);
    const product = await ProductService.createProduct(req.body);
    console.log('Product created:', product);
    
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
});

const getProducts = catchAsync(async (req: Request, res: Response) => {
  console.log('Getting products with query:', req.query);
  const result = await ProductService.getProducts(req.query);
  console.log('Products retrieved:', result);
  
  res.json({
    success: true,
    message: 'Products retrieved successfully',
    ...result
  });
});

const getProductById = catchAsync(async (req: Request, res: Response) => {
  const product = await ProductService.getProductById(req.params.id);
  res.json({
    success: true,
    message: 'Product retrieved successfully',
    data: product,
  });
});

const updateProduct = catchAsync(async (req: Request, res: Response) => {
  const product = await ProductService.updateProduct(req.params.id, req.body);
  res.json({
    success: true,
    message: 'Product updated successfully',
    data: product,
  });
});

const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  await ProductService.deleteProduct(req.params.id);
  res.status(204).send();
});

const getProductsByStore = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductService.getProductsByStore(
    req.params.storeId,
    req.query
  );
  
  res.json({
    success: true,
    message: 'Store products retrieved successfully',
    ...result
  });
});

const getProductsBySeller = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductService.getProductsBySeller(
    req.params.sellerId,
    req.query
  );
  
  res.json({
    success: true,
    message: 'Seller products retrieved successfully',
    ...result
  });
});

const updateProductStock = catchAsync(async (req: Request, res: Response) => {
  const { quantity } = req.body;
  const product = await ProductService.updateProductStock(req.params.id, quantity);
  
  res.json({
    success: true,
    message: 'Product stock updated successfully',
    data: product,
  });
});

const searchProducts = catchAsync(async (req: Request, res: Response) => {
  const { searchTerm } = req.query;
  if (!searchTerm || typeof searchTerm !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Search term is required',
    });
  }

  const result = await ProductService.searchProducts(searchTerm, req.query);
  res.json({
    success: true,
    message: 'Search results retrieved successfully',
    ...result
  });
});

const getProductsByCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductService.getProductsByCategory(
    req.params.categoryId,
    req.query
  );
  
  res.json({
    success: true,
    message: 'Category products retrieved successfully',
    ...result
  });
});

// const addProductReview = catchAsync(async (req: Request, res: Response) => {
//   const product = await ProductService.addReview(req.params.id, {
//     userId: req.user._id, // Assuming you have user info in req.user
//     ...req.body,
//   });
//   res.json({
//     success: true,
//     data: product,
//   });
// });

// const getVendorProducts = catchAsync(async (req: Request, res: Response) => {
//   const filters: FilterQuery<IProduct> = {};
  
//   if (req.query.search) {
//     filters.$text = { $search: req.query.search as string };
//   }

//   const result = await ProductService.getVendorProducts(
//     req.params.vendorId,
//     filters,
//     {
//       page: Number(req.query.page) || 1,
//       limit: Number(req.query.limit) || 10,
//       sortBy: req.query.sortBy as string,
//       sortOrder: req.query.sortOrder as 'asc' | 'desc',
//     }
//   );

//   res.json(result);
// });

export const ProductController = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsByStore,
  getProductsBySeller,
  updateProductStock,
  searchProducts,
  getProductsByCategory,
  // addProductReview,
  // getVendorProducts,
};
