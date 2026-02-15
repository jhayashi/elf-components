/** Zed editor theme format types and configurable theme manager. */

export interface ZedThemeFile {
  $schema?: string;
  name: string;
  author?: string;
  themes: ZedTheme[];
}

export interface ZedTheme {
  name: string;
  appearance: "light" | "dark";
  style: Record<string, string>;
}

export interface ThemeEntry {
  id: string;
  name: string;
  file: ZedThemeFile;
}

export type Appearance = "light" | "dark" | "system";

interface SavedTheme {
  themeId: string;
  custom?: ZedThemeFile;
  appearance?: Appearance | undefined;
}

export interface ThemeManager {
  /** Read the saved theme from localStorage and apply it. Returns a cleanup function. */
  applySelected(): () => void;
  /** Apply the light variant of the saved theme, ignoring prefers-color-scheme. */
  applyLight(): () => void;
  /** Read the saved theme ID from localStorage. */
  getSelectedId(): string;
  /** Read the saved custom theme file from localStorage, if any. */
  getCustomFile(): ZedThemeFile | undefined;
  /** Save theme selection to localStorage. */
  setSelected(id: string, customFile?: ZedThemeFile): void;
  /** Read the saved appearance mode from localStorage (defaults to "system"). */
  getAppearance(): Appearance;
  /** Save appearance mode to localStorage. */
  setAppearance(appearance: Appearance): void;
}

/**
 * Apply a Zed theme's style properties as CSS custom properties on the
 * document root. Keys like `text.muted` become `--text-muted`.
 */
export function applyThemeStyle(style: Record<string, string>): void {
  const root = document.documentElement;
  for (const [key, value] of Object.entries(style)) {
    root.style.setProperty("--" + key.replaceAll(".", "-").replaceAll("_", "-"), value);
  }
}

/**
 * Pick the theme matching the current `prefers-color-scheme` and apply it.
 * Returns a cleanup function that removes the inline styles.
 */
export function applyZedTheme(themeFile: ZedThemeFile): () => void {
  const root = document.documentElement;
  const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const appearance = isDark ? "dark" : "light";
  const theme = themeFile.themes.find((t) => t.appearance === appearance);
  if (theme) {
    applyThemeStyle(theme.style);
  }
  root.style.setProperty("color-scheme", "light dark");

  // Listen for changes
  const mql = window.matchMedia("(prefers-color-scheme: dark)");
  const handler = (e: MediaQueryListEvent) => {
    const next = themeFile.themes.find(
      (t) => t.appearance === (e.matches ? "dark" : "light"),
    );
    if (next) {
      applyThemeStyle(next.style);
    }
  };
  mql.addEventListener("change", handler);

  return () => {
    mql.removeEventListener("change", handler);
    root.style.removeProperty("color-scheme");
    if (theme) {
      for (const key of Object.keys(theme.style)) {
        root.style.removeProperty("--" + key.replaceAll(".", "-").replaceAll("_", "-"));
      }
    }
  };
}

/**
 * Apply a Zed theme with an explicit appearance mode.
 * - `"light"` or `"dark"`: force that variant, no media query listener.
 * - `"system"`: follow OS preference (same as `applyZedTheme()`).
 * Returns a cleanup function.
 */
export function applyZedThemeWithAppearance(
  themeFile: ZedThemeFile,
  appearance: Appearance,
): () => void {
  if (appearance === "system") {
    return applyZedTheme(themeFile);
  }

  const root = document.documentElement;
  const theme = themeFile.themes.find((t) => t.appearance === appearance);
  if (theme) {
    applyThemeStyle(theme.style);
  }
  root.style.setProperty("color-scheme", appearance);

  return () => {
    root.style.removeProperty("color-scheme");
    if (theme) {
      for (const key of Object.keys(theme.style)) {
        root.style.removeProperty("--" + key.replaceAll(".", "-").replaceAll("_", "-"));
      }
    }
  };
}

/**
 * Create a theme manager configured for a specific app.
 */
export function createThemeManager(config: {
  storageKey: string;
  defaultThemeId: string;
  bundledThemes: ThemeEntry[];
}): ThemeManager {
  function getSavedTheme(): SavedTheme {
    try {
      const raw = localStorage.getItem(config.storageKey);
      if (raw) return JSON.parse(raw);
    } catch {
      // ignore
    }
    return { themeId: config.defaultThemeId };
  }

  function resolveThemeFile(saved: SavedTheme): ZedThemeFile | undefined {
    if (saved.themeId === "custom" && saved.custom) {
      return saved.custom;
    }
    return config.bundledThemes.find((t) => t.id === saved.themeId)?.file;
  }

  return {
    applySelected(): () => void {
      const saved = getSavedTheme();
      const themeFile = resolveThemeFile(saved);
      if (themeFile) {
        const appearance = saved.appearance ?? "system";
        return applyZedThemeWithAppearance(themeFile, appearance);
      }
      return () => {};
    },

    applyLight(): () => void {
      const saved = getSavedTheme();
      const themeFile = resolveThemeFile(saved);
      if (!themeFile) return () => {};
      const light = themeFile.themes.find((t) => t.appearance === "light");
      if (light) applyThemeStyle(light.style);
      return () => {};
    },

    getSelectedId(): string {
      try {
        const raw = localStorage.getItem(config.storageKey);
        if (raw) {
          const parsed: SavedTheme = JSON.parse(raw);
          return parsed.themeId;
        }
      } catch {
        // ignore
      }
      return config.defaultThemeId;
    },

    getCustomFile(): ZedThemeFile | undefined {
      try {
        const raw = localStorage.getItem(config.storageKey);
        if (raw) {
          const parsed: SavedTheme = JSON.parse(raw);
          return parsed.custom;
        }
      } catch {
        // ignore
      }
      return undefined;
    },

    setSelected(id: string, customFile?: ZedThemeFile): void {
      const existing = getSavedTheme();
      const saved: SavedTheme =
        id === "custom" && customFile
          ? { themeId: "custom", custom: customFile, appearance: existing.appearance }
          : { themeId: id, appearance: existing.appearance };
      localStorage.setItem(config.storageKey, JSON.stringify(saved));
    },

    getAppearance(): Appearance {
      return getSavedTheme().appearance ?? "system";
    },

    setAppearance(appearance: Appearance): void {
      const existing = getSavedTheme();
      existing.appearance = appearance;
      localStorage.setItem(config.storageKey, JSON.stringify(existing));
    },
  };
}
