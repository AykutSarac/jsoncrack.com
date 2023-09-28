export { CloudModal } from "./CloudModal";
export { ClearModal } from "./ClearModal";
export { DownloadModal } from "./DownloadModal";
export { ImportModal } from "./ImportModal";
export { AccountModal } from "./AccountModal";
export { NodeModal } from "./NodeModal";
export { SettingsModal } from "./SettingsModal";
export { ShareModal } from "./ShareModal";
export { LoginModal } from "./LoginModal";
export { PremiumModal } from "./PremiumModal";
export { JWTModal } from "./JWTModal";
export { SchemaModal } from "./SchemaModal";
export { CancelPremiumModal } from "./CancelPremiumModal";
export { ReviewModal } from "./ReviewModal";
export { JQModal } from "./JQModal";

type Modal =
  | "clear"
  | "cloud"
  | "download"
  | "import"
  | "account"
  | "node"
  | "settings"
  | "share"
  | "login"
  | "premium"
  | "jwt"
  | "schema"
  | "cancelPremium"
  | "review"
  | "jq";

export type { Modal };
