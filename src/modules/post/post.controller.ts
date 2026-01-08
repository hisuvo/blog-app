import { Request, Response } from "express";
import { postService } from "./post.service";
import { PostStatus } from "../../../generated/prisma/enums";
import paginationSortingHelper from "../../helper/paginationSortingHelper";
import { success } from "better-auth/*";
import { UserRole } from "../../middleware/auth";

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

    // const page = Number(req.query.page ?? 1);
    // const limit = Number(req.query.limit ?? 10);
    // const skip = (page - 1) * limit;

    // const sortBy = req.query.sortBy as string | undefined;
    // const orderBy = req.query.orderBy as string | undefined;

    const { page, limit, skip, sortBy, orderBy } =
      await paginationSortingHelper(req.query);

    const blogs = await postService.getAllPost({
      search: searchString,
      tags,
      isFeatured,
      status,
      page,
      limit,
      skip,
      sortBy,
      orderBy,
    });

    res.status(200).json({
      success: true,
      message: "Blogs retrived succssfully",
      blogs,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getPostById = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const result = await postService.getPostById({ postId });

    res.status(200).json({
      success: true,
      message: "Post retrived successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getMyPost = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      throw new Error("You are unauthorized");
    }

    const result = await postService.getMyPost(user?.id as string);

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error,
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

const updatePost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const user = req.user;

    if (!user) {
      throw new Error("You are Unanthorized!");
    }

    const isAdmin = user.role === UserRole.ADMIN;

    console.log(isAdmin);

    const result = await postService.updatePost(
      postId as string,
      req.body,
      user?.id as string,
      isAdmin as boolean
    );

    res.status(201).json({
      success: true,
      message: "post updated successfully",
      data: result,
    });
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
  getPostById,
  getMyPost,
  updatePost,
};
