"use client";

import * as React from "react";
import Link from "next/link";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const navItems: { title: string; href: string }[] = [
  { title: "Home", href: "/" },
  { title: "Posts", href: "/posts" },
  { title: "Series", href: "/series" },
  { title: "Admin", href: "/admin" },
];

export function Navbar() {
  return (
    <div className="fixed top-0 left-0 right-0 bg-background z-50 shadow-sm h-[70px]">
      <div className="container mx-auto flex justify-between items-center py-4">
        <NavigationMenu>
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
      </div>
    </div>
  );
}
