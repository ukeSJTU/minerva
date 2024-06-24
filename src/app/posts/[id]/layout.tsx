import { DynamicIsland } from "@/components/dynamic_island";

export default function PostLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <DynamicIsland />
      <div>{children}</div>
    </div>
  );
}
