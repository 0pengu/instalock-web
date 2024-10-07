import { generateKey } from "@/app/settings/_components/_jwt-section/_jwt-modal/_loader/_generate-key";
import { useGetJwtsQuery } from "@/app/settings/_components/_jwt-section/_jwt-modal/_loader/_get-jwts";
import { CenteredSpinner } from "@/components/ui/centered-spinner";
import { Button, Loader, Modal, Table } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { FaCopy } from "react-icons/fa6";

export default function JWTModal() {
  const [opened, { open, close }] = useDisclosure(false);

  const { isLoading, isError, data, refetch, isRefetching } = useGetJwtsQuery();

  // State to track which key's copy button is active
  const [activeCopyId, setActiveCopyId] = useState<string | null>(null);

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title={
          <div>
            Manage API Keys
            {isRefetching && (
              <Loader color="red" size="xs" className="ml-4 pt-1" />
            )}
          </div>
        }
        centered
      >
        {isLoading && <CenteredSpinner />}
        {isError && (
          <div className="flex flex-col justify-center self-center">
            Something went wrong
          </div>
        )}
        {data?.length === 0 ? (
          <div className="flex flex-col justify-center self-center">
            You don't have any API keys. Click the button below to generate one.
          </div>
        ) : (
          <Table className="max-w-52">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Expires At</Table.Th>
                <Table.Th>Copy</Table.Th>
                <Table.Th>Delete</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {data?.map((key) => (
                <Table.Tr key={key.id}>
                  {/* @ts-ignore */}
                  <Table.Td>{key.expiresAt}</Table.Td>
                  <Table.Td>
                    <FaCopy
                      className={`cursor-pointer ${
                        activeCopyId === key.id
                          ? "text-green-500"
                          : "text-gray-500"
                      }`}
                      onClick={() => {
                        navigator.clipboard.writeText(key.key);
                        setActiveCopyId(key.id);
                        setTimeout(() => {
                          setActiveCopyId(null);
                        }, 1000);
                      }}
                    />
                  </Table.Td>
                  <Table.Td>
                    <Button color="red" variant="outline">
                      🗑
                    </Button>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        )}
        <Button
          className="mt-4"
          onClick={() => {
            generateKey();
            refetch();
          }}
        >
          Generate API Key
        </Button>
      </Modal>
      <Button className="sm:w-52 sm:mt-0 mt-4 w-full" onClick={open}>
        Manage Keys
      </Button>
    </>
  );
}
