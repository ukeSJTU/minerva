"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NavItem = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`px-4 py-2 ${isActive ? "text-primary font-bold" : "text-muted-foreground"} hover:text-primary transition-colors`}
    >
      {children}
    </Link>
  );
};

export function Navbar() {
  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-background/80 backdrop-blur-md shadow-md rounded-full">
      <div className="flex items-center justify-center h-12 px-4">
        <NavItem href="/">Home</NavItem>
        <NavItem href="/posts">Posts</NavItem>
        <NavItem href="/about">About</NavItem>
      </div>
    </nav>
  );
}
