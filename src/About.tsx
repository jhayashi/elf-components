import { create, props } from "@stylexjs/stylex";
import type { ReactNode } from "react";
import { colors, fonts, fontSizes, spacing } from "./Tokens.stylex";
import { pageStyles } from "./PageStyles.stylex";

const MOBILE = "@media (max-width: 480px)";

export interface AboutProps {
  iconSrc: string;
  appName: string;
  version: string;
  description: string;
  /** Menu component to render in the header. */
  menu?: ReactNode;
  /** Page title. Defaults to "About". */
  title?: string;
}

export function About({
  iconSrc,
  appName,
  version,
  description,
  menu,
  title = "About",
}: AboutProps) {
  return (
    <div {...props(pageStyles.page)}>
      <div {...props(pageStyles.header)}>
        <h1 {...props(pageStyles.title)}>{title}</h1>
        {menu}
      </div>

      <div {...props(styles.appInfo)}>
        <img
          src={iconSrc}
          alt={appName}
          width={128}
          height={128}
          {...props(styles.icon)}
        />
        <h2 {...props(styles.appName)}>{appName}</h2>
        <p {...props(styles.version)}>{version}</p>
      </div>

      <p {...props(styles.description)}>{description}</p>
    </div>
  );
}

const styles = create({
  appInfo: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: spacing.xs,
    paddingBlock: spacing.l,
  },
  icon: {
    borderRadius: spacing.s,
    width: {
      default: 128,
      [MOBILE]: 96,
    },
    height: {
      default: 128,
      [MOBILE]: 96,
    },
  },
  appName: {
    fontSize: fontSizes.step3,
    fontFamily: fonts.sans,
    color: colors.primary,
    fontWeight: 700,
  },
  version: {
    fontSize: fontSizes.step0,
    fontFamily: fonts.sans,
    color: colors.secondary,
  },
  description: {
    fontSize: fontSizes.step_1,
    fontFamily: fonts.sans,
    color: colors.secondary,
    textAlign: "center",
  },
});
