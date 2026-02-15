import {
  type Evolu,
  SimpleName,
  String as EvoluString,
  SqliteBoolean,
  createEvolu,
  id,
  nullOr,
  sqliteTrue,
} from "@evolu/common";
import { evoluReactWebDeps } from "@evolu/react-web";

export const SYNC_KEY = "elf-demo-sync";
export type SyncMode = "enabled" | "local-only";

export function getSyncMode(): SyncMode {
  try {
    const val = localStorage.getItem(SYNC_KEY);
    if (val === "enabled") return "enabled";
    if (val === "local-only") return "local-only";
  } catch {
    // SSR or storage unavailable
  }
  return "enabled";
}

export function setSyncMode(mode: SyncMode): void {
  localStorage.setItem(SYNC_KEY, mode);
}

export const SettingsId = id("Settings");
export type SettingsId = typeof SettingsId.Type;

const Schema = {
  settings: {
    id: SettingsId,
    theme: nullOr(EvoluString),
    pageTitle: nullOr(EvoluString),
  },
};

let _evolu: Evolu<typeof Schema> | null = null;

/** Create (or return cached) Evolu instance. Reads sync mode from localStorage. */
export function initEvolu() {
  if (!_evolu) {
    _evolu = createEvolu(evoluReactWebDeps)(Schema, {
      name: SimpleName.orThrow("ElfDemo"),
      ...(getSyncMode() === "local-only" ? { transports: [] } : {}),
    });
  }
  return _evolu;
}

/** Get the existing Evolu instance. Throws if called before initEvolu(). */
export function getEvolu() {
  if (!_evolu) throw new Error("Evolu not initialized");
  return _evolu;
}

type Str = typeof EvoluString.Type;

function _createSettingsQuery() {
  return getEvolu().createQuery((db) =>
    db
      .selectFrom("settings")
      .select(["id", "pageTitle"])
      .where("isDeleted", "is not", sqliteTrue)
      .limit(1),
  );
}

let _settingsQuery: ReturnType<typeof _createSettingsQuery> | null = null;

export function getSettingsQuery() {
  if (!_settingsQuery) {
    _settingsQuery = _createSettingsQuery();
  }
  return _settingsQuery;
}

export function updatePageTitle(settingsId: SettingsId, title: string) {
  getEvolu().update("settings", { id: settingsId, pageTitle: title as Str });
}

export function createSettings(fields: { pageTitle?: string | undefined }) {
  const data: Record<string, unknown> = {};
  if (fields.pageTitle) {
    data["pageTitle"] = fields.pageTitle as Str;
  }
  getEvolu().insert("settings", data);
}
