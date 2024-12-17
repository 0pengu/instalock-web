import {
  AutoGenMatchMeta,
  type RiotMatchInfoType,
} from "@instalock/types/riot";
import { writeFile } from "fs/promises";
import { db } from "../db";
import { randomUUID } from "crypto";

export const loadMatchesForEachUser = async () => {
  const users = await db.user.findMany();

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const matchIds: string[] = [];

    const { riotAuth, riotEntitlement, riotPuuid, riotTag } = user;

    if (!riotAuth || !riotEntitlement || !riotPuuid || !riotTag) {
      continue;
    }

    const riotRes = await fetch(
      `https://pd.na.a.pvp.net/mmr/v1/players/${riotPuuid}/competitiveupdates?startIndex=0&endIndex=20`,
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

    if (!riotRes.ok) {
      continue;
    }

    const riotMatchInfoJson = (await riotRes.json()) as RiotMatchInfoType;

    if (riotMatchInfoJson.errorCode !== undefined) {
      break;
    }

    riotMatchInfoJson.Matches.forEach((match) => {
      matchIds.push(match.MatchID);
    });

    for (let j = 0; j < matchIds.length; j++) {
      const riotMatchRes = await fetch(
        `https://pd.na.a.pvp.net/match-details/v1/matches/${matchIds[j]}`,
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

      // Use the file to generate types, if needed.
      //   if (j === 1) {
      //     await writeFile("test.json", JSON.stringify(await riotMatchRes.json()));
      //   }

      if (!riotMatchRes.ok) {
        continue;
      }

      const json = (await riotMatchRes.json()) as AutoGenMatchMeta;

      const { matchInfo, players, teams } = json;

      const teamBlue =
        teams && teams[0].teamId === "Blue" ? teams[0] : teams && teams[1];
      const teamRed =
        teams && teams[0].teamId === "Red" ? teams[0] : teams && teams[1];

      await db.user.update({
        where: { id: user.id },
        data: {
          riotMatches: {
            create: {
              id: matchInfo?.matchId ?? randomUUID(),
              mapId: matchInfo?.mapId,
              gameVersion: matchInfo?.gameVersion,
              gameStart: new Date(matchInfo?.gameStartMillis ?? ""),
              gameEnd: new Date(
                (matchInfo?.gameLengthMillis ?? 0) +
                  (matchInfo?.gameLengthMillis ?? 0)
              ),
              isCompleted: matchInfo?.isCompleted,
              queueId: matchInfo?.queueID,
              isRanked: matchInfo?.isRanked,
              seasonId: matchInfo?.seasonId,
              roundsPlayed: teams && teams[0].roundsPlayed,
              teamWon:
                teams &&
                (teams[0].teamId === "Red" && teams[0].won === true
                  ? "Red"
                  : "Blue"),
              teamBlueRoundsWon: teamBlue?.roundsWon,
              teamRedRoundsWon: teamRed?.roundsWon,
              matchPlayers: {
                connectOrCreate: players?.map((player) => ({
                  where: { id: player.subject }, // Assumes 'id' is unique in the database
                  create: {
                    id: player.subject ?? randomUUID(),
                    riotTag: `${player.gameName}#${player.tagLine}`,
                    teamId: player.teamId,
                    characterId: player.characterId,
                    kills: player.stats?.kills ?? 0,
                    deaths: player.stats?.deaths ?? 0,
                    assists: player.stats?.assists ?? 0,
                    tier: player.competitiveTier,
                    playerCard: player.playerCard,
                    playerTitle: player.playerTitle,
                    teamColor: player.teamId === "Blue" ? "Blue" : "Red",
                    teamWon:
                      teams &&
                      teams.find((team) => team.teamId === player.teamId)?.won,
                    teamRoundsWon:
                      teams &&
                      teams.find((team) => team.teamId === player.teamId)
                        ?.roundsPlayed,
                  },
                })),
              },
            },
          },
        },
      });
    }
  }
};