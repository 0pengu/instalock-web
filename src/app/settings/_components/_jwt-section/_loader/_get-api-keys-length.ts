import { ApiType } from "@/lib/client/schema/api";
import { useQuery } from "@tanstack/react-query";

export const useApiKeysLengthQuery = () => {
  const query = useQuery({
    queryKey: ["length", "apiKeys"],
    queryFn: getApiKeysLength,
  });
  return { ...query };
};

const getApiKeysLength = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const res = await fetch("/api/jwt/length", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (res.ok) {
    return ((await res.json()) as ApiType<number>).data;
  }
  return null;
};
