'use client';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Ellipsis } from 'lucide-react';
import React from 'react';
import { DeleteSelectedPostsButton } from '../components/delete-buttons';
import ActionDropdown from '../components/action-dropdown';

export type Post = {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
};

export const columns: ColumnDef<Post>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <div className="flex justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="p-0 hover:bg-transparent"
      >
        Title
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="w-[200px]">{row.getValue('title')}</div>,
  },
  {
    accessorKey: 'content',
    header: 'Content',
    cell: ({ row }) => (
      <div className="max-w-[300px] truncate">{row.getValue('content')}</div>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt'));
      return date.toLocaleDateString();
    },
  },
  {
    id: 'actions',
    header: ({ table }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              disabled={table.getSelectedRowModel().rows.length === 0}
              variant="outline"
              size="sm"
            >
              <Ellipsis className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Bulk Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DeleteSelectedPostsButton table={table} />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    cell: ({ row, table }) => {
      return (
        <ActionDropdown
          post={row.original}
          queryKey={table.options.meta?.queryKey}
          onSuccess={table.options.meta?.onDeleteSuccess}
        />
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];
