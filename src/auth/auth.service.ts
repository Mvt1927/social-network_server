import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

import { SignInAuthWithUsernameDto } from './dto/signin.auth.dto';

import { AuthResponse } from './utils/auth.interface';
import { TokenExpiresIn } from './utils';
import {
  UserWithPartialHiddenAttributes,
  UserWithoutHiddenAttributes,
} from 'src/users/utils';

const SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(
    dto: SignInAuthWithUsernameDto,
  ): Promise<UserWithoutHiddenAttributes> {
    const { username, password } = dto;
    const user = await this.usersService.findOne({
      where: {
        username: username,
      },
      omit: {
        hash: false,
      },
    });

    if (!user) {
      // return null;
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const { hash } = user;

    const isMatch = await bcrypt.compare(password, hash);

    if (!isMatch) {
      throw new HttpException('Invalid password', HttpStatus.BAD_REQUEST);
    }

    const { ...userWithoutHiddenAttributes }: UserWithoutHiddenAttributes =
      user;

    return userWithoutHiddenAttributes;
  }

  async signin(user: UserWithoutHiddenAttributes): Promise<AuthResponse> {
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return this.returnAuthResponse(user);
  }

  async returnAuthResponse(
    user: UserWithoutHiddenAttributes,
  ): Promise<AuthResponse> {
    const { token, refreshToken } = await this.signToken(user);
    return {
      statusCode: HttpStatus.OK,
      message: 'User signed in successfully',
      data: {
        user: user,
        token: token,
        refreshToken: refreshToken,
      },
    };
  }

  async signToken(
    user: UserWithoutHiddenAttributes,
    expiresIn = TokenExpiresIn.S30,
  ): Promise<{ token: string; refreshToken: string }> {
    const token = await this.jwtService.signAsync(user, {
      expiresIn: expiresIn,
    });

    const refreshPayload = {
      token: token,
    };

    const refreshToken = await this.jwtService.signAsync(refreshPayload, {
      expiresIn: TokenExpiresIn.D30,
    });

    return { token, refreshToken };
  }
}
