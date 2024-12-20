import { ApiProperty } from '@nestjs/swagger';
import { Media } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsDefined, IsOptional, IsString, ValidateIf, ValidateNested } from 'class-validator';
import { CreateMediaDto } from 'src/media/dto/create-media.dto';

export class CreatePostDto {
  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  content: string;

  @ApiProperty({
    type: [CreateMediaDto],
    description: 'Array of media attachments',
    required: false,
  })
  @ValidateNested({ each: true })
  @Type(() => CreateMediaDto)
  @IsOptional()
  attachments: CreateMediaDto[];

  // if nothing has been provided
  @ValidateIf((o: CreatePostDto) => !o.content && !o.attachments)
  @IsDefined({ message: 'At least one of content or attachments must be provided' })
  protected readonly atLeastOne: undefined;
}
