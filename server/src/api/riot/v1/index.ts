import {
  EntitlementApiType,
  RiotMatchInfoType,
  RiotUserInfoType,
} from "@/lib/autogenerated/riot";
import { db } from "@/lib/db";
import {
  getAllMatchesByUserId,
  getAllMatchesByUserIdShallow,
} from "@/lib/db/function/matches";
import {
  findUserById,
  removeUserRiotCredentials,
  saveUserRiotCredentials,
} from "@/lib/db/function/user";
import { sendSuperJson } from "@/lib/superjson-sender";
import { attempt } from "@instalock/attempt";
import {
  authModalSchema,
  getGameModeName,
  Prisma,
  ShallowMatch,
  ShallowMatchExclude,
  TierNumber,
  tierNumberToNameObject,
} from "@instalock/types";
import { Router } from "express";
import { writeFile } from "fs/promises";

export const riotRouterV1 = Router();

riotRouterV1.get("/@me", async (req, res) => {
  if (!res.locals.user || !res.locals.session) {
    return sendSuperJson(req, res, 401, {
      success: false,
      message: "You are not logged in.",
    });
  }

  const [userError, user] = await attempt(
    findUserById({ id: res.locals.user.id })
  );

  if (userError || !user) {
    return sendSuperJson(
      req,
      res,
      500,
      {
        success: false,
        message: "Internal server error.",
      },
      {
        message: "This should not be happening. Check data object.",
        data: { error: userError, user },
      }
    );
  }

  const { riotAuth, riotEntitlement } = user;

  if (!riotAuth || !riotEntitlement) {
    return sendSuperJson(req, res, 400, {
      success: false,
      message: "Not authenticated.",
    });
  }

  const riotRes = await fetch("https://auth.riotgames.com/userinfo", {
    headers: {
      Authorization: `Bearer ${riotAuth}`,
      "User-Agent": "ShooterGame/13 Windows/10.0.19043.1.256.64bit",
      "X-Riot-ClientVersion": "release-08.07-shipping-9-2444158",
    },
  });

  if (!riotRes.ok) {
    return sendSuperJson(req, res, 400, {
      success: false,
      message: "Not authenticated.",
    });
  }

  return sendSuperJson(req, res, 200, {
    success: true,
    message: "Authenticated.",
    data: { authToken: riotAuth, entitlement: riotEntitlement },
  });
});

