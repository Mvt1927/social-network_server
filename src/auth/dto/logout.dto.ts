import { ApiProperty } from "@nestjs/swagger";
import { IsJWT, IsNotEmpty, IsString } from "class-validator";

export class LogoutDto {

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @IsJWT()
    refreshToken: string;
}
