import React from "react";
import NextLink from "next/link";

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
}

const Link: React.FC<LinkProps> = ({ href, children, ...props }) => (
  <NextLink href={href} {...props}>
    <a className="text-blue-500 hover:underline">{children}</a>
  </NextLink>
);

export default Link;
