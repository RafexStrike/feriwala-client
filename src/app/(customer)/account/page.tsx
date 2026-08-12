"use client";

import { useState } from "react";
import { Package, ShoppingBag, MessageSquare, User, Settings, LogOut, ChevronRight, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useOrders } from "@/lib/hooks/useOrders";
import { formatCurrency, formatDate, formatRelativeTime } from "@/lib/utils/format";
import { EmptyState } from "@/components/shared/EmptyState";
import { VerifiedRoute } from "@/components/customer/RouteGuards";
import { PageHeader } from "@/components/shared/PageHeader";

function OrderHistoryTab() {
  const { data: orders, isLoading } = useOrders();
  const ordersList = orders || [];

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 animate-pulse bg-canvas rounded-xl" />
        ))}
      </div>
    );
  }

  if (ordersList.length === 0) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title="No orders yet"
        description="When you place an order, it will appear here."
        action={{ label: "Start Shopping", href: "/products" }}
      />
    );
  }

  return (
    <div className="space-y-4">
      {ordersList.map((order) => (
        <OrderHistoryCard key={order._id} order={order} />
      ))}
    </div>
  );
}

function OrderHistoryCard({ order }: { order: any }) {
  const itemCount = order.items.reduce((sum: number, item: any) => sum + item.quantity, 0);
  const statusStyles = {
    pending: "bg-yellow-100 text-yellow-800",
    completed: "bg-green-100 text-green-800",
    canceled: "bg-red-100 text-red-800",
  };

  return (
    <div className="rounded-xl border border-line bg-surface p-4 hover:border-ink/20 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-ink">Order #{order._id.slice(-8).toUpperCase()}</span>
            <span className="text-sm text-muted">{formatDate(order.createdAt)}</span>
          </div>
          <div className="mt-1 flex items-center gap-4 text-sm text-muted">
            <span>{itemCount} item{itemCount !== 1 ? "s" : ""}</span>
            <span>•</span>
            <span className="font-medium text-ink">{formatCurrency(order.total)}</span>
          </div>
        </div>
        <Badge variant="outline" className={cn("ml-4 flex-shrink-0", statusStyles[order.status as keyof typeof statusStyles] || "")}>
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </Badge>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild>
          <a href={`/orders/${order._id}`}>View Details <ChevronRight className="ml-1 h-3.5 w-3.5" /></a>
        </Button>
        {order.status === "completed" && (
          <Button variant="outline" size="sm" asChild>
            <a href={`/products/${order.items[0]?.product}?review=true`}>
              <MessageSquare className="mr-1.5 h-3.5 w-3.5" />
              Write Review
            </a>
          </Button>
        )}
      </div>
    </div>
  );
}

function MyReviewsTab() {
  return (
    <EmptyState
      icon={MessageSquare}
      title="No reviews yet"
      description="Reviews you write will appear here."
      action={{ label: "Browse Products", href: "/products" }}
    />
  );
}

function ProfileTab() {
  const { user, isLoading, logout } = useAuth();
  const [activeSection, setActiveSection] = useState("profile");

  if (isLoading) {
    return <div className="h-40 animate-pulse bg-canvas rounded-xl" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="h-20 w-20 rounded-full bg-sky/10 flex items-center justify-center text-sky text-2xl font-bold">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <h3 className="font-display text-xl text-ink">{user?.name}</h3>
          <p className="text-sm text-muted">{user?.email}</p>
          <Badge variant="outline" className={cn("mt-2", user?.role === "admin" ? "bg-purple-100 text-purple-800" : "")}>
            {user?.role ? user?.role.charAt(0).toUpperCase() + user?.role.slice(1) : "User"}
          </Badge>
          {user?.emailVerified && (
            <Badge variant="outline" className="ml-2 bg-green-100 text-green-800">
              Verified Email
            </Badge>
          )}
        </div>
      </div>

      <Separator />

      <Tabs value={activeSection} onValueChange={setActiveSection} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="danger">Delete Account</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6 space-y-4">
          <h4 className="font-medium text-ink">Profile Information</h4>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="name" className="block text-sm font-medium text-ink">Full Name</Label>
              <Input id="name" defaultValue={user?.name} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-ink">Email</Label>
              <Input id="email" type="email" defaultValue={user?.email} disabled className="mt-1" />
            </div>
          </div>
          <Button>Save Changes</Button>
        </TabsContent>

        <TabsContent value="password" className="mt-6 space-y-4">
          <h4 className="font-medium text-ink">Change Password</h4>
          <div className="space-y-4 max-w-md">
            <div>
              <Label htmlFor="currentPassword" className="block text-sm font-medium text-ink">Current Password</Label>
              <Input id="currentPassword" type="password" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="newPassword" className="block text-sm font-medium text-ink">New Password</Label>
              <Input id="newPassword" type="password" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="confirmPassword" className="block text-sm font-medium text-ink">Confirm New Password</Label>
              <Input id="confirmPassword" type="password" className="mt-1" />
            </div>
          </div>
          <Button>Update Password</Button>
        </TabsContent>

        <TabsContent value="danger" className="mt-6 space-y-4 border border-clay/20 rounded-xl p-6 bg-clay/5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-clay/10 text-clay">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-medium text-clay">Delete Account</h4>
              <p className="mt-1 text-sm text-muted">
                This action is irreversible. All your data, including order history and reviews, will be permanently deleted.
              </p>
            </div>
          </div>
          <Button variant="destructive" onClick={() => logout()}>
            Delete My Account
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function AccountPage() {
  return (
    <VerifiedRoute>
      <div className="mx-auto w-[min(1180px,calc(100vw-2rem))] py-10">
        <PageHeader
          title="My Account"
          description="Manage your profile, view orders, and see your reviews."
        />

        <Tabs defaultValue="orders" className="mt-10">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="orders">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="reviews">
              <MessageSquare className="mr-2 h-4 w-4" />
              Reviews
            </TabsTrigger>
            <TabsTrigger value="profile">
              <User className="mr-2 h-4 w-4" />
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="mt-6">
            <OrderHistoryTab />
          </TabsContent>
          <TabsContent value="reviews" className="mt-6">
            <MyReviewsTab />
          </TabsContent>
          <TabsContent value="profile" className="mt-6">
            <ProfileTab />
          </TabsContent>
        </Tabs>
      </div>
    </VerifiedRoute>
  );
}