import {
  ForbiddenException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Type,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsType, Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  getPostDataInclude,
  getPostDataOmit,
  postInclude,
} from './entities/post.entity';
import { ca } from 'date-fns/locale';
import e from 'express';
// import prune from 'json-prune';

@Injectable()
export class PostService {
  constructor(private readonly prismaService: PrismaService) {}
  async getBookmarkInfo(id: string, user: User) {
    try {
      const bookmark = await this.prismaService.bookmark.findUnique({
        where: {
          userId_postId: {
            userId: user.id,
            postId: id,
          },
        },
      });

      const data = {
        isBookmarkedByUser: !!bookmark,
      };

      return data;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch bookmark info');
    }
  }
  async bookmark(id: string, user: User) {
    try {
      await this.prismaService.bookmark.upsert({
        where: {
          userId_postId: {
            userId: user.id,
            postId: id,
          },
        },
        create: {
          userId: user.id,
          postId: id,
        },
        update: {},
      });

      return {
        statusCode: 200,
        message: 'Post bookmarked successfully',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to bookmark post', error);
    }
  }
  async unbookmark(id: string, user: User) {
    try {
      await this.prismaService.bookmark.delete({
        where: {
          userId_postId: {
            userId: user.id,
            postId: id,
          },
        },
      });

      return {
        statusCode: 200,
        message: 'Post unbookmarked successfully',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to unbookmark post');
    }
  }

  create(user: User, createPostDto: CreatePostDto) {
    const newPost = this.prismaService.post.create({
      data: {
        author: {
          connect: {
            id: user.id,
          },
        },
        published: true,
        message: {
          create: {
            content: createPostDto.content,
            attachments:
              createPostDto.attachments != undefined
                ? {
                    createMany: {
                      data: createPostDto.attachments.map((attachment) => {
                        return {
                          type: attachment.type,
                          url: attachment.url,
                        };
                      }),
                    },
                  }
                : undefined,
          },
        },
      },
      include: getPostDataInclude(),
      omit: getPostDataOmit(),
    });
    return newPost;
  }

  async findAll(
    user: User,
    cursor: string | undefined,
    pageSize: number,
    postType: PostsType,
  ) {
    try {
      let postWhereInput: Prisma.PostWhereInput = {};

      switch (postType) {
        case PostsType.BOOKMARK:
          postWhereInput = {
            bookmarks: {
              some: {
                userId: user.id,
              },
            },
            published: true,
          };
          break;
        case PostsType.FOLLOWING:
          postWhereInput = {
            author: {
              followers: {
                some: {
                  followerId: user.id,
                },
              },
            },
            published: true,
          };
          break;
        case PostsType.FOR_YOU:
          postWhereInput = {
            published: true,
          };
          break;
        case PostsType.ALL:
          if (!user.roles.includes('ADMIN')) {
            postWhereInput = {
              published: true,
            };
          }
          break;
        default:
          postWhereInput = {
            authorId: user.id,
          };
          break;
      }

      console.log(postWhereInput);

      const posts = await this.prismaService.post.findMany({
        where: { ...postWhereInput },
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
      throw new InternalServerErrorException('Failed to fetch posts');
    }
  }

  async search(
    user: User,
    cursor: string | undefined,
    pageSize: number,
    q: string,
  ) {
    try {
      const searchQuery = q.trim().toLowerCase().split(' ').join('&');

      const posts = await this.prismaService.post.findMany({
        where: {
          OR: [
            {
              message: {
                content: {
                  search: searchQuery,
                },
              },
            },
            {
              author: {
                username: {
                  search: searchQuery,
                },
              },
            },
            {
              author: {
                fullname: {
                  search: searchQuery,
                },
              },
            },
          ],
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
      throw new InternalServerErrorException('Failed to fetch posts');
    }
  }

  findOne(id: string) {
    return this.prismaService.post.findUnique({
      where: {
        id: id,
      },
      include: { ...getPostDataInclude(), comments: true },
      omit: getPostDataOmit(),
    });
  }

  async update(id: string, updatePostDto: UpdatePostDto, user: User) {
    const post = await this.prismaService.post.findUnique({
      where: {
        id: id,
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.authorId !== user.id) {
      throw new ForbiddenException('You are not allowed to update this post');
    }

    const updatedPost = await this.prismaService.post.update({
      data: {
        message: {
          update: {
            content: updatePostDto.content,
            attachments: {
              createMany: {
                data: updatePostDto.attachments.map((attachment) => {
                  return {
                    type: attachment.type,
                    url: attachment.url,
                  };
                }),
              },
            },
          },
        },
        published: updatePostDto.published,
      },
      where: {
        id: id,
      },
    });

    return updatedPost;
  }

  async remove(id: string, user: User) {
    const post = await this.prismaService.post.findUnique({
      where: {
        id: id,
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.authorId !== user.id) {
      throw new ForbiddenException('You are not allowed to delete this post');
    }

    let deletedPost = post;

    const message = await this.prismaService.message.findUnique({
      where: {
        id: post.messageId,
        posts: {
          some: {
            id: id,
          },
        },
      },
    });

    if (!message) {
      deletedPost = await this.prismaService.post.delete({
        where: {
          id: id,
        },
      });
      return deletedPost;
    }

    deletedPost = (
      await this.prismaService.message.delete({
        where: {
          id: post.messageId,
        },
        include: {
          posts: {
            where: {
              id: id,
            },
          },
        },
      })
    ).posts[0];

    return deletedPost;
  }

  async getTrendingTags() {
    try {
      const result = await this.prismaService.$queryRaw<
        { hashtag: string; count: bigint }[]
      >`
            SELECT LOWER(unnest(regexp_matches(message.content, '#[[:alnum:]_]+', 'g'))) AS hashtag, COUNT(*) AS count
            FROM "posts"
            JOIN "messages" AS message ON "posts"."messageId" = message.id
            GROUP BY (hashtag)
            ORDER BY count DESC, hashtag ASC
            LIMIT 5
        `;
      console.log(result);
      return result.map((row) => ({
        hashtag: row.hashtag,
        count: Number(row.count),
      }));
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to fetch trending tags',
        error,
      );
    }
  }
}
