"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { notificationEmailSchema } from "@/lib/utils/validation";
import {
  useNotificationEmails,
  useCreateNotificationEmail,
  useUpdateNotificationEmail,
  useDeleteNotificationEmail,
} from "@/lib/hooks/useAdmin";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { DataTable } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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
import { formatDate } from "@/lib/utils/format";
import { toast } from "@/hooks/use-toast";
import type { NotificationRecipient, NotificationEmailInput } from "@/types/api";

const notificationTypes = [
  { id: "order_status", label: "Order Status Updates" },
  { id: "new_order", label: "New Order Alerts" },
  { id: "low_stock", label: "Low Stock Alerts" },
  { id: "new_review", label: "New Review Notifications" },
];

export default function NotificationsPage() {
  const { data: recipients, isLoading, error, refetch } = useNotificationEmails();
  const createRecipient = useCreateNotificationEmail();
  const updateRecipient = useUpdateNotificationEmail();
  const deleteRecipient = useDeleteNotificationEmail();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRecipient, setEditingRecipient] = useState<NotificationRecipient | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const form = useForm<NotificationEmailInput>({
    resolver: zodResolver(notificationEmailSchema),
    defaultValues: {
      email: "",
      isActive: true,
      notificationTypes: [],
    },
  });

  const openCreateDialog = () => {
    setEditingRecipient(null);
    form.reset({ email: "", isActive: true, notificationTypes: [] });
    setIsDialogOpen(true);
  };

  const openEditDialog = (recipient: NotificationRecipient) => {
    setEditingRecipient(recipient);
    form.reset({
      email: recipient.email,
      isActive: recipient.isActive,
      notificationTypes: recipient.notificationTypes,
    });
    setIsDialogOpen(true);
  };

  const onSubmit = async (data: NotificationEmailInput) => {
    try {
      if (editingRecipient) {
        await updateRecipient.mutateAsync({ recipientId: editingRecipient._id, data });
        toast({ title: "Recipient updated successfully" });
      } else {
        await createRecipient.mutateAsync(data);
        toast({ title: "Recipient created successfully" });
      }
      setIsDialogOpen(false);
      form.reset();
    } catch (err) {
      toast({
        title: editingRecipient ? "Failed to update recipient" : "Failed to create recipient",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteRecipient.mutateAsync(deleteId);
      toast({ title: "Recipient deleted successfully" });
      setDeleteId(null);
    } catch (err) {
      toast({
        title: "Failed to delete recipient",
        variant: "destructive",
      });
    }
  };

  if (error) {
    return (
      <ErrorState
        title="Failed to load notification recipients"
        message={error.message || "An error occurred while fetching recipients."}
        onRetry={refetch}
      />
    );
  }

  return (
    <div>
      <AdminHeader
        title="Notification Emails"
        description="Manage email recipients for store notifications"
        actions={
          <Button onClick={openCreateDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Add Recipient
          </Button>
        }
      />

      <DataTable
        data={recipients ?? []}
        columns={[
          {
            key: "email",
            header: "Email",
            render: (item) => (
              <span className="font-medium text-ink">{item.email}</span>
            ),
          },
          {
            key: "notificationTypes",
            header: "Notification Types",
            render: (item) => (
              <div className="flex flex-wrap gap-1">
                {item.notificationTypes.map((type) => (
                  <Badge key={type} variant="secondary" className="text-xs">
                    {type.replace(/_/g, " ")}
                  </Badge>
                ))}
              </div>
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
            key: "createdAt",
            header: "Added",
            render: (item) => formatDate(item.createdAt),
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
        emptyTitle="No notification recipients"
        emptyDescription="Add email addresses to receive store notifications."
        emptyIcon={Mail}
        keyExtractor={(item) => item._id}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingRecipient ? "Edit Recipient" : "Add Recipient"}
            </DialogTitle>
            <DialogDescription>
              {editingRecipient
                ? "Update notification preferences for this recipient."
                : "Add a new email recipient for store notifications."}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notificationTypes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notification Types</FormLabel>
                    <div className="space-y-2">
                      {notificationTypes.map((type) => (
                        <label
                          key={type.id}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <Checkbox
                            checked={field.value?.includes(type.id) ?? false}
                            onCheckedChange={(checked) => {
                              const current = field.value || [];
                              if (checked) {
                                field.onChange([...current, type.id]);
                              } else {
                                field.onChange(current.filter((t) => t !== type.id));
                              }
                            }}
                          />
                          <span className="text-sm text-ink">{type.label}</span>
                        </label>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="!mt-0">Active</FormLabel>
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createRecipient.isPending || updateRecipient.isPending}
                >
                  {createRecipient.isPending || updateRecipient.isPending
                    ? "Saving..."
                    : editingRecipient
                    ? "Update"
                    : "Add"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Recipient</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this recipient? They will stop receiving notifications.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteRecipient.isPending}>
              {deleteRecipient.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
