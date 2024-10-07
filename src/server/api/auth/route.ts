import { discord, lucia } from "@/lib/server/auth";
import { generateState } from "arctic";
import { parseCookies, serializeCookie } from "oslo/cookie";
import express from "express";
import { OAuth } from "@/lib/server/types/discord/oauth";
import { db } from "@/lib/server/db/init";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export const authRouter = express.Router();

authRouter.get("/check", async (_, res) => {
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

authRouter.get("/discord", async (_, res) => {
  const state = generateState();
  const url = await discord.createAuthorizationURL(state, {
    scopes: ["identify"],
  });

  res
    .appendHeader(
      "Set-Cookie",
      serializeCookie("discord_oauth_state", state, {
        path: "/",
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 60 * 10,
        sameSite: "lax",
      })
    )
    .redirect(url.toString());
});

authRouter.post("/discord/callback", async (req, res) => {
  if (res.locals.user && res.locals.session) {
    return res.json({
      success: true,
      message: "You are already logged in",
      data: {
        ...res.locals.user,
      },
    });
  }

  const code = req.query.code?.toString() ?? null;
  const state = req.query.state?.toString() ?? null;
  const storedState =
    parseCookies(req.headers.cookie ?? "").get("discord_oauth_state") ?? null;

  if (!code || !state || !storedState || state !== storedState) {
    res.status(400).end();
    return;
  }
  try {
    const tokens = await discord.validateAuthorizationCode(code);
    const response = await fetch("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });
    const user: OAuth = await response.json();

    const existingUser = await db.user.findFirst({
      where: {
        discordId: user.id,
      },
    });

    if (existingUser) {
      const session = await lucia.createSession(existingUser.id, {});
      return res
        .appendHeader(
          "Set-Cookie",
          lucia.createSessionCookie(session.id).serialize()
        )
        .json({
          success: true,
          message: "You have been successfully logged in",
          data: {
            ...existingUser,
          },
        });
    }

    const userId = crypto.randomUUID();
    await db.user.create({
      data: {
        id: userId,
        discordId: user.id,
        username: user.username,
        avatar: user.avatar,
      },
    });

    const session = await lucia.createSession(userId, {});
    return res
      .appendHeader(
        "Set-Cookie",
        lucia.createSessionCookie(session.id).serialize()
      )
      .json({
        success: true,
        message: "You have been successfully logged in",
        data: {
          ...{
            id: userId,
            discordId: user.id,
            username: user.username,
            avatar: user.avatar,
          },
        },
      });
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError && e.code === "P2002") {
      // invalid code
      return res.status(400).json({
        success: false,
        message: "Failed to log in",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Failed to log in",
    });
  }
});

authRouter.post("/logout", async (_, res) => {
  if (!res.locals.session) {
    return res.status(401).json({
      success: false,
      message: "You are not logged in",
    });
  }

  await lucia.invalidateSession(res.locals.session.id);
  return res
    .setHeader("Set-Cookie", lucia.createBlankSessionCookie().serialize())
    .json({
      success: true,
      message: "You have been successfully logged out",
    });
});
