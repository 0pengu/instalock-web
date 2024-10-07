import { useQuery } from "@tanstack/react-query";

export const useAuthQuery = (code?: string, state?: string) => {
  const query = useQuery({
    queryKey: ["auth"],
    queryFn: () => fetchAuth(code, state),
  });

  return { isAuthenticated: (query.data && query.isFetched) ?? false };
};

const fetchAuth = async (code?: string, state?: string) => {
  const res = await fetch(
    `/api/auth/discord/callback?code=${code ?? ""}&state=${state ?? ""}`
  );
  if (res.status === 200) {
    return true;
  }
  return false;
};
