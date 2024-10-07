import ApiKeyBadge from "@/app/settings/_components/_jwt-section/_api-key-badge";
import JWTModal from "@/app/settings/_components/_jwt-section/_jwt-modal/_jwt-modal";
import { Card, Group, Text } from "@mantine/core";

export default function JwtSection() {
  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      className="mx-16 mt-8"
    >
      <Card.Section className="p-4 font-bold text-2xl">
        Generate API Key
      </Card.Section>
      <Group justify="space-between" mt="md" mb="xs">
        <Text fw={500}>
          Generate an API key to use with the Instalock Desktop program.
        </Text>
        <div className="sm:block hidden">
          <ApiKeyBadge />
        </div>
      </Group>
      <div className="sm:hidden block">
        <ApiKeyBadge />
      </div>
      <JWTModal />
    </Card>
  );
}
