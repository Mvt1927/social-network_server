import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import { CommonService } from 'src/common/common.service';
import { formatFieldsWithName } from './utils';
import { UserWithoutHiddenAttributes } from './types';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private commonService: CommonService,
  ) {}

  async findOne(args: Prisma.UserFindUniqueArgs): Promise<User | null> {
    return this.prisma.user.findUnique(args);
  }

  async findOneWithEmail(
    email: string,
    options?: {
      select?: Prisma.UserSelect;
      omit?: Prisma.UserOmit;
    },
  ): Promise<User | null> {
    return this.findOne({
      where: {
        email: email.trim().toLowerCase(),
      },
      select: options.select,
      omit: options.omit,
    });
  }

  async findOneWithUsername(
    username: string,
    options?: {
      select?: Prisma.UserSelect;

      omit?: Prisma.UserOmit;
    },
  ): Promise<User | null> {
    return this.findOne({
      where: {
        username: username.trim().toLowerCase(),
      },
      select: options?.select,
      omit: options?.omit,
    });
  }

  async findOneWithId(
    id: string,
    select?: Prisma.UserSelect,
    omit?: Prisma.UserOmit,
  ): Promise<User | null> {
    return this.findOne({
      where: {
        id: id,
      },
      select: select,
      omit: omit,
    });
  }

  async findMany(
    args?: Prisma.UserFindManyArgs,
  ): Promise<UserWithoutHiddenAttributes[]> {
    this.format(args);
    return this.prisma.user.findMany(args);
  }

  async create(args: Prisma.UserCreateArgs): Promise<User> {
    this.format(args);
    return this.prisma.user.create(args);
  }

  async update(args: Prisma.UserUpdateArgs): Promise<User> {
    this.format(args);

    return this.prisma.user.update(args);
  }

  async remove(args: Prisma.UserDeleteArgs): Promise<User> {
    this.format(args);
    return this.prisma.user.delete(args);
  }

  formatUsername(value: string): string {
    return value.trim().toLowerCase();
  }

  formatEmail(value: string): string {
    return value.trim().toLowerCase();
  }

  formatName(value: string): string {
    return this.commonService.formatName(value.trim());
  }

  format(args: object) {
    formatFieldsWithName(args, 'username', this.formatUsername);
    formatFieldsWithName(args, 'email', this.formatEmail);
    formatFieldsWithName(args, 'name', this.formatName);
  }
}
