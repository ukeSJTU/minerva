import React from "react";

interface HeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children?: React.ReactNode;
}

const Heading: React.FC<HeadingProps> = ({ level, children }) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  let className = "font-bold";

  switch (level) {
    case 1:
      className += " text-3xl mt-6 mb-4";
      break;
    case 2:
      className += " text-2xl mt-5 mb-3";
      break;
    case 3:
      className += " text-xl mt-4 mb-2";
      break;
    case 4:
      className += " text-lg mt-3 mb-2";
      break;
    case 5:
    case 6:
      className += " text-base mt-2 mb-1";
      break;
  }

  return <Tag className={className}>{children}</Tag>;
};

export default Heading;
