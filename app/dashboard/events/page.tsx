"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, Plus, Edit, Trash2, Eye } from "lucide-react"
import Image from "next/image"

export default function DashboardEventsPage() {
  // This would normally come from a database
  const events = []

  return (
    <div className="bg-black text-white min-h-screen">
      <div className="container px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">My Events</h1>
          <Button className="bg-orange-500 hover:bg-orange-600" asChild>
            <Link href="/events/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Event
            </Link>
          </Button>
        </div>

        {events.length > 0 ? (
          <div className="space-y-6">
            {/* Events would be mapped here */}
            <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3">
                  <div className="aspect-video relative">
                    <Image src="/scooter-event.png" alt="Event" fill className="object-cover" />
                  </div>
                </div>
                <div className="p-4 md:p-6 flex-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Sample Event Title</h2>
                    <div className="flex items-center mt-2 md:mt-0">
                      <span className="bg-blue-500/20 text-blue-500 text-xs px-2 py-1 rounded">Upcoming</span>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-400 mb-2">
                    <Calendar className="mr-1 h-4 w-4" />
                    <span>June 15, 2025 • 2:00 PM - 5:00 PM</span>
                  </div>
                  <p className="text-gray-400 mb-4 line-clamp-2">
                    This is a sample event description. In a real application, this would show the actual event
                    description.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    <Button size="sm" variant="outline" className="bg-gray-800 hover:bg-gray-700" asChild>
                      <Link href="/events/event-id">
                        <Eye className="mr-1 h-4 w-4" />
                        View
                      </Link>
                    </Button>
                    <Button size="sm" variant="outline" className="bg-gray-800 hover:bg-gray-700" asChild>
                      <Link href="/events/event-id/edit">
                        <Edit className="mr-1 h-4 w-4" />
                        Edit
                      </Link>
                    </Button>
                    <Button size="sm" variant="outline" className="bg-red-900/20 hover:bg-red-900/30 text-red-500">
                      <Trash2 className="mr-1 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-900 rounded-lg p-8 border border-gray-800 text-center">
            <Calendar className="h-16 w-16 mx-auto text-gray-600 mb-4" />
            <h2 className="text-2xl font-bold mb-2">No Events Yet</h2>
            <p className="text-gray-400 max-w-md mx-auto mb-6">
              You haven't created any events yet. Create your first event to start connecting with the community.
            </p>
            <Button className="bg-orange-500 hover:bg-orange-600" asChild>
              <Link href="/events/create">
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Event
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
