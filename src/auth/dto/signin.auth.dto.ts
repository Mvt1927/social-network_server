import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AuthSignIn {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
