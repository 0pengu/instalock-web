type WebApplicationError = {
  httpStatus: number;
  errorCode: string;
  implementationDetails: string;
};

type SucessfulEntitlement = {
  entitlements_token: string;
  errorCode: undefined;
};

export type EntitlementApiType = WebApplicationError | SucessfulEntitlement;

type ErrorRiotUserType = {
  error: string;
  error_description: string;
};

type SuccessRiotUserType = {
  country: string;
  sub: string;
  email_verified: boolean;
  player_plocale: string | null;
  country_at: number;
  pw: {
    cng_at: number;
    reset: boolean;
    must_reset: boolean;
  };
  phone_number_verified: boolean;
  account_verified: boolean;
  ppid: string | null;
  federated_identity_details: never[];
  player_locale: string;
  acct: {
    type: number;
    state: string;
    adm: boolean;
    game_name: string;
    tag_line: string;
    created_at: number;
  };
  age: number;
  jti: string;
  affinity: { pp: string };
  error: undefined;
};

export type RiotUserInfoType = ErrorRiotUserType | SuccessRiotUserType;

export type RiotMatchInfoType =
  | {
      httpStatus: number;
      errorCode: undefined;
      message?: string;
      Version: number;
      Subject: string;
      Matches: Match[];
    }
  | {
      httpStatus: number;
      errorCode: string;
      message: string;
    };

type Match = {
  MatchID: string;
  MapID: string;
  SeasonID: string;
  MatchStartTime: number;
  TierAfterUpdate: number;
  TierBeforeUpdate: number;
  RankedRatingAfterUpdate: number;
  RankedRatingBeforeUpdate: number;
  RankedRatingEarned: number;
  RankedRatingPerformanceBonus: number;
  CompetitiveMovement: string;
  AFKPenalty: number;
};
