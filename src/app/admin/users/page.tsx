"use client";

import { useState } from "react";
import { Pencil, Trash2, Users, Shield, ShieldOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userUpdateSchema } from "@/lib/utils/validation";
import {
  useAdminUsers,
  useUpdateUser,
  useDeleteUser,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ErrorState } from "@/components/shared/ErrorState";
import { formatDate } from "@/lib/utils/format";
import { toast } from "@/hooks/use-toast";
import type { User, UserUpdateInput } from "@/types/api";

export default function UsersPage() {
  const { data: users, isLoading, error, refetch } = useAdminUsers();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const form = useForm<UserUpdateInput>({
    resolver: zodResolver(userUpdateSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "user",
    },
  });

  const openEditDialog = (user: User) => {
    setEditingUser(user);
    form.reset({ name: user.name, email: user.email, role: user.role });
  };

  const onSubmit = async (data: UserUpdateInput) => {
    if (!editingUser) return;
    try {
      await updateUser.mutateAsync({ userId: editingUser.id, data });
      toast({ title: "User updated successfully" });
      setEditingUser(null);
    } catch (err) {
      toast({
        title: "Failed to update user",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteUser.mutateAsync(deleteId);
      toast({ title: "User deleted successfully" });
      setDeleteId(null);
    } catch (err) {
      toast({
        title: "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  if (error) {
    return (
      <ErrorState
        title="Failed to load users"
        message={error.message || "An error occurred while fetching users."}
        onRetry={refetch}
      />
    );
  }

  return (
    <div>
      <AdminHeader
        title="Users"
        description="Manage user accounts and permissions"
      />

      <DataTable
        data={users ?? []}
        columns={[
          {
            key: "name",
            header: "User",
            render: (item) => (
              <div>
                <p className="font-medium text-ink">{item.name}</p>
                <p className="text-sm text-muted">{item.email}</p>
              </div>
            ),
          },
          {
            key: "role",
            header: "Role",
            render: (item) => (
              <Badge variant={item.role === "admin" ? "default" : "secondary"}>
                {item.role === "admin" ? (
                  <Shield className="mr-1 h-3 w-3" />
                ) : (
                  <ShieldOff className="mr-1 h-3 w-3" />
                )}
                {item.role}
              </Badge>
            ),
          },
          {
            key: "emailVerified",
            header: "Verified",
            render: (item) => (
              <Badge variant={item.emailVerified ? "default" : "secondary"}>
                {item.emailVerified ? "Verified" : "Unverified"}
              </Badge>
            ),
          },
          {
            key: "createdAt",
            header: "Joined",
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
                <Button variant="ghost" size="sm" onClick={() => setDeleteId(item.id)}>
                  <Trash2 className="h-4 w-4 text-clay" />
                </Button>
              </div>
            ),
          },
        ]}
        isLoading={isLoading}
        emptyTitle="No users"
        emptyDescription="No users have registered yet."
        emptyIcon={Users}
        keyExtractor={(item) => item.id}
      />

      <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user details and permissions.
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
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditingUser(null)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={updateUser.isPending}>
                  {updateUser.isPending ? "Saving..." : "Update"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteUser.isPending}>
              {deleteUser.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
