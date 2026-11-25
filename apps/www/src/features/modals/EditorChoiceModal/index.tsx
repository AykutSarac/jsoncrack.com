import React, { useEffect, useState } from "react";
import { Modal } from "@mantine/core";
import styled from "styled-components";
import { LuArrowRight, LuCirclePlay, LuLayers, LuLink } from "react-icons/lu";
import { getToDiagramEditorUrl, openInToDiagram } from "../../../lib/utils/todiagramHandoff";
import useFile from "../../../store/useFile";

const SESSION_KEY = "editor_choice_shown";
const HERO_IMAGE = "/assets/todiagram-canvas.webp";
const LOGO = "https://todiagram.com/logo.svg";

const StyledHero = styled.div`
  position: relative;
  height: 330px;
  overflow: hidden;
  background: #0c0c0f;

  /* Brand line along the top edge */
  &::before {
    content: "";
    position: absolute;
    inset: 0 0 auto 0;
    height: 3px;
    background: linear-gradient(90deg, #ff66c4, #ffde59);
    z-index: 2;
  }

  /* Fades the screenshot into the modal */
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(12, 12, 15, 0) 52%, #0c0c0f 100%);
  }

  @media only screen and (max-width: 720px) {
    height: 200px;
  }
`;

const StyledHeroImage = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 38%;
`;

const StyledBrand = styled.div`
  position: absolute;
  left: 24px;
  top: 22px;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 8px;
  height: 36px;
  padding: 0 14px 0 10px;
  border-radius: 18px;
  background: rgba(12, 12, 15, 0.82);
  border: 1px solid #34343c;
  color: #ffffff;
  font-size: 15px;
  font-weight: 800;
`;

const StyledBody = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  margin-top: -26px;
  padding: 0 48px 32px;
  text-align: center;
  color: #dedee4;

  @media only screen and (max-width: 720px) {
    padding: 0 20px 24px;
  }
`;

const StyledTitle = styled.h2`
  margin: 0;
  font-size: 42px;
  line-height: 1.08;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: #ffffff;

  span {
    background: linear-gradient(90deg, #ff66c4 0%, #ffb45c 55%, #ffde59 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  @media only screen and (max-width: 720px) {
    font-size: 28px;
  }
`;

const StyledText = styled.p`
  margin: 12px auto 0;
  max-width: 560px;
  font-size: 16px;
  line-height: 1.5;
  color: #b3b3bd;
`;

const StyledChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const StyledChip = styled.span`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 36px;
  padding: 0 14px;
  border-radius: 18px;
  background: #15151a;
  border: 1px solid #2e2e36;
  font-size: 13.5px;
`;

const StyledActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const StyledOpenLink = styled.a`
  display: flex;
  align-items: center;
  gap: 10px;
  height: 54px;
  padding: 0 26px;
  border-radius: 14px;
  background: linear-gradient(135deg, #ff75b7, #fed761);
  box-shadow:
    inset 0 -3px 0 rgba(0, 0, 0, 0.14),
    0 12px 30px rgba(255, 117, 183, 0.25);
  color: #17171a;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  transition: filter 0.15s ease;

  &:hover {
    filter: brightness(1.06);
  }

  &:focus-visible {
    outline: 2px solid #ffffff;
    outline-offset: 2px;
  }
`;

const StyledStayButton = styled.button`
  height: 54px;
  padding: 0 22px;
  border: 1px solid #2e2e36;
  border-radius: 14px;
  background: transparent;
  color: #c9c9d1;
  font: inherit;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover {
    background: #15151a;
  }

  &:focus-visible {
    outline: 2px solid #ffffff;
    outline-offset: 2px;
  }
`;

const StyledPrivacyLink = styled.a`
  font-size: 12px;
  color: #a0a0aa;
  text-decoration: underline;

  &:hover {
    color: #ffffff;
  }
`;

// Session storage can be unavailable (blocked storage); then it shows on each load.
const wasDismissed = () => {
  try {
    return window.sessionStorage.getItem(SESSION_KEY) === "true";
  } catch {
    return false;
  }
};

const rememberDismissed = () => {
  try {
    window.sessionStorage.setItem(SESSION_KEY, "true");
  } catch {
    // Nothing to remember it in.
  }
};

export const EditorChoiceModal = () => {
  const [opened, setOpened] = useState(false);
  const format = useFile(state => state.format);
  const openUrl = getToDiagramEditorUrl({ medium: "promotion_modal", format });

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_DISABLE_EXTERNAL_MODE !== "true" && !wasDismissed()) {
      setOpened(true);
    }
  }, []);

  // Either choice counts as an answer for the rest of this browser session.
  const handleDismiss = () => {
    setOpened(false);
    rememberDismissed();
  };

  const handleOpen = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const handedOff = openInToDiagram({
      url: openUrl,
      content: useFile.getState().getContents(),
      format,
    });

    // Popup blocked: let the anchor navigate normally.
    if (handedOff) event.preventDefault();
    handleDismiss();
  };

  if (!opened) return null;

  return (
    <Modal
      opened={opened}
      onClose={handleDismiss}
      centered
      size={960}
      radius={22}
      padding={0}
      withCloseButton={false}
      overlayProps={{ color: "#08080a", backgroundOpacity: 0.8, blur: 2 }}
      styles={{
        content: { background: "#0c0c0f", border: "1px solid #2a2a31" },
        body: { padding: 0 },
      }}
    >
      <StyledHero>
        <StyledHeroImage
          src={HERO_IMAGE}
          alt="An order file drawn as a colour-coded diagram on ToDiagram's canvas"
        />
        <StyledBrand>
          <img src={LOGO} alt="" width={20} height={20} />
          ToDiagram
        </StyledBrand>
      </StyledHero>
      <StyledBody>
        <div>
          <StyledTitle>
            Your file, on a <span>better canvas.</span>
          </StyledTitle>
          <StyledText>
            ToDiagram is the new editor from the JSON Crack team. Free, no account, and your file
            comes with you.
          </StyledText>
        </div>
        <StyledChips>
          <StyledChip>
            <LuLink size={15} color="#ff8fcb" aria-hidden />
            Share with a link
          </StyledChip>
          <StyledChip>
            <LuCirclePlay size={15} color="#ffb45c" aria-hidden />
            SVG and animated MP4 export
          </StyledChip>
          <StyledChip>
            <LuLayers size={15} color="#ffde59" aria-hidden />
            Mermaid and custom diagrams
          </StyledChip>
        </StyledChips>
        <StyledActions>
          <StyledOpenLink href={openUrl} target="_blank" onClick={handleOpen} data-autofocus>
            Open my file in ToDiagram
            <LuArrowRight size={18} strokeWidth={2.6} aria-hidden />
          </StyledOpenLink>
          <StyledStayButton type="button" onClick={handleDismiss}>
            Stay in JSON Crack
          </StyledStayButton>
        </StyledActions>
        <StyledPrivacyLink
          href="https://todiagram.com/legal/privacy?utm_source=jsoncrack&utm_medium=promotion_modal"
          target="_blank"
          rel="noopener noreferrer"
        >
          ToDiagram Privacy Policy
        </StyledPrivacyLink>
      </StyledBody>
    </Modal>
  );
};
