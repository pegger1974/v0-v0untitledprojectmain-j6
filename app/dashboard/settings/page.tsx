"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Save } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SettingsPage() {
  return (
    <div className="bg-black text-white min-h-screen">
      <div className="container px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Settings</h1>
        </div>

        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="account">
            <TabsList className="bg-gray-900 border border-gray-800">
              <TabsTrigger value="account" className="data-[state=active]:bg-orange-500">
                Account
              </TabsTrigger>
              <TabsTrigger value="profile" className="data-[state=active]:bg-orange-500">
                Profile
              </TabsTrigger>
              <TabsTrigger value="notifications" className="data-[state=active]:bg-orange-500">
                Notifications
              </TabsTrigger>
              <TabsTrigger value="privacy" className="data-[state=active]:bg-orange-500">
                Privacy
              </TabsTrigger>
            </TabsList>

            <TabsContent value="account" className="mt-6">
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <h2 className="text-xl font-bold mb-4">Account Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      defaultValue="user@example.com"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
                    />
                  </div>
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      defaultValue="********"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
                    />
                  </div>
                  <div className="pt-4">
                    <Button className="bg-orange-500 hover:bg-orange-600">
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="profile" className="mt-6">
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <h2 className="text-xl font-bold mb-4">Profile Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      defaultValue="User"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
                    />
                  </div>
                  <div>
                    <label htmlFor="bio" className="block text-sm font-medium mb-1">
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      rows={4}
                      defaultValue="Scooter enthusiast"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
                    />
                  </div>
                  <div className="pt-4">
                    <Button className="bg-orange-500 hover:bg-orange-600">
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="notifications" className="mt-6">
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <h2 className="text-xl font-bold mb-4">Notification Settings</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Email Notifications</h3>
                      <p className="text-sm text-gray-400">Receive email notifications</p>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="email-notifications"
                        defaultChecked
                        className="rounded border-gray-700 bg-gray-800"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Push Notifications</h3>
                      <p className="text-sm text-gray-400">Receive push notifications</p>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="push-notifications"
                        defaultChecked
                        className="rounded border-gray-700 bg-gray-800"
                      />
                    </div>
                  </div>
                  <div className="pt-4">
                    <Button className="bg-orange-500 hover:bg-orange-600">
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="privacy" className="mt-6">
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <h2 className="text-xl font-bold mb-4">Privacy Settings</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Profile Visibility</h3>
                      <p className="text-sm text-gray-400">Make your profile visible to others</p>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="profile-visibility"
                        defaultChecked
                        className="rounded border-gray-700 bg-gray-800"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Show Online Status</h3>
                      <p className="text-sm text-gray-400">Show when you're online</p>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="online-status"
                        defaultChecked
                        className="rounded border-gray-700 bg-gray-800"
                      />
                    </div>
                  </div>
                  <div className="pt-4">
                    <Button className="bg-orange-500 hover:bg-orange-600">
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
