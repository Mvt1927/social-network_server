import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { Cache } from 'cache-manager';
import { JwtService } from 'src/jwt/jwt.service';
import { UsersService } from 'src/users/users.service';
import { generateNumberCode } from 'src/utils/string.utils';

@Injectable()
export class VerificationService {
  public VERIFICATION_CODE_LENGTH = 6;
  public VERIFICATION = 'VERIFICATION';

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async generateVerificationToken(user: User) {
    const verificationCode = generateNumberCode(this.VERIFICATION_CODE_LENGTH);

    const payload = {
      user: {
        id: user.id,
        email: user.email,
      },
      verificationCode: verificationCode,
    };

    const token = await this.jwtService.signConfirmationToken(payload);

    await this.cacheManager.set(
      `${this.VERIFICATION}:${user.id}:${user.email}`,
      verificationCode,
      this.jwtService.jwtConfig.confirmation.time * 1000,
    );

    return {
      token: token,
      verificationCode: verificationCode,
    };
  }

  async verifyEmail(
    user: { id: string; email: string },
    verificationCode: string,
  ) {
    const cachedVerificationCode = await this.cacheManager.get(
      `${this.VERIFICATION}:${user.id}:${user.email}`,
    );

    console.log("cachedVerificationCode: ",cachedVerificationCode)
    if (!cachedVerificationCode) {
      return false;
    }

    if (cachedVerificationCode !== verificationCode) {
      return false;
    }


    await this.cacheManager.del(
      `${this.VERIFICATION}:${user.id}:${user.email}`,
    );

    const u = await this.usersService.update({
      where: {
        id: user.id,
      },
      data: {
        isVerified: true,
      },
    });

    console.log(u);

    return true;
  }

}
