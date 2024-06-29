import React from "react";
import { Components } from "react-markdown";

const Code: Components["code"] = ({ className, children, ...props }) => {
  const match = /language-(\w+)/.exec(className || "");
  return match ? (
    <div className="overflow-x-auto">
      <pre className={`${className} p-4 rounded-lg`}>
        <code className={`language-${match[1]}`} {...props}>
          {children}
        </code>
      </pre>
    </div>
  ) : (
    <code className={className} {...props}>
      {children}
    </code>
  );
};

export default Code;
