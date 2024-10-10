import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { ConfigNames, IDbConfig } from 'src/config/interfaces/config.interface';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(private readonly configService: ConfigService) {
    const dbConfig = configService.get<IDbConfig>(ConfigNames.DB);
    super(dbConfig);
  }

  async onModuleInit() {
    await this.$connect();
  }
  clenDb() {
    return this.$transaction([this.user.deleteMany()]);
  }
}
