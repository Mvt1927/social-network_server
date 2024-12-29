import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAccessGuard } from 'src/auth/guards/jwt-access/jwt-access.guard';
import { VerifyEmailGuard } from 'src/verification/guards/verify-email/verify-email.guard';
import { GetUser } from 'src/users/decorators/get-user/get-user.decorator';
import { User } from '@prisma/client';

@Controller('post/:postId/comment')
@UseGuards(JwtAccessGuard, VerifyEmailGuard)
@ApiBearerAuth('Access Token')
@ApiTags('Comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  create(
    @GetUser() user: User,
    @Param('postId') postId: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentService.create(user, postId, createCommentDto);
  }

  @ApiQuery({ name: 'cursor', required: false, type: String })
  @ApiQuery({ name: 'pageSize', required: false, type: String })
  @Get()
  findAll(
    @GetUser() user: User,
    @Param('postId') postId: string,
    @Query('cursor') cursor: string | undefined,
    @Query('pageSize') pageSize: string = '10',
    @Query() q: Record<string, any> | any,
  ) {
    return this.commentService.findAll(user, postId, cursor, pageSize, q);
  }

  @Get(':id')
  findOne(
    @GetUser() user: User,
    @Param('postId') postId: string,
    @Param('id') id: string,
  ) {
    return this.commentService.findOne(user, postId, id);
  }

  @Patch(':id')
  update(
    @GetUser() user: User,
    @Param('postId') postId: string,
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentService.update(user, postId, id, updateCommentDto);
  }

  @Delete(':id')
  remove(
    @GetUser() user: User,
    @Param('postId') postId: string,
    @Param('id') id: string,
  ) {
    return this.commentService.remove(user, postId, id);
  }
}
