"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Check } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function EventPaymentPage() {
  const router = useRouter()
  const [eventData, setEventData] = useState<any>(null)
  const [isPublishing, setIsPublishing] = useState(false)

  useEffect(() => {
    // Get event data from localStorage
    const storedEvent = localStorage.getItem("lastCreatedEvent")
    if (storedEvent) {
      setEventData(JSON.parse(storedEvent))
    }
  }, [])

  const handlePublish = () => {
    if (!eventData) return

    setIsPublishing(true)

    // In a real app, this would process payment and save to database
    // For now, we'll save to localStorage as a temporary solution

    try {
      // Get existing published events or initialize empty array
      const existingEvents = localStorage.getItem("publishedEvents")
      const publishedEvents = existingEvents ? JSON.parse(existingEvents) : []

      // Add the new event
      publishedEvents.push(eventData)

      // Save back to localStorage
      localStorage.setItem("publishedEvents", JSON.stringify(publishedEvents))

      // Show success message and redirect
      setTimeout(() => {
        router.push("/events")
      }, 1000)
    } catch (error) {
      console.error("Error publishing event:", error)
      setIsPublishing(false)
    }
  }

  if (!eventData) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        <p>Loading event data...</p>
      </div>
    )
  }

  return (
    <div className="bg-black text-white min-h-screen">
      <div className="container px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/events/create">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Publish Your Event</h1>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-900 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Your Event is Ready to Publish!</h2>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/3">
                <div className="aspect-video relative rounded-lg overflow-hidden">
                  <Image
                    src={eventData.coverImage || "/scooter-event.png"}
                    alt={eventData.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="w-full md:w-2/3">
                <h3 className="text-xl font-bold">{eventData.title}</h3>
                <p className="text-gray-400 mb-2">
                  {eventData.date} • {eventData.startTime} - {eventData.endTime}
                </p>
                <p className="text-gray-400 mb-4">{eventData.location}</p>
                <p className="line-clamp-3">{eventData.description}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Select a Pricing Plan</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-gray-800 rounded-lg p-4 bg-gray-800">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-bold">Basic</h3>
                  <span className="bg-orange-500 text-white px-2 py-1 rounded text-xs">FREE</span>
                </div>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Basic event listing</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Up to 50 attendees</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Standard visibility</span>
                  </li>
                </ul>
                <Button
                  className="w-full bg-orange-500 hover:bg-orange-600"
                  onClick={handlePublish}
                  disabled={isPublishing}
                >
                  {isPublishing ? "Publishing..." : "Select"}
                </Button>
              </div>

              <div className="border border-orange-500 rounded-lg p-4 bg-gray-800 relative">
                <div className="absolute -top-3 right-4 bg-orange-500 text-white px-2 py-1 rounded-full text-xs">
                  POPULAR
                </div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-bold">Premium</h3>
                  <span className="bg-orange-500 text-white px-2 py-1 rounded text-xs">$19.99</span>
                </div>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Enhanced event listing</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Up to 200 attendees</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Featured in search results</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Analytics dashboard</span>
                  </li>
                </ul>
                <Button
                  className="w-full bg-orange-500 hover:bg-orange-600"
                  onClick={handlePublish}
                  disabled={isPublishing}
                >
                  {isPublishing ? "Publishing..." : "Select"}
                </Button>
              </div>

              <div className="border border-gray-800 rounded-lg p-4 bg-gray-800">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-bold">Professional</h3>
                  <span className="bg-orange-500 text-white px-2 py-1 rounded text-xs">$49.99</span>
                </div>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Premium event listing</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Unlimited attendees</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Featured on homepage</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Advanced analytics</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Priority support</span>
                  </li>
                </ul>
                <Button
                  className="w-full bg-orange-500 hover:bg-orange-600"
                  onClick={handlePublish}
                  disabled={isPublishing}
                >
                  {isPublishing ? "Publishing..." : "Select"}
                </Button>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" className="bg-gray-900 border-gray-800" asChild>
              <Link href="/events/create">Back</Link>
            </Button>
            <Button className="bg-orange-500 hover:bg-orange-600" onClick={handlePublish} disabled={isPublishing}>
              {isPublishing ? "Publishing..." : "Publish for Free"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
