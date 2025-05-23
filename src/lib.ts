import { invoke } from "@tauri-apps/api/core";

export async function isWindows(): Promise<boolean> {
    return await invoke("is_windows");
}
