import { Prisma } from "@prisma/client";
export const notificationsInclude = {
  issuer:{
    select: {
      username: true,
      fullname: true,
      avatarUrl: true,
    },
  },
  post: {
    select: {
      id: true,
      message: {
        select: {
          id: true,
          content: true,
          _count: {
            select: {
              attachments: true,
            }
          }
        }
      }
    },
  },
} satisfies Prisma.NotificationInclude;

export type NotificationData = Prisma.NotificationGetPayload<{
  include: typeof notificationsInclude;
}>;

export interface NotificationPage {
  notifications: NotificationData[],
  nextCursor: string | null,
}

export interface NotificationUnreadCount {
  unreadCount: number;
}