import express from "express";
import postRouter from "./modules/post/post.router";
import cors from "cors";
import { auth } from "./lib/auth";
import { toNodeHandler } from "better-auth/node";
import { commentRouter } from "./modules/comment/comment.router";

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true, // Cookies / Authentication token / Session data allow
  })
);

app.use(express.json());
app.all("/api/auth/*splat", toNodeHandler(auth));

app.use("/api/v1", postRouter);
app.use("/api/v1/comment", commentRouter);

export default app;
