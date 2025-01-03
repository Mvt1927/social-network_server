import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateReactionDto } from './dto/create-reaction.dto';
import { UpdateReactionDto } from './dto/update-reaction.dto';
import { NotificationType, ReactionType, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ReactionData } from './entities/reaction.entity';
import { log } from 'console';

@Injectable()
export class PostReactionService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    user: User,
    postId: string,
    createReactionDto: CreateReactionDto,
  ) {
    try {
      const post = await this.prismaService.post.findUnique({
        where: {
          id: postId,
        },
        select: {
          authorId: true,
          published: true,
        },
      });

      if (!post || (!post.published && post.authorId !== user.id)) {
        throw new NotFoundException('Post not found');
      }

      const [reaction] = await this.prismaService.$transaction([
        this.prismaService.reaction.upsert({
          where: {
            authorId_postId: {
              postId,
              authorId: user.id,
            },
          },
          create: {
            authorId: user.id,
            postId,
            type: createReactionDto.type || ReactionType.LIKE,
          },
          update: {
            type: createReactionDto.type || ReactionType.LIKE,
          },
        }),
        ...(user.id !== post.authorId
          ? [
              this.prismaService.notification.create({
                data: {
                  issuerId: user.id,
                  recipientId: post.authorId,
                  postId,
                  type: NotificationType.REACTION,
                },
              }),
            ]
          : []),
      ]);
      return reaction;
    } catch (error) {
      throw new InternalServerErrorException('Error while creating reaction');
    }
  }

  async findAll(user: User, postId: string) {
    try {
      const post = await this.prismaService.post.findUnique({
        where: {
          id: postId,
        },
        select: {
          reaction: {
            where: {
              authorId: user.id,
            },
            select: {
              id: true,
              type: true,
              authorId: true,
            },
          },
          published: true,
          authorId: true,
          _count: {
            select: {
              reaction: true,
            },
          },
        },
      });

      if (!post || (!post.published && post.authorId !== user.id)) {
        throw new NotFoundException('Post not found');
      }

      const data: ReactionData = {
        reaction: post._count.reaction,
        userReactionType: post.reaction.length ? post.reaction[0].type : null,
      };

      return data;
    } catch (error) {
      throw new InternalServerErrorException('Error while fetching reactions');
    }
  }

  findOne(id: string) {
    return `This action returns a #${id} reaction`;
  }

  update(id: string, updateReactionDto: UpdateReactionDto) {
    return `This action updates a #${id} reaction`;
  }

  async remove(user: User, postId: string) {
    try {
      const post = await this.prismaService.post.findUnique({
        where: {
          id: postId,
        },
        select: {
          authorId: true,
          published: true,
        },
      });

      console.log('post', post);
      if (!post || (!post.published && post.authorId !== user.id)) {
        throw new NotFoundException('Post not found');
      }

      const [reaction] = await this.prismaService.$transaction([
        this.prismaService.reaction.delete({
          where: {
            authorId_postId: {
              postId,
              authorId: user.id,
            },
          },
        }),
        this.prismaService.notification.deleteMany({
          where: {
            issuerId: user.id,
            recipientId: post.authorId,
            postId,
            type: NotificationType.REACTION,
          },
        }),
      ]);
      return reaction;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error while deleting reaction');
    }
  }
}
