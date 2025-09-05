"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, UserCircle, Home, Users, BarChart, Calendar, History, Menu } from "lucide-react";
import { useAuth } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navLinks = [
  { href: "/sessions", label: "Sessions", icon: Home },
  { href: "/teams", label: "Teams", icon: Users },
  { href: "/stats", label: "Stats", icon: BarChart },
  { href: "/calendar", label: "Calendar", icon: Calendar },
  { href: "/history", label: "History", icon: History },
];

export function Header() {
  const { user, logout, isAdmin, getUserByUsername } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const fullUser = user ? getUserByUsername(user.username) : null;

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleLinkClick = (href: string) => {
    router.push(href);
    setIsSheetOpen(false);
  }

  const NavLink = ({ href, label, icon: Icon }: { href: string, label: string, icon: React.ElementType }) => (
    <Link
      href={href}
      onClick={() => handleLinkClick(href)}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
        pathname === href && "text-primary bg-muted"
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/sessions" className="flex items-center gap-2 font-semibold">
            <svg
                role="img"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 fill-primary"
            >
              <title>Inverness Eagles</title>
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10zm-5-10a5 5 0 0 1 10 0v.035c-1.373-1.63-3.56-2.535-5-2.535s-3.627.905-5 2.535V12zm1.618-3.322c.813-1.012 2.1-1.678 3.382-1.678s2.57.666 3.382 1.678c-1.12-.52-2.352-.828-3.382-.828s-2.262.308-3.382.828zM9.475 14.525c.575-2.1 2.44-3.525 4.525-3.525.688 0 1.35.138 1.95.4-1.162.775-2.887 1.25-4.45 1.25-1.025 0-2.012-.225-2.837-.638.2.837.537 1.625 1.812 2.513z" />
            </svg>
            <span className="hidden sm:inline">Inverness Eagles</span>
          </Link>
          <nav className="hidden md:flex md:items-center md:gap-5 text-sm font-medium">
             {navLinks.map(link => (
              <Link key={link.href} href={link.href} className={cn(
                "transition-colors hover:text-primary",
                 pathname === link.href ? "text-primary" : "text-muted-foreground"
              )}>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                     <AvatarImage src={fullUser?.avatarUrl} alt={user.username} />
                    <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.username}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {isAdmin ? "Administrator" : "Player"}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/profile')}>
                  <UserCircle className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild>
              <Link href="/login">Get Started</Link>
            </Button>
          )}

          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
               <SheetHeader className="sr-only">
                  <SheetTitle>Menu</SheetTitle>
                  <SheetDescription>
                    Main navigation links for the application.
                  </SheetDescription>
                </SheetHeader>
               <nav className="grid gap-6 text-lg font-medium">
                  <Link
                      href="/sessions"
                      className="flex items-center gap-2 text-lg font-semibold mb-4"
                      onClick={() => setIsSheetOpen(false)}
                    >
                       <svg
                          role="img"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 fill-primary"
                        >
                            <title>Inverness Eagles</title>
                            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10zm-5-10a5 5 0 0 1 10 0v.035c-1.373-1.63-3.56-2.535-5-2.535s-3.627.905-5 2.535V12zm1.618-3.322c.813-1.012 2.1-1.678 3.382-1.678s2.57.666 3.382 1.678c-1.12-.52-2.352-.828-3.382-.828s-2.262.308-3.382.828zM9.475 14.525c.575-2.1 2.44-3.525 4.525-3.525.688 0 1.35.138 1.95.4-1.162.775-2.887 1.25-4.45 1.25-1.025 0-2.012-.225-2.837-.638.2.837.537 1.625 1.812 2.513z" />
                        </svg>
                      <span className="sr-only">Inverness Eagles</span>
                  </Link>
                  {navLinks.map(link => (
                    <NavLink key={link.href} {...link} />
                  ))}
               </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
