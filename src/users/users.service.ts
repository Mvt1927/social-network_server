import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import { UserWithoutHash } from './user.type';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(args: Prisma.UserFindUniqueArgs): Promise<User | null> {
    return this.prisma.user.findUnique(args);
  }

  async FindMany(args?: Prisma.UserFindManyArgs): Promise<UserWithoutHash[]> {
    return this.prisma.user.findMany(args);
  }

  async create(args: Prisma.UserCreateArgs): Promise<User> {
    return this.prisma.user.create(args);
  }

  async update(args: Prisma.UserUpdateArgs): Promise<User> {
    return this.prisma.user.update(args);
  }

  async remove(args: Prisma.UserDeleteArgs): Promise<User> {
    return this.prisma.user.delete(args);
  }
}
