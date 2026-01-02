import { Request, Response } from "express";
import { postService } from "./post.service";
import { boolean } from "better-auth/*";
import { PostStatus } from "../../../generated/prisma/enums";

const getAllPost = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    const searchString = typeof search === "string" ? search : undefined;

    const tags = req.query.tags ? (req.query.tags as string).split(",") : [];

    const isFeatured = req.query.isFeatured
      ? req.query.isFeatured === "true"
        ? true
        : req.query.isFeatured === "false"
        ? false
        : undefined
      : undefined;

    const status = req.query.status as PostStatus;

    const blogs = await postService.getAllPost({
      search: searchString,
      tags,
      isFeatured,
      status,
    });

    res.status(200).json({
      success: true,
      message: "Blogs retrived succssfully",
      data: blogs,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const createPost = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Unauthorized",
      });
    }
    const result = await postService.createPost(req.body, user.id);

    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const postController = {
  createPost,
  getAllPost,
};
