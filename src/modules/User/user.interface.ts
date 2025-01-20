import { Model } from "mongoose";
import { USER_ROLE, USER_STATUS, GENDER } from "./user.constant";

export type TUserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];
export type TUserStatus = (typeof USER_STATUS)[keyof typeof USER_STATUS];
export type TGender = (typeof GENDER)[keyof typeof GENDER];

export interface TUser {
  id: string;
  name: string;
  email: string;
  password: string;
  needsPasswordChange: boolean;
  role: TUserRole;
  status: TUserStatus;
  isDeleted: boolean;
  passwordChangedAt?: Date;
  phoneNumber?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: TGender;
  profileImage?: string;
  bio?: string;
  lastLoginAt?: Date;
}

export interface TUserModel extends Model<TUser> {
  isUserExistsByCustomId(id: string): Promise<TUser | null>;
  isPasswordMatched(plainTextPassword: string, hashedPassword: string): Promise<boolean>;
  isJWTIssuedBeforePasswordChanged(passwordChangedAt: Date, iat: number): boolean;
  checkUserStatus(id: string): Promise<boolean>;
}

export interface TUserWithRole extends TUser {
  role: TUserRole;
}

