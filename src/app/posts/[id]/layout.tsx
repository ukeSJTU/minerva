import { DynamicIsland } from "@/components/dynamic_island";

export default function PostLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col items-center">
      <DynamicIsland />
      <div className="">{children}</div>
    </div>
  );
}
