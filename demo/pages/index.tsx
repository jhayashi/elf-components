import { useQuery } from "@evolu/react";
import { create, props } from "@stylexjs/stylex";
import { useCallback } from "react";
import { EditableTitle } from "../../src/EditableTitle";
import { colors, fonts, fontSizes, spacing } from "../../src/Tokens.stylex";
import { pageStyles, elementStyles } from "../../src/PageStyles.stylex";
import { Toast, toast } from "../../src/Toast";
import { AppMenu } from "../components/AppMenu";
import {
  getSettingsQuery,
  updatePageTitle,
  createSettings,
} from "../lib/Db";

const MOBILE = "@media (max-width: 480px)";

export default function Home() {
  const settings = useQuery(getSettingsQuery());
  const settingsRow = settings.length > 0 ? settings[0] : undefined;

  const handleTitleSave = useCallback(
    (title: string) => {
      if (settingsRow) {
        updatePageTitle(settingsRow.id, title);
      } else {
        createSettings({ pageTitle: title });
      }
    },
    [settingsRow],
  );

  return (
    <div {...props(pageStyles.page)}>
      <div {...props(pageStyles.header)}>
        <EditableTitle
          currentTitle={settingsRow?.pageTitle ?? null}
          defaultTitle="ELF Demo"
          onSave={handleTitleSave}
        />
        <AppMenu currentPath="/" />
      </div>

      <section {...props(pageStyles.section)}>
        <h2 {...props(pageStyles.sectionTitle)}>Interactive Elements</h2>
        <div {...props(styles.buttonRow)}>
          <button
            type="button"
            onClick={() => toast("Action completed")}
            {...props(elementStyles.button)}
          >
            Show Toast
          </button>
          <button
            type="button"
            onClick={() => toast("Something went wrong", "error")}
            {...props(elementStyles.buttonDanger)}
          >
            Error Toast
          </button>
          <button
            type="button"
            onClick={() => {
              localStorage.removeItem("elf-demo-setup");
              location.reload();
            }}
            {...props(elementStyles.button)}
          >
            Reset Setup Wizard
          </button>
        </div>
        <div {...props(styles.inputRow)}>
          <input
            type="text"
            placeholder="Text input..."
            {...props(styles.input)}
          />
          <select {...props(elementStyles.select)}>
            <option>Option A</option>
            <option>Option B</option>
            <option>Option C</option>
          </select>
        </div>
        <label {...props(elementStyles.toggleRow)}>
          <input type="checkbox" defaultChecked />
          <span {...props(elementStyles.toggleLabel)}>Checkbox example</span>
        </label>
      </section>

      <section {...props(pageStyles.section)}>
        <h2 {...props(pageStyles.sectionTitle)}>Surfaces</h2>
        <div {...props(styles.surfaceDemo)}>
          <div {...props(styles.surface)}>
            <p {...props(styles.surfaceLabel)}>Surface background</p>
          </div>
          <div {...props(styles.elevated)}>
            <p {...props(styles.surfaceLabel)}>Elevated surface</p>
          </div>
        </div>
      </section>

      <section {...props(pageStyles.section)}>
        <h2 {...props(pageStyles.sectionTitle)}>Color Palette</h2>
        <div {...props(styles.palette)}>
          {paletteItems.map(({ label, cssVar }) => (
            <div key={label} {...props(styles.swatch)}>
              <div
                {...props(styles.swatchBox)}
                style={{ backgroundColor: `var(--${cssVar})` }}
              />
              <div>
                <div {...props(styles.swatchLabel)}>--{cssVar}</div>
                <div {...props(styles.swatchDesc)}>{label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section {...props(pageStyles.section)}>
        <h2 {...props(pageStyles.sectionTitle)}>Syntax Colors</h2>
        <div {...props(styles.palette)}>
          {syntaxTokens.map(({ label, cssVar, sample }) => (
            <div key={label} {...props(styles.swatch)}>
              <div
                {...props(styles.swatchBox)}
                style={{ backgroundColor: `var(--${cssVar})` }}
              />
              <div>
                <span
                  {...props(styles.syntaxSample)}
                  style={{ color: `var(--${cssVar})` }}
                >
                  {sample}
                </span>
                <div {...props(styles.swatchLabel)}>--{cssVar}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section {...props(pageStyles.section)}>
        <h2 {...props(pageStyles.sectionTitle)}>Typography</h2>
        <p {...props(styles.typeStep5)}>Step 5 — Display</p>
        <p {...props(styles.typeStep4)}>Step 4 — Large heading</p>
        <p {...props(styles.typeStep3)}>Step 3 — Heading</p>
        <p {...props(styles.typeStep2)}>Step 2 — Sub-heading</p>
        <p {...props(styles.typeStep1)}>Step 1 — Large body</p>
        <p {...props(styles.typeStep0)}>Step 0 — Body (base)</p>
        <p {...props(styles.typeStep_1)}>Step -1 — Small</p>
        <p {...props(styles.typeStep_2)}>Step -2 — Caption</p>
      </section>

      <Toast />
    </div>
  );
}

const paletteItems = [
  { label: "Page bg", cssVar: "background" },
  { label: "Panel bg", cssVar: "surface-background" },
  { label: "Dialog bg", cssVar: "elevated-surface-background" },
  { label: "Primary text", cssVar: "text" },
  { label: "Secondary text", cssVar: "text-muted" },
  { label: "Placeholder", cssVar: "text-placeholder" },
  { label: "Accent", cssVar: "text-accent" },
  { label: "Disabled", cssVar: "text-disabled" },
  { label: "Borders", cssVar: "border" },
  { label: "Focus ring", cssVar: "border-focused" },
  { label: "Hover bg", cssVar: "element-hover" },
  { label: "Error", cssVar: "error" },
  { label: "Warning", cssVar: "warning" },
  { label: "Success", cssVar: "success" },
  { label: "Search highlight", cssVar: "search-match-background" },
];

const syntaxTokens = [
  { label: "keyword", cssVar: "syntax-keyword", sample: "const function return" },
  { label: "string", cssVar: "syntax-string", sample: '"hello world"' },
  { label: "comment", cssVar: "syntax-comment", sample: "// a comment" },
  { label: "function", cssVar: "syntax-function", sample: "fetchData()" },
  { label: "type", cssVar: "syntax-type", sample: "string number boolean" },
  { label: "variable", cssVar: "syntax-variable", sample: "userName count" },
  { label: "number", cssVar: "syntax-number", sample: "42 3.14 0xff" },
  { label: "operator", cssVar: "syntax-operator", sample: "= + - * / ===" },
  { label: "constant", cssVar: "syntax-constant", sample: "MAX_SIZE PI" },
  { label: "property", cssVar: "syntax-property", sample: ".length .name" },
  { label: "boolean", cssVar: "syntax-boolean", sample: "true false" },
  { label: "tag", cssVar: "syntax-tag", sample: "<div> <span>" },
  { label: "attribute", cssVar: "syntax-attribute", sample: 'class="..." id="..."' },
  { label: "constructor", cssVar: "syntax-constructor", sample: "new Map()" },
  { label: "enum", cssVar: "syntax-enum", sample: "Status.Active" },
  { label: "title", cssVar: "syntax-title", sample: "# Heading" },
  { label: "punctuation", cssVar: "syntax-punctuation", sample: "{ } ( ) [ ] ;" },
  { label: "comment.doc", cssVar: "syntax-comment-doc", sample: "/** @param */" },
  { label: "string.escape", cssVar: "syntax-string-escape", sample: "\\n \\t \\\\" },
  { label: "string.regex", cssVar: "syntax-string-regex", sample: "/^match$/gi" },
  { label: "variable.special", cssVar: "syntax-variable-special", sample: "this self _" },
];

const styles = create({
  palette: {
    display: "grid",
    gridTemplateColumns: {
      default: "repeat(auto-fill, minmax(14rem, 1fr))",
      [MOBILE]: "repeat(auto-fill, minmax(10rem, 1fr))",
    },
    gap: spacing.xs,
  },
  swatch: {
    display: "flex",
    alignItems: "center",
    gap: spacing.xs,
  },
  swatchBox: {
    width: "2rem",
    height: "2rem",
    borderRadius: 4,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: colors.borderLighter,
    flexShrink: 0,
  },
  swatchLabel: {
    fontSize: fontSizes.step_1,
    fontFamily: fonts.mono,
    color: colors.secondary,
  },
  swatchDesc: {
    fontSize: fontSizes.step_2,
    fontFamily: fonts.sans,
    color: colors.disabled,
  },
  syntaxSample: {
    fontSize: fontSizes.step_1,
    fontFamily: fonts.mono,
  },
  typeStep5: { fontSize: fontSizes.step5, fontFamily: fonts.sans, color: colors.primary },
  typeStep4: { fontSize: fontSizes.step4, fontFamily: fonts.sans, color: colors.primary },
  typeStep3: { fontSize: fontSizes.step3, fontFamily: fonts.sans, color: colors.primary },
  typeStep2: { fontSize: fontSizes.step2, fontFamily: fonts.sans, color: colors.primary },
  typeStep1: { fontSize: fontSizes.step1, fontFamily: fonts.sans, color: colors.primary },
  typeStep0: { fontSize: fontSizes.step0, fontFamily: fonts.sans, color: colors.primary },
  typeStep_1: { fontSize: fontSizes.step_1, fontFamily: fonts.sans, color: colors.primary },
  typeStep_2: { fontSize: fontSizes.step_2, fontFamily: fonts.sans, color: colors.primary },
  buttonRow: {
    display: "flex",
    gap: spacing.xs,
    flexWrap: "wrap",
  },
  inputRow: {
    display: "flex",
    gap: spacing.xs,
    flexWrap: "wrap",
  },
  input: {
    paddingBlock: spacing.xs,
    paddingInline: spacing.s,
    fontSize: fontSizes.step_1,
    fontFamily: fonts.sans,
    color: colors.primary,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: colors.border,
    borderRadius: 6,
    outline: "none",
    width: {
      default: "auto",
      [MOBILE]: "100%",
    },
    "::placeholder": {
      color: colors.disabled,
    },
    ":focus": {
      borderColor: colors.accent,
    },
  },
  surfaceDemo: {
    display: "flex",
    gap: spacing.s,
    flexWrap: "wrap",
  },
  surface: {
    flex: 1,
    minWidth: {
      default: "12rem",
      [MOBILE]: "8rem",
    },
    padding: spacing.m,
    backgroundColor: colors.hoverAndFocusBackground,
    borderRadius: 8,
  },
  elevated: {
    flex: 1,
    minWidth: {
      default: "12rem",
      [MOBILE]: "8rem",
    },
    padding: spacing.m,
    backgroundColor: "var(--elevated-surface-background)",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: colors.borderLighter,
    borderRadius: 8,
  },
  surfaceLabel: {
    fontSize: fontSizes.step_1,
    fontFamily: fonts.sans,
    color: colors.secondary,
  },
});
