import { useApiKeysLengthQuery } from "@/app/settings/_components/_jwt-section/_loader/_get-api-keys-length";
import { Badge } from "@mantine/core";
import { FaSpinner } from "react-icons/fa6";

const className = "self-center";

export default function ApiKeyBadge() {
  const { isError, isLoading, data } = useApiKeysLengthQuery();

  if (isLoading) {
    return (
      <Badge color="gray" className={className}>
        <FaSpinner className="animate-spin" />
      </Badge>
    );
  }

  if (isError) {
    return (
      <Badge color="red" className={className}>
        Error fetching API keys
      </Badge>
    );
  }

  return (
    <Badge
      className={className}
      variant="gradient"
      gradient={{ from: "blue", to: "red" }}
    >
      {data} API keys
    </Badge>
  );
}
