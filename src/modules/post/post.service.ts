import { Post, PostStatus } from "../../../generated/prisma/client";
import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";

const getAllPost = async (payload: {
  search?: string;
  tags: string[] | [];
  isFeatured: boolean | undefined;
  status: PostStatus;
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  orderBy: string;
}) => {
  const andCondition: PostWhereInput[] = [];

  if (payload.search) {
    andCondition.push({
      OR: [
        {
          title: {
            contains: payload.search as string,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: payload.search as string,
            mode: "insensitive",
          },
        },
        {
          tags: {
            has: "GO",
          },
        },
      ],
    });
  }

  if (payload.tags.length > 0) {
    andCondition.push({
      tags: {
        hasEvery: payload.tags,
      },
    });
  }

  if (payload.isFeatured !== undefined) {
    andCondition.push({
      isFeatured: payload.isFeatured,
    });
  }

  if (payload.status) {
    andCondition.push({
      status: payload.status,
    });
  }

  const allPost = await prisma.post.findMany({
    take: payload.limit,
    skip: payload.skip,
    where: {
      AND: andCondition,
    },

    orderBy: {
      [payload.sortBy]: payload.orderBy,
    },
  });

  const total: number = await prisma.post.count({
    where: {
      AND: andCondition,
    },
  });

  return {
    data: allPost,
    totalPost: total,
    page: payload.page,
    limit: payload.limit,
    totalPages: Math.ceil(total / payload.limit),
  };
};

const getPostById = async (payload: { postId?: string }) => {
  const result = await prisma.$transaction(async (tx) => {
    const post = await tx.post.findFirst({
      where: {
        id: payload.postId,
      },
    });

    await tx.post.updateMany({
      data: {
        views: {
          increment: 1,
        },
      },
    });

    return post;
  });

  return result;

  /* transaction withour find and update views */

  // const result = await prisma.post.findFirst({
  //   where: {
  //     id: payload.postId,
  //   },
  // });

  // await prisma.post.updateMany({
  //   data: {
  //     views: {
  //       increment: 1,
  //     },
  //   },
  // });
  // return result;
};

const createPost = async (
  data: Omit<Post, "id" | "createdAt" | "updatedAt" | "authorId">,
  userId: string
) => {
  const result = await prisma.post.create({
    data: { ...data, authorId: userId },
  });

  return result;
};

export const postService = {
  createPost,
  getAllPost,
  getPostById,
};
