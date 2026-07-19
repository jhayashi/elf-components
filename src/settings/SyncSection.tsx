import { create, props } from "@stylexjs/stylex";
import { useState } from "react";
import { elementStyles, pageStyles } from "../PageStyles.stylex";
import { colors, fonts, fontSizes, spacing } from "../Tokens.stylex";

export interface SyncSectionProps {
  readonly enabled: boolean;
  readonly onToggle: () => void;
  /** Section heading. Defaults to "Sync". */
  readonly title?: string;
  /** Description text shown above the toggle. */
  readonly helpText?: string;
  /** Label when sync is enabled. Defaults to "Sync enabled". */
  readonly enabledLabel?: string;
  /** Label when sync is disabled. Defaults to "Sync disabled". */
  readonly disabledLabel?: string;
  /** Current custom relay URL (empty string = default relay). */
  readonly serverUrl?: string;
  /** Called with a validated wss:// URL, or "" to clear back to the default relay. */
  readonly onServerUrlSave?: (url: string) => void;
  /** Label for the server URL field. Defaults to "Sync server URL". */
  readonly serverLabel?: string;
  /** Help text shown under the server URL label. */
  readonly serverHelpText?: string;
  /** Label for the apply button. Defaults to "Apply". */
  readonly saveLabel?: string;
  /** Message shown when the entered URL is not a valid wss:// URL. */
  readonly invalidUrlMessage?: string;
}

export function SyncSection({
  enabled,
  onToggle,
  title = "Sync",
  helpText,
  enabledLabel = "Sync enabled",
  disabledLabel = "Sync disabled",
  serverUrl,
  onServerUrlSave,
  serverLabel = "Sync server URL",
  serverHelpText,
  saveLabel = "Apply",
  invalidUrlMessage = "Enter a valid wss:// URL.",
}: SyncSectionProps) {
  const [value, setValue] = useState(serverUrl ?? "");
  const [error, setError] = useState(false);

  const handleSave = () => {
    const trimmed = value.trim();
    if (trimmed === "") {
      setError(false);
      onServerUrlSave?.("");
      return;
    }
    let ok = false;
    try {
      ok = new URL(trimmed).protocol === "wss:";
    } catch {
      ok = false;
    }
    if (!ok) {
      setError(true);
      return;
    }
    setError(false);
    onServerUrlSave?.(trimmed);
  };

  return (
    <section {...props(pageStyles.section)}>
      <h2 {...props(pageStyles.sectionTitle)}>{title}</h2>
      {helpText && <p {...props(elementStyles.helpText)}>{helpText}</p>}
      <button
        type="button"
        onClick={onToggle}
        {...props(elementStyles.button, enabled && elementStyles.buttonActive)}
        role="switch"
        aria-checked={enabled}
      >
        {enabled ? enabledLabel : disabledLabel}
      </button>

      {enabled && onServerUrlSave && (
        <div {...props(styles.serverField)}>
          <label htmlFor="sync-server-url" {...props(styles.label)}>
            {serverLabel}
          </label>
          {serverHelpText && (
            <p {...props(elementStyles.helpText)}>{serverHelpText}</p>
          )}
          <div {...props(styles.inputRow)}>
            <input
              id="sync-server-url"
              type="url"
              inputMode="url"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="wss://free.evoluhq.com"
              {...props(styles.input)}
            />
            <button
              type="button"
              onClick={handleSave}
              {...props(elementStyles.button)}
            >
              {saveLabel}
            </button>
          </div>
          {error && <p {...props(styles.error)}>{invalidUrlMessage}</p>}
        </div>
      )}
    </section>
  );
}

const styles = create({
  serverField: {
    display: "flex",
    flexDirection: "column",
    gap: spacing.xs,
  },
  label: {
    fontSize: fontSizes.step_1,
    fontFamily: fonts.sans,
    color: colors.primary,
  },
  inputRow: {
    display: "flex",
    gap: spacing.xs,
    flexWrap: "wrap",
  },
  input: {
    flex: 1,
    minWidth: "12rem",
    paddingBlock: spacing.xs,
    paddingInline: spacing.s,
    fontSize: fontSizes.step_1,
    fontFamily: fonts.mono,
    color: colors.primary,
    backgroundColor: colors.hoverAndFocusBackground,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: colors.border,
    borderRadius: 6,
    outline: "none",
    ":focus": {
      borderColor: colors.accent,
    },
  },
  error: {
    fontSize: fontSizes.step_1,
    fontFamily: fonts.sans,
    color: colors.error,
  },
});
