import { useAuthStore } from "@/app/(auth)/_store";
import { Paper, Button, Text } from "@mantine/core";
import { useEffect } from "react";
import { FaDiscord } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  const [auth, setAuth] = [
    useAuthStore((state) => state.auth),
    useAuthStore((state) => state.setAuth),
  ];

  useEffect(() => {
    if (auth) {
      return navigate("/dashboard");
    }

    const checkAuthStatus = async () => {
      const res = await fetch("/api/auth/check");
      if (res.ok) {
        setAuth(true);
      }
    };
    checkAuthStatus();
  }, [auth, navigate, setAuth]);

  if (auth) {
    return null;
  }

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <Paper radius="md" p="xl" withBorder>
        <Text size="lg" fw={500} className="text-center">
          Welcome to Instalock
        </Text>

        <Link to="/api/auth/discord" reloadDocument>
          <Button
            className="my-6 w-full"
            size="md"
            variant="gradient"
            gradient={{ from: "gray", to: "blue", deg: 45 }}
            leftSection={<FaDiscord />}
          >
            Login with Discord
          </Button>
        </Link>

        <Link to="/">
          <Text className="text-center hover:underline">← Go back home</Text>
        </Link>
      </Paper>
    </div>
  );
}
