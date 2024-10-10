import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'usernameOrEmail',
    });
  }

  async validate(usernameOrEmail: string, password: string): Promise<any> {
    let user = await this.authService.validateUserByUsername({
      username: usernameOrEmail,
      password,
    });

    if (!user) {
      user = await this.authService.validateUserByEmail({
        email: usernameOrEmail,
        password,
      });
    }

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
