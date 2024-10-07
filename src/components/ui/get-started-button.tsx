import { Button } from "@mantine/core";
import { Link } from "react-router-dom";

export default function GetStartedButton({ to }: { to: string }) {
  return (
    <Link to={to}>
      <Button
        size="xl"
        visibleFrom="sm"
        variant="gradient"
        gradient={{ from: "purple", to: "red" }}
        className="my-4"
      >
        Get Started
      </Button>
      <Button
        size="md"
        hiddenFrom="sm"
        variant="gradient"
        gradient={{ from: "purple", to: "red" }}
        className="my-4"
      >
        Get Started
      </Button>
    </Link>
  );
}
