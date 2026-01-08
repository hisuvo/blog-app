import express from "express";
import { postController } from "./post.controller";
import auth, { UserRole } from "../../middleware/auth";

const router = express.Router();

router.get("/", auth(UserRole.USER, UserRole.ADMIN), postController.getAllPost);

router.get("/stats", auth(UserRole.ADMIN), postController.postStats);

router.get(
  "/myPost",
  auth(UserRole.USER, UserRole.ADMIN),
  postController.getMyPost
);

router.get(
  "/:postId",
  auth(UserRole.USER, UserRole.ADMIN),
  postController.getPostById
);

router.post(
  "/",
  auth(UserRole.USER, UserRole.ADMIN),
  postController.createPost
);

router.patch(
  "/:postId",
  auth(UserRole.USER, UserRole.ADMIN),
  postController.updatePost
);

router.delete(
  "/:postId",
  auth(UserRole.USER, UserRole.ADMIN),
  postController.deletePost
);

export default router;
