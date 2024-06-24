import React from "react";

interface ListProps
  extends React.HTMLAttributes<HTMLUListElement | HTMLOListElement> {
  ordered?: boolean;
}

const List: React.FC<ListProps> = ({ ordered, ...props }) => {
  const Tag = ordered ? "ol" : "ul";
  const className = `list-${ordered ? "decimal" : "disc"} list-inside mb-2`;

  return <Tag className={className} {...props} />;
};

export default List;
