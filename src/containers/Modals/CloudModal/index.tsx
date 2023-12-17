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
        <Group position="right">
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
  const { data, refetch } = useQuery(["allJson", query], () => documentSvc.getAll(), {
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
        <tr key={element.id}>
          <td>
            <Flex align="center" gap="xs">
              {element.private ? <VscLock /> : <VscUnlock />}
              {element.id}
            </Flex>
          </td>
          <td>
            <Flex align="center" justify="space-between">
              {element.name}
              <ActionIcon color="cyan" onClick={() => setCurrentFile(element)}>
                <VscEdit />
              </ActionIcon>
            </Flex>
          </td>
          <td>{dayjs(element.created_at).format("DD.MM.YYYY")}</td>
          <td>
            <Badge variant="light" color={colorByFormat[element.format]} size="sm">
              {element.format.toUpperCase()}
            </Badge>
          </td>
          <td>{element.views.toLocaleString("en-US")}</td>
          <td>
            <Flex gap="xs">
              <ActionIcon
                component={Link}
                href={`?json=${element.id}`}
                prefetch={false}
                color="blue"
                onClick={onClose}
              >
                <MdFileOpen size="18" />
              </ActionIcon>
              <ActionIcon color="red" onClick={() => onDeleteClick(element)}>
                <FaTrash size="18" />
              </ActionIcon>
              <ActionIcon color="green" onClick={() => copyShareLink(element.id)}>
                <AiOutlineLink />
              </ActionIcon>
            </Flex>
          </td>
        </tr>
      )),
    [data, copyShareLink, onClose, onDeleteClick]
  );

  return (
    <Modal title="Saved On The Cloud" opened={opened} size="xl" onClose={onClose} centered>
      <Paper>
        <ScrollArea h={360} offsetScrollbars>
          <Table fontSize="xs" verticalSpacing="xs" striped>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Create Date</th>
                <th>Format</th>
                <th>Views</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
        </ScrollArea>
      </Paper>
      {data && (
        <Flex gap="md">
          <Paper my="lg" withBorder radius="md" p="xs" w="100%">
            <Group>
              <RingProgress
                size={60}
                roundCaps
                thickness={8}
                sections={[
                  {
                    value: (data.length * 100) / totalQuota,
                    color: data.length > totalQuota / 1.5 ? "red" : "blue",
                  },
                ]}
              />
              <div>
                <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
                  Total Quota
                </Text>
                <Text weight={700} size="xl">
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
              <Text fz="md" align="center" color="blue">
                <Flex align="center" justify="center">
                  <VscAdd size="24" />
                  Create New Document
                </Flex>
              </Text>
            </UnstyledButton>
          </Paper>
        </Flex>
      )}
      <Divider py="xs" />
      <Text fz="xs">
        The Cloud Save feature is primarily designed for convenient access and is not advisable for
        storing sensitive data.
      </Text>
      <UpdateNameModal file={currentFile} onClose={() => setCurrentFile(null)} refetch={refetch} />
    </Modal>
  );
};
