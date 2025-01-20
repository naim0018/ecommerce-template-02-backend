import { Request, Response } from 'express';
import { VendorService } from './vendor.service';
import catchAsync from '@/app/utils/catchAsync';
import sendResponse from '@/app/utils/sendResponse';
import ApiError from '@/utils/ApiError';

const createVendor = catchAsync(async (req: Request, res: Response) => {
  if (!req.user?._id) {
    throw new ApiError(401, 'User not authenticated');
  }

  const vendorData = {
    ...req.body,
    userId: req.user._id
  };
  const vendor = await VendorService.createVendor(vendorData);
  
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Vendor created successfully',
    data: vendor
  });
});

const getVendors = catchAsync(async (req: Request, res: Response) => {
  const result = await VendorService.getVendors(req.query);
  
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Vendors retrieved successfully",
    meta: {
      ...result.meta,
      totalPage: result.meta?.totalPages || 0
    },
    data: result.data,
  });
});

const getVendorById = catchAsync(async (req: Request, res: Response) => {
  const vendor = await VendorService.getVendorById(req.params.id);
  
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Vendor retrieved successfully',
    data: vendor
  });
});

const getVendorProfile = catchAsync(async (req: Request, res: Response) => {
  if (!req.user?._id) {
    throw new ApiError(401, 'User not authenticated');
  }

  const vendor = await VendorService.getVendorByUserId(req.user._id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Vendor profile retrieved successfully",
    data: vendor,
  });
});

const updateVendor = catchAsync(async (req: Request, res: Response) => {
  const vendor = await VendorService.updateVendor(req.params.id, req.body);
  
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Vendor updated successfully',
    data: vendor
  });
});

const deleteVendor = catchAsync(async (req: Request, res: Response) => {
  await VendorService.deleteVendor(req.params.id);
  
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Vendor deleted successfully',
    data: null
  });
});

const getVendorStats = catchAsync(async (req: Request, res: Response) => {
  const stats = await VendorService.getVendorStats(req.params.id);
  
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Vendor stats retrieved successfully',
    data: stats
  });
});

export const VendorController = {
  createVendor,
  getVendors,
  getVendorById,
  getVendorProfile,
  updateVendor,
  deleteVendor,
  getVendorStats
}; 