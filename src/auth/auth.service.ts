import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  // async signin(dto: AuthSignIn) {
  //   const user = await this.usersService.findOne({
  //     where: {
  //       username: dto.username,
  //     },
  //   });
  //   if (!user) return { status: false, msg: 'Incorrect Username or Password' };
  //   const pwMatches = await argon.verify(user.hash, dto.password).catch((_) => {
  //     return false;
  //   });
  //   if (pwMatches) {
  //     return this.signToken(user.id, user.username);
  //   } else return { status: pwMatches, msg: 'Incorrect Username or Password' };
  // }
}
