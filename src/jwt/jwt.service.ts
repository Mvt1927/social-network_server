import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CommonService } from 'src/common/common.service';
import { IJwt } from 'src/config/interfaces/jwt.interface';
import { IAccessPayload, IEmailPayload, IRefreshPayload } from './interfaces';
import { JwtService as NestJwtService } from '@nestjs/jwt';

@Injectable()
export class JwtService {
  private readonly jwtConfig: IJwt;
  private readonly issuer: string;
  private readonly domain: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly commonService: CommonService,
    private readonly jwtService: NestJwtService,
  ) {}

  private static async generateTokenAsync(
    payload: IAccessPayload | IEmailPayload | IRefreshPayload,
    secret: string,
  ) {
    console.log('payload', payload);
  }
}
