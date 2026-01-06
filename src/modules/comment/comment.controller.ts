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
export const commentController = {
  getAllComment,
  createComment,
};
