import { Get, Injectable, NotFoundException, UseGuards } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { VerifyEmailGuard } from 'src/verification/guards/verify-email/verify-email.guard';
import { JwtAccessGuard } from 'src/auth/guards/jwt-access/jwt-access.guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { getMinnimalUserDataSelect } from 'src/users/entities/user.entities';

@UseGuards(JwtAccessGuard, VerifyEmailGuard)
@Injectable()
export class CommentService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(user: User, postId: string, createCommentDto: CreateCommentDto) {
    // return 'This action adds a new comment';

    const post = await this.prismaService.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.published === false && post.authorId !== user.id) {
      throw new NotFoundException('Post not found');
    }

    return this.prismaService.comment.create({
      data: {
        author: {
          connect: {
            id: user.id,
          },
        },
        post: {
          connect: {
            id: postId,
          },
        },
        message: {
          create: {
            content: createCommentDto.content,
            attachments: createCommentDto.attachments && {
              createMany: {
                data: createCommentDto.attachments.map((attachment) => {
                  return {
                    type: attachment.type,
                    url: attachment.url,
                  };
                }),
              },
            },
          },
        },
        published: createCommentDto.published,
      },
      include: {
        message: {
          include: {
            attachments: true,
          },
        },
        author: {
          select: getMinnimalUserDataSelect(),
        },
        _count: {
          select: {
            reaction: true,
            replyComments: true,
          },
        },
      },
    });
  }

  async findAll(
    user: User,
    postId: string,
    cursor: string | undefined,
    size: string = '10',
    query: Record<string, any> | any,
  ) {
    // return `This action returns all comment`;
    const pageSize = +size || 10;

    if (postId === undefined) {
      throw new NotFoundException('Post not found');
    }

    const post = await this.prismaService.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.published === false && post.authorId !== user.id) {
      throw new NotFoundException('Post not found');
    }

    const comments = await this.prismaService.comment.findMany({
      where: {
        OR: [
          {
            post: {
              id: postId,
            },
            published: true,
          },
          {
            post: {
              id: postId,
            },
            published: false,
            authorId: user.id,
          },
        ],
      },
      include: {
        message: {
          include: {
            attachments: true,
          },
        },
        author: {
          select: getMinnimalUserDataSelect(),
        },
        _count: {
          select: {
            reaction: true,
            replyComments: true,
          },
        },
      },
    });

    const nextCursor =
      comments.length > pageSize ? comments[comments.length - 1].id : undefined;

    const data = {
      comments: comments.slice(0, pageSize),
      nextCursor,
    };

    return data;
  }

  findOne(user: User, postId: string, id: string) {
    return `This action returns a #${id} comment`;
  }

  update(
    user: User,
    postId: string,
    id: string,
    updateCommentDto: UpdateCommentDto,
  ) {
    return `This action updates a #${id} comment`;
  }

  remove(user: User, postId: string, id: string) {
    return `This action removes a #${id} comment`;
  }
}
