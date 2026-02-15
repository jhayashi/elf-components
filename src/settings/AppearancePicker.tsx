import { create, props } from "@stylexjs/stylex";
import type { Appearance } from "../theme";
import { colors, spacing } from "../Tokens.stylex";
import { elementStyles } from "../PageStyles.stylex";

const MOBILE = "@media (max-width: 480px)";

export interface AppearancePickerProps {
  readonly appearance: Appearance;
  readonly onChange: (appearance: Appearance) => void;
  readonly lightLabel?: string;
  readonly darkLabel?: string;
  readonly systemLabel?: string;
}

export function AppearancePicker({
  appearance,
  onChange,
  lightLabel = "Light",
  darkLabel = "Dark",
  systemLabel = "System",
}: AppearancePickerProps) {
  const options: { value: Appearance; label: string }[] = [
    { value: "light", label: lightLabel },
    { value: "dark", label: darkLabel },
    { value: "system", label: systemLabel },
  ];

  return (
    <div {...props(styles.row)}>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          {...props(
            elementStyles.button,
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
  buttonActive: {
    borderColor: colors.accent,
    color: colors.accent,
  },
});
