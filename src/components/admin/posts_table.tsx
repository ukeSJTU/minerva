"use client";

import { useState } from "react";
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
import Link from "next/link";

// Define your data type based on the schema
type Post = {
  id: number;
  title: string;
  content: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  categoryId: number;
  seriesId: number | null;
  orderInSeries: number | null;
};

// Sample data (replace with actual data fetching)
const data: Post[] = [
  {
    id: 1,
    title: "First Post",
    content: "Content 1",
    published: true,
    createdAt: "2024-06-28",
    updatedAt: "2024-06-28",
    categoryId: 1,
    seriesId: null,
    orderInSeries: null,
  },
  {
    id: 2,
    title: "Second Post",
    content: "Content 2",
    published: false,
    createdAt: "2024-06-29",
    updatedAt: "2024-06-29",
    categoryId: 2,
    seriesId: 1,
    orderInSeries: 1,
  },
  // Add more sample data...
];

const columns: ColumnDef<Post>[] = [
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
    accessorKey: "createdAt",
    header: "Created At",
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div>
        <Button variant="outline" size="sm" className="mr-2">
          Edit
        </Button>
        <Button variant="destructive" size="sm">
          Delete
        </Button>
      </div>
    ),
  },
];

export function PostsTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filtering, setFiltering] = useState("");

  const table = useReactTable({
    data,
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
        <Button>
          <Link href="/admin/posts/create">Create New Post</Link>
        </Button>
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
