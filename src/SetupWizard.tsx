import { create, props } from "@stylexjs/stylex";
import { useCallback, useState } from "react";
import {
  colors,
  consts,
  fonts,
  fontSizes,
  shadows,
  spacing,
} from "./Tokens.stylex";
import { elementStyles } from "./PageStyles.stylex";

const MOBILE = "@media (max-width: 480px)";

type WizardStep =
  | "features"
  | "your-data"
  | "sync-choice"
  | "no-sync-done"
  | "account-choice"
  | "restore"
  | "new-account";

type SetupResult = { sync: false } | { sync: true; restoredMnemonic?: string };

export interface SetupWizardProps {
  readonly appName: string;
  /** Short tagline shown on the feature marketing step. */
  readonly tagline?: string | undefined;
  /** Validate a mnemonic string for the restore step. Return true if valid. */
  readonly validateMnemonic?: ((value: string) => boolean) | undefined;
  /** Create a new account (init Evolu with sync) and return the mnemonic. */
  readonly onCreateAccount?: (() => Promise<string>) | undefined;
  /** Called when the wizard completes. App handles Evolu config + reload. */
  readonly onComplete: (result: SetupResult) => void;
}

export function SetupWizard({
  appName,
  tagline,
  validateMnemonic,
  onCreateAccount,
  onComplete,
}: SetupWizardProps) {
  const [step, setStep] = useState<WizardStep>("features");
  const [restoreValue, setRestoreValue] = useState("");
  const [showMnemonic, setShowMnemonic] = useState(false);
  const [restoreError, setRestoreError] = useState("");
  const [mnemonic, setMnemonic] = useState("");
  const [copied, setCopied] = useState(false);

  const handleRestore = useCallback(() => {
    const trimmed = restoreValue.trim();
    if (!trimmed) {
      setRestoreError("Please enter your identity phrase.");
      return;
    }
    if (validateMnemonic && !validateMnemonic(trimmed)) {
      setRestoreError("Invalid identity phrase. Please check and try again.");
      return;
    }
    onComplete({ sync: true, restoredMnemonic: trimmed });
  }, [restoreValue, validateMnemonic, onComplete]);

  const handleNewAccount = useCallback(async () => {
    if (onCreateAccount) {
      const m = await onCreateAccount();
      setMnemonic(m);
    }
    setStep("new-account");
  }, [onCreateAccount]);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(mnemonic);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [mnemonic]);

  return (
    <div {...props(styles.overlay)}>
      <div {...props(styles.dialog)}>
        {step === "features" && (
          <>
            <h2 {...props(styles.heading)}>Welcome to {appName}</h2>
            {tagline && <p {...props(styles.body)}>{tagline}</p>}
            <p {...props(styles.body)}>
              {appName} works offline, syncs across your devices with end-to-end
              encryption, and never locks you into a cloud service. Your data
              lives on your hardware — fast, private, and always available.
            </p>
            <div {...props(styles.actions)}>
              <button
                type="button"
                {...props(elementStyles.button, styles.buttonPrimary)}
                onClick={() => setStep("your-data")}
              >
                Next
              </button>
            </div>
          </>
        )}

        {step === "your-data" && (
          <>
            <h2 {...props(styles.heading)}>You control your data</h2>
            <p {...props(styles.body)}>
              {appName} is local-first. Everything is stored on your device by
              default — nothing is sent to a server unless you choose to enable
              sync.
            </p>
            <div {...props(styles.actions)}>
              <button
                type="button"
                {...props(elementStyles.button)}
                onClick={() => setStep("features")}
              >
                Back
              </button>
              <button
                type="button"
                {...props(elementStyles.button, styles.buttonPrimary)}
                onClick={() => setStep("sync-choice")}
              >
                Next
              </button>
            </div>
          </>
        )}

        {step === "sync-choice" && (
          <>
            <h2 {...props(styles.heading)}>Sync across devices?</h2>
            <p {...props(styles.body)}>
              Sync uses end-to-end encryption to securely replicate your data
              across devices. No one else can read it — not even the sync
              server.
            </p>
            <p {...props(styles.body)}>
              Your data is tied to an identity phrase — 24 words that uniquely
              identify you and your data. You can change this later in Settings.
            </p>
            <div {...props(styles.actions)}>
              <button
                type="button"
                {...props(elementStyles.button)}
                onClick={() => setStep("your-data")}
              >
                Back
              </button>
              <button
                type="button"
                {...props(elementStyles.button)}
                onClick={() => setStep("no-sync-done")}
              >
                Don&apos;t Sync
              </button>
              <button
                type="button"
                {...props(elementStyles.button, styles.buttonPrimary)}
                onClick={() => setStep("account-choice")}
              >
                Sync
              </button>
            </div>
          </>
        )}

        {step === "no-sync-done" && (
          <>
            <h2 {...props(styles.heading)}>All set!</h2>
            <p {...props(styles.body)}>
              Your data will stay on this device only. If you change your mind,
              you can enable sync anytime from Settings.
            </p>
            <div {...props(styles.actions)}>
              <button
                type="button"
                {...props(elementStyles.button)}
                onClick={() => setStep("sync-choice")}
              >
                Back
              </button>
              <button
                type="button"
                {...props(elementStyles.button, styles.buttonPrimary)}
                onClick={() => onComplete({ sync: false })}
              >
                Done
              </button>
            </div>
          </>
        )}

        {step === "account-choice" && (
          <>
            <h2 {...props(styles.heading)}>Do you have an identity phrase?</h2>
            <p {...props(styles.body)}>
              If you&apos;ve used {appName} on another device, enter your
              existing identity phrase to access your data. Otherwise,
              we&apos;ll create a new one for you.
            </p>
            <div {...props(styles.actions)}>
              <button
                type="button"
                {...props(elementStyles.button)}
                onClick={() => setStep("sync-choice")}
              >
                Back
              </button>
              <button
                type="button"
                {...props(elementStyles.button)}
                onClick={() => setStep("restore")}
              >
                I have one
              </button>
              <button
                type="button"
                {...props(elementStyles.button, styles.buttonPrimary)}
                onClick={handleNewAccount}
              >
                Create new
              </button>
            </div>
          </>
        )}

        {step === "restore" && (
          <>
            <h2 {...props(styles.heading)}>Enter your identity phrase</h2>
            <p {...props(styles.body)}>
              Enter your 24-word identity phrase to access your data and sync
              across devices.
            </p>
            <div {...props(styles.inputGroup)}>
              <input
                type={showMnemonic ? "text" : "password"}
                value={restoreValue}
                onChange={(e) => {
                  setRestoreValue(e.target.value);
                  setRestoreError("");
                }}
                placeholder="Enter your 24-word identity phrase..."
                {...props(styles.input)}
              />
              <button
                type="button"
                {...props(styles.toggleButton)}
                onClick={() => setShowMnemonic(!showMnemonic)}
              >
                {showMnemonic ? "Hide" : "Show"}
              </button>
            </div>
            {restoreError && (
              <p {...props(styles.errorText)}>{restoreError}</p>
            )}
            <div {...props(styles.actions)}>
              <button
                type="button"
                {...props(elementStyles.button)}
                onClick={() => {
                  setRestoreValue("");
                  setRestoreError("");
                  setStep("account-choice");
                }}
              >
                Back
              </button>
              <button
                type="button"
                {...props(elementStyles.button, styles.buttonPrimary)}
                onClick={handleRestore}
              >
                Done
              </button>
            </div>
          </>
        )}

        {step === "new-account" && (
          <>
            <h2 {...props(styles.heading)}>Here&apos;s your identity phrase</h2>
            <p {...props(styles.body)}>
              This is the key to your data — treat it like a password. Save it
              somewhere safe.
              {mnemonic
                ? " You'll need it to access your data on other devices."
                : " You can find your identity phrase in Settings. Save it somewhere safe — you'll need it to access your data on other devices."}
            </p>
            {mnemonic && (
              <div {...props(styles.mnemonicBlock)}>
                <code {...props(styles.mnemonicText)}>{mnemonic}</code>
                <button
                  type="button"
                  {...props(elementStyles.button)}
                  onClick={handleCopy}
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            )}
            <div {...props(styles.actions)}>
              <button
                type="button"
                {...props(elementStyles.button)}
                onClick={() => setStep("account-choice")}
              >
                Back
              </button>
              <button
                type="button"
                {...props(elementStyles.button, styles.buttonPrimary)}
                onClick={() => onComplete({ sync: true })}
              >
                Done!
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const styles = create({
  overlay: {
    position: "fixed",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 2000,
    padding: {
      default: spacing.m,
      [MOBILE]: spacing.s,
    },
  },
  dialog: {
    display: "flex",
    flexDirection: "column",
    gap: spacing.m,
    width: "100%",
    maxWidth: {
      default: "28rem",
      [MOBILE]: "auto",
    },
    padding: {
      default: spacing.xl,
      [MOBILE]: spacing.l,
    },
    backgroundColor: "var(--elevated-surface-background, var(--background))",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: colors.border,
    borderRadius: 12,
    boxShadow: shadows.shadow4,
  },
  heading: {
    fontSize: fontSizes.step2,
    fontFamily: fonts.sans,
    color: colors.primary,
    fontWeight: 700,
    margin: 0,
  },
  body: {
    fontSize: fontSizes.step0,
    fontFamily: fonts.sans,
    color: colors.secondary,
    lineHeight: 1.5,
    margin: 0,
  },
  actions: {
    display: "flex",
    gap: spacing.xs,
    flexWrap: "wrap",
    justifyContent: "flex-end",
  },
  buttonPrimary: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
    color: "#fff",
    ":hover": {
      opacity: 0.9,
      borderColor: colors.accent,
    },
  },
  inputGroup: {
    display: "flex",
    gap: spacing.xs,
    alignItems: "center",
  },
  input: {
    flex: 1,
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
    minHeight: consts.minimalHit,
    ":focus": {
      borderColor: colors.accent,
    },
  },
  toggleButton: {
    paddingBlock: spacing.xs,
    paddingInline: spacing.xs,
    fontSize: fontSizes.step_2,
    fontFamily: fonts.sans,
    color: colors.secondary,
    backgroundColor: "transparent",
    borderWidth: 0,
    cursor: "pointer",
    ":hover": {
      color: colors.primary,
    },
  },
  errorText: {
    fontSize: fontSizes.step_1,
    fontFamily: fonts.sans,
    color: colors.error,
    margin: 0,
  },
  mnemonicBlock: {
    display: "flex",
    flexDirection: "column",
    gap: spacing.xs,
    padding: spacing.s,
    backgroundColor: colors.hoverAndFocusBackground,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: colors.border,
    borderRadius: 6,
  },
  mnemonicText: {
    fontSize: fontSizes.step_1,
    fontFamily: fonts.mono,
    color: colors.primary,
    lineHeight: 1.6,
    wordBreak: "break-word",
    whiteSpace: "pre-wrap",
  },
});
