import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/cjs/styles/prism";

interface CodeBlockProps {
  className?: string;
  children: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ className, children }) => {
  const language = className ? className.replace("language-", "") : "";
  return (
    <SyntaxHighlighter language={language} style={tomorrow} className="rounded">
      {children}
    </SyntaxHighlighter>
  );
};

export default CodeBlock;
