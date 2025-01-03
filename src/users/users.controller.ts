import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAccessGuard } from 'src/auth/guards/jwt-access/jwt-access.guard';
import { VerifyEmailGuard } from 'src/verification/guards/verify-email/verify-email.guard';
import { UsersService } from './users.service';
import { id } from 'date-fns/locale';
import { username } from '@snaplet/copycat/dist/username';
import { GetUser } from './decorators/get-user/get-user.decorator';
import { use } from 'passport';
import { PostsType, User } from '@prisma/client';
import { query } from 'express';

@UseGuards(JwtAccessGuard, VerifyEmailGuard)
@Controller('user')
@ApiBearerAuth('Access Token')
@ApiTags('User')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('to-follow')
  async getToFollow(@GetUser() user: User) {
    return this.userService.getUsersToFollow(user);
  }

  @Get('followers')
  async getFollowers(
    @GetUser() loginUser: User,
    @Query('cursor') cursor: string | undefined,
    @Query('pageSize') pageSize: string = '10',
  ) {
    console.log('followers');
    return this.userService.getFollowers(loginUser, cursor, +pageSize);
  }

  @Get(':userId/follow')
  async getFollow(@GetUser() loginUser: User, @Param('userId') userId: string) {
    return this.userService.getFollow(userId, loginUser);
  }

  @ApiTags('Follow')
  @Post(':userId/follow')
  async followUser(
    @GetUser() loginUser: User,
    @Param('userId') userId: string,
  ) {
    return this.userService.followUser(loginUser, userId);
  }

  @ApiTags('Follow')
  @Delete(':userId/follow')
  async unfollowUser(
    @GetUser() loginUser: User,
    @Param('userId') userId: string,
  ) {
    return this.userService.unfollowUser(loginUser, userId);
  }

  @ApiTags('Post')
  @Get(':userId/post')
  findAllPostOfUser(
    @GetUser() loginUser: User,
    @Param('userId') userId: string,
    @Query('cursor') cursor: string | undefined,
    @Query('pageSize') pageSize: string = '10',
  ) {
    return this.userService.findAllPostsByUser(
      userId,
      loginUser,
      cursor,
      +pageSize,
    );
  }

  @Get(':username')
  async getUser(@Param('username') username: string, @GetUser() user: User) {
    console.log(':username');

    return this.userService.getUniqueUsername(username, user);
  }

}
