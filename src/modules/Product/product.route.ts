import { Router } from "express";
import validateRequest from "../../app/middleware/validateRequest";
import { ProductController } from "./product.controller";
import { ProductValidation } from "./product.validation";   

const router = Router();

// GET /api/v1/products
router.get('/', ProductController.getProducts);

// POST /api/v1/products/add-product
router.post('/add-product', validateRequest(ProductValidation.createProduct), ProductController.createProduct);

// GET /api/v1/products/:id
router.get("/:id", ProductController.getProductById);

// PATCH /api/v1/products/:id
router.patch("/:id", ProductController.updateProduct);

// DELETE /api/v1/products/:id
router.delete("/:id", ProductController.deleteProduct);

export const ProductRoute = router;