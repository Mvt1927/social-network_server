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

import { SignInAuthWithUsernameDto } from './dto/signin.auth.dto';

import { AuthResponse } from './utils/auth.interface';
import { SALT_ROUNDS, TokenExpiresIn } from './utils';
import {
  UserHiddenAttributesType,
  UserOmitArgs,
  UserOmitArgsKeys,
  UserWithPartialHiddenAttributes,
  UserWithoutHiddenAttributes,
  userOmitArgs,
} from 'src/users/utils';
import { SignInAuthWithEmailDto } from './dto';
import { RegisterAuthDto } from './dto/register.auth.dto';
import { User } from '@prisma/client';
import { log } from 'console';
import { splitObject, splitObject2 } from 'src/utils';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(
    dto: SignInAuthWithUsernameDto | SignInAuthWithEmailDto,
    user: UserWithPartialHiddenAttributes,
  ): Promise<UserWithoutHiddenAttributes> {
    const { password } = dto;

    if (!user) {
      // return null;
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { hash, salt, ...userWithoutHashAndSalt } = user;

    const isMatch = await bcrypt.compare(password, hash);

    // delete user.hash;

    if (!isMatch) {
      throw new HttpException('Invalid password', HttpStatus.BAD_REQUEST);
    }

    return userWithoutHashAndSalt;
  }

  async validateUserByEmail(dto: SignInAuthWithEmailDto) {
    const { email } = dto;
    const user = await this.usersService.findOne({
      where: {
        email: email,
      },
      omit: {
        hash: false,
      },
    });

    return this.validateUser(dto, user);
  }

  async validateUserByUsername(dto: SignInAuthWithUsernameDto) {
    const { username } = dto;
    const user = await this.usersService.findOne({
      where: {
        username: username,
      },
      omit: {
        hash: false,
      },
    });

    return this.validateUser(dto, user);
  }

  async signin(user: UserWithoutHiddenAttributes): Promise<AuthResponse> {
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return this.returnAuthResponse(user as UserWithPartialHiddenAttributes);
  }

  async register(dto: RegisterAuthDto): Promise<AuthResponse> {
    const users = await this.usersService.FindMany({
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
    const { salt, hash } = await this.hashPassword(password);
    const user = await this.usersService.create({
      data: {
        ...dtoWithoutPassword,
        hash: hash,
        salt: salt,
      },
    });

    return this.returnAuthResponse(user);
  }

  async hashPassword(password: string): Promise<UserHiddenAttributesType> {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    return {
      salt: salt,
      hash: await bcrypt.hash(password, salt),
    };
  }

  async returnAuthResponse(
    user: UserWithPartialHiddenAttributes,
  ): Promise<AuthResponse> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { hash, salt, ...userWithoutHashAndSalt } = user;

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
