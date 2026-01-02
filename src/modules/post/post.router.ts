import express from "express";
import { postController } from "./post.controller";
import auth, { UserRole } from "../../middleware/auth";

const router = express.Router();

router.get("/blogs", auth(UserRole.USER), postController.getAllPost);

router.post(
  "/blogs",
  auth(UserRole.USER, UserRole.ADMIN),
  postController.createPost
);

export default router;
