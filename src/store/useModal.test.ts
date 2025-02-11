import useModal from "./useModal";

// No additional imports needed as we only use "useModal" already imported and Jest globals.
/**
 * Test that verifies the modal store's setVisible function correctly updates the 
 * state of a given modal.
 */
test("Modal store: setVisible correctly updates the modal state", () => {
  // Access the default state from the modal store.
  const initialState = useModal.getState();
  
  // Verify that all modals start with a false (not visible) state.
  expect(initialState.download).toBe(false);
  expect(initialState.import).toBe(false);
  expect(initialState.node).toBe(false);
  expect(initialState.upgrade).toBe(false);
  expect(initialState.jwt).toBe(false);
  expect(initialState.schema).toBe(false);
  expect(initialState.jq).toBe(false);
  expect(initialState.type).toBe(false);
  expect(initialState.jpath).toBe(false);
  
  // Update the 'download' modal to be visible.
  initialState.setVisible("download")(true);
  
  // Get the updated state.
  const updatedState = useModal.getState();
  
  // Verify that 'download' is now true while other modals remain false.
  expect(updatedState.download).toBe(true);
  expect(updatedState.import).toBe(false);
});
/**
 * Test that verifies toggling a modal's visible state multiple times.
 * This test sets a specific modal ("node") to true, verifies the update,
 * then toggles it back to false and checks the state again.
 */
test("Modal store: toggling modal state multiple times", () => {
  const modal = "node";
  
  // Get the initial state and verify that the modal is initially false.
  const initialState = useModal.getState();
  expect(initialState[modal]).toBe(false);
  
  // Set the modal state to true.
  initialState.setVisible(modal)(true);
  const stateAfterTrue = useModal.getState();
  expect(stateAfterTrue[modal]).toBe(true);
  
  // Toggle the modal back to false.
  stateAfterTrue.setVisible(modal)(false);
  const stateAfterFalse = useModal.getState();
  expect(stateAfterFalse[modal]).toBe(false);
});
/**
 * Test that verifies updating multiple modals concurrently:
 * This test sets a few modals to "true" simultaneously and ensures that 
 * only those modals are updated while the others remain unchanged. It then resets
 * the updated modals back to "false" and verifies that the complete state returns to its initial condition.
 */
test("Modal store: updating multiple modals concurrently does not interfere with other modals", () => {
  // Define the modals that will be toggled in this test.
  const modalsToToggle: Array<keyof typeof useModal.getState()> = ["download", "import", "node"];
  
  // Set the selected modals to true.
  modalsToToggle.forEach(modal => {
    useModal.getState().setVisible(modal)(true);
  });
  
  // Retrieve the updated state.
  const stateAfterUpdate = useModal.getState();
  
  // Verify that the toggled modals are true.
  modalsToToggle.forEach(modal => {
    expect(stateAfterUpdate[modal]).toBe(true);
  });
  
  // Verify that the other modals remain false.
  // Filter out the "setVisible" function and the modals we updated.
  Object.keys(stateAfterUpdate)
    .filter(key => key !== "setVisible" && !modalsToToggle.includes(key as any))
    .forEach(modalKey => {
      // We know that every key other than setVisible should be a boolean
      expect((stateAfterUpdate as any)[modalKey]).toBe(false);
    });
  
  // Reset the toggled modals back to false.
  modalsToToggle.forEach(modal => {
    useModal.getState().setVisible(modal)(false);
  });
  
  // Verify that all modals (excluding setVisible) are false.
  const finalState = useModal.getState();
  Object.keys(finalState)
    .filter(key => key !== "setVisible")
    .forEach(modalKey => {
      expect((finalState as any)[modalKey]).toBe(false);
    });
});
/**
 * Test that verifies the store's subscription mechanism.
 * It subscribes a listener to the modal store, updates the state for the "jq" modal,
 * confirms that the listener is notified with the updated state,
 * then unsubscribes and verifies that further updates do not trigger the listener.
 */
test("Modal store: subscription updates when modal state changes", () => {
  // Create a mock listener function.
  const listener = jest.fn();
  // Subscribe the listener to the modal store updates.
  const unsubscribe = useModal.subscribe(listener);
  // Update the state for the "jq" modal to true.
  useModal.getState().setVisible("jq")(true);
  // Expect the listener to have been called at least once.
  expect(listener).toHaveBeenCalled();
  // Retrieve the last call argument of the listener.
  const lastState = listener.mock.calls[listener.mock.calls.length - 1][0];
  expect(lastState.jq).toBe(true);
  // Now unsubscribe the listener.
  unsubscribe();
  // Clear the listener's history.
  listener.mockClear();
  // Update the state again - this time setting the "jq" modal to false.
  useModal.getState().setVisible("jq")(false);
  // Verify that the listener was not called after unsubscribing.
  expect(listener).not.toHaveBeenCalled();
});
/**
 * Test that verifies the behavior of multiple subscriptions.
 * This test subscribes two listeners to the modal store,
 * updates a modal state, confirms both listeners are notified,
 * unsubscribes the first listener, and then verifies that upon a subsequent update,
 * only the second listener is notified. This ensures that unsubscribing one listener
 * does not affect any others.
 */
test("Modal store: multiple subscriptions management", () => {
  const listener1 = jest.fn();
  const listener2 = jest.fn();
  
  // Subscribe both listeners to the modal store.
  const unsubscribe1 = useModal.subscribe(listener1);
  const unsubscribe2 = useModal.subscribe(listener2);
  
  // Update the "schema" modal to true.
  useModal.getState().setVisible("schema")(true);
  
  // Both listeners should be notified.
  expect(listener1).toHaveBeenCalled();
  expect(listener2).toHaveBeenCalled();
  
  // Verify that the last call argument for listener1 has "schema" set to true.
  const lastState1 = listener1.mock.calls[listener1.mock.calls.length - 1][0];
  expect(lastState1.schema).toBe(true);
  
  // Unsubscribe listener1.
  unsubscribe1();
  
  // Clear mocks to track only the next update.
  listener1.mockClear();
  listener2.mockClear();
  
  // Update the "schema" modal back to false.
  useModal.getState().setVisible("schema")(false);
  
  // Expect listener1 (unsubscribed) not to be called,
  // while listener2 should receive the update.
  expect(listener1).not.toHaveBeenCalled();
  expect(listener2).toHaveBeenCalled();
  
  // Confirm that the global state for "schema" is now false.
  const finalState = useModal.getState();
  expect(finalState.schema).toBe(false);
  
  // Clean up by unsubscribing listener2.
  unsubscribe2();
});