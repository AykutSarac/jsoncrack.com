import * as ModalComponents from ".";

// Define the modals array separate from the component logic
export const modals = Object.freeze(Object.keys(ModalComponents)) as Extract<
  keyof typeof ModalComponents,
  string
>[];

export type ModalName = (typeof modals)[number];
