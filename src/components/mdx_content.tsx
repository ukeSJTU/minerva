"use client";

import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { components } from "@/components/markdown";

interface MDXContentProps {
  source: MDXRemoteSerializeResult;
}

export default function MDXContent({ source }: MDXContentProps) {
  return <MDXRemote {...source} components={components} />;
}
