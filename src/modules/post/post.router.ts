import express from "express";
import { postController } from "./post.controller";

const router = express.Router();

router.post("/blogs", postController.createPost);

export default router;
