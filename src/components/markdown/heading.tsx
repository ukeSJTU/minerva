import React from "react";

interface HeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children?: React.ReactNode;
}

const Heading: React.FC<HeadingProps> = ({ level, children }) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  const className = `text-${4 - level}xl font-bold mt-${level} mb-${level - 1}`;

  return <Tag className={className}>{children}</Tag>;
};

export default Heading;
