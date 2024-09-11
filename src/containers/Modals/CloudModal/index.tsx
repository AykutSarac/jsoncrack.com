import React from "react";
import { useRouter } from "next/router";
import type { ModalProps, DefaultMantineColor } from "@mantine/core";
import {
  Text,
  ScrollArea,
  Table,
  ActionIcon,
  Badge,
  Paper,
  Flex,
  Button,
  RingProgress,
  Drawer,
  LoadingOverlay,
  Menu,
  TextInput,
  Alert,
} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { event as gaEvent } from "nextjs-google-analytics";
import toast from "react-hot-toast";
import { BiSearch } from "react-icons/bi";
import { FaTrash } from "react-icons/fa";
import { LuDownload } from "react-icons/lu";
import { SlOptionsVertical } from "react-icons/sl";
import { VscAdd, VscWarning } from "react-icons/vsc";
import type { FileFormat } from "src/enums/file.enum";
import { documentSvc } from "src/lib/api/document.service";
import type { File } from "src/store/useFile";
import useFile from "src/store/useFile";
import useModal from "src/store/useModal";

dayjs.extend(relativeTime);

const colorByFormat: Record<FileFormat, DefaultMantineColor> = {
  json: "orange",
  yaml: "blue",
  xml: "red",
  toml: "dark",
  csv: "grape",
};

const TOTAL_QUOTA = 25;

export const CloudModal = ({ opened, onClose }: ModalProps) => {
  const setVisible = useModal(state => state.setVisible);
  const setFile = useFile(state => state.setFile);
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
        gaEvent("open_cloud_file");
      } catch (error) {
        if (error instanceof Error) toast.error(error.message);
      } finally {
        onClose();
      }
    },
    [onClose, setFile]
  );

  const downloadFile = React.useCallback(async (id: string) => {
    try {
      // it will fetch the file first, then download it with corresponsing format
      const { data, error } = await documentSvc.getById(id);
      if (error) throw new Error(error.message);

      const blob = new Blob([data[0].content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${data[0].name}.${data[0].format}`;
      a.click();
      URL.revokeObjectURL(url);

      gaEvent("download_cloud_file");

      return true;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
      return false;
    }
  }, []);

  const onDeleteClick = React.useCallback(
    async (file: File) => {
      try {
        toast.loading("Deleting file...", { id: "delete-file" });

        const { error } = await documentSvc.delete(file.id);
        if (error) throw new Error(error.message);

        await refetch();
        toast.success(`Deleted ${file.name}!`, { id: "delete-file" });
        gaEvent("delete_cloud_file");
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
          <Table.Td fz="10" c="dimmed" title={dayjs(element.updated_at).format("DD MMM, YYYY")}>
            {dayjs(element.updated_at).fromNow()}
          </Table.Td>
          <Table.Td onClick={e => e.stopPropagation()}>
            <Flex gap="xs">
              <Menu position="bottom" withArrow shadow="md">
                <Menu.Target>
                  <ActionIcon variant="subtle" color="gray">
                    <SlOptionsVertical />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item
                    fz="xs"
                    onClick={() => downloadFile(element.id)}
                    leftSection={<LuDownload />}
                  >
                    Download
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Item
                    c="red"
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
    [data, downloadFile, onDeleteClick, openFile]
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
      <Alert color="red" icon={<VscWarning />}>
        Cloud storage will be terminated on <b>1 October 2024</b>. Please download your data before
        the deadline.
        <Button color="red" variant="light" mt="sm" onClick={() => setVisible("notice")(true)}>
          Read More
        </Button>
      </Alert>
      <Text fz="xs" py="lg">
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
        <ScrollArea h="calc(100vh - 345px)" offsetScrollbars>
          <LoadingOverlay visible={isLoading} />
          <Table fz="xs" verticalSpacing="4" highlightOnHover>
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
                thickness={2}
                sections={[
                  {
                    value: (data.length * 100) / TOTAL_QUOTA,
                    color: data.length > TOTAL_QUOTA / 1.5 ? "red" : "blue",
                  },
                ]}
              />
              <Text fw={700} size="xs">
                {data.length} / {TOTAL_QUOTA}
              </Text>
            </Flex>
          </Flex>
        )}
      </Paper>
    </Drawer>
  );
};
