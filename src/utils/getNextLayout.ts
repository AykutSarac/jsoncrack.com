export function getNextLayout(layout: "LEFT" | "RIGHT" | "DOWN" | "UP") {
  switch (layout) {
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
