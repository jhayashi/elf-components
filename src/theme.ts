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

interface SavedTheme {
  themeId: string;
  custom?: ZedThemeFile;
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
}

/**
 * Apply a Zed theme's style properties as CSS custom properties on the
 * document root. Keys like `text.muted` become `--text-muted`.
 */
export function applyThemeStyle(style: Record<string, string>): void {
  const root = document.documentElement;
  for (const [key, value] of Object.entries(style)) {
    root.style.setProperty("--" + key.replaceAll(".", "-"), value);
  }
}

/**
 * Pick the theme matching the current `prefers-color-scheme` and apply it.
 * Returns a cleanup function that removes the inline styles.
 */
export function applyZedTheme(themeFile: ZedThemeFile): () => void {
  const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const appearance = isDark ? "dark" : "light";
  const theme = themeFile.themes.find((t) => t.appearance === appearance);
  if (theme) {
    applyThemeStyle(theme.style);
  }

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
    // Remove inline overrides so CSS :root rules take effect again
    const root = document.documentElement;
    if (theme) {
      for (const key of Object.keys(theme.style)) {
        root.style.removeProperty("--" + key.replaceAll(".", "-"));
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
        return applyZedTheme(themeFile);
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
      const saved: SavedTheme =
        id === "custom" && customFile
          ? { themeId: "custom", custom: customFile }
          : { themeId: id };
      localStorage.setItem(config.storageKey, JSON.stringify(saved));
    },
  };
}
