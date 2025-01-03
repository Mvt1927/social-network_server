import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class RequestVerifyDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}