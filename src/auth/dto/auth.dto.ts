import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { PASSWORD_ERROR_MESSAGE, PASSWORD_REGEX, USERNAME_ERROR_MESSAGE, USERNAME_REGEX } from '../constants';

export class UsernameAuthDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Matches(
    USERNAME_REGEX,
    { message: 'Username'+ USERNAME_ERROR_MESSAGE },
  )
  username: string;
}

export class LoginAuthDto extends UsernameAuthDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @Matches(PASSWORD_REGEX, {
    message: 'Password' + PASSWORD_ERROR_MESSAGE,
  })
  password: string;
}


export class RegisterAuthDto extends LoginAuthDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
}
