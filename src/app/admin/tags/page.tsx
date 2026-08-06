"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Tag } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { tagSchema } from "@/lib/utils/validation";
import {
  useAdminTags,
  useCreateTag,
  useUpdateTag,
  useDeleteTag,
} from "@/lib/hooks/useAdmin";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { DataTable } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ErrorState } from "@/components/shared/ErrorState";
import { toast } from "@/hooks/use-toast";
import type { Tag as TagType, TagInput } from "@/types/api";

export default function TagsPage() {
  const { data: tags, isLoading, error, refetch } = useAdminTags();
  const createTag = useCreateTag();
  const updateTag = useUpdateTag();
  const deleteTag = useDeleteTag();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<TagType | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const form = useForm<TagInput>({
    resolver: zodResolver(tagSchema),
    defaultValues: {
      name: "",
    },
  });

  const openCreateDialog = () => {
    setEditingTag(null);
    form.reset({ name: "" });
    setIsDialogOpen(true);
  };

  const openEditDialog = (tag: TagType) => {
    setEditingTag(tag);
    form.reset({ name: tag.name });
    setIsDialogOpen(true);
  };

  const onSubmit = async (data: TagInput) => {
    try {
      if (editingTag) {
        await updateTag.mutateAsync({ tagId: editingTag._id, data });
        toast({ title: "Tag updated successfully" });
      } else {
        await createTag.mutateAsync(data);
        toast({ title: "Tag created successfully" });
      }
      setIsDialogOpen(false);
      form.reset();
    } catch (err) {
      toast({
        title: editingTag ? "Failed to update tag" : "Failed to create tag",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteTag.mutateAsync(deleteId);
      toast({ title: "Tag deleted successfully" });
      setDeleteId(null);
    } catch (err) {
      toast({
        title: "Failed to delete tag",
        variant: "destructive",
      });
    }
  };

  if (error) {
    return (
      <ErrorState
        title="Failed to load tags"
        message={error.message || "An error occurred while fetching tags."}
        onRetry={refetch}
      />
    );
  }

  return (
    <div>
      <AdminHeader
        title="Tags"
        description="Manage product tags for better organization"
        actions={
          <Button onClick={openCreateDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Add Tag
          </Button>
        }
      />

      <DataTable
        data={tags ?? []}
        columns={[
          {
            key: "name",
            header: "Name",
            render: (item) => (
              <span className="font-medium text-ink">{item.name}</span>
            ),
          },
          {
            key: "isActive",
            header: "Status",
            render: (item) => (
              <Badge variant={item.isActive ? "default" : "secondary"}>
                {item.isActive ? "Active" : "Inactive"}
              </Badge>
            ),
          },
          {
            key: "actions",
            header: "Actions",
            render: (item) => (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => openEditDialog(item)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setDeleteId(item._id)}>
                  <Trash2 className="h-4 w-4 text-clay" />
                </Button>
              </div>
            ),
          },
        ]}
        isLoading={isLoading}
        emptyTitle="No tags"
        emptyDescription="Create your first tag to label products."
        emptyIcon={Tag}
        keyExtractor={(item) => item._id}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingTag ? "Edit Tag" : "Create Tag"}
            </DialogTitle>
            <DialogDescription>
              {editingTag
                ? "Update the tag name below."
                : "Add a new tag to label your products."}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Tag name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createTag.isPending || updateTag.isPending}>
                  {createTag.isPending || updateTag.isPending
                    ? "Saving..."
                    : editingTag
                    ? "Update"
                    : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Tag</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this tag? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteTag.isPending}>
              {deleteTag.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
