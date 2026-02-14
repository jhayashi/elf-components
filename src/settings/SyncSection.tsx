import { props } from "@stylexjs/stylex";
import { elementStyles, pageStyles } from "../PageStyles.stylex";

export interface SyncSectionProps {
  enabled: boolean;
  onToggle: () => void;
  /** Section heading. Defaults to "Sync". */
  title?: string;
  /** Description text shown above the toggle. */
  helpText?: string;
  /** Label when sync is enabled. Defaults to "Sync enabled". */
  enabledLabel?: string;
  /** Label when sync is disabled. Defaults to "Sync disabled". */
  disabledLabel?: string;
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
      <label {...props(elementStyles.toggleRow)}>
        <input type="checkbox" checked={enabled} onChange={onToggle} />
        <span {...props(elementStyles.toggleLabel)}>
          {enabled ? enabledLabel : disabledLabel}
        </span>
      </label>
    </section>
  );
}
