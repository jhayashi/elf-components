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
  className?: string | undefined;
  style?: Readonly<Record<string, string | number>> | undefined;
}) {
  const { href, children, onClick, ...rest } = props;
  return (
    <Link href={href} onClick={onClick} {...rest}>
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
