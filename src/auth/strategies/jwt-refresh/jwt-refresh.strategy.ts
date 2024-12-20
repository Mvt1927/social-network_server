import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JsonWebTokenError } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { isNumber } from 'class-validator';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtService } from 'src/jwt/jwt.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtService.jwtConfig.refresh.secret,
      
    });
  }

  authenticate(req: Request, options?: any): void {
    super.authenticate(req, options);
  }

  async validate(payload: any) {
    // console.log('payload', payload);
    
    if (!payload || !payload.sub || !payload.sub.user) {
      throw new UnauthorizedException({
        message: 'Invalid token',
        statusCode: HttpStatus.UNAUTHORIZED,
      });
    }
    const { id } = payload.sub.user;

    const user = await this.userService.findOneWithId(id);
    if (!user) {
      throw new UnauthorizedException({
        message: 'Invalid token',
        statusCode: HttpStatus.UNAUTHORIZED,
      });
    }

    return {user, tokenPayload: payload};
  }
}
