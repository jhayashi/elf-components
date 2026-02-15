import { type AppOwner, Mnemonic } from "@evolu/common";
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
import { Toast } from "../../../src/Toast";
import { AppMenu } from "../../components/AppMenu";
import { getEvolu, getSyncMode, setSyncMode } from "../../lib/Db";
import { themeManager } from "../_app";

export default function Preferences() {
  const [activeThemeId, setActiveThemeId] = useState("");
  const [appearance, setAppearance] = useState<Appearance>("system");
  const [syncEnabled, setSyncEnabled] = useState(true);
  const [owner, setOwner] = useState<AppOwner | null>(null);

  useEffect(() => {
    setActiveThemeId(themeManager.getSelectedId());
    setAppearance(themeManager.getAppearance());
    setSyncEnabled(getSyncMode() === "enabled");
    void getEvolu().appOwner.then(setOwner);
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
    const input = window.prompt("Enter your 24-word identity phrase:");
    if (!input) return;
    const result = Mnemonic.from(input);
    if (!result.ok) {
      alert("Invalid identity phrase. Please check and try again.");
      return;
    }
    void getEvolu().restoreAppOwner(result.value);
  }, []);

  const handleReset = useCallback(() => {
    if (confirm("Are you sure you want to reset? This cannot be undone.")) {
      void getEvolu().resetAppOwner();
    }
  }, []);

  const handleSyncToggle = useCallback(() => {
    const newMode = syncEnabled ? "local-only" : "enabled";
    const msg =
      newMode === "local-only"
        ? "Disable sync? Data will stay local only."
        : "Enable sync across devices?";
    if (confirm(msg)) {
      setSyncMode(newMode);
      window.location.reload();
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
        owner={owner ? { mnemonic: owner.mnemonic as string } : null}
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
