import { create } from "@stylexjs/stylex";
import { colors, fonts, fontSizes, spacing } from "./Tokens.stylex";

export const pageStyles = create({
  page: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    maxWidth: "48rem",
    width: "100%",
    marginInline: "auto",
    paddingBlock: spacing.m,
    paddingInline: spacing.s,
    gap: spacing.l,
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: fontSizes.step2,
    fontFamily: fonts.sans,
    color: colors.primary,
    fontWeight: 700,
  },
  section: {
    display: "flex",
    flexDirection: "column",
    gap: spacing.s,
  },
  sectionTitle: {
    fontSize: fontSizes.step1,
    fontFamily: fonts.sans,
    color: colors.primary,
    fontWeight: 600,
  },
});

export const elementStyles = create({
  button: {
    alignSelf: "flex-start",
    paddingBlock: spacing.xs,
    paddingInline: spacing.s,
    fontSize: fontSizes.step_1,
    fontFamily: fonts.sans,
    color: colors.primary,
    backgroundColor: colors.hoverAndFocusBackground,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: colors.border,
    borderRadius: 6,
    cursor: "pointer",
    ":hover": {
      borderColor: colors.accent,
    },
  },
  buttonDanger: {
    alignSelf: "flex-start",
    paddingBlock: spacing.xs,
    paddingInline: spacing.s,
    fontSize: fontSizes.step_1,
    fontFamily: fonts.sans,
    color: colors.error,
    backgroundColor: colors.hoverAndFocusBackground,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: colors.border,
    borderRadius: 6,
    cursor: "pointer",
    ":hover": {
      borderColor: colors.error,
    },
  },
  select: {
    paddingBlock: spacing.xs,
    paddingInline: spacing.s,
    fontSize: fontSizes.step_1,
    fontFamily: fonts.sans,
    color: colors.primary,
    backgroundColor: colors.hoverAndFocusBackground,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: colors.border,
    borderRadius: 6,
    cursor: "pointer",
    outline: "none",
    ":focus": {
      borderColor: colors.accent,
    },
  },
  helpText: {
    fontSize: fontSizes.step_1,
    fontFamily: fonts.sans,
    color: colors.secondary,
  },
  toggleRow: {
    display: "flex",
    alignItems: "center",
    gap: spacing.xs,
    cursor: "pointer",
  },
  toggleLabel: {
    fontSize: fontSizes.step_1,
    fontFamily: fonts.sans,
    color: colors.primary,
  },
  mnemonic: {
    textWrap: "balance",
    textAlign: "center",
    fontFamily: fonts.mono,
    color: colors.primary,
    fontSize: fontSizes.step_1,
    padding: spacing.s,
    backgroundColor: colors.hoverAndFocusBackground,
    borderRadius: 6,
  },
});
