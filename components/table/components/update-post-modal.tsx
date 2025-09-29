import UpdatePostForm from '@/components/form/update-post-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { QueryKey } from '@tanstack/react-query';
import React, { useState } from 'react';
import { Post } from '../desktop-table/columns';

const UpdatePostModal = ({
  queryKey,
  post,
}: {
  queryKey: QueryKey;
  post: Post;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          Update
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Post</DialogTitle>
          <DialogDescription>
            Here you can update your post details.
          </DialogDescription>
        </DialogHeader>

        <UpdatePostForm queryKey={queryKey} setIsOpen={setIsOpen} post={post} />
      </DialogContent>
    </Dialog>
  );
};

export default UpdatePostModal;
