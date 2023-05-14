export function getNextDirection(direction: "LEFT" | "RIGHT" | "DOWN" | "UP") {
  if (direction === "RIGHT") return "DOWN";
  if (direction === "DOWN") return "LEFT";
  if (direction === "LEFT") return "UP";
  return "RIGHT";
}
