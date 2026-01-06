import express from "express";
import { commentController } from "./comment.controller";
import auth, { UserRole } from "../../middleware/auth";

const router = express.Router();

router.get("/comment", commentController.getAllComment);
router.post(
  "/comment",
  auth(UserRole.USER, UserRole.ADMIN),
  commentController.createComment
);

export const commentRouter = router;
