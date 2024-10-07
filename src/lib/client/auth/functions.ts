import { ApiType } from "@/lib/client/schema/api";
import { User } from "@prisma/client";

export const loginUser = async (data: {
  username?: string;
  password?: string;
}) => {
  const res = await fetch(
    `/api/auth/discord/callback?code=${data.code ?? ""}&state=${
      data.status ?? ""
    }`
  );
  if (res.status === 200) {
    return true;
  }
  return false;
};

export const fetchUser = async () => {
  const res = await fetch("/api/@me", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (res.ok) {
    return ((await res.json()) as ApiType<User>).data;
  }
  return undefined;
};

export const logoutUser = async () => {
  const res = await fetch("/api/auth/logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.ok;
};
