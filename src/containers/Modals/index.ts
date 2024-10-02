export { DownloadModal } from "./DownloadModal";
export { ImportModal } from "./ImportModal";
export { NodeModal } from "./NodeModal";
export { UpgradeModal } from "./UpgradeModal";
export { JWTModal } from "./JWTModal";
export { SchemaModal } from "./SchemaModal";
export { JQModal } from "./JQModal";
export { TypeModal } from "./TypeModal";
export { JPathModal } from "./JPathModal";

type Modal =
  | "download"
  | "import"
  | "node"
  | "upgrade"
  | "jwt"
  | "schema"
  | "jq"
  | "type"
  | "jpath";

export type { Modal };
