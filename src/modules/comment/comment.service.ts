import { CommentStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const getAllComment = async () => {
  const result = await prisma.comment.findMany({
    where: {
      parentId: null,
      status: CommentStatus.APPROVE,
    },

    orderBy: {
      createdAt: "asc",
    },

    include: {
      replies: {
        include: {
          replies: true,
        },
      },
    },
  });

  const totalComment = await prisma.comment.count();
  return {
    data: result,
    total: totalComment,
  };
};

const createComment = async (payload: {
  content: string;
  postId: string;
  authorId: string;
  parentId?: string;
}) => {
  await prisma.post.findUniqueOrThrow({
    where: {
      id: payload.postId,
    },
  });

  if (payload.parentId) {
    await prisma.comment.findUniqueOrThrow({
      where: {
        id: payload.parentId,
      },
    });
  }

  const result = await prisma.comment.create({
    data: payload,
  });

  return result;
};

export const commentService = {
  getAllComment,
  createComment,
};
