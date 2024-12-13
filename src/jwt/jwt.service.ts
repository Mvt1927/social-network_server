import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService as BaseJwtService } from '@nestjs/jwt';
import { IJwt } from 'src/config/interfaces/jwt.interface';

@Injectable()
export class JwtService {
  jwtConfig: IJwt;

  constructor(
    private baseJwtService: BaseJwtService,
    private configService: ConfigService,
  ) {
    this.jwtConfig = this.configService.get('jwt');
  }

  async verifyBaseToken(token: string) {
    return this.baseJwtService.verifyAsync(token);
  }

  async signBaseToken(payload: any) {
    return this.baseJwtService.signAsync({
      sub: payload,
    });
  }

  async verifyAccessToken(token: string) {
    return this.baseJwtService.verifyAsync(token, {
      secret: this.jwtConfig.access.secret,
    });
  }

  async signAccessToken(payload: any) {
    return this.baseJwtService.signAsync(
      { sub: payload },
      {
        secret: this.jwtConfig.access.secret,
        expiresIn: this.jwtConfig.access.time,
      },
    );
  }

  async verifyRefreshToken(token: string) {
    return this.baseJwtService.verifyAsync(token, {
      secret: this.jwtConfig.refresh.secret,
    });
  }

  async signRefreshToken(payload: any) {
    return this.baseJwtService.signAsync(
      { sub: payload },
      {
        secret: this.jwtConfig.refresh.secret,
        expiresIn: this.jwtConfig.refresh.time,
      },
    );
  }

  async verifyConfirmationToken(token: string) {
    return this.baseJwtService.verifyAsync(token, {
      secret: this.jwtConfig.confirmation.secret,
    });
  }

  async signConfirmationToken(payload: any) {
    return this.baseJwtService.signAsync(
      { sub: payload },
      {
        secret: this.jwtConfig.confirmation.secret,
        expiresIn: this.jwtConfig.confirmation.time,
      },
    );
  }

  async verifyResetPasswordToken(token: string) {
    return this.baseJwtService.verifyAsync(token, {
      secret: this.jwtConfig.resetPassword.secret,
    });
  }

  async signResetPasswordToken(payload: any) {
    return this.baseJwtService.signAsync(
      { sub: payload },
      {
        secret: this.jwtConfig.resetPassword.secret,
        expiresIn: this.jwtConfig.resetPassword.time,
      },
    );
  }
}
