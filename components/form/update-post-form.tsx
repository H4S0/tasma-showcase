import { usePrismaMutation } from '@/app/hooks/use-prisma-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { QueryKey } from '@tanstack/react-query';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { toast } from 'sonner';
import { Post } from '../table/desktop-table/columns';

const UpdatePostSchema = z.object({
  title: z.string(),
  content: z.string(),
});

type UpdatePostFormProps = {
  setIsOpen: (open: boolean) => void;
  queryKey: QueryKey;
  post: Post;
};

const UpdatePostForm = ({ queryKey, setIsOpen, post }: UpdatePostFormProps) => {
  const form = useForm<z.infer<typeof UpdatePostSchema>>({
    resolver: zodResolver(UpdatePostSchema),
    defaultValues: {
      title: post.title,
      content: post.content,
    },
  });

  const updatePost = usePrismaMutation({
    model: 'post',
    operation: 'update',
    queryKey,
  });

  const onSubmit: SubmitHandler<z.infer<typeof UpdatePostSchema>> = (data) => {
    updatePost.mutate(
      {
        where: { id: post.id },
        data,
      },
      {
        onSuccess: (response) => {
          toast.success('Post update successfully!');
          setIsOpen(false);
          form.reset({
            title: '',
            content: '',
          });
        },
        onError: (error) => {
          toast.error(`Error updating post: ${error.message}`);
        },
      }
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          name="title"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Post title</FormLabel>
              <FormControl>
                <Input placeholder="Programmers day" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          name="content"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Post content</FormLabel>
              <FormControl>
                <Input placeholder="example content" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <Button disabled={updatePost.isPending}>
          {updatePost.isPending ? 'Updating post...' : 'Update post'}
        </Button>
      </form>
    </Form>
  );
};

export default UpdatePostForm;
