import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Type,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  getPostDataInclude,
  getPostDataOmit,
  postInclude,
  PostType,
} from './entities/post.entity';
// import prune from 'json-prune';

@Injectable()
export class PostService {
  constructor(private readonly prismaService: PrismaService) {}

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
    postType: PostType,
  ) {
    try {
      let postWhereInput: Prisma.PostWhereInput = {};

      switch (postType) {
        case PostType.BOOKMARK:
          postWhereInput = {
            bookmarks: {
              some: {
                userId: user.id,
              },
            },
            published: true,
          };
        case PostType.FOR_YOU:
          postWhereInput = {
            published: true,
          };
        case PostType.ALL:
          if (!user.roles.includes('ADMIN')) {
            postWhereInput = {
              published: true,
            };
          }
        default:
          postWhereInput = {
            authorId: user.id,
          };
      }

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
}
