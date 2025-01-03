import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, IsUrl } from "class-validator";

export class UpdateProfileDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  fullname: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  bio: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsUrl()
  avatarUrl: string;
}