const TagBadge = ({ name }: { name: string }) => {
  return (
    <span className="inline-block bg-primary px-3 py-1 rounded-full text-primary-foreground text-xs font-medium">
      #{name}
    </span>
  );
};

export default TagBadge;
