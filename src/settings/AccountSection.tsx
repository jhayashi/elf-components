import { props } from "@stylexjs/stylex";
import { useState } from "react";
import { elementStyles, pageStyles } from "../PageStyles.stylex";

export interface AccountSectionProps {
  owner: { mnemonic: string } | null;
  onRestore: () => void;
  onReset: () => void;
  /** Section heading. Defaults to "Account". */
  title?: string;
  /** Button labels. */
  labels?: {
    showMnemonic?: string;
    hideMnemonic?: string;
    restore?: string;
    reset?: string;
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
    showMnemonic: showLabel = "Show Mnemonic",
    hideMnemonic: hideLabel = "Hide Mnemonic",
    restore: restoreLabel = "Restore Owner",
    reset: resetLabel = "Reset Owner",
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
