import React from "react";
import NextLink from "next/link";

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
}

const Link: React.FC<LinkProps> = ({ href, ...props }) => (
  <NextLink href={href} className="text-blue-500 hover:underline" {...props} />
);

export default Link;
