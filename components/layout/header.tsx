"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Menu, X, ShoppingBag, Users, Calendar, Info, Bell, LogIn, UserPlus } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-white font-bold">
            X
          </div>
          <span className="text-xl font-bold text-white">ScootX</span>
        </Link>

        <nav className="hidden md:flex gap-6">
          <Link
            href="/marketplace"
            className={`flex items-center gap-1 text-sm font-medium ${
              isActive("/marketplace") ? "text-orange-500" : "text-gray-200 hover:text-orange-500 transition-colors"
            }`}
          >
            <ShoppingBag className="h-4 w-4" />
            Marketplace
          </Link>
          <Link
            href="/social"
            className={`flex items-center gap-1 text-sm font-medium ${
              isActive("/social") ? "text-orange-500" : "text-gray-200 hover:text-orange-500 transition-colors"
            }`}
          >
            <Users className="h-4 w-4" />
            Social
          </Link>
          <Link
            href="/events"
            className={`flex items-center gap-1 text-sm font-medium ${
              isActive("/events") ? "text-orange-500" : "text-gray-200 hover:text-orange-500 transition-colors"
            }`}
          >
            <Calendar className="h-4 w-4" />
            Events
          </Link>
          <Link
            href="/about"
            className={`flex items-center gap-1 text-sm font-medium ${
              isActive("/about") ? "text-orange-500" : "text-gray-200 hover:text-orange-500 transition-colors"
            }`}
          >
            <Info className="h-4 w-4" />
            About
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            // Show these elements when user is logged in
            <>
              <Button variant="ghost" className="relative p-0 h-8 w-8 rounded-full">
                <Bell className="h-5 w-5 text-gray-400 hover:text-white" />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-orange-500"></span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={user.avatarUrl || "/images/avatars/default-avatar.png"}
                        alt={user.name || "User"}
                      />
                      <AvatarFallback className="bg-orange-500 text-white">
                        {user.name ? user.name[0].toUpperCase() : "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name || "User"}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer">
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/messages" className="cursor-pointer">
                      Messages
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/notifications" className="cursor-pointer">
                      Notifications
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings" className="cursor-pointer">
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="cursor-pointer">
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            // Show login/signup buttons when no user is logged in
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="text-gray-200 hover:text-white" asChild>
                <Link href="/login">
                  <LogIn className="h-4 w-4 mr-2" />
                  Log in
                </Link>
              </Button>
              <Button className="bg-orange-500 hover:bg-orange-600" size="sm" asChild>
                <Link href="/signup">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Sign up
                </Link>
              </Button>
            </div>
          )}

          <Button variant="ghost" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-800 bg-black">
          <div className="container py-4 space-y-4">
            <Link
              href="/marketplace"
              className={`flex items-center gap-2 p-2 rounded-md ${
                isActive("/marketplace") ? "bg-gray-800 text-orange-500" : "text-gray-200"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <ShoppingBag className="h-5 w-5" />
              Marketplace
            </Link>
            <Link
              href="/social"
              className={`flex items-center gap-2 p-2 rounded-md ${
                isActive("/social") ? "bg-gray-800 text-orange-500" : "text-gray-200"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <Users className="h-5 w-5" />
              Social
            </Link>
            <Link
              href="/events"
              className={`flex items-center gap-2 p-2 rounded-md ${
                isActive("/events") ? "bg-gray-800 text-orange-500" : "text-gray-200"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <Calendar className="h-5 w-5" />
              Events
            </Link>
            <Link
              href="/about"
              className={`flex items-center gap-2 p-2 rounded-md ${
                isActive("/about") ? "bg-gray-800 text-orange-500" : "text-gray-200"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <Info className="h-5 w-5" />
              About
            </Link>

            {!user && (
              <>
                <div className="border-t border-gray-800 my-2"></div>
                <Link
                  href="/login"
                  className="flex items-center gap-2 p-2 rounded-md text-gray-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <LogIn className="h-5 w-5" />
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="flex items-center gap-2 p-2 rounded-md bg-orange-500 text-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <UserPlus className="h-5 w-5" />
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
