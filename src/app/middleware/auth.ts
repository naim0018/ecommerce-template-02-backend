import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../error/AppError";
import config from "../config";
import { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import { TUserRole } from "../../modules/User/user.interface";
import { UserModel } from "../../modules/User/user.model";
import { StatusCodes } from "http-status-codes";

declare module 'express-serve-static-core' {
  interface Request {
    user: JwtPayload & { 
      role: TUserRole; 
      userId: string; 
      iat: number;
    };
  }
}

interface IDecodedToken extends JwtPayload {
  role: TUserRole;
  userId: string;
  iat: number;
}

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new AppError(StatusCodes.UNAUTHORIZED, 'You are not authorized!');
    }

    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string,
    ) as IDecodedToken;

    const user = await UserModel.isUserExistsByCustomId(decoded.userId);

    if (!user) {
      throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
    }

    if (user.isDeleted) {
      throw new AppError(StatusCodes.FORBIDDEN, 'User has been deleted');
    }

    if (user.status === 'blocked') {
      throw new AppError(StatusCodes.FORBIDDEN, 'User is blocked');
    }

    if (
      user.passwordChangedAt &&
      UserModel.isJWTIssuedBeforePasswordChanged(
        new Date(user.passwordChangedAt),
        decoded.iat
      )
    ) {
      throw new AppError(StatusCodes.UNAUTHORIZED, 'Token is invalid');
    }

    if (requiredRoles.length && !requiredRoles.includes(decoded.role)) {
      throw new AppError(
        StatusCodes.FORBIDDEN,
        'You do not have permission to perform this action'
      );
    }

    req.user = decoded;
    next();
  });
};

export default auth;
