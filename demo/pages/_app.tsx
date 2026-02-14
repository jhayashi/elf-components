import { create, props } from "@stylexjs/stylex";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useEffect } from "react";
import { webSpacing } from "../../src/Themes";
import { colors } from "../../src/Tokens.stylex";
import { createThemeManager } from "../../src/theme";
import { bundledThemes } from "../../src/themes";
import "../styles/globals.css";

export const themeManager = createThemeManager({
  storageKey: "elf-demo-theme",
  defaultThemeId: "bandley",
  bundledThemes,
});

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    return themeManager.applySelected();
  }, []);

  return (
    <>
      <Head>
        <title>ELF Demo</title>
      </Head>
      <div {...props(webSpacing, styles.container)}>
        <Component {...pageProps} />
      </div>
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
