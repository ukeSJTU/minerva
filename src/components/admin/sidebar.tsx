import { Button } from "@/components/ui/button";
import { FileText, Layers } from "lucide-react";

export function Sidebar({
  setActiveSection,
}: {
  setActiveSection: (section: "posts" | "series") => void;
}) {
  return (
    <div className="w-64 bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
      <nav className="space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => setActiveSection("posts")}
        >
          <FileText className="mr-2 h-4 w-4" />
          Posts
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => setActiveSection("series")}
        >
          <Layers className="mr-2 h-4 w-4" />
          Series
        </Button>
        {/* Add more navigation items as needed */}
      </nav>
    </div>
  );
}
