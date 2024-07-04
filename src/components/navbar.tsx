"use client";

import * as React from "react";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const navItems: { title: string; href: string }[] = [
  { title: "Home", href: "/" },
  { title: "Posts", href: "/posts" },
  { title: "Series", href: "/series" },
  { title: "Admin", href: "/admin" },
];

export function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="bg-transparent text-white p-4 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <ul className="flex space-x-6">
          {navItems.map((item) => (
            <li key={item.title}>
              <Link
                href={item.href}
                className="hover:text-gray-300 transition-colors"
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center space-x-4">
          {status === "authenticated" ? (
            <>
              <Avatar>
                <AvatarImage
                  src={session.user?.image || undefined}
                  alt={session.user?.name || "User"}
                />
                <AvatarFallback>
                  {session.user?.name?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
              <Button
                variant="ghost"
                onClick={() => signOut()}
                className="text-white border-white hover:bg-white hover:text-black"
              >
                Logout
              </Button>
            </>
          ) : (
            <Button
              variant="ghost"
              onClick={() => signIn()}
              className="text-white border-white hover:bg-white hover:text-black"
            >
              Login
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
