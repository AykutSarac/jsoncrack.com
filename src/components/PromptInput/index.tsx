import React from "react";
import { ActionIcon, TextInput, Loader, Tooltip, HoverCard, Flex, Badge } from "@mantine/core";
import { getHotkeyHandler } from "@mantine/hooks";
import styled from "styled-components";
import { FunctionsHttpError } from "@supabase/supabase-js";
import toast from "react-hot-toast";
import { GoDependabot } from "react-icons/go";
import { VscClose, VscQuestion } from "react-icons/vsc";
import useJsonQuery from "src/hooks/useJsonQuery";
import { supabase } from "src/lib/api/supabase";
import useConfig from "src/store/useConfig";
import useUser from "src/store/useUser";

const StyledPromptInput = styled(TextInput)`
  .mantine-TextInput-wrapper {
    margin-bottom: 0;
  }
  .mantine-TextInput-input {
    font-weight: 500;
    background: ${({ theme }) => theme.PROMPT_BG};
    color: ${({ theme }) => theme.PROMPT_TEXT_COLOR};
    border: none;
    border-bottom: 1px solid
      ${({ theme, error }) => (error ? theme.DANGER : theme.PROMPT_BORDER_COLOR)};

    :focus-within {
      border-color: #15593a;
    }
  }

  .mantine-TextInput-error {
    padding: 4px;
    border-bottom: 1px solid ${({ theme }) => theme.DANGER};
    background: #280000;
  }

  svg {
    color: ${({ theme }) => theme.PROMPT_TEXT_COLOR};
  }

  ::placeholder {
    color: ${({ theme }) => theme.PROMPT_PLACEHOLDER_COLOR};
  }
`;

export const PromptInput = () => {
  const { updateJson, getJsonType } = useJsonQuery();
  const premium = useUser(state => state.premium);
  const [completing, setCompleting] = React.useState(false);
  const [prompt, setPrompt] = React.useState("");
  const promptVisible = useConfig(state => state.aiEnabled);
  const [promptError, setPromptError] = React.useState<string | null>(null);

  const onSubmit = async () => {
    try {
      setPromptError(null);
      setCompleting(true);
      const jsonModel = await getJsonType();

      const { data, error } = await supabase.functions.invoke("jq", {
        body: { query: prompt, jsonModel },
      });

      if (error instanceof FunctionsHttpError) {
        const errorMessage = await error.context.json();
        throw Error(errorMessage.error);
      }

      // extract jq command
      const jqOutput = data.command;
      const regex = /'([^']*)'/;
      const match = jqOutput.match(regex);

      if (match && match[1]) {
        const extractedString = match[1];
        updateJson(extractedString);
        toast.success(`${data.credits} credits left for today.`);
      } else {
        throw Error("An error occured while parsing result.");
      }
    } catch (error: any) {
      console.error(error);
      if (error instanceof Error) setPromptError(error.message);
    } finally {
      setCompleting(false);
    }
  };

  if (!promptVisible || !premium) return null;

  return (
    <Tooltip.Floating
      disabled={premium}
      label="JSON Crack AI is currently only available to premium users"
      fz="xs"
      withinPortal
    >
      <div>
        <StyledPromptInput
          placeholder="Ask JSON Crack AI to transform the data"
          value={prompt}
          onChange={e => setPrompt(e.currentTarget.value)}
          maxLength={200}
          disabled={!premium || completing}
          onKeyDown={getHotkeyHandler([["Enter", onSubmit]])}
          onSubmit={onSubmit}
          error={
            promptError && (
              <Flex align="center" justify="space-between">
                {promptError}
                <ActionIcon
                  size="xs"
                  variant="transparent"
                  title="Close Error"
                  onClick={() => setPromptError(null)}
                >
                  <VscClose color="red" />
                </ActionIcon>
              </Flex>
            )
          }
          rightSection={
            <>
              <HoverCard withArrow withinPortal>
                <HoverCard.Target>
                  <ActionIcon variant="transparent">
                    <VscQuestion />
                  </ActionIcon>
                </HoverCard.Target>
                <HoverCard.Dropdown maw={300} fz="xs">
                  This feature is in the{" "}
                  <Badge size="xs" radius={2} variant="light">
                    alpha
                  </Badge>{" "}
                  phase, and its results may not always be accurate. Be cautious, as invalid actions
                  still consume a credit. We only process the schema of your data and DO NOT process
                  values.
                  <br />
                  <br />
                  You receive <b>10 credits</b> daily, and you have the option to deactivate this
                  feature in the settings located at the upper right corner of the editor.
                  <br />
                  <br />
                  Examples:
                  <li>
                    <code>Retrieve members whose names begin with &quot;M&quot;</code>
                  </li>
                  <li>
                    <code>Retrieve members with age older than 30</code>
                  </li>
                </HoverCard.Dropdown>
              </HoverCard>
            </>
          }
          leftSection={completing ? <Loader size="xs" /> : <GoDependabot strokeWidth={1} />}
          radius={0}
        />
      </div>
    </Tooltip.Floating>
  );
};
