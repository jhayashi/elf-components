import { props } from "@stylexjs/stylex";
import { elementStyles, pageStyles } from "../PageStyles.stylex";

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
}

export function SyncSection({
  enabled,
  onToggle,
  title = "Sync",
  helpText,
  enabledLabel = "Sync enabled",
  disabledLabel = "Sync disabled",
}: SyncSectionProps) {
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
    </section>
  );
}
