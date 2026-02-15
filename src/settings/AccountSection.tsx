import { props } from "@stylexjs/stylex";
import { useState } from "react";
import { elementStyles, pageStyles } from "../PageStyles.stylex";

export interface AccountSectionProps {
  readonly owner: { readonly mnemonic: string } | null;
  readonly onRestore: () => void;
  readonly onReset: () => void;
  /** Section heading. Defaults to "Account". */
  readonly title?: string;
  /** Button labels. */
  readonly labels?: {
    readonly showIdentityPhrase?: string;
    readonly hideIdentityPhrase?: string;
    readonly restore?: string;
    readonly reset?: string;
  };
}

export function AccountSection({
  owner,
  onRestore,
  onReset,
  title = "Account",
  labels = {},
}: AccountSectionProps) {
  const [showMnemonic, setShowMnemonic] = useState(false);

  const {
    showIdentityPhrase: showLabel = "Show Identity Phrase",
    hideIdentityPhrase: hideLabel = "Hide Identity Phrase",
    restore: restoreLabel = "Restore Identity",
    reset: resetLabel = "Reset All Data",
  } = labels;

  return (
    <section {...props(pageStyles.section)}>
      <h2 {...props(pageStyles.sectionTitle)}>{title}</h2>
      <button
        type="button"
        onClick={() => setShowMnemonic(!showMnemonic)}
        {...props(elementStyles.button)}
      >
        {showMnemonic ? hideLabel : showLabel}
      </button>
      {showMnemonic && owner && (
        <p {...props(elementStyles.mnemonic)}>{owner.mnemonic}</p>
      )}
      <button type="button" onClick={onRestore} {...props(elementStyles.button)}>
        {restoreLabel}
      </button>
      <button type="button" onClick={onReset} {...props(elementStyles.buttonDanger)}>
        {resetLabel}
      </button>
    </section>
  );
}
