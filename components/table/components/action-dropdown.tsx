import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Ellipsis } from 'lucide-react';
import React from 'react';
import { DeletePostButton } from './delete-buttons';
import { QueryKey } from '@tanstack/react-query';
import UpdatePostModal from './update-post-modal';
import { Post } from '../desktop-table/columns';

type ActionDropdownProps = {
  post: Post;
  queryKey: QueryKey;
  onSuccess?: () => void;
};

const ActionDropdown = ({ post, queryKey, onSuccess }: ActionDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Ellipsis />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Post action</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DeletePostButton
          postId={post.id}
          queryKey={queryKey}
          onSuccess={onSuccess}
        />
        <UpdatePostModal queryKey={queryKey} post={post} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ActionDropdown;
