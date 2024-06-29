"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  ColumnDef,
  flexRender,
  SortingState,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Post, Category, Series, Tag } from "@prisma/client";

type PostWithRelations = Post & {
  category: Category;
  series: Series | null;
  tags: Tag[];
};

export function PostsTable() {
  const [posts, setPosts] = useState<PostWithRelations[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filtering, setFiltering] = useState("");

  const columns: ColumnDef<PostWithRelations>[] = [
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "published",
      header: "Status",
      cell: ({ row }) => (row.original.published ? "Published" : "Draft"),
    },
    {
      accessorKey: "category.name",
      header: "Category",
    },
    {
      accessorKey: "series.title",
      header: "Series",
      cell: ({ row }) => row.original.series?.title || "N/A",
    },
    {
      accessorKey: "views",
      header: "Views",
    },
    {
      accessorKey: "likes",
      header: "Likes",
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div>
          <Link href={`/admin/posts/edit/${row.original.id}`} passHref>
            <Button variant="outline" size="sm" className="mr-2">
              Edit
            </Button>
          </Link>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDelete(row.original.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/posts");
      if (!response.ok) throw new Error("Failed to fetch posts");
      const data: PostWithRelations[] = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const handleEdit = (id: number) => {
    // Implement edit functionality
    console.log("Edit post:", id);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this post?")) {
      try {
        const response = await fetch(`/api/posts/${id}`, { method: "DELETE" });
        if (!response.ok) throw new Error("Failed to delete post");
        fetchPosts(); // Refresh the posts list
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    }
  };

  const table = useReactTable({
    data: posts,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      globalFilter: filtering,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setFiltering,
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Posts</h2>
        <Link href={"/admin/posts/create"} passHref>
          <Button variant="default" size="sm" className="mr-2">
            Create New Post
          </Button>
        </Link>
      </div>
      <Input
        placeholder="Filter posts..."
        value={filtering}
        onChange={(e) => setFiltering(e.target.value)}
        className="mb-4"
      />
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
