import { z } from 'zod';

const createVendor = z.object({
  body: z.object({
    name: z.string().min(3),
    email: z.string().email(),
    phone: z.string(),
    address: z.object({
      street: z.string(),
      city: z.string(),
      state: z.string(),
      country: z.string(),
      zipCode: z.string()
    }),
    commissionRate: z.number().min(0).max(100),
    storeSettings: z.object({
      storeName: z.string().min(3),
      storeDescription: z.string().optional(),
      shippingMethods: z.array(z.object({
        name: z.string(),
        cost: z.number(),
        estimatedDays: z.string()
      })).optional(),
      returnPolicy: z.string().optional()
    })
  })
});

const updateVendor = z.object({
  body: createVendor.shape.body.partial()
});

export const VendorValidation = {
  createVendor,
  updateVendor
}; 