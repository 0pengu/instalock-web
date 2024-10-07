import express from "express";

export const meRouter = express.Router();

meRouter.get("/", (_, res) => {
  if (!res.locals.user) {
    return res.status(401).json({
      success: false,
      message: "You are not logged in",
    });
  }

  return res.json({
    success: true,
    message: "You are logged in",
    data: {
      ...res.locals.user,
    },
  });
});
