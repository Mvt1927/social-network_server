import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import argon2 from 'argon2';

import { RegisterAuthDto, LoginAuthDto } from './dto/auth.dto';
import {
  UserHiddenAttributesType,
  UserWithoutHiddenAttributes,
  UserWithPartialHiddenAttributes,
} from 'src/users/types';
import { forEach } from 'lodash';
import { JwtService } from 'src/jwt/jwt.service';
import { hideEmail } from 'src/users/utils';
import { TokenBlacklistService } from 'src/blacklist/token-blacklist/token-blacklist.service';
import { LogoutDto } from './dto/logout.dto';
import { ref } from 'joi';
import { VerificationService } from 'src/verification/verification.service';
import { readFileSync } from 'fs';
import Handlebars from 'handlebars';
import { time } from 'console';
import { EmailService } from 'src/email/email.service';
import e from 'express';
import { User } from '@prisma/client';
import { getProfileUserDataSelect } from 'src/users/entities/user.entities';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RequestChangePasswordDto } from './dto/request-change-password.dto';
import { formatDuration, intervalToDuration } from 'date-fns';
import { vi } from 'date-fns/locale';

type AuthResponse = any;

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private tokenBlacklistService: TokenBlacklistService,
    private verifyService: VerificationService,
    private emailService: EmailService,
  ) {}

  async signin(dto: LoginAuthDto): Promise<AuthResponse> {
    const { username, password } = dto;

    const user = await this.usersService.findUnique({
      where: {
        username: username,
      },
      omit: {
        hash: false,
      },
    });

    if (!user) {
      throw new BadRequestException([
        {
          property: 'username',
          constraints: {
            isUserExists: 'User does not exist',
          },
        },
      ]);
    }

    const isPasswordValid = await argon2.verify(user.hash, password);

    if (!isPasswordValid) {
      throw new BadRequestException([
        {
          property: 'password',
          constraints: {
            isPasswordValid: 'Password is invalid',
          },
        },
      ]);
    }

    return this.returnAuthResponse(user);
  }

  async register(dto: RegisterAuthDto): Promise<AuthResponse> {
    const users = await this.usersService.findMany({
      where: {
        OR: [
          {
            email: dto.email,
          },
          {
            username: dto.username,
          },
        ],
      },
      select: {
        id: true,
        email: true,
        username: true,
      },
    });

    if (users.length > 0) {
      forEach(users, (user) => {
        if (user.email === dto.email) {
          throw new BadRequestException([
            {
              property: 'email',
              constraints: {
                isEmailExists: 'Email already exists',
              },
            },
          ]);
        }

        if (user.username === dto.username) {
          throw new BadRequestException([
            {
              property: 'username',
              constraints: {
                isUsernameExists: 'Username already exists',
              },
            },
          ]);
        }
      });
    }

    const { password, ...dtoWithoutPassword } = dto;
    const { hash } = await this.hashPassword(password);
    const user = await this.usersService.create({
      data: {
        ...dtoWithoutPassword,
        hash: hash,
        // salt: salt,
      },
    });

    return await this.sendVerificationEmail(user);
  }

  async hashPassword(password: string): Promise<UserHiddenAttributesType> {
    return {
      hash: await argon2.hash(password),
    };
  }

  async returnAuthResponse(
    user: UserWithPartialHiddenAttributes,
    refresh = false,
  ): Promise<AuthResponse> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { hash, ...userWithoutHash } = user;

    const { id, username, fullname } = userWithoutHash;

    const payloadAccess = {
      user: {
        id: id,
        username: username,
        fullname: fullname,
      },
    };

    const payloadRefresh = {
      user: {
        id: id,
      },
    };

    userWithoutHash.email = hideEmail(userWithoutHash.email);

    const accessToken = await this.jwtService.signAccessToken(payloadAccess);
    const refreshToken = !refresh
      ? await this.jwtService.signRefreshToken(payloadRefresh)
      : undefined;
    return {
      statusCode: HttpStatus.OK,
      message: 'User has been successfully authenticated',
      data: !refresh
        ? {
            user: userWithoutHash,
            token: accessToken,
            refreshToken: refreshToken,
          }
        : {
            token: accessToken,
            refreshToken: refreshToken,
          },
    };
  }

  async profile(user: UserWithPartialHiddenAttributes) {
    const userProfile = await this.usersService.findOneWithId(
      user.id,
      getProfileUserDataSelect(),
    );

    delete userProfile.hash;

    userProfile.email = hideEmail(user.email);

    return {
      statusCode: HttpStatus.OK,
      data: {
        user: userProfile,
      },
    };
  }

  async refresh(user: UserWithPartialHiddenAttributes, accessToken: string) {
    this.tokenBlacklistService.addTokenToBlacklist(
      accessToken,
      Date.now() + this.jwtService.jwtConfig.access.time * 1000,
    );
    return this.returnAuthResponse(user, true);
  }

  async logout(token: string, logoutDto: LogoutDto): Promise<any> {
    try {
      const payload = await this.jwtService.verifyRefreshToken(
        logoutDto.refreshToken,
      );
      const expiresIn = payload.exp - Math.floor(Date.now() / 1000);
      await this.tokenBlacklistService.addTokenToBlacklist(
        logoutDto.refreshToken,
        expiresIn,
      );
    } catch (error) {
      throw new UnauthorizedException({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Invalid token',
      });
    }

    await this.tokenBlacklistService.addTokenToBlacklist(
      token,
      Date.now() + this.jwtService.jwtConfig.access.time * 1000,
    );

    return {
      statusCode: HttpStatus.OK,
      message: 'User has been successfully logged out',
      token: await this.tokenBlacklistService.isTokenBlacklisted(token),
      refreshToken: await this.tokenBlacklistService.isTokenBlacklisted(
        logoutDto.refreshToken,
      ),
    };
  }

  async test(token: string): Promise<any> {
    return await this.tokenBlacklistService.isTokenBlacklisted(token);
  }

  requestVerify(user: User, email: string) {
    if (user.email !== email) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Invalid email',
      });
    }

    return this.sendVerificationEmail(user);
  }

  async resetPassword(user: User, token: string, dto: ChangePasswordDto) {
    try {
      this.tokenBlacklistService.addTokenToBlacklist(
        token,
        Date.now() + this.jwtService.jwtConfig.resetPassword.time * 1000,
      );

      return this.usersService.update({
        where: {
          id: user.id,
        },
        data: {
          hash: await argon2.hash(dto.newPassword),
        },
      });
    } catch (error) {
      throw new InternalServerErrorException("Failed to reset user's password");
    }
  }

  async requestResetPassword(user: User, dto: RequestChangePasswordDto) {
    if (dto.email !== user.email) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Invalid email',
      });
    }

    if (!(await argon2.verify(user.hash, dto.password))) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Invalid password',
      });
    }

    const token = this.jwtService.signResetPasswordToken({
      user: {
        id: user.id,
      },
    });

    const templatePath = 'src/email/templates/reset-password.hbs';
    const templateContent = readFileSync(templatePath, 'utf-8');
    const template = Handlebars.compile(templateContent);

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    const html = template({
      name: user.username,
      resetLink,
      time: formatDuration(
        intervalToDuration({
          start: 0,
          end: this.jwtService.jwtConfig.resetPassword.time * 1000,
        }),
        { locale: vi },
      ),
    });

    const subject = 'Reset your password';

    this.emailService.sendMail(user.email, subject, '', html);

    return {
      statusCode: HttpStatus.OK,
      message: 'Reset password email has been sent',
    };
  }

  async sendVerificationEmail(user: User) {
    const { token, verificationCode } =
      await this.verifyService.generateVerificationToken(user);

    const templatePath = 'src/email/templates/welcome.hbs'; // Đường dẫn đến template
    const templateContent = readFileSync(templatePath, 'utf-8');
    const template = Handlebars.compile(templateContent);

    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    const html = template({
      name: user.username,
      verificationLink,
      verificationCode,
      time: formatDuration(
        intervalToDuration({
          start: 0,
          end: this.jwtService.jwtConfig.confirmation.time * 1000,
        }),
        { locale: vi },
      ),
    }); // Thay thế các biến trong template

    const subject = 'Welcome to our platform';

    this.emailService.sendMail(user.email, subject, '', html);

    return this.returnAuthResponse(user);
  }

  async verifyWithToken(
    user: UserWithoutHiddenAttributes,
    tokenPayload: any,
  ): Promise<any> {
    let code = null;

    if (
      !tokenPayload ||
      !tokenPayload.sub ||
      !tokenPayload.sub.verificationCode ||
      tokenPayload.sub.user.id !== user.id ||
      !this.verifyService.verifyEmail(user, tokenPayload.sub.verificationCode)
    ) {
      throw new UnauthorizedException({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Invalid token',
      });
    }

    return this.verifyWithCode(user, code);
  }

  async verifyWithCode(user: UserWithoutHiddenAttributes, code: string) {
    const verified = await this.verifyService.verifyEmail(user, code);

    if (!verified) {
      throw new UnauthorizedException({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Invalid code',
      });
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Email has been successfully verified',
    };
  }
}
