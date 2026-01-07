import express from "express";
import { commentController } from "./comment.controller";
import auth, { UserRole } from "../../middleware/auth";

const router = express.Router();

router.get("/", auth(UserRole.USER), commentController.getAllComment);

router.get(
  "/:commentId",
  auth(UserRole.USER, UserRole.ADMIN),
  commentController.getCommentById
);

router.get(
  "/author/:authorId",
  auth(UserRole.USER, UserRole.ADMIN),
  commentController.getCommentByAuthorId
);

router.post(
  "/",
  auth(UserRole.USER, UserRole.ADMIN),
  commentController.createComment
);

router.delete(
  "/:commentId",
  auth(UserRole.USER, UserRole.ADMIN),
  commentController.deleteCommentById
);

router.patch(
  "/:commentId/moderate",
  auth(UserRole.ADMIN),
  commentController.moderateComment
);

router.patch(
  "/:commentId",
  auth(UserRole.USER, UserRole.ADMIN),
  commentController.updateComment
);

export const commentRouter = router;
