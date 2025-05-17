"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Upload, X, Calendar, Clock, MapPin } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function CreateEventPage() {
  const router = useRouter()
  const [coverImage, setCoverImage] = useState<File | null>(null)
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Rally",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    address: "",
    isOnline: false,
    isPrivate: false,
    maxAttendees: "",
  })

  // Categories
  const categories = ["Rally", "Festival", "Workshop", "Exhibition", "Anniversary", "International", "Meetup"]

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value
    setFormData((prev) => ({ ...prev, [name]: val }))
  }

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB")
        return
      }

      const imageUrl = URL.createObjectURL(file)
      setCoverImage(file)
      setCoverImagePreview(imageUrl)
    }
  }

  // Remove cover image
  const removeCoverImage = () => {
    setCoverImage(null)
    setCoverImagePreview(null)
  }

  // Upload image using the API route
  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      // Create form data for the API request
      const formData = new FormData()
      formData.append("file", file)
      formData.append("fileType", "image")
      formData.append("bucket", "event_images")

      // Send the request to the API route
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to upload image")
      }

      const data = await response.json()
      return data.url
    } catch (err) {
      console.error("Error uploading image:", err)
      throw err
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // Upload cover image if selected
      let imageUrl = null
      if (coverImage) {
        imageUrl = await uploadImage(coverImage)
        if (!imageUrl) {
          throw new Error("Failed to upload image")
        }
      }

      // Store event data in localStorage for the confirmation page
      const eventData = {
        ...formData,
        coverImage: imageUrl || "/scooter-event.png",
        id: Date.now().toString(),
      }

      localStorage.setItem("lastCreatedEvent", JSON.stringify(eventData))

      // In a real app, this would save to the database
      console.log("Event created:", eventData)

      // Redirect to confirmation page
      router.push("/events/create/payment")
    } catch (err) {
      console.error("Error creating event:", err)
      setError(err instanceof Error ? err.message : "Failed to create event")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-black text-white min-h-screen">
      <div className="container px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/events">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Create New Event</h1>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-500 text-white p-4 rounded-lg mb-6">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          {/* Cover Image */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Event Cover Image</h2>
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
              <div className="aspect-video relative bg-gray-800 rounded-lg overflow-hidden mb-4">
                {coverImagePreview ? (
                  <>
                    <Image src={coverImagePreview || "/placeholder.svg"} alt="Cover" fill className="object-cover" />
                    <button
                      type="button"
                      className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-2"
                      onClick={removeCoverImage}
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </>
                ) : (
                  <label className="flex flex-col items-center justify-center h-full cursor-pointer">
                    <Upload className="h-12 w-12 text-gray-400 mb-2" />
                    <p className="text-gray-400">Click to upload cover image</p>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                )}
              </div>
              <p className="text-sm text-gray-400">
                Upload a high-quality image to attract attendees. Recommended size: 1200x630 pixels.
              </p>
            </div>
          </div>

          {/* Event Details */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Event Details</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-1">
                  Event Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2"
                  placeholder="e.g., Annual Scooter Rally 2025"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2"
                  placeholder="Describe your event in detail. Include what attendees can expect, schedule, special guests, etc."
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium mb-1">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium mb-1">
                    Date *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                      className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-10 pr-4 py-2"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="startTime" className="block text-sm font-medium mb-1">
                    Start Time *
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="time"
                      id="startTime"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleChange}
                      required
                      className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-10 pr-4 py-2"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="endTime" className="block text-sm font-medium mb-1">
                    End Time *
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="time"
                      id="endTime"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleChange}
                      required
                      className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-10 pr-4 py-2"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Event Location</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  id="isOnline"
                  name="isOnline"
                  checked={formData.isOnline}
                  onChange={handleChange}
                  className="rounded border-gray-800 bg-gray-900"
                />
                <label htmlFor="isOnline" className="text-sm">
                  This is an online event
                </label>
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium mb-1">
                  Venue Name *
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2"
                  placeholder={formData.isOnline ? "e.g., Zoom Meeting" : "e.g., Central Park"}
                />
              </div>

              {!formData.isOnline && (
                <div>
                  <label htmlFor="address" className="block text-sm font-medium mb-1">
                    Address *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-gray-400" />
                    <textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      rows={2}
                      className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-10 pr-4 py-2"
                      placeholder="Full address including city, state, and zip code"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Additional Settings */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Additional Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPrivate"
                  name="isPrivate"
                  checked={formData.isPrivate}
                  onChange={handleChange}
                  className="rounded border-gray-800 bg-gray-900"
                />
                <label htmlFor="isPrivate" className="text-sm">
                  Private event (only visible to invited guests)
                </label>
              </div>

              <div>
                <label htmlFor="maxAttendees" className="block text-sm font-medium mb-1">
                  Maximum Attendees (optional)
                </label>
                <input
                  type="number"
                  id="maxAttendees"
                  name="maxAttendees"
                  value={formData.maxAttendees}
                  onChange={handleChange}
                  min="1"
                  className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2"
                  placeholder="Leave blank for unlimited"
                />
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" className="bg-gray-900 border-gray-800" asChild>
              <Link href="/events">Cancel</Link>
            </Button>
            <Button type="submit" className="bg-orange-500 hover:bg-orange-600" disabled={isSubmitting}>
              {isSubmitting ? "Publishing..." : "Continue to Publish"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
