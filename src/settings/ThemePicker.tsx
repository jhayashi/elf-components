import { create, props } from "@stylexjs/stylex";
import type { ThemeEntry } from "../theme";
import { colors, fonts, fontSizes, spacing } from "../Tokens.stylex";

export interface ThemePickerProps {
  themes: ThemeEntry[];
  activeThemeId: string;
  onSelect: (id: string) => void;
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
            styles.themeButton,
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
  },
  themeButton: {
    paddingBlock: spacing.xs,
    paddingInline: spacing.s,
    fontSize: fontSizes.step_1,
    fontFamily: fonts.sans,
    color: colors.primary,
    backgroundColor: colors.hoverAndFocusBackground,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: colors.border,
    borderRadius: 6,
    cursor: "pointer",
    ":hover": {
      borderColor: colors.accent,
    },
  },
  themeButtonActive: {
    borderColor: colors.accent,
    color: colors.accent,
  },
});