riotRouterV1.post("/auth", async (req, res) => {
  if (!res.locals.user || !res.locals.session) {
    return sendSuperJson(req, res, 401, {
      success: false,
      message: "You are not logged in.",
    });
  }

  const parser = await authModalSchema.safeParseAsync(req.body);

  if (!parser.success) {
    return sendSuperJson(
      req,
      res,
      400,
      {
        success: false,
        message: "Request body is malformed/improper.",
      },
      {
        message: "Parser failed.",
        error: parser.error,
      }
    );
  }

  const { url } = parser.data;

  const authToken = (() => {
    try {
      const urlObject = new URL(url);
      const params = new URLSearchParams(urlObject.hash.substring(1));
      return params.get("access_token");
    } catch {
      return null;
    }
  })();

  if (!authToken) {
    return sendSuperJson(
      req,
      res,
      400,
      {
        success: false,
        message:
          "URL cannot be parsed to find the access_token. If this issue keeps ocurring, please contact tahmidd on Discord.",
      },
      {
        message: "Cannot receive access_token",
        data: { authToken },
      }
    );
  }

  const riotRes = await fetch(
    "https://entitlements.auth.riotgames.com/api/token/v1",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  const riotJson = (await riotRes.json()) as EntitlementApiType;

  if (riotJson.errorCode !== undefined) {
    return sendSuperJson(
      req,
      res,
      400,
      {
        message: "Failed to authenticate.",
        success: false,
      },
      {
        message: "Riot Api issue.",
        data: riotJson,
      }
    );
  }

  const { entitlements_token: entitlementToken } = riotJson;

  const riotUserInfoRes = await fetch("https://auth.riotgames.com/userinfo", {
    headers: {
      Authorization: `Bearer ${authToken}`,
      "User-Agent": "ShooterGame/13 Windows/10.0.19043.1.256.64bit",
      "X-Riot-ClientVersion": "release-08.07-shipping-9-2444158",
    },
  });

  if (!riotUserInfoRes.ok) {
    return sendSuperJson(
      req,
      res,
      500,
      {
        success: false,
        message: "Internal server error.",
      },
      {
        message: "Failed to retrieve user info from Riot API.",
        data: { statusCode: riotUserInfoRes.status },
      }
    );
  }

  const riotUserInfoJson = (await riotUserInfoRes.json()) as RiotUserInfoType;

  if (riotUserInfoJson.error !== undefined) {
    return sendSuperJson(
      req,
      res,
      500,
      {
        success: false,
        message: "Internal server error.",
      },
      {
        message: "Failed to retrieve user info from Riot API.",
        data: { ...riotUserInfoJson },
      }
    );
  }

  const tagName = `${riotUserInfoJson.acct.game_name}#${riotUserInfoJson.acct.tag_line}`;
  const puuid = riotUserInfoJson.sub;

  const [updatedUserError, updatedUser] = await attempt(
    saveUserRiotCredentials({
      id: res.locals.user.id,
      entitlementToken,
      authToken,
      puuid,
      tagName,
    })
  );

  if (updatedUserError || !updatedUser) {
    return sendSuperJson(
      req,
      res,
      500,
      {
        success: false,
        message: "Internal server error.",
      },
      {
        message: "Failed to save Riot credentials to database.",
        data: {
          tokens: { authToken, entitlementToken },
          error: updatedUserError,
        },
      }
    );
  }

  return sendSuperJson(req, res, 200, {
    success: true,
    message: "Riot authentication succeeded!",
    data: {
      authToken,
      entitlementToken,
    },
  });
});

riotRouterV1.post("/unauth", async (req, res) => {
  if (!res.locals.user || !res.locals.session) {
    return sendSuperJson(req, res, 401, {
      success: false,
      message: "You are not logged in.",
    });
  }

  const [userError, user] = await attempt(
    findUserById({ id: res.locals.user.id })
  );

  if (userError || !user) {
    return sendSuperJson(
      req,
      res,
      500,
      {
        success: false,
        message: "Internal server error.",
      },
      {
        message: "This should not be happening. Check data object.",
        data: { error: userError, user },
      }
    );
  }

  const [updatedUserError, updatedUser] = await attempt(
    removeUserRiotCredentials({ id: user.id })
  );

  if (updatedUserError || !updatedUser) {
    return sendSuperJson(
      req,
      res,
      500,
      {
        success: false,
        message: "Internal server error.",
      },
      {
        message:
          "Database operation of removing Riot credentials failed. Check data object.",
        data: { error: updatedUserError, user: updatedUser },
      }
    );
  }

  return sendSuperJson(
    req,
    res,
    200,
    {
      success: true,
      message: "The Riot account has been successfully removed!",
      data: {},
    },
    {
      message: "Should be successful.",
      data: { updatedUser },
    }
  );
});

riotRouterV1.get("/user", async (req, res) => {
  const result = {
    name: undefined,
    rank: undefined,
    rr: undefined,
    rankName: undefined,
  } as {
    name?: string;
    rank?: number;
    rr?: number;
    rankName?: string;
  };

  if (!res.locals.user || !res.locals.session) {
    return sendSuperJson(req, res, 401, {
      success: false,
      message: "You are not logged in.",
    });
  }

  const [userError, user] = await attempt(
    findUserById({ id: res.locals.user.id })
  );

  if (userError || !user) {
    return sendSuperJson(
      req,
      res,
      500,
      {
        success: false,
        message: "Internal server error.",
      },
      {
        message: "This should not be happening. Check data object.",
        data: { error: userError, user },
      }
    );
  }

  const { riotAuth, riotEntitlement, riotPuuid: puuid, riotTag } = user;

  if (!riotAuth || !riotEntitlement || !puuid || !riotTag) {
    return sendSuperJson(req, res, 400, {
      success: false,
      message: "Not authenticated via Riot.",
    });
  }

  result.name = riotTag;

  const riotMatchInfoRes = await fetch(
    `https://pd.na.a.pvp.net/mmr/v1/players/${puuid}/competitiveupdates?startIndex=0&endIndex=1&queue=competitive`,
    {
      headers: {
        Authorization: `Bearer ${riotAuth}`,
        "X-Riot-Entitlements-JWT": riotEntitlement,
        "X-Riot-ClientPlatform":
          "ew0KCSJwbGF0Zm9ybVR5cGUiOiAiUEMiLA0KCSJwbGF0Zm9ybU9TIjogIldpbmRvd3MiLA0KCSJwbGF0Zm9ybU9TVmVyc2lvbiI6ICIxMC4wLjE5MDQyLjEuMjU2LjY0Yml0IiwNCgkicGxhdGZvcm1DaGlwc2V0IjogIlVua25vd24iDQp9",
        "User-Agent": "ShooterGame/13 Windows/10.0.19043.1.256.64bit",
        "X-Riot-ClientVersion": "release-08.07-shipping-9-2444158",
      },
    }
  );

  if (!riotMatchInfoRes.ok) {
    return sendSuperJson(
      req,
      res,
      500,
      {
        success: false,
        message: "Internal server error.",
      },
      {
        message: "Failed to retrieve latest match info from Riot API.",
        data: { statusCode: riotMatchInfoRes.status },
      }
    );
  }

  const riotMatchInfoJson =
    (await riotMatchInfoRes.json()) as RiotMatchInfoType;

  if (riotMatchInfoJson.errorCode !== undefined) {
    return sendSuperJson(
      req,
      res,
      500,
      {
        success: false,
        message: "Internal server error.",
      },
      {
        message: "Failed to retrieve latest match info from Riot API.",
        data: { ...riotMatchInfoJson },
      }
    );
  }

  const latestMatch = riotMatchInfoJson.Matches[0];

  result.rank = latestMatch.TierAfterUpdate;
  result.rr = latestMatch.RankedRatingAfterUpdate;

  const tierKey = latestMatch.TierAfterUpdate.toString() as TierNumber;
  result.rankName = tierNumberToNameObject[tierKey];

  return sendSuperJson(req, res, 200, {
    success: true,
    message: "Player information retrieved!",
    data: { ...result },
  });
});

riotRouterV1.get("/matches/shallow", async (req, res) => {
  await new Promise((r) => setTimeout(() => r(0), 2000));
  if (!res.locals.user || !res.locals.session) {
    return sendSuperJson(req, res, 401, {
      success: false,
      message: "You are not logged in.",
    });
  }

  const [userError, user] = await attempt(
    findUserById({ id: res.locals.user.id })
  );

  if (userError || !user) {
    return sendSuperJson(
      req,
      res,
      500,
      {
        success: false,
        message: "Internal server error.",
      },
      {
        message: "This should not be happening. Check data object.",
        data: { error: userError, user },
      }
    );
  }

  // This is asserted to catch any changes so I can update the library accordingly.
  const [matchesError, matches] = await attempt(
    getAllMatchesByUserIdShallow({
      puuid: user.riotPuuid,
    }) as Prisma.PrismaPromise<ShallowMatchExclude[]>
  );

  const newMatches = await Promise.all(
    matches?.map(async (match) => {
      const riotPlayersInMatch = await db.riotMatchPlayers.findMany({
        where: {
          riotMatches: { some: { id: match.id } },
        },
      });

      // await writeFile(
      //   `${__dirname}/test${match.id}.json`,
      //   JSON.stringify(riotPlayersInMatch)
      // );

      const me = riotPlayersInMatch.filter(
        (player) => player.puuid == user.riotPuuid
      )[0];

      const gameModeName = getGameModeName(match.queueId ?? "Unknown");

      return {
        ...match,
        characterId: me?.characterId,
        queueId: gameModeName,
        me,
      };
    }) ?? []
  );

  if (matchesError) {
    return sendSuperJson(
      req,
      res,
      500,
      {
        success: false,
        message: "Internal server error.",
      },
      {
        message: "Failed to fetch matches.",
      }
    );
  }

  return sendSuperJson(req, res, 200, {
    success: true,
    message: "Matches found!",
    data: { matches: newMatches },
  });
});
