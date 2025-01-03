import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Prisma, Role, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationData, NotificationPage, notificationsInclude, NotificationUnreadCount } from './entities/notification.entity';

@Injectable()
export class NotificationService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createNotificationDto: CreateNotificationDto) {
    return 'This action adds a new notification';
  }

  async findAll(
    user: User,
    pageSize: number,
    cursor: string | undefined,
    query: Record<string, any> | any,
  ): Promise<NotificationPage> {
    try {
      let notificationsQuery = {};

      if (!user.roles.includes(Role.ADMIN)) {
        notificationsQuery = {
          where: {
            recipientId: user.id,
          },
        } satisfies Prisma.NotificationFindManyArgs;
      }
      const notifications = await this.prismaService.notification.findMany({
        ...notificationsQuery,
        orderBy: { createdAt: 'desc' },
        take: pageSize + 1,
        cursor: cursor ? { id: cursor } : undefined,
        include: notificationsInclude,
      });

      const nextCursor =
        notifications.length > pageSize ? notifications[pageSize].id : null;

      const data: NotificationPage = {
        notifications: notifications.slice(0, pageSize),
        nextCursor,
      };

      return data;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error occured while fetching notifications',
      );
    }
  }

  async getUnreadCount(user: User): Promise<NotificationUnreadCount> {
    try {
      let notificationsQuery = {};

      if (!user.roles.includes(Role.ADMIN)) {
        notificationsQuery = {
          where: {
            recipientId: user.id,
          },
        } satisfies Prisma.NotificationFindManyArgs;
      }

      const unreadCount = await this.prismaService.notification.count({
        ...notificationsQuery,
        where: {
          read: false,
        },
      });

      const data: NotificationUnreadCount = {
        unreadCount,
      };

      return data;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error occured while fetching unread notifications',
      );
    }
  }

  async markAsRead(user: User) {
    try {
      let notificationUpdateWhereQuery = {
        recipientId: undefined,
      } satisfies Prisma.NotificationWhereInput;

      if (!user.roles.includes(Role.ADMIN)) {
        notificationUpdateWhereQuery.recipientId = user.id;
      }

      await this.prismaService.notification.updateMany({
        where: notificationUpdateWhereQuery,
        data: {
          read: true,
        },
      });

      return { message: 'Notifications marked as read' };
    } catch (error) {
      throw new InternalServerErrorException(
        'Error occured while updating notification',
      );
    }
  }

  findOne(id: string) {
    return `This action returns a #${id} notification`;
  }

  update(id: string, updateNotificationDto: UpdateNotificationDto) {
    return `This action updates a #${id} notification`;
  }

  remove(id: string) {
    return `This action removes a #${id} notification`;
  }
}
