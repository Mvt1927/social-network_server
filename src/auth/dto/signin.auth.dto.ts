import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SignInAuthDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}


