export const NODE_DIMENSIONS = {
  ROW_HEIGHT: 24, // Regular row height
  PARENT_HEIGHT: 36, // Height for parent nodes
} as const;

export const SUPPORTED_LIMIT = +(process.env.NEXT_PUBLIC_NODE_LIMIT as string);
