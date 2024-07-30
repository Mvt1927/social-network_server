import { User } from '@prisma/client';
import { userOmitArgs } from './user.constants';

export type UserOmitArgs = typeof userOmitArgs;

export type UserOmitArgsKeys = keyof UserOmitArgs;

export type UserHiddenAttributesType = Pick<User, UserOmitArgsKeys>;

export type UserPartialHiddenAttributes = Partial<UserHiddenAttributesType>;

export type UserWithoutHiddenAttributes = Omit<User, UserOmitArgsKeys>;

export type UserWithPartialHiddenAttributes =
  | UserWithoutHiddenAttributes
  | User;
