import {
  BadRequestException,
  HttpStatus,
  Injectable,
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
    const refreshToken = await this.jwtService.signRefreshToken(payloadRefresh);
    return {
      statusCode: HttpStatus.OK,
      message: 'User has been successfully authenticated',
      data: {
        user: userWithoutHash,
        token: accessToken,
        refreshToken: refreshToken,
      },
    };
  }

  async profile(user: UserWithPartialHiddenAttributes) {
    delete user.hash;

    user.email = hideEmail(user.email);

    return {
      statusCode: HttpStatus.OK,
      data: {
        user: user,
      },
    };
  }

  async refresh(user: UserWithPartialHiddenAttributes) {
    delete user.hash;

    user.email = hideEmail(user.email);

    return this.returnAuthResponse(user);
  }

  async logout(
    token: string,
    tokenPayload: { exp: number },
    logoutDto: LogoutDto,
  ): Promise<any> {
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

    const expiresIn = (tokenPayload.exp - Math.floor(Date.now() / 1000)) * 1000;
    await this.tokenBlacklistService.addTokenToBlacklist(token, expiresIn);

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
      time: '1 giờ',
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
