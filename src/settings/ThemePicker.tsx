import { create, props } from "@stylexjs/stylex";
import type { ThemeEntry } from "../theme";
import { colors, spacing } from "../Tokens.stylex";
import { elementStyles } from "../PageStyles.stylex";

const MOBILE = "@media (max-width: 480px)";

export interface ThemePickerProps {
  readonly themes: readonly ThemeEntry[];
  readonly activeThemeId: string;
  readonly onSelect: (id: string) => void;
}

export function ThemePicker({ themes, activeThemeId, onSelect }: ThemePickerProps) {
  return (
    <div {...props(styles.themeGrid)}>
      {themes.map((theme) => (
        <button
          key={theme.id}
          type="button"
          onClick={() => onSelect(theme.id)}
          {...props(
            elementStyles.button,
            activeThemeId === theme.id && styles.themeButtonActive,
          )}
        >
          {theme.name}
        </button>
      ))}
    </div>
  );
}

const styles = create({
  themeGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: spacing.xs,
    flexDirection: {
      default: "row",
      [MOBILE]: "column",
    },
  },
  themeButtonActive: {
    borderColor: colors.accent,
    color: colors.accent,
  },
});
