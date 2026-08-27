"use client";

import { homepageContent } from "@/content/homepage";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthProvider";
import { CartSidebar } from "@/components/shared/CartSidebar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ShoppingBag, User, LogOut, Settings, LayoutDashboard } from "lucide-react";
import { getInitials } from "@/lib/utils/format";

export function SiteHeader() {
  const pathname = usePathname();
  const { user, isLoading, logout, isAuthenticated, isAdmin } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-line/60 bg-canvas/80 backdrop-blur-xl">
      <div className="mx-auto flex w-[min(1180px,calc(100vw-2rem))] items-center justify-between py-4">
        <Link href="/" className="group inline-flex items-center gap-2">
          <span className="font-display text-xl tracking-tight text-ink">{homepageContent.nav.logo}</span>
          <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-br from-sky via-clay to-honey transition-transform duration-300 group-hover:scale-110" />
        </Link>
        <nav aria-label="Main" className="flex items-center gap-4">
          <Link
            href={homepageContent.nav.primary.href}
            className="rounded-full border border-line px-4 py-2 text-sm text-muted transition-colors hover:border-ink/20 hover:bg-ink/5 hover:text-ink"
          >
            {homepageContent.nav.primary.label}
          </Link>

          <CartSidebar />

          {isLoading ? (
            <div className="h-10 w-10 animate-pulse rounded-full bg-muted/20" />
          ) : isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user?.image || ""} alt={user?.name || "User"} />
                    <AvatarFallback className="bg-sky text-canvas">
                      {getInitials(user?.name || "U")}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-medium text-ink">{user?.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {/* my account page exist, but is hidden from the user, cause we will implement it later */}
                {/* <DropdownMenuItem asChild>
                  <Link href="/account" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Account
                  </Link>
                </DropdownMenuItem> */}
                <DropdownMenuItem asChild>
                  <Link href="/orders" className="flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4" />
                    Orders
                  </Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="flex items-center gap-2">
                      <LayoutDashboard className="h-4 w-4" />
                      Admin Dashboard
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => logout()}
                  className="text-clay focus:text-clay flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="text-sm text-muted hover:text-ink">
                Log in
              </Link>
              <Link href="/register">
                <Button size="sm">Sign up</Button>
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}