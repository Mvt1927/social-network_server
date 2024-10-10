import { ApiProperty } from '@nestjs/swagger';
import { PasswordDto } from './password-auth.dtos';
import { IsNotEmpty, IsString } from 'class-validator';

export class SignInDto extends PasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  usernameOrEmail: string;
}
