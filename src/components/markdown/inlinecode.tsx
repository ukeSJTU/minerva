import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  atomDark,
  dracula,
} from "react-syntax-highlighter/dist/cjs/styles/prism";

interface InlineCodeProps {
  children: string;
}

const InlineCode: React.FC<InlineCodeProps> = ({ children }) => {
  return (
    <SyntaxHighlighter
      language="text"
      style={dracula}
      customStyle={{
        display: "inline",
        padding: "0.2em 0.4em",
        margin: 0,
        fontSize: "85%",
        borderRadius: "6px",
      }}
    >
      {children}
    </SyntaxHighlighter>
  );
};

export default InlineCode;
