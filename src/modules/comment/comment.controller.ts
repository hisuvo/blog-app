import { Request, Response } from "express";
import { commentService } from "./comment.service";

const getAllComment = async (req: Request, res: Response) => {
  try {
    const result = await commentService.getAllComment();

    res.status(200).json({
      success: true,
      message: "Comment retrive successfully",
      result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getCommentById = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;

    const result = await commentService.getCommentById({ commentId });

    res.status(200).json({
      success: true,
      message: "Comment retrive successfuly",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getCommentByAuthorId = async (req: Request, res: Response) => {
  try {
    const { authorId } = req.params;

    const result = await commentService.getCommentByAuthorId({ authorId });

    res.status(200).json({
      success: true,
      message: "Author retrive comment successfuly",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const createComment = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const comment = req.body;

    comment.authorId = user?.id;
    const result = await commentService.createComment(comment);

    res.status(200).json({
      success: true,
      message: "Comment retrive successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error,
    });
  }
};

const deleteCommentById = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const { commentId } = req.params;

    console.log(user, commentId);

    const result = await commentService.deleteCommentById(
      user?.id as string,
      commentId as string
    );

    res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const moderateComment = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    const { status } = req.body;

    const result = await commentService.moderateComment(
      commentId as string,
      status
    );

    res.status(200).json({
      success: false,
      message: "Comment status updated successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const commentController = {
  getAllComment,
  getCommentById,
  getCommentByAuthorId,
  createComment,
  deleteCommentById,
  moderateComment,
};
