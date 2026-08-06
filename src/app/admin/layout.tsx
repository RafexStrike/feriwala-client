"use client";

import { AdminRoute } from "@/components/customer/RouteGuards";
import { AdminLayout } from "@/components/admin/AdminLayout";

export default function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminRoute>
      <AdminLayout>{children}</AdminLayout>
    </AdminRoute>
  );
}
