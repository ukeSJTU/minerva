import React from "react";

const Paragraph: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = (
  props
) => <p className="mb-2" {...props} />;

export default Paragraph;
