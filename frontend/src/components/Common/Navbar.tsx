import { Link as RouterLink } from "@tanstack/react-router";
import { LogOut, Menu } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useAuth, { isLoggedIn } from "@/hooks/useAuth";
import { getInitials } from "@/utils";

const navItems = [
  { label: "Features", href: "#features" },
  { label: "How it Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "Testimonials", href: "#testimonials" },
];

export function Navbar() {
  const { logout, user } = useAuth();
  const isAuthenticated = isLoggedIn();
  const userLabel = user?.full_name || user?.email || "Signed in user";
  const userInitial = user?.full_name?.trim()
    ? getInitials(user.full_name)
    : (user?.email?.trim().charAt(0) ?? "?");

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <img src="/assets/images/logo.png" alt="Logo" className="h-12 w-auto" />

        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex size-10 items-center justify-center rounded-full bg-orange-600 text-sm font-semibold text-white outline-none ring-offset-background transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  aria-label={userLabel}
                  title={userLabel}
                >
                  <Avatar className="size-10">
                    <AvatarFallback className="bg-orange-600 text-sm font-semibold text-white">
                      {userInitial}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" sideOffset={8}>
                <DropdownMenuLabel className="flex flex-col gap-0.5 p-3 font-normal">
                  <span className="text-sm font-medium leading-none">
                    {user?.full_name || "Signed in user"}
                  </span>
                  <span className="text-xs text-muted-foreground leading-none">
                    {user?.email}
                  </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <RouterLink to="/login">Sign In</RouterLink>
              </Button>
              <Button asChild>
                <RouterLink to="/signup">Get Started</RouterLink>
              </Button>
            </>
          )}
        </div>

        <Button variant="ghost" size="icon" className="md:hidden" asChild>
          <a href="#menu" aria-label="Open menu">
            <Menu className="size-5" />
          </a>
        </Button>
      </div>
    </header>
  );
}

export default Navbar;
