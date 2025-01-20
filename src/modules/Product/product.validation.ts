import { z } from "zod";

const createProduct = z.object({
  body: z.object({
    productCode: z.string(),
    title: z.string().min(3),
    brand: z.string(),
    manufacturer: z.string().optional(),
    description: z.string().min(10),
    shortDescription: z.string(),
    keyFeatures: z.array(z.string()),
    category: z.string(),
    subCategory: z.string().optional(),
    condition: z.enum(['New', 'Used', 'Refurbished']),

    // Pricing & Stock
    stock: z.number().int().positive(),
    price: z.number().positive(),
    discountPrice: z.number().positive().optional(),

    // Variants
    variants: z.array(z.object({
      name: z.string(),
      values: z.array(z.string())
    })),

    // Additional Information
    specifications: z.record(z.string()),

    // Store & Seller Information
    storeId: z.string(),
    sellerId: z.string()
  })
});

const updateProduct = z.object({
  body: createProduct.shape.body.partial()
});

const addReview = z.object({
  body: z.object({
    rating: z.number().min(1).max(5),
    comment: z.string().optional(),
    images: z.array(z.string()).optional()
  })
});

export const ProductValidation = {
  createProduct,
  updateProduct,
  addReview
};
