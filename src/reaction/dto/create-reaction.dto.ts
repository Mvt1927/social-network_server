import { ApiProperty } from '@nestjs/swagger';
import { ReactionType } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';

export class CreateReactionDto {
  @ApiProperty({ enum: ReactionType })
  @IsOptional()
  @IsEnum(ReactionType)
  type: ReactionType;
}
