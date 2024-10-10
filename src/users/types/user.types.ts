import { User } from '@prisma/client';
import { USER_OMIT } from '../constants';

export type UserOmitArgs = typeof USER_OMIT;

export type UserOmitArgsKeys = keyof UserOmitArgs;

export type UserHiddenAttributesType = Pick<User, UserOmitArgsKeys>;

export type UserPartialHiddenAttributes = Partial<UserHiddenAttributesType>;

export type UserWithoutHiddenAttributes = Omit<User, UserOmitArgsKeys>;

export type UserWithPartialHiddenAttributes = UserWithoutHiddenAttributes &
  Partial<User>;
