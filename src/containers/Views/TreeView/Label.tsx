import React from "react";
import { Button, HoverCard } from "@mantine/core";
import { styled, DefaultTheme } from "styled-components";
import _get from "lodash.get";
import { VscEdit } from "react-icons/vsc";
import { KeyPath } from "react-json-tree";
import useJson from "src/store/useJson";

interface LabelProps {
  keyPath: KeyPath;
  nodeType: string;
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedValue: React.Dispatch<React.SetStateAction<string | number | null>>;
  setPath: React.Dispatch<React.SetStateAction<(string | number)[]>>;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}

function getLabelColor({ $type, theme }: { $type?: string; theme: DefaultTheme }) {
  if ($type === "Object") return theme.NODE_COLORS.PARENT_OBJ;
  if ($type === "Array") return theme.NODE_COLORS.PARENT_ARR;
  return theme.NODE_COLORS.PARENT_OBJ;
}

const StyledLabel = styled.span<{ $nodeType?: string }>`
  color: ${({ theme, $nodeType }) => getLabelColor({ theme, $type: $nodeType })};

  &:hover {
    filter: brightness(1.5);
    transition: filter 0.2s ease-in-out;
  }
`;

export const Label = ({
  keyPath,
  nodeType,
  setOpened,
  setSelectedValue,
  setPath,
  setValue,
}: LabelProps) => {
  const getJson = useJson(state => state.getJson);

  return (
    <HoverCard shadow="sm" openDelay={50} closeDelay={250} withArrow position="left">
      <HoverCard.Target>
        <StyledLabel $nodeType={nodeType}>{keyPath[0]}:</StyledLabel>
      </HoverCard.Target>
      <HoverCard.Dropdown py={4}>
        <Button
          variant="transparent"
          size="xs"
          onClick={() => {
            setOpened(true);
            setSelectedValue(keyPath[0]);

            const path = keyPath.toReversed();
            const value = _get(JSON.parse(getJson()), path);

            setPath(path);
            setValue(JSON.stringify(value));
          }}
          leftSection={<VscEdit size="12" />}
        >
          Click to edit
        </Button>
      </HoverCard.Dropdown>
    </HoverCard>
  );
};
