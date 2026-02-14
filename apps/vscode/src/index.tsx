import "@mantine/core/styles.css";
import "@mantine/code-highlight/styles.css";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./global.css";

const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);
root.render(<App />);
