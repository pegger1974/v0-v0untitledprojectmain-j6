"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, ShoppingBag, User, Settings, Bell, MessageSquare } from "lucide-react"
import Image from "next/image"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login?redirect=/dashboard")
    }
  }, [user, isLoading, router])

  // Show nothing while checking authentication
  if (isLoading || !user) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-black text-white min-h-screen">
      <div className="container px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-800">
                  <Image
                    src={user.avatarUrl || "/images/avatars/default-avatar.png"}
                    alt="Profile"
                    width={64}
                    height={64}
                    className="object-cover"
                  />
                </div>
                <div>
                  <h2 className="font-bold text-lg">{user.name || "User"}</h2>
                  <p className="text-sm text-gray-400">@{user.username || user.email.split("@")[0]}</p>
                </div>
              </div>
              <div className="border-t border-gray-800 pt-4 space-y-2">
                <Link href="/dashboard" className="flex items-center gap-2 p-2 bg-gray-800 rounded-md text-orange-500">
                  <User className="h-5 w-5" />
                  Dashboard
                </Link>
                <Link href="/dashboard/listings" className="flex items-center gap-2 p-2 hover:bg-gray-800 rounded-md">
                  <ShoppingBag className="h-5 w-5" />
                  My Listings
                </Link>
                <Link href="/dashboard/events" className="flex items-center gap-2 p-2 hover:bg-gray-800 rounded-md">
                  <Calendar className="h-5 w-5" />
                  My Events
                </Link>
                <Link href="/dashboard/messages" className="flex items-center gap-2 p-2 hover:bg-gray-800 rounded-md">
                  <MessageSquare className="h-5 w-5" />
                  Messages
                </Link>
                <Link
                  href="/dashboard/notifications"
                  className="flex items-center gap-2 p-2 hover:bg-gray-800 rounded-md"
                >
                  <Bell className="h-5 w-5" />
                  Notifications
                </Link>
                <Link href="/dashboard/settings" className="flex items-center gap-2 p-2 hover:bg-gray-800 rounded-md">
                  <Settings className="h-5 w-5" />
                  Settings
                </Link>
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
              <h3 className="font-bold mb-2">Quick Stats</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gray-800 p-3 rounded-lg">
                  <p className="text-xs text-gray-400">Listings</p>
                  <p className="text-xl font-bold">0</p>
                </div>
                <div className="bg-gray-800 p-3 rounded-lg">
                  <p className="text-xs text-gray-400">Events</p>
                  <p className="text-xl font-bold">0</p>
                </div>
                <div className="bg-gray-800 p-3 rounded-lg">
                  <p className="text-xs text-gray-400">Messages</p>
                  <p className="text-xl font-bold">0</p>
                </div>
                <div className="bg-gray-800 p-3 rounded-lg">
                  <p className="text-xs text-gray-400">Followers</p>
                  <p className="text-xl font-bold">0</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3 space-y-6">
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h2 className="text-xl font-bold mb-4">Welcome to Your Dashboard</h2>
              <p className="text-gray-400 mb-4">
                This is your personal dashboard where you can manage your listings, events, and account settings.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button className="bg-orange-500 hover:bg-orange-600" asChild>
                  <Link href="/marketplace/create">Create Listing</Link>
                </Button>
                <Button className="bg-orange-500 hover:bg-orange-600" asChild>
                  <Link href="/events/create">Create Event</Link>
                </Button>
              </div>
            </div>

            <Tabs defaultValue="listings">
              <TabsList className="bg-gray-900 border border-gray-800">
                <TabsTrigger value="listings">Recent Listings</TabsTrigger>
                <TabsTrigger value="events">Upcoming Events</TabsTrigger>
              </TabsList>
              <TabsContent value="listings" className="mt-4">
                <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                  <div className="text-center py-8">
                    <ShoppingBag className="h-12 w-12 mx-auto text-gray-600 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Listings Yet</h3>
                    <p className="text-gray-400 mb-4">You haven't created any listings yet.</p>
                    <Button className="bg-orange-500 hover:bg-orange-600" asChild>
                      <Link href="/marketplace/create">Create Your First Listing</Link>
                    </Button>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="events" className="mt-4">
                <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 mx-auto text-gray-600 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Events Yet</h3>
                    <p className="text-gray-400 mb-4">You haven't created any events yet.</p>
                    <Button className="bg-orange-500 hover:bg-orange-600" asChild>
                      <Link href="/events/create">Create Your First Event</Link>
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
              <div className="text-center py-8">
                <Bell className="h-12 w-12 mx-auto text-gray-600 mb-4" />
                <h3 className="text-lg font-medium mb-2">No Recent Activity</h3>
                <p className="text-gray-400">Your recent activity will appear here.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
