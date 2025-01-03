import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PostReactionService } from './reaction.service';
import { CreateReactionDto } from './dto/create-reaction.dto';
import { UpdateReactionDto } from './dto/update-reaction.dto';
import { GetUser } from 'src/users/decorators/get-user/get-user.decorator';
import { User } from '@prisma/client';
import { ApiBearerAuth, ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import { JwtAccessGuard } from 'src/auth/guards/jwt-access/jwt-access.guard';
import { VerifyEmailGuard } from 'src/verification/guards/verify-email/verify-email.guard';
import { get } from 'lodash';

@ApiTags('Reactions', 'Post')
@UseGuards(JwtAccessGuard, VerifyEmailGuard)
@ApiBearerAuth('Access Token')
@Controller('post/:postId/reaction')
export class PostReactionController {
  constructor(private readonly reactionService: PostReactionService) {}

  // SWAGGER_DOCS:BEGINS
  @ApiOperation({ summary: 'Create a new reaction' })
  @ApiProperty({ type: CreateReactionDto })
  // SWAGGER_DOCS:ENDS
  @Post()
  create(
    @GetUser() user: User,
    @Param('postId') postId: string,
    @Body() createReactionDto: CreateReactionDto,
  ) {
    return this.reactionService.create(user, postId, createReactionDto);
  }

  // SWAGGER_DOCS:BEGINS
  @ApiOperation({ summary: 'Get all reactions' })
  // SWAGGER_DOCS:ENDS
  @Get()
  findAll(@GetUser() user: User, @Param('postId') postId: string) {
    return this.reactionService.findAll(user, postId);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.reactionService.findOne(id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateReactionDto: UpdateReactionDto,
  // ) {
  //   return this.reactionService.update(id, updateReactionDto);
  // }

  // SWAGGER_DOCS:BEGINS
  @ApiOperation({ summary: 'Delete a reaction' })
  // SWAGGER_DOCS:ENDS
  @Delete('')
  remove(
    @GetUser() user: User,
    @Param('postId') postId: string,
    // @Param('id') id: string,
  ) {
    console.log('delete reaction');
    return this.reactionService.remove(user, postId);
  }
}

@Controller('comment/:commentId/reaction')
export class CommentReactionController {
  constructor(private readonly reactionService: PostReactionService) {}

  @Post()
  create(@Body() createReactionDto: CreateReactionDto) {
    // return this.reactionService.create(createReactionDto);
  }

  @Get()
  findAll() {
    // return this.reactionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reactionService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateReactionDto: UpdateReactionDto,
  ) {
    return this.reactionService.update(id, updateReactionDto);
  }

  @Delete(':id')
  remove(
    @GetUser() user: User,
    @Param('commentId') commentId: string,
    @Param('id') id: string) {
    // return this.reactionService.remove(id);
  }
}
