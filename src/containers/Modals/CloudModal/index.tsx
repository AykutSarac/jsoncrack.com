import React from "react";
import { useRouter } from "next/router";
import type { ModalProps, DefaultMantineColor } from "@mantine/core";
import {
  Modal,
  Text,
  ScrollArea,
  Table,
  ActionIcon,
  Badge,
  Paper,
  Flex,
  Button,
  Group,
  Stack,
  RingProgress,
  Drawer,
  LoadingOverlay,
  Menu,
  TextInput,
} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import toast from "react-hot-toast";
import { BiSearch, BiSolidFolderOpen, BiText } from "react-icons/bi";
import { FaTrash } from "react-icons/fa";
import { SlOptionsVertical } from "react-icons/sl";
import { VscAdd } from "react-icons/vsc";
import type { FileFormat } from "src/enums/file.enum";
import { gaEvent } from "src/lib/utils/gaEvent";
import { documentSvc } from "src/services/document.service";
import type { File } from "src/store/useFile";
import useFile from "src/store/useFile";

dayjs.extend(relativeTime);

const colorByFormat: Record<FileFormat, DefaultMantineColor> = {
  json: "orange",
  yaml: "blue",
  xml: "red",
  toml: "dark",
  csv: "grape",
};

interface UpdateNameModalProps {
  file: File | null;
  onClose: () => void;
  refetch: () => void;
}

const UpdateNameModal = ({ file, onClose, refetch }: UpdateNameModalProps) => {
  const [name, setName] = React.useState("");

  React.useEffect(() => {
    if (file?.name) setName(file.name);
  }, [file?.name]);

  const onSubmit = async () => {
    try {
      if (!file) return;

      toast.loading("Updating document...", { id: "update-document" });
      await documentSvc.update(file.id, { name });

      refetch();
      setName("");
      toast.dismiss("update-document");
    } catch (error) {
      toast.error("An error occurred while updating the document!", { id: "update-document" });
    } finally {
      onClose();
    }
  };

  return (
    <Modal title="Update document name" opened={!!file} onClose={onClose} centered zIndex={202}>
      <Stack>
        <TextInput
          value={name}
          placeholder="File name"
          onChange={e => setName(e.currentTarget.value)}
          autoFocus
          data-autofocus
        />
        <Group justify="right">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>Update</Button>
        </Group>
      </Stack>
    </Modal>
  );
};

const TOTAL_QUOTA = 25;

export const CloudModal = ({ opened, onClose }: ModalProps) => {
  const setFile = useFile(state => state.setFile);
  const [currentFile, setCurrentFile] = React.useState<File | null>(null);
  const [searchValue, setSearchValue] = React.useState("");
  const [debouncedSearchValue] = useDebouncedValue(searchValue, 1000);
  const { isReady, replace } = useRouter();

  const { data, isLoading, refetch } = useQuery(
    ["allJson", debouncedSearchValue],
    () => documentSvc.getAll(debouncedSearchValue),
    { enabled: isReady && opened }
  );

  const isCreateDisabled = React.useMemo(() => {
    if (!data?.length) return false;
    return data.length >= TOTAL_QUOTA;
  }, [data?.length]);

  const onCreate = async () => {
    replace({ query: undefined });
    onClose();
  };

  const openFile = React.useCallback(
    async (id: string) => {
      try {
        const { data, error } = await documentSvc.getById(id);
        if (error) throw new Error(error.message);

        if (data[0]) setFile(data[0]);
        gaEvent("Cloud Modal", "open file");
      } catch (error) {
        if (error instanceof Error) toast.error(error.message);
      } finally {
        onClose();
      }
    },
    [onClose, setFile]
  );

  const onDeleteClick = React.useCallback(
    async (file: File) => {
      try {
        toast.loading("Deleting file...", { id: "delete-file" });

        const { error } = await documentSvc.delete(file.id);
        if (error) throw new Error(error.message);

        await refetch();
        toast.success(`Deleted ${file.name}!`, { id: "delete-file" });
        gaEvent("Cloud Modal", "delete file");
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message, { id: "delete-file" });
        }
      } finally {
        toast.dismiss("delete-file");
      }
    },
    [refetch]
  );

  const rows = React.useMemo(
    () =>
      data?.map(element => (
        <Table.Tr
          key={element.id}
          onClick={() => openFile(element.id)}
          style={{ cursor: "pointer" }}
        >
          <Table.Td>
            <Badge
              variant="transparent"
              color={colorByFormat[element.format]}
              size="sm"
              radius="xs"
            >
              {element.format.toUpperCase()}
            </Badge>
          </Table.Td>
          <Table.Td>{element.name}</Table.Td>
          <Table.Td>{dayjs(element.updated_at).format("DD MMM YYYY")}</Table.Td>
          <Table.Td onClick={e => e.stopPropagation()}>
            <Flex gap="xs">
              <Menu width={150} position="bottom" withArrow shadow="md">
                <Menu.Target>
                  <ActionIcon variant="subtle" color="gray">
                    <SlOptionsVertical />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item
                    fz="xs"
                    onClick={() => openFile(element.id)}
                    leftSection={<BiSolidFolderOpen />}
                  >
                    Open
                  </Menu.Item>
                  <Menu.Item
                    fz="xs"
                    leftSection={<BiText />}
                    onClick={() => setCurrentFile(element)}
                  >
                    Rename File
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Item
                    fz="xs"
                    onClick={() => onDeleteClick(element)}
                    leftSection={<FaTrash />}
                  >
                    Delete
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Flex>
          </Table.Td>
        </Table.Tr>
      )),
    [data, onDeleteClick, openFile]
  );

  return (
    <Drawer
      title="Saved On The Cloud"
      opened={opened}
      size="xl"
      onClose={onClose}
      transitionProps={{ duration: 300, timingFunction: "ease", transition: "slide-left" }}
      pos="relative"
      position="right"
    >
      <Text fz="xs" pb="lg">
        The Cloud Save feature is primarily designed for convenient access and is not advisable for
        storing sensitive data.
      </Text>
      <Paper>
        <TextInput
          value={searchValue}
          onChange={e => setSearchValue(e.currentTarget.value)}
          size="xs"
          mb="sm"
          placeholder="Search"
          leftSection={<BiSearch />}
        />
        <ScrollArea h="calc(100vh - 220px)" offsetScrollbars>
          <LoadingOverlay visible={isLoading} />
          <Table fz="xs" verticalSpacing="xs" highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Format</Table.Th>
                <Table.Th>Name</Table.Th>
                <Table.Th>Last opened date</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </ScrollArea>
        {data && (
          <Flex py="lg" gap="md">
            <Button
              size="compact-xs"
              leftSection={<VscAdd />}
              disabled={isCreateDisabled}
              onClick={onCreate}
              variant="outline"
            >
              Open New
            </Button>
            <Flex align="center" gap="xs">
              <RingProgress
                size={20}
                roundCaps
                thickness={3}
                sections={[
                  {
                    value: (data.length * 100) / TOTAL_QUOTA,
                    color: data.length > TOTAL_QUOTA / 1.5 ? "red" : "blue",
                  },
                ]}
              />
              <div>
                <Text fw={700} size="xs">
                  {data.length} / {TOTAL_QUOTA}
                </Text>
              </div>
            </Flex>
          </Flex>
        )}
      </Paper>
      <UpdateNameModal file={currentFile} onClose={() => setCurrentFile(null)} refetch={refetch} />
    </Drawer>
  );
};
