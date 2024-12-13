import { IsEmail, IsNotEmpty, IsString, IsUUID } from "class-validator";

export class VerifyEmailDto {
    @IsNotEmpty()
    @IsString()
    verificationCode: string;
}