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

const getCommentById = async (payload: { commentId: string }) => {
  return await prisma.comment.findUnique({
    where: {
      id: payload.commentId,
    },
    include: {
      post: {
        select: {
          id: true,
          title: true,
          views: true,
        },
      },
    },
  });
};

const getCommentByAuthorId = async (payload: { authorId: string }) => {
  return await prisma.comment.findMany({
    where: {
      authorId: payload.authorId,
    },
    orderBy: {
      createdAt: "desc",
    },

    include: {
      post: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });
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

const deleteCommentById = async (userId: string, authorId: string) => {
  console.log({ userId, authorId });
};

const moderateComment = async (commentId: string, status: CommentStatus) => {
  const commentData = await prisma.comment.findUniqueOrThrow({
    where: {
      id: commentId,
    },
    select: {
      id: true,
      status: true,
    },
  });

  if (commentData.status === status) {
    throw new Error(`Already your comment status ${status}`);
  }

  return await prisma.comment.update({
    where: {
      id: commentId,
    },
    data: {
      status,
    },
  });
};

export const commentService = {
  getAllComment,
  getCommentById,
  getCommentByAuthorId,
  createComment,
  deleteCommentById,
  moderateComment,
};
