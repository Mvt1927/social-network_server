import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { userOmitArgs } from 'src/users/utils';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
      omit: {
        user: userOmitArgs,
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
  }
  clenDb() {
    return this.$transaction([this.user.deleteMany()]);
  }
}
