import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationType, Prisma, User } from '@prisma/client';
import { UserWithoutHiddenAttributes } from './types';
import { getMinnimalUserDataSelect } from './entities/user.entities';
import { getPostDataOmit, postInclude } from 'src/post/entities/post.entity';
import { stat } from 'fs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findUnique(args: Prisma.UserFindUniqueArgs): Promise<User | null> {
    return this.prisma.user.findUnique(args);
  }

  async findOneWithEmail(
    email: string,
    options?: {
      select?: Prisma.UserSelect;
      omit?: Prisma.UserOmit;
    },
  ): Promise<User | null> {
    return this.findUnique({
      where: {
        email: email.trim().toLowerCase(),
      },
      select: options.select,
      omit: options.omit,
    });
  }

  async findOneWithUsername(
    username: string,
    options?: {
      select?: Prisma.UserSelect;

      omit?: Prisma.UserOmit;
    },
  ): Promise<User | null> {
    return this.findUnique({
      where: {
        username: username.trim().toLowerCase(),
      },
      select: options?.select,
      omit: options?.omit,
    });
  }

  async findOneWithId(
    id: string,
    select?: Prisma.UserSelect,
    omit?: Prisma.UserOmit,
  ): Promise<User | null> {
    return this.findUnique({
      where: {
        id: id,
      },
      select: select,
      omit: omit,
    });
  }

  async getFollowers(loginUser: User, cursor: string | null, pageSize: number) {
    try {
      const followers = await this.prisma.user.findMany({
        where: {
          following: {
            some: {
              followingId: loginUser.id,
            },
          },
        },
        select: getMinnimalUserDataSelect(),
        cursor: cursor
          ? {
              id: cursor,
            }
          : undefined,

        take: pageSize + 1,
      });

      const nextCursor =
        followers.length > pageSize
          ? followers[followers.length - 1].id
          : null;

      const data = {
        followers: followers.slice(0, pageSize),
        nextCursor,
      };

      return data;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch followers');
    }
  }

  async followUser(loginUser: User, userId: string) {
    try {
      if (loginUser.id === userId) {
        throw new NotFoundException('You cannot follow yourself');
      }

      await this.prisma.$transaction([
        this.prisma.follow.upsert({
          where: {
            followerId_followingId: {
              followerId: loginUser.id,
              followingId: userId,
            },
          },
          create: {
            followerId: loginUser.id,
            followingId: userId,
          },
          update: {},
        }),
        this.prisma.notification.createMany({
          data: [
            {
              issuerId: loginUser.id,
              recipientId: userId,
              type: NotificationType.FOLLOW,
            },
          ],
        }),
      ]);
      return {
        statusCode: 200,
        message: 'Followed user',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to follow user');
    }
  }

  async unfollowUser(loginUser: User, userId: string) {
    try {
      await this.prisma.$transaction([
        this.prisma.follow.delete({
          where: {
            followerId_followingId: {
              followerId: loginUser.id,
              followingId: userId,
            },
          },
        }),
        this.prisma.notification.deleteMany({
          where: {
            issuerId: loginUser.id,
            recipientId: userId,
            type: NotificationType.FOLLOW,
          },
        }),
      ]);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to unfollow user');
    }
  }

  async getFollow(userId: string, loginUser: User) {
    try {
      const users = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          followers: {
            where: {
              followerId: loginUser.id,
            },
            select: {
              follower: true,
            },
          },
          _count: {
            select: {
              followers: true,
              following: true,
            },
          },
        },
      });

      if (!users) {
        throw new NotFoundException('User not found');
      }

      const data = {
        followers: users._count.followers,
        following: users._count.following,
        isFollowedByUser: !!users.followers.length,
      };

      return data;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch followers');
    }
  }

  async findMany(
    args?: Prisma.UserFindManyArgs,
  ): Promise<UserWithoutHiddenAttributes[]> {
    return this.prisma.user.findMany(args);
  }

  async create(args: Prisma.UserCreateArgs): Promise<User> {
    return this.prisma.user.create(args);
  }

  async update(args: Prisma.UserUpdateArgs): Promise<User> {
    return this.prisma.user.update(args);
  }

  async remove(args: Prisma.UserDeleteArgs): Promise<User> {
    return this.prisma.user.delete(args);
  }

  formatUsername(value: string): string {
    return value.trim().toLowerCase();
  }

  formatEmail(value: string): string {
    return value.trim().toLowerCase();
  }

  async getUniqueUsername(username: string, loginUser: User) {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          username: {
            equals: username,
            mode: 'insensitive',
          },
        },
        select: getMinnimalUserDataSelect(),
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return user;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Something went wrong',
        error.message,
      );
    }
  }

  async findAllPostsByUser(
    userId: string,
    loginUser: User,
    cursor: string | null,
    pageSize: number,
  ) {
    try {
      const posts = await this.prisma.post.findMany({
        where: {
          authorId: userId,
          published: loginUser.id === userId ? undefined : true,
        },
        include: postInclude,
        orderBy: { createAt: 'desc' },
        omit: getPostDataOmit(),
        cursor: cursor ? { id: cursor } : undefined,
        take: pageSize + 1,
      });

      const nextCursor =
        posts.length > pageSize ? posts[posts.length - 1].id : null;

      const data = {
        posts: posts.slice(0, pageSize),
        nextCursor,
      };
      return data;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch posts');
    }
  }

  async getUsersToFollow(user: User) {
    try {
      const users = await this.prisma.user.findMany({
        where: {
          NOT: {
            id: user.id,
          },
        },
        select: getMinnimalUserDataSelect(),
        take: 5,
      });

      return users;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch users to follow');
    }
  }
}
