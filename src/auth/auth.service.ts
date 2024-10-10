import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import argon2 from 'argon2';

import { SignInAuthWithEmailDto } from './dto';
import { RegisterAuthDto, SignInAuthWithUsernameDto } from './dto/auth.dto';
import { SALT_ROUNDS } from './constants/hash.const';
import { TokenExpiresIn } from './enums';
import { invertBooleanValues } from 'src/utils';
import { USER_OMIT } from 'src/users/constants';
import { removeKeys } from 'src/utils/object.utils';
import {
  UserHiddenAttributesType,
  UserWithPartialHiddenAttributes,
  UserWithoutHiddenAttributes,
} from 'src/users/types';
import { any } from 'joi';

type AuthResponse = any

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(
    password: string,
    user: UserWithPartialHiddenAttributes,
  ): Promise<UserWithoutHiddenAttributes> {
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const { hash } = user;

    const isVerified = await argon2.verify(hash, password);

    if (!isVerified) {
      throw new HttpException('Invalid password', HttpStatus.BAD_REQUEST);
    }

    return removeKeys(user, Object.keys(USER_OMIT));
  }

  async validateUserByEmail(
    dto: SignInAuthWithEmailDto,
  ): Promise<UserWithoutHiddenAttributes> {
    const { email, password } = dto;
    const user = await this.usersService.findOneWithEmail(email, {
      omit: invertBooleanValues(USER_OMIT),
    });

    if (!user) {
      return null;
    }

    return this.validateUser(password, user);
  }

  async validateUserByUsername(
    dto: SignInAuthWithUsernameDto,
  ): Promise<UserWithoutHiddenAttributes> {
    const { username, password } = dto;
    const user = await this.usersService.findOneWithUsername(username, {
      omit: invertBooleanValues(USER_OMIT),
    });

    if (!user) {
      return null;
    }

    return this.validateUser(password, user);
  }

  async signin(user: UserWithoutHiddenAttributes): Promise<any> {
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
      throw new BadRequestException(
        `User with ${users[0].email === dto.email ? 'Email' : 'Username'} already exists`,
      );
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

    return this.returnAuthResponse(user);
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
    const { hash, ...userWithoutHashAndSalt } = user;

    const { token, refreshToken } = await this.signToken(
      userWithoutHashAndSalt,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'User signed in successfully',
      data: {
        user: userWithoutHashAndSalt,
        token: token,
        refreshToken: refreshToken,
      },
    };
  }

  async signToken(
    user: UserWithoutHiddenAttributes,
    expiresIn = TokenExpiresIn.S30,
  ): Promise<{ token: string; refreshToken: string }> {
    const token = await this.jwtService.signAsync(
      {
        sub: {
          user: user,
        },
      },
      {
        expiresIn: expiresIn,
      },
    );

    const refreshPayload = {
      token: token,
    };

    const refreshToken = await this.jwtService.signAsync(refreshPayload, {
      expiresIn: TokenExpiresIn.D30,
    });

    return { token, refreshToken };
  }
}
