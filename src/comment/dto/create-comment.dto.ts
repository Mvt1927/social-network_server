import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsDefined, IsOptional, IsString, ValidateIf, ValidateNested } from "class-validator";
import { CreateMediaDto } from "src/media/dto/create-media.dto";
import { CreatePostDto } from "src/post/dto/create-post.dto";

export class CreateCommentDto {
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

  @ApiProperty({
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  published: boolean = true;

  // if nothing has been provided
  @ValidateIf((o: CreatePostDto) => !o.content && !o.attachments)
  @IsDefined({
    message: 'At least one of content or attachments must be provided',
  })
  protected readonly atLeastOne: undefined;
}
