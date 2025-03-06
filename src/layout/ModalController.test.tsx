import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ModalController from "./ModalController";
import { render, screen } from "@testing-library/react";
import useModal from "src/store/useModal";
import { render } from "@testing-library/react";

// No additional imports required.
// No additional imports required since ModalController, useModal, render, screen, and fireEvent are already imported above.
// Variable to capture calls to the setVisible function.
let setVisibleCalls = [];
jest.mock("src/store/useModal", () => {
  return jest.fn((selector) => {
    // Fake state of the modal store: only the "download" modal is open.
    const fakeState = {
      import: false,
      download: true,
      upgrade: false,
      jwt: false,
      node: false,
      schema: false,
      jq: false,
      type: false,
      jpath: false,
      setVisible: (key) => (visible) => {
        setVisibleCalls.push({ key, visible });
      },
    };
    return selector(fakeState);
  });
});
jest.mock("src/containers/Modals", () => ({
  ImportModal: ({ opened, onClose }) =>
    opened ? <div data-testid="import-modal">Import Modal</div> : null,
  DownloadModal: ({ opened, onClose }) =>
    opened ? (
      <div data-testid="download-modal" onClick={onClose}>
        Download Modal
      </div>
    ) : null,
  UpgradeModal: ({ opened, onClose }) =>
    opened ? <div data-testid="upgrade-modal">Upgrade Modal</div> : null,
  JWTModal: ({ opened, onClose }) =>
    opened ? <div data-testid="jwt-modal">JWT Modal</div> : null,
  NodeModal: ({ opened, onClose }) =>
    opened ? <div data-testid="node-modal">Node Modal</div> : null,
  SchemaModal: ({ opened, onClose }) =>
    opened ? <div data-testid="schema-modal">Schema Modal</div> : null,
  JQModal: ({ opened, onClose }) =>
    opened ? <div data-testid="jq-modal">JQ Modal</div> : null,
  TypeModal: ({ opened, onClose }) =>
    opened ? <div data-testid="type-modal">Type Modal</div> : null,
  JPathModal: ({ opened, onClose }) =>
    opened ? <div data-testid="jpath-modal">JPath Modal</div> : null,
}));
beforeEach(() => {
  // Reset the captured setVisible calls before each test.
  setVisibleCalls = [];
});
test("should render DownloadModal when state is true and trigger onClose callback correctly", () => {
  /**
   * This test verifies that the DownloadModal renders when its state is true in the modal store,
   * and that clicking on the modal triggers the onClose callback, which in turn calls
   * the setVisible function with the correct parameters.
   */
  render(<ModalController />);
  // Verify that the DownloadModal is rendered.
  const downloadModal = screen.getByTestId("download-modal");
  expect(downloadModal).toBeInTheDocument();
  // Simulate a user clicking on the modal to trigger the onClose callback.
  fireEvent.click(downloadModal);
  // The setVisible function should be called for the "download" key with false.
  expect(setVisibleCalls).toContainEqual({ key: "download", visible: false });
});
test("should not render modals that are closed", () => {
  /**
   * This test verifies that only the open modal (download) is rendered by ModalController,
   * while all the other modals remain closed and are not present in the DOM.
   */
  render(<ModalController />);
  expect(screen.queryByTestId("download-modal")).toBeInTheDocument();
  expect(screen.queryByTestId("import-modal")).not.toBeInTheDocument();
  expect(screen.queryByTestId("upgrade-modal")).not.toBeInTheDocument();
  expect(screen.queryByTestId("jwt-modal")).not.toBeInTheDocument();
  expect(screen.queryByTestId("node-modal")).not.toBeInTheDocument();
  expect(screen.queryByTestId("schema-modal")).not.toBeInTheDocument();
  expect(screen.queryByTestId("jq-modal")).not.toBeInTheDocument();
  expect(screen.queryByTestId("type-modal")).not.toBeInTheDocument();
  expect(screen.queryByTestId("jpath-modal")).not.toBeInTheDocument();
});
test("should render multiple modals open and trigger their onClose callbacks correctly", () => {
  /**
   * This test verifies that when multiple modals are open (import, download, and jwt),
   * the ModalController renders them correctly and that clicking on each modal triggers its onClose
   * callback by calling setVisible with false for the corresponding modal.
   */
  // Override the useModal mock to return a state with multiple modals open.
  useModal.mockImplementation((selector) => {
    const fakeState = {
      import: true,
      download: true,
      upgrade: false,
      jwt: true,
      node: false,
      schema: false,
      jq: false,
      type: false,
      jpath: false,
      setVisible: (key) => (visible) => {
        setVisibleCalls.push({ key, visible });
      },
    };
    return selector(fakeState);
  });
  render(<ModalController />);
  // Check that the "import", "download", and "jwt" modals are rendered.
  expect(screen.queryByTestId("import-modal")).toBeInTheDocument();
  expect(screen.queryByTestId("download-modal")).toBeInTheDocument();
  expect(screen.queryByTestId("jwt-modal")).toBeInTheDocument();
  // Check that a modal that should remain closed is not in the document.
  expect(screen.queryByTestId("upgrade-modal")).not.toBeInTheDocument();
  // Simulate closing the "import" modal.
  fireEvent.click(screen.getByTestId("import-modal"));
  // Simulate closing the "jwt" modal.
  fireEvent.click(screen.getByTestId("jwt-modal"));
  // Verify that onClose for the "import" and "jwt" modals have called setVisible with false.
  expect(setVisibleCalls).toContainEqual({ key: "import", visible: false });
  expect(setVisibleCalls).toContainEqual({ key: "jwt", visible: false });
});
test("should not render any modals when all modal states are false", () => {
  /**
   * This test verifies that when all modals are closed in the modal store,
   * the ModalController does not render any modal components.
   */
  useModal.mockImplementation((selector) => {
    const fakeState = {
      import: false,
      download: false,
      upgrade: false,
      jwt: false,
      node: false,
      schema: false,
      jq: false,
      type: false,
      jpath: false,
      setVisible: (key) => (visible) => {
        setVisibleCalls.push({ key, visible });
      },
    };
    return selector(fakeState);
  });
  render(<ModalController />);
  // Assert that no modal is rendered when all modal states are false.
  expect(screen.queryByTestId("import-modal")).not.toBeInTheDocument();
  expect(screen.queryByTestId("download-modal")).not.toBeInTheDocument();
  expect(screen.queryByTestId("upgrade-modal")).not.toBeInTheDocument();
  expect(screen.queryByTestId("jwt-modal")).not.toBeInTheDocument();
  expect(screen.queryByTestId("node-modal")).not.toBeInTheDocument();
  expect(screen.queryByTestId("schema-modal")).not.toBeInTheDocument();
  expect(screen.queryByTestId("jq-modal")).not.toBeInTheDocument();
  expect(screen.queryByTestId("type-modal")).not.toBeInTheDocument();
  expect(screen.queryByTestId("jpath-modal")).not.toBeInTheDocument();
});
test("should render all modals open and trigger their onClose callbacks for every modal", () => {
  /**
   * This test verifies that when all modal states are true in the modal store,
   * the ModalController renders every modal component and clicking on each modal triggers
   * its onClose callback, which in turn calls setVisible with false for the corresponding modal.
   */
  // Override the useModal mock to return a state with all modals open.
  useModal.mockImplementation((selector) => {
    const fakeState = {
      import: true,
      download: true,
      upgrade: true,
      jwt: true,
      node: true,
      schema: true,
      jq: true,
      type: true,
      jpath: true,
      setVisible: (key) => (visible) => {
        setVisibleCalls.push({ key, visible });
      },
    };
    return selector(fakeState);
  });
  
  // Render the ModalController
  render(<ModalController />);
  
  const modalTestIds = [
    "import-modal",
    "download-modal",
    "upgrade-modal",
    "jwt-modal",
    "node-modal",
    "schema-modal",
    "jq-modal",
    "type-modal",
    "jpath-modal",
  ];
  
  // Loop through all modal test ids and verify that they are rendered.
  modalTestIds.forEach((testId) => {
    const modalElement = screen.getByTestId(testId);
    expect(modalElement).toBeInTheDocument();
    fireEvent.click(modalElement);
  });
  
  // Verify that onClose has been called for each modal.
  const modalKeys = [
    "import",
    "download",
    "upgrade",
    "jwt",
    "node",
    "schema",
    "jq",
    "type",
    "jpath",
  ];
  
  modalKeys.forEach((key) => {
    expect(setVisibleCalls).toContainEqual({ key, visible: false });
  });
});
test("should call useModal exactly two times upon rendering", () => {
  /**
   * This test verifies that ModalController calls the useModal hook exactly twice:
   * once for retrieving the setVisible function, and once for retrieving the modal states.
   * This ensures the component is correctly using the modal store without redundant calls.
   */
  // Clear previous useModal calls to ensure a clean test environment.
  useModal.mockClear();
  
  // Render the ModalController.
  render(<ModalController />);
  
  // Verify that useModal has been called exactly two times.
  expect(useModal).toHaveBeenCalledTimes(2);
});
test("should render modals in the correct order when multiple modals are open", () => {
  /**
   * This test verifies that when all modal states are set to true,
   * the ModalController renders the modal components in the order defined
   * in the modalComponents array. It checks that the first rendered modal is
   * the 'import' modal and the last is the 'jpath' modal.
   */
  // Override the useModal mock to return a state with all modals open.
  useModal.mockImplementation((selector) => {
    const fakeState = {
      import: true,
      download: true,
      upgrade: true,
      jwt: true,
      node: true,
      schema: true,
      jq: true,
      type: true,
      jpath: true,
      setVisible: (key) => (visible) => {
        // For ordering test, we don't need to record calls here.
      },
    };
    return selector(fakeState);
  });
  // Render the ModalController. We use the render result's container to inspect DOM order.
  const { container } = render(<ModalController />);
  // Select all modal elements rendered by their data-testid attribute.
  const renderedModals = container.querySelectorAll("div[data-testid]");
  const renderedTestIds = Array.from(renderedModals).map((div) =>
    div.getAttribute("data-testid")
  );
  // Expected order of modals as defined in ModalController's modalComponents array.
  const expectedOrder = [
    "import-modal",
    "download-modal",
    "upgrade-modal",
    "jwt-modal",
    "node-modal",
    "schema-modal",
    "jq-modal",
    "type-modal",
    "jpath-modal",
  ];
  expect(renderedTestIds).toEqual(expectedOrder);
});
test("should render no modals when modal state keys are undefined", () => {
  /**
   * This test verifies that if the modal store does not provide boolean state values for modal keys (i.e., returns undefined),
   * the ModalController correctly renders no modal components, since undefined is falsy.
   */
  useModal.mockImplementation((selector) => {
    const fakeState = {
      // intentionally omitting modal boolean states so that state[modal.key] returns undefined
      setVisible: (key) => (visible) => {
        setVisibleCalls.push({ key, visible });
      },
    };
    return selector(fakeState);
  });
  render(<ModalController />);
  const testIds = [
    "import-modal",
    "download-modal",
    "upgrade-modal",
    "jwt-modal",
    "node-modal",
    "schema-modal",
    "jq-modal",
    "type-modal",
    "jpath-modal",
  ];
  
  testIds.forEach((testId) => {
    expect(screen.queryByTestId(testId)).not.toBeInTheDocument();
  });
});
test("should render only modals with truthy state values when some modal state keys are missing", () => {
  /**
   * This test verifies that ModalController only renders modal components for which the modal state
   * is explicitly truthy. In this case, the fake modal store only provides values for 'import' and 'jwt'
   * (as true) while other modal keys are missing (undefined, which is falsy) or set to false. The test confirms
   * that only the corresponding modals are rendered.
   */
  // Override the useModal mock to simulate a partial state:
  useModal.mockImplementation((selector) => {
    const fakeState = {
      import: true,
      // 'download' is omitted (undefined)
      upgrade: false,
      jwt: true,
      // Other modals ('node', 'schema', 'jq', 'type', 'jpath') are omitted (undefined)
      setVisible: (key) => (visible) => {
        setVisibleCalls.push({ key, visible });
      },
    };
    return selector(fakeState);
  });
  
  render(<ModalController />);
  
  // The 'import' and 'jwt' modals should render because their state is true.
  expect(screen.queryByTestId("import-modal")).toBeInTheDocument();
  expect(screen.queryByTestId("jwt-modal")).toBeInTheDocument();
  
  // The others should not be rendered: 'download' is undefined (falsy), 'upgrade' is false, and the rest are omitted.
  expect(screen.queryByTestId("download-modal")).not.toBeInTheDocument();
  expect(screen.queryByTestId("upgrade-modal")).not.toBeInTheDocument();
  expect(screen.queryByTestId("node-modal")).not.toBeInTheDocument();
  expect(screen.queryByTestId("schema-modal")).not.toBeInTheDocument();
  expect(screen.queryByTestId("jq-modal")).not.toBeInTheDocument();
  expect(screen.queryByTestId("type-modal")).not.toBeInTheDocument();
  expect(screen.queryByTestId("jpath-modal")).not.toBeInTheDocument();
});
test("should render modal with truthy non-boolean state and trigger onClose callback correctly", () => {
  /**
   * This test verifies that if a modal state is not strictly a boolean but truthy (e.g. 1),
   * the ModalController still renders the modal, and clicking on it triggers the onClose callback,
   * which in turn calls setVisible with false.
   */
  // Override useModal to simulate a modal with a non-boolean truthy value for 'import'.
  useModal.mockImplementation(selector => {
    const fakeState = {
      import: 1,       // truthy value (non-boolean)
      download: 0,     // falsy value
      upgrade: false,
      jwt: false,
      node: false,
      schema: false,
      jq: false,
      type: false,
      jpath: false,
      setVisible: key => visible => {
        setVisibleCalls.push({ key, visible });
      },
    };
    return selector(fakeState);
  });
  render(<ModalController />);
  // The 'import' modal should render because its state is truthy.
  const importModal = screen.getByTestId("import-modal");
  expect(importModal).toBeInTheDocument();
  // The 'download' modal should not render because its state is falsy.
  expect(screen.queryByTestId("download-modal")).not.toBeInTheDocument();
  // Simulate a click to trigger the onClose callback for the 'import' modal.
  fireEvent.click(importModal);
  // Verify that the onClose callback calls setVisible with the correct values.
  expect(setVisibleCalls).toContainEqual({ key: "import", visible: false });
});