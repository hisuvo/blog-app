import express from "express";
import { postController } from "./post.controller";
import auth, { UserRole } from "../../middleware/auth";

const router = express.Router();

router.post(
  "/bolgs",
  auth(UserRole.USER, UserRole.ADMIN),
  postController.createPost
);

export default router;
