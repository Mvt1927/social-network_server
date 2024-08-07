import { IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { SignInAuthTokenType } from '../utils';
import { ApiProperty } from '@nestjs/swagger';

export class SignInAuthWithUsernameDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;
}

export class SignInAuthWithTokenDto {
  @IsNotEmpty()
  @IsString()
  token: string;

  @IsNotEmpty()
  @IsEnum(SignInAuthTokenType)
  type: SignInAuthTokenType;
}
