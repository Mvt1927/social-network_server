import { ApiProperty } from '@nestjs/swagger';
import { PASSWORD_ERROR_MESSAGE, PASSWORD_REGEX } from '../constants';
import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class RequestChangePasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @Matches(PASSWORD_REGEX, {
    message: 'Password' + PASSWORD_ERROR_MESSAGE,
  })
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
