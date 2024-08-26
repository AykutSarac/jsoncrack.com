export { CloudModal } from "./CloudModal";
export { ClearModal } from "./ClearModal";
export { DownloadModal } from "./DownloadModal";
export { ImportModal } from "./ImportModal";
export { AccountModal } from "./AccountModal";
export { NodeModal } from "./NodeModal";
export { ShareModal } from "./ShareModal";
export { LoginModal } from "./LoginModal";
export { UpgradeModal } from "./UpgradeModal";
export { JWTModal } from "./JWTModal";
export { SchemaModal } from "./SchemaModal";
export { ReviewModal } from "./ReviewModal";
export { JQModal } from "./JQModal";
export { TypeModal } from "./TypeModal";
export { JPathModal } from "./JPathModal";
export { NoticeModal } from "./NoticeModal";

type Modal =
  | "cloud"
  | "download"
  | "import"
  | "account"
  | "node"
  | "share"
  | "login"
  | "upgrade"
  | "jwt"
  | "schema"
  | "review"
  | "jq"
  | "type"
  | "jpath"
  | "notice";

export type { Modal };
