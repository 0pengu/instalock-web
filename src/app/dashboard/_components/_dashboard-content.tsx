import { useUserQuery } from "@/app/dashboard/_loader/_fetch-user";

export default function DashboardContent() {
  const { data } = useUserQuery();

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">Welcome back, {data?.username}!</h1>
      <p className="text-lg">You have {data?.id} points.</p>
    </div>
  );
}
