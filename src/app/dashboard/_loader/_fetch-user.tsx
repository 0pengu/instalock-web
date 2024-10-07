import { ApiType } from "@/lib/client/schema/api";
import { User } from "@prisma/client";
import { useSuspenseQuery } from "@tanstack/react-query";

/**
 * A custom query for fetching the user data.
 * @returns `UserQuery` - React Query object
 * @example ```ts
 * const { isLoading, isError, data } = useUserQuery()

  if (isLoading) return <div>Loading...</div>;

  if (isError) return <div>Error fetching user data</div>;

  if (!data) return <div>Error fetching user data</div>;
 * ```
 */
export const useUserQuery = () => {
  const query = useSuspenseQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
  });
  return { ...query };
};

const fetchUser = async () => {
  // Fake lag for development purposes
  process.env.NODE_ENV === "development" &&
    (await new Promise((resolve) => setTimeout(() => resolve(true), 1000)));
  const res = await fetch("/api/@me", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (res.ok) {
    return ((await res.json()) as ApiType<User>).data;
  }
};
