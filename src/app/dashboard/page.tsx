import { useAuthStore } from "@/app/(auth)/_store";
import DashboardContent from "@/app/dashboard/_components/_dashboard-content";
import Navbar from "@/app/dashboard/_components/_navbar";
import { CenteredSpinner } from "@/components/ui/centered-spinner";
import { Suspense, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const navigate = useNavigate();

  const auth = useAuthStore((state) => state.auth);

  useEffect(() => {
    if (!auth) {
      return navigate("/login");
    }
  }, [auth, navigate]);

  if (!auth) {
    return null;
  }

  return (
    <>
      <Navbar />
      <Suspense fallback={<CenteredSpinner />}>
        <DashboardContent />
      </Suspense>
    </>
  );
}
