import {
  Burger,
  Button,
  Center,
  Container,
  Divider,
  Drawer,
  Group,
  Image,
  Loader,
  Menu,
  Progress,
  rem,
  ScrollArea,
  Text,
  UnstyledButton,
} from "@mantine/core";
import cx from "clsx";
import { useDisclosure } from "@mantine/hooks";
import { IconChevronDown, IconRefresh, IconTrash } from "@tabler/icons-react";
import { ReactNode, useState } from "react";
import classes from "@/app/(app)/dashboard/_components/UserNavbar/UserNavbar.module.css";
import {
  useDisconnectRiotPlayerQuery,
  useRiotPlayerInfoQuery,
} from "@/app/(app)/dashboard/_components/UserNavbar/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";

export default function UserNavbar() {
  const queryClient = useQueryClient();
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const [opened, setOpened] = useState(false);

  const { data, status } = useRiotPlayerInfoQuery();
  const { mutate } = useDisconnectRiotPlayerQuery();

  if (status === "pending") {
    return (
      <UserNavbarWrapper>
        <Center h={58}>
          <Loader color="red.7" />
        </Center>
      </UserNavbarWrapper>
    );
  }

  if (status === "error") {
    return <UserNavbarWrapper />;
  }

  const { name, rr, rank, rankName } = data;
  const rankImage = `/tiers/${rank}.png`;

  const handleRefresh = () => {
    queryClient.resetQueries({ queryKey: ["riot"] });
  };

  const handleDisconnect = () => {
    const id = notifications.show({
      message: "Removing current Riot connection, please wait...",
    });
    mutate(void 0, {
      onSuccess: ({ success, message }) => {
        notifications.update({
          id,
          message,
          color: success ? "green" : "red",
        });
        queryClient.resetQueries({ queryKey: ["riot"] });
      },
    });
  };

  return (
    <UserNavbarWrapper>
      <Group justify="space-between">
        <Group justify="left" gap={10}>
          <Image
            src={rankImage}
            alt={`${rank} ${rr}`}
            width={10}
            height={10}
            className="h-12"
          />
          <Text>
            {rankName} <Progress value={Number(rr)} color="red" /> {rr}/100
          </Text>
        </Group>
        <Group justify="right" gap={10}>
          <Burger
            opened={drawerOpened}
            onClick={toggleDrawer}
            hiddenFrom="xs"
            size="sm"
          />
        </Group>
        <Drawer
          opened={drawerOpened}
          onClose={closeDrawer}
          size="80%"
          padding="md"
          title={name}
          hiddenFrom="sm"
          zIndex={1000000}
        >
          <ScrollArea h={`calc(100vh - ${rem(80)})`} mx="-md">
            <Divider my="sm" />
            <Group justify="center" grow pb="xl" px="md">
              <Button
                color="red"
                leftSection={
                  <IconTrash
                    style={{ width: rem(16), height: rem(16) }}
                    stroke={1.5}
                  />
                }
                onClick={(e) => {
                  e.preventDefault();
                  handleDisconnect();
                  toggleDrawer();
                }}
              >
                Disconnect from user
              </Button>
            </Group>
            <Group justify="center" grow pb="xl" px="md">
              <Button
                onClick={() => {
                  handleRefresh();
                  toggleDrawer();
                }}
              >
                <IconRefresh /> Refresh
              </Button>
            </Group>
          </ScrollArea>
        </Drawer>
        <Group gap={10}>
          <Menu
            width={260}
            position="bottom-end"
            transitionProps={{ transition: "pop-top-right" }}
            opened={opened}
            onChange={setOpened}
            withinPortal
          >
            <Menu.Target>
              <UnstyledButton
                className={cx(
                  classes.user,
                  {
                    [classes.userActive]: opened,
                  },
                  "p-3"
                )}
              >
                <Group gap={7}>
                  <Text>{name}</Text>
                  {/* <Avatar src={user.image} alt={user.name} radius="xl" size={20} /> */}
                  {/* <Text fw={500} size="sm" lh={1} mr={3}>
                    {user.name}
                  </Text> */}
                  <IconChevronDown
                    style={{ width: rem(12), height: rem(12) }}
                    stroke={1.5}
                  />
                </Group>
              </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown className="z-auto">
              <Menu.Item
                color="red"
                onClick={handleDisconnect}
                leftSection={
                  <IconTrash
                    style={{ width: rem(16), height: rem(16) }}
                    stroke={1.5}
                  />
                }
              >
                Disconnect from user
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
          <UnstyledButton
            className={cx(classes.user, "bg-inherit p-3")}
            onClick={handleRefresh}
          >
            <Center>
              <IconRefresh />
            </Center>
          </UnstyledButton>
        </Group>
      </Group>
    </UserNavbarWrapper>
  );
}

function UserNavbarWrapper({ children }: { children?: ReactNode }) {
  return (
    <div className={classes.header + " w-full sticky top-0 z-[350]"}>
      <Container className={classes.mainSection} size="md">
        {children}
      </Container>
    </div>
  );
}
