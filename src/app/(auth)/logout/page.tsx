import { useAuthStore } from "@/app/(auth)/_store";
import { CenteredSpinner } from "@/components/ui/centered-spinner";
import { notifications } from "@mantine/notifications";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LogoutPage() {
  const navigate = useNavigate();

  const [auth, setAuth] = [
    useAuthStore((state) => state.auth),
    useAuthStore((state) => state.setAuth),
  ];

  useEffect(() => {
    if (!auth) {
      return navigate("/login");
    }
  }, [auth, navigate]);

  useEffect(() => {
    const id = notifications.show({
      loading: true,
      title: "Please wait",
      message: "Logging you out...",
      withCloseButton: false,
    });

    const logout = async () => {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });
      if (!res.ok) {
        notifications.update({
          id,
          title: "Error",
          message: "Failed to log out",
          color: "red",
          withCloseButton: true,
        });
        navigate("/login");
      }

      notifications.update({
        id,
        title: "Success",
        message: "Logged out successfully",
        color: "green",
        withCloseButton: true,
      });

      setAuth(false);
      navigate("/login");
    };
    logout();
  });

  if (!auth) {
    return null;
  }

  return <CenteredSpinner />;
}
