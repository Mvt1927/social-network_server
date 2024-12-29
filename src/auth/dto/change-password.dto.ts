import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Matches, MinLength } from "class-validator";
import { PASSWORD_ERROR_MESSAGE, PASSWORD_REGEX } from "../constants";

export class ChangePasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @Matches(PASSWORD_REGEX, {
    message: 'Password' + PASSWORD_ERROR_MESSAGE,
  })
  newPassword: string;
}