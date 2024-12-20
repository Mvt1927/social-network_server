import { ApiProperty } from "@nestjs/swagger";
import { $Enums, Media } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl } from "class-validator";

export class CreateMediaDto {

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsUrl()
  url: string;

  @ApiProperty(
    {
      enum: $Enums.MediaType,
      enumName: 'MediaType',
    }
  )
  @IsNotEmpty()
  @IsEnum($Enums.MediaType)
  type: $Enums.MediaType;

  @ApiProperty({required: false})
  @IsOptional()
  @IsString()
  messageId: string;
}
