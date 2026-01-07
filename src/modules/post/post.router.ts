import express from "express";
import { postController } from "./post.controller";
import auth, { UserRole } from "../../middleware/auth";

const router = express.Router();

router.get("/", auth(UserRole.USER), postController.getAllPost);

router.get("/myPost", auth(UserRole.USER), postController.getMyPost);

router.get("/:postId", postController.getPostById);

router.post(
  "/",
  auth(UserRole.USER, UserRole.ADMIN),
  postController.createPost
);

export default router;
