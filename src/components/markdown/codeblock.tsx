import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  atomDark,
  dracula,
  solarizedlight,
} from "react-syntax-highlighter/dist/cjs/styles/prism";

interface CodeBlockProps {
  children: string;
  className?: string;
  inline?: boolean;
}

const CodeBlock: React.FC<CodeBlockProps> = ({
  children,
  className,
  inline,
}) => {
  const language = className ? className.replace(/language-/, "") : "text";

  if (inline) {
    return <code className={className}>{children}</code>;
  }

  return (
    <SyntaxHighlighter language={language} style={solarizedlight}>
      {children}
    </SyntaxHighlighter>
  );
};

export default CodeBlock;
