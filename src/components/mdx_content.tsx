import { MDXRemote } from "next-mdx-remote/rsc";
import { components } from "@/components/markdown";

export default function MDXContent({ source }: { source: string }) {
  return <MDXRemote source={source} components={components} />;
}
