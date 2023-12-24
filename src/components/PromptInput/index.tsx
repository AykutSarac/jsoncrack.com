import React from "react";
import { ActionIcon, TextInput, Loader, Tooltip } from "@mantine/core";
import { getHotkeyHandler } from "@mantine/hooks";
import styled from "styled-components";
import { toast } from "react-hot-toast";
import { GoDependabot } from "react-icons/go";
import { VscClose, VscQuestion } from "react-icons/vsc";
import useJsonQuery from "src/hooks/useJsonQuery";
import { supabase } from "src/lib/api/supabase";
import useUser from "src/store/useUser";

function removeWhitespaces(inputString: string) {
  // Remove extra whitespaces and newlines
  const compactString = inputString.replace(/\s+/g, "").replaceAll("interface", "interface ");
  return compactString;
}

const StyledPromptInput = styled(TextInput)`
  .mantine-Input-input {
    font-weight: 500;
    background: ${({ theme }) => theme.PROMPT_BG};
    color: ${({ theme }) => theme.PROMPT_TEXT_COLOR};
    border: none;
    border-bottom: 1px solid ${({ theme }) => theme.PROMPT_BORDER_COLOR};

    :focus-within {
      border-color: #15593a;
    }
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
  const [promptVisible, setPromptVisible] = React.useState(true);

  const onSubmit = async () => {
    try {
      setCompleting(true);

      const resp = await supabase.functions.invoke("jq", {
        body: {
          query: prompt,
          jsonModel: removeWhitespaces(getJsonType()),
        },
      });

      // extract jq command
      const jqOutput = resp.data.choices[0].message?.content || "";
      const regex = /'([^']*)'/;
      const match = jqOutput.match(regex);

      if (match && match[1]) {
        const extractedString = match[1];
        updateJson(extractedString);
      } else {
        throw Error("An error occured while parsing result.");
      }
    } catch (error) {
      toast.error("An error occured while parsing result.");
    } finally {
      setCompleting(false);
    }
  };

  if (!promptVisible) return null;

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
          rightSectionWidth={60}
          maxLength={200}
          disabled={!premium || completing}
          onKeyDown={getHotkeyHandler([["Enter", onSubmit]])}
          onSubmit={onSubmit}
          rightSection={
            <>
              <Tooltip
                label="This feature is in the experimental phase, and its outcomes may not consistently reflect accuracy. It solely utilizes the schema without incorporating values, hence your actions should align with your particular schema. Please note that we do not store your data."
                maw={300}
                multiline
                withinPortal
                fz="xs"
                withArrow
              >
                <ActionIcon variant="transparent">
                  <VscQuestion />
                </ActionIcon>
              </Tooltip>
              <ActionIcon
                variant="transparent"
                title="Close"
                onClick={() => setPromptVisible(false)}
              >
                <VscClose />
              </ActionIcon>
            </>
          }
          leftSection={completing ? <Loader size="xs" /> : <GoDependabot strokeWidth={1} />}
          radius={0}
        />
      </div>
    </Tooltip.Floating>
  );
};
