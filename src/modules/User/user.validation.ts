import { z } from 'zod';
import { USER_ROLE, USER_STATUS, GENDER } from './user.constant';

const createUserZodSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Name is required',
    }),
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email(),
    password: z.string({
      required_error: 'Password is required',
    }),
    needsPasswordChange: z.boolean().default(true),
    role: z.enum(Object.values(USER_ROLE) as [string, ...string[]]).default(USER_ROLE.USER),
    status: z.enum(Object.values(USER_STATUS) as [string, ...string[]]).default(USER_STATUS.ACTIVE),
    isDeleted: z.boolean().default(false),
    passwordChangedAt: z.date().optional(),
    phoneNumber: z.string().optional(),
    address: z.string().optional(),
    dateOfBirth: z.string().optional(),
    gender: z.enum(Object.values(GENDER) as [string, ...string[]]).optional(),
    profileImage: z.string().optional(),
    bio: z.string().optional(),
    lastLoginAt: z.date().optional()
  }),
});

const updateUserZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    password: z.string().optional(),
    needsPasswordChange: z.boolean().optional(),
    role: z.enum(Object.values(USER_ROLE) as [string, ...string[]]).optional(),
    status: z.enum(Object.values(USER_STATUS) as [string, ...string[]]).optional(),
    isDeleted: z.boolean().optional(),
    passwordChangedAt: z.date().optional(),
    phoneNumber: z.string().optional(),
    address: z.string().optional(),
    dateOfBirth: z.string().optional(),
    gender: z.enum(Object.values(GENDER) as [string, ...string[]]).optional(),
    profileImage: z.string().optional(),
    bio: z.string().optional(),
    lastLoginAt: z.date().optional()
  }),
});

export const UserValidation = {
  createUserZodSchema,
  updateUserZodSchema,
};
