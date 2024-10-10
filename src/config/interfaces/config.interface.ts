import { Prisma } from '@prisma/client';
import { IEmailConfig } from './email-config.interface';
import { IJwt } from './jwt.interface';

export type IDbConfig = Prisma.Subset<
  Prisma.PrismaClientOptions,
  Prisma.PrismaClientOptions
>;

export interface IConfig {
  id: string;
  version: string;
  port: number;
  domain: string;
  db: IDbConfig;
  jwt: IJwt;
  emailService: IEmailConfig;
}

export enum ConfigNames {
  ID = 'id',
  VERSION = 'version',
  PORT = 'port',
  DOMAIN = 'domain',
  DB = 'db',
  JWT = 'jwt',
  EMAIL_SERVICE = 'emailService',
}
