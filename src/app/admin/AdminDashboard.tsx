"use client";

import { useState } from "react";
import { Sidebar } from "@/components/admin/sidebar";
import { PostsTable } from "@/components/admin/posts_table";
import { SeriesTable } from "@/components/admin/series_table";

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("posts");

  return (
    <div className="flex h-screen">
      <Sidebar setActiveSection={setActiveSection} />
      <main className="flex-1 p-6 overflow-auto">
        {activeSection === "posts" && <PostsTable />}
        {activeSection === "series" && <SeriesTable />}
        {/* Add more sections as needed */}
      </main>
    </div>
  );
}
