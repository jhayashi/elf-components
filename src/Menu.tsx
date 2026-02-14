import { create, props } from "@stylexjs/stylex";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { colors, consts, fonts, fontSizes, spacing } from "./Tokens.stylex";

export interface MenuItem {
  label: string;
  href: string;
}

interface LinkRenderProps {
  href: string;
  children: ReactNode;
  onClick: () => void;
  className?: string;
  style?: Record<string, string>;
}

export interface MenuProps {
  currentPath: string;
  items: MenuItem[];
  /** Custom link renderer for SPA navigation. Defaults to plain <a>. */
  renderLink?: (props: LinkRenderProps) => ReactNode;
  /** Accessible label for the menu button. */
  ariaLabel?: string;
}

function DefaultLink({ href, children, onClick, ...rest }: LinkRenderProps) {
  return (
    <a href={href} onClick={onClick} {...rest}>
      {children}
    </a>
  );
}

export function Menu({
  currentPath,
  items,
  renderLink = DefaultLink,
  ariaLabel = "Menu",
}: MenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div ref={menuRef} {...props(styles.menuWrapper)}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        {...props(styles.hamburgerButton)}
        aria-label={ariaLabel}
        aria-expanded={open}
      >
        <span {...props(styles.hamburgerLine)} />
        <span {...props(styles.hamburgerLine)} />
        <span {...props(styles.hamburgerLine)} />
      </button>
      {open && (
        <div {...props(styles.dropdown)} role="menu">
          {items.map((item) => {
            const isCurrent = item.href === currentPath;
            if (isCurrent) {
              return (
                <span
                  key={item.href}
                  role="menuitem"
                  aria-current="page"
                  {...props(styles.dropdownItem, styles.dropdownItemActive)}
                >
                  {item.label}
                </span>
              );
            }
            const linkProps = props(styles.dropdownItem);
            return renderLink({
              key: item.href,
              href: item.href,
              onClick: () => setOpen(false),
              children: item.label,
              ...linkProps,
            } as LinkRenderProps & { key: string });
          })}
        </div>
      )}
    </div>
  );
}

const styles = create({
  menuWrapper: {
    position: "relative",
  },
  hamburgerButton: {
    backgroundColor: "transparent",
    borderWidth: 0,
    outline: "none",
    appearance: "none",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: 4,
    padding: 10,
    ":hover": {
      opacity: 0.8,
    },
  },
  hamburgerLine: {
    display: "block",
    width: 22,
    height: 2,
    backgroundColor: colors.accent,
    borderRadius: 1,
  },
  dropdown: {
    position: "absolute",
    insetInlineEnd: 0,
    top: "100%",
    marginTop: 4,
    display: "flex",
    flexDirection: "column",
    backgroundColor: colors.hoverAndFocusBackground,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: colors.border,
    borderRadius: 8,
    overflow: "hidden",
    zIndex: 100,
    minWidth: "10rem",
  },
  dropdownItem: {
    paddingBlock: spacing.xs,
    paddingInline: spacing.s,
    fontSize: fontSizes.step_1,
    fontFamily: fonts.sans,
    color: colors.primary,
    textDecoration: "none",
    whiteSpace: "nowrap",
    minHeight: consts.minimalHit,
    display: "flex",
    alignItems: "center",
    ":hover": {
      backgroundColor: colors.ghostElementHover,
    },
  },
  dropdownItemActive: {
    color: colors.secondary,
    cursor: "default",
    ":hover": {
      backgroundColor: "transparent",
    },
  },
});
