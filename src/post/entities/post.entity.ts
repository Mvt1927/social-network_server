import { Prisma } from '@prisma/client';
import { getMinnimalUserDataSelect } from 'src/users/entities/user.entities';

export function getPostDataInclude() {
  return {
    author: {
      select: getMinnimalUserDataSelect(),
    },
    message: {
      include: {
        attachments: true,
      },
    },
    reaction: {
      select: {
        authorId: true,
      },
    },
    bookmarks: {
      select: {
        userId: true,
      },
    },
    _count: {
      select: {
        reaction: true,
        comments: true,
      },
    },
  } satisfies Prisma.PostInclude;
}

export function getPostDataOmit() {
  return {
    authorId: true,
    messageId: true,
  } satisfies Prisma.PostOmit;
}

