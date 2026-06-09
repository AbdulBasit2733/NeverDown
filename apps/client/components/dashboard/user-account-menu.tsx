"use client";

import Link from "next/link";
import { ChevronDown, Home, LogOut, User } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0]}${parts[1]![0]}`.toUpperCase();
}

export function UserAccountMenu() {
  const { data: session, status } = useSession();

  const displayName =
    session?.user?.username || session?.user?.name || "Account";
  const email = session?.user?.email;
  const initials = getInitials(displayName);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  if (status === "loading") {
    return (
      <Button variant="outline" size="sm" disabled className="gap-2">
        <span className="size-6 rounded-full bg-muted animate-pulse" />
        <span className="h-4 w-20 rounded bg-muted animate-pulse" />
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 pl-1.5 pr-2.5"
          aria-label="Open account menu"
        >
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
            {session?.user?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={session.user.image}
                alt=""
                className="size-6 rounded-full object-cover"
              />
            ) : (
              initials
            )}
          </span>
          <span className="max-w-[8rem] truncate text-sm font-medium">
            {displayName}
          </span>
          <ChevronDown className="size-3.5 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium leading-none">{displayName}</p>
            {email && (
              <p className="text-xs text-muted-foreground truncate">{email}</p>
            )}
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/" className="cursor-pointer">
            <Home className="size-4" />
            Home
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem disabled>
          <User className="size-4" />
          Account settings
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          variant="destructive"
          className="cursor-pointer"
          onClick={handleLogout}
        >
          <LogOut className="size-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
