import { usePrismaMutation } from '@/app/hooks/use-prisma-query';
import { Button } from '@/components/ui/button';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Post } from '@prisma/client';
import { QueryKey } from '@tanstack/react-query';
import { Table } from '@tanstack/react-table';

type DeleteSelectedPostsButtonProps = {
  table: Table<Post>;
};

export function DeleteSelectedPostsButton({
  table,
}: DeleteSelectedPostsButtonProps) {
  const deleteMany = usePrismaMutation(
    {
      model: 'post',
      operation: 'deleteMany',
      queryKey: table.options.meta?.queryKey,
    },
    {
      onSuccess: () => {
        table.resetRowSelection();
        table.options.meta?.onDeleteSuccess?.();
      },
    }
  );

  const handleBulkDelete = () => {
    const selectedIds = table
      .getSelectedRowModel()
      .rows.map((row) => row.original.id);

    if (selectedIds.length === 0) return;

    deleteMany.mutate({
      where: { id: { in: selectedIds } },
    });
  };

  return (
    <DropdownMenuItem
      onClick={handleBulkDelete}
      disabled={deleteMany.isPending}
      variant="destructive"
    >
      {deleteMany.isPending ? 'Deleting...' : 'Delete Selected'}
    </DropdownMenuItem>
  );
}

type DeletePostButtonProps = {
  postId: string;
  queryKey: QueryKey;
  onSuccess?: () => void;
};

export function DeletePostButton({
  postId,
  queryKey,
  onSuccess,
}: DeletePostButtonProps) {
  const deletePost = usePrismaMutation(
    {
      model: 'post',
      operation: 'delete',
      args: { where: { id: postId } },
      queryKey,
    },
    {
      onSuccess: () => {
        onSuccess?.();
      },
    }
  );

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={() => deletePost.mutate({ where: { id: postId } })}
      disabled={deletePost.isPending}
    >
      {deletePost.isPending ? 'Deleting...' : 'Delete'}
    </Button>
  );
}
