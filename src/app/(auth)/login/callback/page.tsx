import { useAuthStore } from "@/app/(auth)/_store";
import { CenteredSpinner } from "@/components/ui/centered-spinner";
import { notifications } from "@mantine/notifications";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginCallbackPage() {
  const navigate = useNavigate();

  const [auth, setAuth] = [
    useAuthStore((state) => state.auth),
    useAuthStore((state) => state.setAuth),
  ];

  useEffect(() => {
    if (auth) {
      notifications.show({
        title: "Logged in",
        message: "You are already logged in.",
        color: "blue",
      });
      return navigate("/dashboard");
    }
  }, [auth, navigate]);

  const url = new URL(window.location.href);
  const code = url.searchParams.get("code") ?? "";
  const state = url.searchParams.get("state") ?? "";

  useEffect(() => {
    const id = notifications.show({
      title: "Please wait",
      message: "Logging you in...",
      loading: true,
      withCloseButton: false,
    });

    if (!code || !state) {
      notifications.update({
        id,
        title: "Error",
        message: "Invalid callback URL.",
        color: "red",
      });
      return navigate("/login");
    }

    const login = async () => {
      const res = await fetch(
        `/api/auth/discord/callback?code=${code}&state=${state}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(res);

      if (res.ok) {
        setAuth(true);
        notifications.update({
          id,
          title: "Success",
          message: "Logged in successfully.",
          color: "green",
        });
        navigate("/dashboard");
      } else {
        notifications.update({
          id,
          title: "Error",
          message: "Failed to log in.",
          color: "red",
        });
        navigate("/login");
      }
    };
    login();
  }, [code, navigate, setAuth, state]);

  if (auth) {
    return null;
  }

  return <CenteredSpinner />;
}
