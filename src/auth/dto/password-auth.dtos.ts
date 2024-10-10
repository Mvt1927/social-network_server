import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';
import { PASSWORD_ERROR_MESSAGE, PASSWORD_REGEX } from 'src/constants';

export class PasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @Matches(PASSWORD_REGEX, {
    message: 'Password' + PASSWORD_ERROR_MESSAGE,
  })
  password: string;
}
