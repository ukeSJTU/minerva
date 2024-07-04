"use client";

import { useState } from "react";
import { Sidebar } from "@/components/admin/sidebar";
import { PostsTable } from "@/components/admin/posts_table";
import { SeriesTable } from "@/components/admin/series_table";
import { UsersTable } from "@/components/admin/users_table";

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState<
    "posts" | "series" | "users"
  >("posts");

  return (
    <div className="flex h-screen">
      <Sidebar
        activeSession={activeSection}
        setActiveSection={setActiveSection}
      />
      <main className="flex-1 p-6 ">
        {activeSection === "posts" && <PostsTable />}
        {activeSection === "series" && <SeriesTable />}
        {activeSection === "users" && <UsersTable />}
        {/* Add more sections as needed */}
      </main>
    </div>
  );
}
