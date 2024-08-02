import { Prisma, User } from '@prisma/client';
import { userOmitArgs } from './user.constants';
import { plainToClass } from 'class-transformer';

export type UserOmitArgs = typeof userOmitArgs;

export type UserOmitArgsKeys = keyof UserOmitArgs;

export type UserHiddenAttributesType = Pick<User, UserOmitArgsKeys>;

export type UserPartialHiddenAttributes = Partial<UserHiddenAttributesType>;

export type UserWithoutHiddenAttributes = Omit<User, UserOmitArgsKeys>;

export type UserWithPartialHiddenAttributes = UserWithoutHiddenAttributes &
  Partial<User>;

export const test: UserWithPartialHiddenAttributes = {
  email: 'test',
  // hash: 'test',
  id: 'test',
  salt: 'test',
  username: 'test',
  createAt: new Date(),
  updateAt: new Date(),
  firstName: 'test',
  lastName: 'test',
};
