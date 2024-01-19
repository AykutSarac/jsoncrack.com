import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Modal,
  Text,
  Divider,
  ScrollArea,
  ModalProps,
  Table,
  ActionIcon,
  Badge,
  Paper,
  Flex,
  DefaultMantineColor,
  Input,
  Button,
  Group,
  Stack,
  RingProgress,
  UnstyledButton,
  Drawer,
  LoadingOverlay,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import toast from "react-hot-toast";
import { AiOutlineLink } from "react-icons/ai";
import { FaTrash } from "react-icons/fa";
import { MdFileOpen } from "react-icons/md";
import { VscAdd, VscEdit, VscLock, VscUnlock } from "react-icons/vsc";
import { FileFormat } from "src/enums/file.enum";
import { documentSvc } from "src/services/document.service";
import useFile, { File } from "src/store/useFile";
import useUser from "src/store/useUser";

dayjs.extend(relativeTime);

const colorByFormat: Record<FileFormat, DefaultMantineColor> = {
  json: "orange",
  yaml: "blue",
  xml: "red",
  toml: "dark",
  csv: "grape",
};

const UpdateNameModal: React.FC<{
  file: File | null;
  onClose: () => void;
  refetch: () => void;
}> = ({ file, onClose, refetch }) => {
  const [name, setName] = React.useState("");
  const onSubmit = () => {
    if (!file) return;
    toast
      .promise(documentSvc.update(file.id, { name }), {
        loading: "Updating document...",
        error: "Error occurred while updating document!",
        success: `Renamed document to ${name}`,
      })
      .then(() => {
        refetch();
        setName("");
      });

    onClose();
  };

  return (
    <Modal title="Update Document name" opened={!!file} onClose={onClose} centered zIndex={202}>
      <Stack>
        <Input
          value={name}
          placeholder={file?.name}
          onChange={e => setName(e.currentTarget.value)}
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

export const CloudModal: React.FC<ModalProps> = ({ opened, onClose }) => {
  const totalQuota = useUser(state => (state.premium ? 200 : 25));
  const isPremium = useUser(state => state.premium);
  const getContents = useFile(state => state.getContents);
  const setHasChanges = useFile(state => state.setHasChanges);
  const getFormat = useFile(state => state.getFormat);
  const [currentFile, setCurrentFile] = React.useState<File | null>(null);
  const { isReady, query, replace } = useRouter();

  const { data, isLoading, refetch } = useQuery(["allJson", query], () => documentSvc.getAll(), {
    enabled: isReady && opened,
  });

  const isCreateDisabled = React.useMemo(() => {
    if (!data?.length) return false;
    return isPremium ? data.length >= 200 : data.length >= 25;
  }, [isPremium, data?.length]);

  const onCreate = async () => {
    try {
      toast.loading("Saving document...", { id: "fileSave" });
      const { data, error } = await documentSvc.upsert({
        contents: getContents(),
        format: getFormat(),
      });

      if (error) throw error;

      toast.success("Document saved to cloud", { id: "fileSave" });
      setHasChanges(false);
      replace({ query: { json: data } });
      onClose();
    } catch (error: any) {
      toast.error("Failed to save document!", { id: "fileSave" });
      console.error(error);
    }
  };

  const onDeleteClick = React.useCallback(
    (file: File) => {
      toast
        .promise(documentSvc.delete(file.id), {
          loading: "Deleting file...",
          error: "An error occurred while deleting the file!",
          success: `Deleted ${file.name}!`,
        })
        .then(() => refetch());
    },
    [refetch]
  );

  const copyShareLink = React.useCallback((fileId: string) => {
    const shareLink = `${window.location.origin}/editor?json=${fileId}`;
    navigator.clipboard.writeText(shareLink);
    toast.success("Copied share link to clipboard!");
  }, []);

  const rows = React.useMemo(
    () =>
      data?.map(element => (
        <Table.Tr key={element.id}>
          <Table.Td>
            <Flex align="center" gap="xs">
              {element.private ? <VscLock /> : <VscUnlock />}
              {element.id}
            </Flex>
          </Table.Td>
          <Table.Td>
            <Flex align="center" justify="space-between">
              {element.name}
              <ActionIcon
                variant="transparent"
                color="cyan"
                onClick={() => setCurrentFile(element)}
              >
                <VscEdit />
              </ActionIcon>
            </Flex>
          </Table.Td>
          <Table.Td>{dayjs(element.created_at).format("DD.MM.YYYY")}</Table.Td>
          <Table.Td>
            <Badge variant="light" color={colorByFormat[element.format]} size="sm">
              {element.format.toUpperCase()}
            </Badge>
          </Table.Td>
          <Table.Td>{element.views.toLocaleString("en-US")}</Table.Td>
          <Table.Td>
            <Flex gap="xs">
              <ActionIcon.Group>
                <ActionIcon
                  variant="transparent"
                  component={Link}
                  href={`?json=${element.id}`}
                  prefetch={false}
                  color="blue"
                  onClick={onClose}
                >
                  <MdFileOpen size="18" />
                </ActionIcon>
                <ActionIcon
                  variant="transparent"
                  color="red"
                  onClick={() => onDeleteClick(element)}
                >
                  <FaTrash size="18" />
                </ActionIcon>
                <ActionIcon
                  variant="transparent"
                  color="green"
                  onClick={() => copyShareLink(element.id)}
                >
                  <AiOutlineLink />
                </ActionIcon>
              </ActionIcon.Group>
            </Flex>
          </Table.Td>
        </Table.Tr>
      )),
    [data, copyShareLink, onClose, onDeleteClick]
  );

  return (
    <Drawer
      title="Saved On The Cloud"
      opened={opened}
      size="xl"
      onClose={onClose}
      transitionProps={{ duration: 300, timingFunction: "ease", transition: "slide-right" }}
      pos="relative"
    >
      <LoadingOverlay visible={isLoading} />
      {data && (
        <Flex gap="md">
          <Paper my="lg" withBorder radius="md" p="xs" w="100%">
            <Group>
              <RingProgress
                size={40}
                roundCaps
                thickness={6}
                sections={[
                  {
                    value: (data.length * 100) / totalQuota,
                    color: data.length > totalQuota / 1.5 ? "red" : "blue",
                  },
                ]}
              />
              <div>
                <Text c="dimmed" fz="xs" fw={700} style={{ textTransform: "uppercase" }}>
                  Total Quota
                </Text>
                <Text fw={700} size="lg">
                  {data.length} / {totalQuota}
                </Text>
              </div>
            </Group>
          </Paper>
          <Paper my="lg" withBorder radius="md" p="xs" w={250}>
            <UnstyledButton
              fw="bold"
              w="100%"
              h="100%"
              onClick={onCreate}
              disabled={isCreateDisabled}
            >
              <Text
                fz="sm"
                fw="bold"
                c="blue"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  textAlign: "center",
                }}
              >
                <VscAdd size="18" strokeWidth={1} />
                Create New Document
              </Text>
            </UnstyledButton>
          </Paper>
        </Flex>
      )}
      <Text fz="xs" pb="lg">
        The Cloud Save feature is primarily designed for convenient access and is not advisable for
        storing sensitive data.
      </Text>
      <Divider py="xs" />
      <Paper>
        <ScrollArea h="100%" offsetScrollbars>
          <Table fz="xs" verticalSpacing="xs" striped withTableBorder>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>ID</Table.Th>
                <Table.Th>Name</Table.Th>
                <Table.Th>Create Date</Table.Th>
                <Table.Th>Format</Table.Th>
                <Table.Th>Views</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </ScrollArea>
      </Paper>
      <UpdateNameModal file={currentFile} onClose={() => setCurrentFile(null)} refetch={refetch} />
    </Drawer>
  );
};
