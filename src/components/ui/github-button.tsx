import { Button } from "@mantine/core";
import { Link } from "react-router-dom";

export default function GithubButton({ to }: { to: string }) {
  return (
    <Link to={to}>
      <Button
        size="xl"
        visibleFrom="sm"
        className="my-4 bg-gray-600 hover:bg-gray-700"
      >
        GitHub
      </Button>
      <Button
        size="md"
        hiddenFrom="sm"
        className="my-4 bg-gray-600 hover:bg-gray-700"
      >
        GitHub
      </Button>
    </Link>
  );
}
