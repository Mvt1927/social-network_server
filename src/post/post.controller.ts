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
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAccessGuard } from 'src/auth/guards/jwt-access/jwt-access.guard';
import { GetUser } from 'src/users/decorators/get-user/get-user.decorator';
import { User } from '@prisma/client';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiProperty,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { VerifyEmailGuard } from 'src/verification/guards/verify-email/verify-email.guard';
import { PostType } from './entities/post.entity';
import { query } from 'express';

@UseGuards(JwtAccessGuard, VerifyEmailGuard)
@Controller('post')
@ApiBearerAuth('Access Token')
@ApiTags('Post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  // SWAGGER_DOCS:BEGINS
  @ApiOperation({ summary: 'Create a new post' })
  @ApiBody({ type: CreatePostDto })
  // SWAGGER_DOCS:ENDS
  @Post()
  create(@GetUser() user: User, @Body() createPostDto: CreatePostDto) {
    return this.postService.create(user, createPostDto);
  }

  // SWAGGER_DOCS:BEGINS
  @ApiOperation({ summary: 'Get all posts' })
  @ApiQuery({ name: 'cursor', required: false, type: String })
  @ApiQuery({
    name: 'q',
    required: false,
    content: {
      schema: {
        example: PostType.ALL,
      },
    },
    enum: PostType,
    example: PostType.ALL,
    // type: String,
  })
  // @ApiProperty({ required: false })
  // SWAGGER_DOCS:ENDS
  @Get()
  findAll(
    @GetUser() user: User,
    @Query('cursor') cursor: string | undefined,
    @Query('pageSize') pageSize: string = '10',
    @Query('PostType') postType: PostType = PostType.ALL,
    @Query('q') searchQuery: String | undefined,
    @Query() query: any,
  ) {
    return this.postService.findAll(user, cursor, +pageSize, postType);
  }

  @Get('search')
  async search(
    @GetUser() user: User,
    @Query('cursor') cursor: string | undefined,
    @Query('pageSize') pageSize: string = '10',
    @Query('q') searchQuery: string = "",
    @Query() query: any,
  ) {
    return this.postService.search(user, cursor, +pageSize, searchQuery);
  }

  // SWAGGER_DOCS:BEGINS
  @ApiOperation({ summary: 'Get a post by id' })
  // SWAGGER_DOCS:ENDS
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(id);
  }

  // SWAGGER_DOCS:BEGINS
  @ApiOperation({ summary: 'Update a post by id' })
  // SWAGGER_DOCS:ENDS
  @Patch(':id')
  update(
    @GetUser() user: User,
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postService.update(id, updatePostDto, user);
  }

  // SWAGGER_DOCS:BEGINS
  @ApiOperation({ summary: 'Delete a post by id' })
  // SWAGGER_DOCS:ENDS
  @Delete(':id')
  remove(@GetUser() user: User, @Param('id') id: string) {
    return this.postService.remove(id, user);
  }
}
