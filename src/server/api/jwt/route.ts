import { db } from "@/lib/server/db/init";
import { randomUUID } from "crypto";
import express from "express";
import jwt from "jsonwebtoken";

export const jwtRouter = express.Router();

jwtRouter.get("", async (_, res) => {
  try {
    if (!res.locals.user || !res.locals.session) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = res.locals.user;

    const apiKeys = await db.apiKey.findMany({
      where: {
        userId: user.id,
      },
    });

    return res.json({
      success: true,
      data: apiKeys,
      message: "Success",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
});

jwtRouter.post("", async (_, res) => {
  try {
    if (!res.locals.user || !res.locals.session) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = res.locals.user;

    const token = jwt.sign(
      { userId: user.id },
      process.env.SECRET_KEY as string,
      { expiresIn: 60 * 60 * 24 * 365 /* 1 year */ }
    );

    await db.apiKey.create({
      data: {
        id: randomUUID(),
        key: token,
        expiresAt: new Date(Date.now() + 60 * 60 * 24 * 365 * 1000), // 1 year
        userId: user.id,
      },
    });

    return res.json({
      succes: true,
      token,
      message: "Token created successfully",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
});

jwtRouter.get("/check", async (req, res) => {
  try {
    // if (!res.locals.user || !res.locals.session) {
    //   return res.status(401).json({ message: "Unauthorized" });
    // }

    const token = req.query.jwt as string;

    const apiKey = await db.apiKey.findFirst({
      where: {
        key: token,
      },
    });

    if (!apiKey) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (apiKey.expiresAt < new Date()) {
      return res.status(402).json({ message: "Unauthorized" });
    }

    if (apiKey.activated) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await db.apiKey.update({
      where: {
        id: apiKey.id,
      },
      data: {
        activated: true,
      },
    });

    return res.json({
      success: true,
      message: "Token is valid",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
});

jwtRouter.get("/length", async (_, res) => {
  if (!res.locals.user || !res.locals.session) {
    return res.status(401).json({ message: "Unauthorized", success: false });
  }

  const count = await db.apiKey.count({
    where: {
      userId: res.locals.user.id,
    },
  });

  return res.json({ success: true, data: count, message: "Success" });
});
