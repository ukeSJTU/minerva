import Heading from "@/components/markdown/heading";
import Link from "@/components/markdown/link";
import Image from "@/components/markdown/image";
import CodeBlock from "@/components/markdown/codeblock";
import InlineCode from "@/components/markdown/inlinecode";

export const components = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <Heading level={1} {...props} />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <Heading level={2} {...props} />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <Heading level={3} {...props} />
  ),
  h4: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <Heading level={4} {...props} />
  ),
  h5: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <Heading level={5} {...props} />
  ),
  h6: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <Heading level={6} {...props} />
  ),
  a: Link as React.ComponentType<React.AnchorHTMLAttributes<HTMLAnchorElement>>,
  img: Image as React.ComponentType<React.ImgHTMLAttributes<HTMLImageElement>>,
  code: ({ className, children, ...props }: any) => {
    const match = /language-(\w+)/.exec(className || "");
    const inline = !match;
    return inline ? (
      <InlineCode {...props}>{children}</InlineCode>
    ) : (
      <CodeBlock className={className} {...props}>
        {children}
      </CodeBlock>
    );
  },
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
    <pre className="overflow-x-auto" {...props} />
  ),
};
