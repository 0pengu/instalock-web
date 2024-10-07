import { ApiType } from "@/lib/client/schema/api";
import { ApiKey } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

type ApiKeyType = ApiKey & {
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
};

export const useGetJwtsQuery = () => {
  const query = useQuery({
    queryKey: ["jwts"],
    queryFn: getJwts,
  });
  return { ...query };
};

const getJwts = async () => {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const res = await fetch("/api/jwt", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (res.ok) {
    return ((await res.json()) as ApiType<ApiKeyType[]>).data;
  }
  return undefined;
};
