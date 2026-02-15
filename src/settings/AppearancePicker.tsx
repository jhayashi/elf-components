import { create, props } from "@stylexjs/stylex";
import type { Appearance } from "../theme";
import { colors, consts, fonts, fontSizes, spacing } from "../Tokens.stylex";

const MOBILE = "@media (max-width: 480px)";

const options: { value: Appearance; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
];

export interface AppearancePickerProps {
  appearance: Appearance;
  onChange: (appearance: Appearance) => void;
}

export function AppearancePicker({ appearance, onChange }: AppearancePickerProps) {
  return (
    <div {...props(styles.row)}>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          {...props(
            styles.button,
            appearance === opt.value && styles.buttonActive,
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

const styles = create({
  row: {
    display: "flex",
    flexWrap: "wrap",
    gap: spacing.xs,
    flexDirection: {
      default: "row",
      [MOBILE]: "column",
    },
  },
  button: {
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
    minHeight: consts.minimalHit,
    ":hover": {
      borderColor: colors.accent,
    },
  },
  buttonActive: {
    borderColor: colors.accent,
    color: colors.accent,
  },
});
