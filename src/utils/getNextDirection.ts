export function getNextDirection(direction: "LEFT" | "RIGHT" | "DOWN" | "UP") {
  switch (direction) {
    case "RIGHT":
      return "DOWN";

    case "DOWN":
      return "LEFT";

    case "LEFT":
      return "UP";

    default:
      return "RIGHT";
  }
}
