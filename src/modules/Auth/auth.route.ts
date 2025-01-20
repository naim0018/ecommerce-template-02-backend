import { Router } from "express";
import validateRequest from "../../app/middleware/validateRequest";
import { USER_ROLE } from "../User/user.constant";
import auth from "../../app/middleware/auth";
import { AuthValidation } from "./auth.validation";
import { AuthControllers } from "./auth.controller";
import { TUserRole } from "../User/user.interface";

const router = Router();
router.post(
  "/login",
  validateRequest(AuthValidation.loginValidationSchema),
  AuthControllers.loginUser
);

router.post(
  "/change-password",
  auth(USER_ROLE.ADMIN as TUserRole, USER_ROLE.USER as TUserRole),
  validateRequest(AuthValidation.changePasswordValidationSchema),  
  AuthControllers.changePassword
);

router.post(
  "/refresh-token",
  validateRequest(AuthValidation.refreshTokenValidationSchema),
  AuthControllers.refreshToken
);

router.post(
  "/forget-password",
  validateRequest(AuthValidation.forgetPasswordValidationSchema),
  AuthControllers.forgetPassword
);

router.post(
  "/reset-password",
  validateRequest(AuthValidation.forgetPasswordValidationSchema),
  AuthControllers.resetPassword
);
export const AuthRoute = router;
