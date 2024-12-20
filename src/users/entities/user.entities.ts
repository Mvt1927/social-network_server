import { Prisma } from '@prisma/client';

export function getMinnimalUserDataSelect() {
  return {
    id: true,
    username: true,
    fullname: true,
    avatarUrl: true,
    bio: true,
    createAt: true,
    isVerified: true,
    followers: {
      select: {
        followingId: true,
      },
    },

    _count: {
      select: {
        posts: true,
        followers: true,
        following: true,
      },
    },
  } satisfies Prisma.UserSelect;
}

export function getProfileUserDataSelect() {
  return {
    id: true,
    username: true,
    fullname: true,
    avatarUrl: true,
    bio: true,
    createAt: true,
    isVerified: true,
    followers: {
      select: {
        followingId: true,
      },
    },
    following: {
      select: {
        followerId: true,
      },
    },
    userFriends: {
      where: {
        status: true,
      },
      select: {
        friend_id: true,
      },
    },

    friendUserFriends: {
      where: {
        status: true,
      },
      select: {
        user_id: true,
      },
    },
    _count: {
      select: {
        posts: true,
        followers: true,
        following: true,
        friendUserFriends: {
          where: {
            status: true,
          },
        },
        userFriends: {
          where: {
            status: true,
          },
        },
      },
    },
  } satisfies Prisma.UserSelect;
}
