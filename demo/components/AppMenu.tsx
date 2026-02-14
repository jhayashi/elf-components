import Link from "next/link";
import { Menu, type MenuItem } from "../../src/Menu";
import type { ReactNode } from "react";

const menuItems: MenuItem[] = [
  { label: "Home", href: "/" },
  { label: "Settings", href: "/settings/preferences" },
  { label: "About", href: "/settings/about" },
];

function renderLink(props: {
  href: string;
  children: ReactNode;
  onClick: () => void;
  className?: string;
  style?: Record<string, string>;
}) {
  const { href, children, onClick, ...rest } = props;
  return (
    <Link key={href} href={href} onClick={onClick} {...rest}>
      {children}
    </Link>
  );
}

export function AppMenu({ currentPath }: { currentPath: string }) {
  return (
    <Menu
      currentPath={currentPath}
      items={menuItems}
      renderLink={renderLink}
    />
  );
}
