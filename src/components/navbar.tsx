"use client";

import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const navItems: { title: string; href: string }[] = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Posts",
    href: "/posts",
  },
  {
    title: "Contact",
    href: "/contact",
  },
];

export function Navbar() {
  return (
    <NavigationMenu className="fixed bottom-4 left-1/2 transform -translate-x-1/2">
      <NavigationMenuList>
        {navItems.map((item) => (
          <NavigationMenuItem key={item.title}>
            <Link href={item.href} legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                {item.title}
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
