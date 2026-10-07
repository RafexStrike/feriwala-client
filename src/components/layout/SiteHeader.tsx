"use client";

import { homepageContent } from "@/content/homepage";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthProvider";
import { CartSidebar } from "@/components/shared/CartSidebar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ShoppingBag, LogOut, LayoutDashboard } from "lucide-react";
import { getInitials } from "@/lib/utils/format";
import { BrandMotif } from "@/components/ui/BrandMotif";

export function SiteHeader() {
  const pathname = usePathname();
  const { user, isLoading, logout, isAuthenticated, isAdmin } = useAuth();

  if (pathname.startsWith("/admin") || pathname === "/experimental-home") {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-[rgba(244,239,230,0.72)] backdrop-blur-xl">
      <div className="mx-auto flex w-[min(1180px,calc(100vw-1rem))] items-center justify-between gap-3 py-3 sm:gap-4 sm:py-4">
        <Link href="/" className="group inline-flex shrink-0 items-center gap-3">
          <BrandMotif className="h-3 w-8 group-hover:translate-y-[-1px]" />
          <span className="font-display text-xl tracking-tight text-ink sm:text-2xl">{homepageContent.nav.logo}</span>
        </Link>

        <nav aria-label="Main" className="flex items-center justify-end gap-2 sm:gap-3">
          <Link
            href={homepageContent.nav.primary.href}
            className="hidden rounded-full border border-line/80 bg-white/20 px-3 py-2 text-[0.7rem] uppercase tracking-[0.2em] text-muted transition-colors hover:border-ink/20 hover:bg-white/60 hover:text-ink sm:inline-flex"
          >
            {homepageContent.nav.primary.label}
          </Link>

          <CartSidebar />

          {isLoading ? (
            <div className="h-9 w-9 animate-pulse rounded-full bg-muted/20 sm:h-10 sm:w-10" />
          ) : isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0 sm:h-10 sm:w-10">
                  <Avatar className="h-9 w-9 sm:h-10 sm:w-10">
                    <AvatarImage src={user?.image || ""} alt={user?.name || "User"} />
                    <AvatarFallback className="bg-ink text-canvas text-[11px] sm:text-sm">
                      {getInitials(user?.name || "U")}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-medium text-ink">{user?.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
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
                  className="flex items-center gap-2 text-clay focus:text-clay"
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Link href="/login" className="text-xs text-muted hover:text-ink sm:text-sm">
                Log in
              </Link>
              <Link href="/register">
                <Button size="sm" className="px-3 py-2 text-xs sm:px-4 sm:text-sm">Sign up</Button>
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}