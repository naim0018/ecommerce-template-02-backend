import express from 'express';
import { VendorController } from './vendor.controller';
import auth from '@/app/middleware/auth';
import validateRequest from '@/app/middleware/validateRequest';
import { VendorValidation } from './vendor.validation';
import { TUserRole } from '../User/user.interface';

const router = express.Router();

// Public routes
router.get('/', VendorController.getVendors);
router.get('/:id', VendorController.getVendorById);
router.get('/:id/stats', VendorController.getVendorStats);

// Protected routes
router.use(auth());

// Vendor routes
router.get(
  '/profile/me',
  auth('vendor' as TUserRole),
  VendorController.getVendorProfile
);

router.post(
  '/',
  validateRequest(VendorValidation.createVendor),
  VendorController.createVendor
);

router.patch(
  '/:id',
  auth('vendor' as TUserRole),
  validateRequest(VendorValidation.updateVendor),
  VendorController.updateVendor
);

router.delete(
  '/:id',
  auth('admin' as TUserRole),
  VendorController.deleteVendor
);

export const VendorRoutes = router; 