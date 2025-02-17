import {
  type ShortcutHandler,
  isRegistered,
  register,
  unregister,
} from "@tauri-apps/api/globalShortcut"
import { useEffect } from "react"

/**
 * A React hook to register global shortcuts using Tauri's globalShortcut API.
 * Internally this uses a useEffect hook, but has proper support for React.StrictMode
 * via cleaning up the effect hook, so as to maintain idempotency.
 *
 * @param shortcut The key combination string for the shortcut
 * @param shortcutHandler The handler callback when the shortcut is triggered
 */
export const useGlobalShortcut = (
  shortcut: string,
  shortcutHandler: ShortcutHandler,
) => {
  useEffect(() => {
    let ignore = false

    async function registerShortcut() {
      const isShortcutRegistered = await isRegistered(shortcut)
      if (!ignore && !isShortcutRegistered) {
        await register(shortcut, shortcutHandler)
      }
    }

    void registerShortcut().catch((err: unknown) => {
      console.error(`Failed to register global shortcut '${shortcut}'`, err)
    })

    return () => {
      ignore = true
      void unregister(shortcut)
    }
  }, [shortcut, shortcutHandler])
}
