import { ApiProperty } from '@nestjs/swagger';
import { PASSWORD_ERROR_MESSAGE, PASSWORD_REGEX } from '../constants';
import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class RequestChangePasswordDto {

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
