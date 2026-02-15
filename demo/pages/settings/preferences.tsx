import { props } from "@stylexjs/stylex";
import { useCallback, useEffect, useState } from "react";
import { pageStyles } from "../../../src/PageStyles.stylex";
import { bundledThemes } from "../../../src/themes";
import type { Appearance } from "../../../src/theme";
import { applyZedThemeWithAppearance } from "../../../src/theme";
import { ThemePicker } from "../../../src/settings/ThemePicker";
import { AppearancePicker } from "../../../src/settings/AppearancePicker";
import { AccountSection } from "../../../src/settings/AccountSection";
import { SyncSection } from "../../../src/settings/SyncSection";
import { Toast, toast } from "../../../src/Toast";
import { AppMenu } from "../../components/AppMenu";
import { themeManager } from "../_app";

export default function Preferences() {
  const [activeThemeId, setActiveThemeId] = useState("");
  const [appearance, setAppearance] = useState<Appearance>("system");
  const [syncEnabled, setSyncEnabled] = useState(true);

  useEffect(() => {
    setActiveThemeId(themeManager.getSelectedId());
    setAppearance(themeManager.getAppearance());
  }, []);

  const handleThemeSelect = useCallback((id: string) => {
    const entry = bundledThemes.find((t) => t.id === id);
    if (!entry) return;
    themeManager.setSelected(id);
    setActiveThemeId(id);
    applyZedThemeWithAppearance(entry.file, themeManager.getAppearance());
  }, []);

  const handleAppearanceChange = useCallback((a: Appearance) => {
    themeManager.setAppearance(a);
    setAppearance(a);
    // Re-apply current theme with new appearance
    themeManager.applySelected();
  }, []);

  const handleRestore = useCallback(() => {
    const mnemonic = window.prompt("Enter your recovery mnemonic:");
    if (mnemonic) {
      toast("Owner restored (demo)");
    }
  }, []);

  const handleReset = useCallback(() => {
    if (confirm("Are you sure you want to reset? This cannot be undone.")) {
      toast("Owner reset (demo)");
    }
  }, []);

  const handleSyncToggle = useCallback(() => {
    const msg = syncEnabled
      ? "Disable sync? Data will stay local only."
      : "Enable sync across devices?";
    if (confirm(msg)) {
      setSyncEnabled(!syncEnabled);
      toast(syncEnabled ? "Sync disabled" : "Sync enabled");
    }
  }, [syncEnabled]);

  return (
    <div {...props(pageStyles.page)}>
      <div {...props(pageStyles.header)}>
        <h1 {...props(pageStyles.title)}>Settings</h1>
        <AppMenu currentPath="/settings/preferences" />
      </div>

      <section {...props(pageStyles.section)}>
        <h2 {...props(pageStyles.sectionTitle)}>Theme</h2>
        <ThemePicker
          themes={bundledThemes}
          activeThemeId={activeThemeId}
          onSelect={handleThemeSelect}
        />
      </section>

      <section {...props(pageStyles.section)}>
        <h2 {...props(pageStyles.sectionTitle)}>Appearance</h2>
        <AppearancePicker
          appearance={appearance}
          onChange={handleAppearanceChange}
        />
      </section>

      <AccountSection
        owner={{ mnemonic: "abandon ability able about above absent absorb abstract" }}
        onRestore={handleRestore}
        onReset={handleReset}
      />

      <SyncSection
        enabled={syncEnabled}
        onToggle={handleSyncToggle}
        helpText="Sync uses Evolu's encrypted CRDT technology for cross-device access."
      />

      <Toast />
    </div>
  );
}
