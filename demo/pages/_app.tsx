import { type Evolu, Mnemonic } from "@evolu/common";
import { EvoluProvider } from "@evolu/react";
import { create, props } from "@stylexjs/stylex";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useCallback, useEffect, useState } from "react";
import { SetupWizard } from "../../src/SetupWizard";
import { webSpacing } from "../../src/Themes";
import { colors } from "../../src/Tokens.stylex";
import { createThemeManager } from "../../src/theme";
import { bundledThemes } from "../../src/themes";
import { initEvolu, setSyncMode } from "../lib/Db";
import "../styles/globals.css";

export const themeManager = createThemeManager({
  storageKey: "elf-demo-theme",
  defaultThemeId: "bandley",
  bundledThemes,
});

function validateMnemonic(value: string): boolean {
  return Mnemonic.from(value).ok;
}

export default function App({ Component, pageProps }: AppProps) {
  const [setupComplete, setSetupComplete] = useState<boolean | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [evolu, setEvolu] = useState<Evolu<any> | null>(null);

  useEffect(() => {
    return themeManager.applySelected();
  }, []);

  useEffect(() => {
    const done = localStorage.getItem("elf-demo-setup") === "true";
    setSetupComplete(done);
    if (done) {
      setEvolu(initEvolu());
    }
  }, []);

  const handleCreateAccount = useCallback(async () => {
    localStorage.setItem("elf-demo-setup", "true");
    setSyncMode("enabled");
    const e = initEvolu();
    const owner = await e.appOwner;
    return owner.mnemonic as string;
  }, []);

  const handleComplete = useCallback(
    (result: { sync: false } | { sync: true; restoredMnemonic?: string }) => {
      localStorage.setItem("elf-demo-setup", "true");
      if (result.sync && result.restoredMnemonic) {
        setSyncMode("enabled");
        const e = initEvolu();
        const parsed = Mnemonic.from(result.restoredMnemonic);
        if (parsed.ok) {
          void e.restoreAppOwner(parsed.value);
          return; // restoreAppOwner triggers a reload
        }
      }
      if (result.sync) {
        // Evolu already created by onCreateAccount — use cached instance
        setEvolu(initEvolu());
      } else {
        // No-sync path: if Evolu was already created with sync (user went
        // New → Back → Back → Don't Sync), reload to discard it
        setSyncMode("local-only");
        window.location.reload();
      }
    },
    [],
  );

  return (
    <>
      <Head>
        <title>ELF Demo</title>
      </Head>
      {evolu ? (
        <EvoluProvider value={evolu}>
          <div {...props(webSpacing, styles.container)}>
            <Component {...pageProps} />
          </div>
        </EvoluProvider>
      ) : (
        setupComplete === false && (
          <SetupWizard
            appName="ELF Demo"
            tagline="A beautiful demo of local-first components, themes, and design tokens."
            validateMnemonic={validateMnemonic}
            onCreateAccount={handleCreateAccount}
            onComplete={handleComplete}
          />
        )
      )}
    </>
  );
}

const styles = create({
  container: {
    minHeight: "100%",
    display: "flex",
    flexDirection: "column",
    backgroundColor: colors.background,
  },
});
