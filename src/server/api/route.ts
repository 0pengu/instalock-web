import { meRouter } from "@/server/api/@me/route";
import { authRouter } from "@/server/api/auth/route";
import { jwtRouter } from "@/server/api/jwt/route";
import express from "express";

export const apiRouter = express.Router();

apiRouter.get("", (_, res) => {
  return res.status(200).json({ status: true, message: "Hello, world!" });
});

apiRouter.use("/auth", authRouter);
apiRouter.use("/@me", meRouter);
apiRouter.use("/jwt", jwtRouter);
