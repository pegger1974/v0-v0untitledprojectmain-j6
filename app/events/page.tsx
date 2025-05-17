"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users, Search, Filter, Plus, RefreshCw, Download, Upload, Copy, Check } from "lucide-react"

// Sample events data with proper event poster images
const sampleEvents = [
  {
    id: "1",
    title: "SCOOTER-FEST 19",
    date: "May 18, 2025",
    location: "Leek Town Centre, Market Place & Derby St",
    description:
      "Join us for the 19th annual Scooter-Fest! Features include a large parts fair, ridden custom show (last entry 1:30 pm), DJ Mike Coburn, and live music by The Renegades.",
    attendees: 42,
    image: "/images/events/norfolk-scooter-run.jpg",
    organizer: "North Staffs Jesters Scooter Club",
    category: "Festival",
  },
  {
    id: "2",
    title: "30 JAHRE VESPA-CLUB KÖFLACH",
    date: "August 9, 2025",
    location: "MAD CLUB KOSIR, Bärnbach, Austria",
    description:
      "Celebrating 30 years of the Vespa Club Köflach! Join the ride out at 15:00 Uhr. Parking and camping available at this anniversary celebration.",
    attendees: 86,
    image: "/images/events/vespa-club-koflach.jpg",
    organizer: "Vespa Club Köflach",
    category: "Anniversary",
  },
  {
    id: "3",
    title: "EAST BELFAST SCOOTER RALLY",
    date: "August 8, 2025",
    location: "Shorts Sports & Social Club, Belfast",
    description:
      "The annual East Belfast Scooter Rally returns! Join us for a day of scooter displays, ride-outs, and evening entertainment.",
    attendees: 28,
    image: "/images/events/east-belfast-rally.png",
    category: "Rally",
  },
]

// Event categories
const categories = ["All", "Rally", "Festival", "Workshop", "Exhibition", "Anniversary", "International"]

interface UserEvent {
  id: string
  title: string
  date: string
  location: string
  description: string
  category: string
  coverImage: string
  attendees?: number
}

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>(sampleEvents)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [debugInfo, setDebugInfo] = useState<string>("")
  const [showExportModal, setShowExportModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [exportCode, setExportCode] = useState("")
  const [importCode, setImportCode] = useState("")
  const [copied, setCopied] = useState(false)
  const [importError, setImportError] = useState("")

  // Function to load events from localStorage
  const loadEvents = () => {
    setIsLoading(true)
    try {
      const publishedEvents = localStorage.getItem("publishedEvents")
      let debugMessage = "Sample events loaded. "

      if (publishedEvents) {
        const parsedEvents = JSON.parse(publishedEvents) as UserEvent[]
        debugMessage += `Found ${parsedEvents.length} published events in localStorage.`

        // Format the user events to match the sample events structure
        const formattedUserEvents = parsedEvents.map((event) => ({
          id: event.id,
          title: event.title.toUpperCase(), // Match the uppercase style of sample events
          date: formatDate(event.date),
          location: event.location,
          description: event.description,
          attendees: event.attendees || Math.floor(Math.random() * 50) + 5, // Random attendees if not specified
          image: event.coverImage,
          category: event.category,
        }))

        // Combine with sample events
        setEvents([...formattedUserEvents, ...sampleEvents])
      } else {
        debugMessage += "No published events found in localStorage."
        setEvents(sampleEvents)
      }

      setDebugInfo(debugMessage)
    } catch (err) {
      console.error("Error parsing published events:", err)
      setDebugInfo(`Error loading events: ${err instanceof Error ? err.message : String(err)}`)
      // If there's an error, just use the sample events
      setEvents(sampleEvents)
    } finally {
      setIsLoading(false)
    }
  }

  // Load events on initial render
  useEffect(() => {
    loadEvents()
  }, [])

  // Format date from YYYY-MM-DD to Month DD, YYYY
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    } catch (e) {
      return dateString
    }
  }

  // Filter events by category and search query
  const filteredEvents = events.filter((event) => {
    const matchesCategory = selectedCategory === "All" || event.category === selectedCategory
    const matchesSearch =
      searchQuery === "" ||
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.description && event.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesCategory && matchesSearch
  })

  // Export events to a code
  const handleExport = () => {
    try {
      const publishedEvents = localStorage.getItem("publishedEvents")
      if (publishedEvents) {
        // Base64 encode the events for sharing
        const encoded = btoa(publishedEvents)
        setExportCode(encoded)
        setShowExportModal(true)
      } else {
        setDebugInfo("No events to export")
      }
    } catch (err) {
      console.error("Error exporting events:", err)
      setDebugInfo(`Error exporting events: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  // Copy export code to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(exportCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Import events from a code
  const handleImport = () => {
    try {
      if (!importCode.trim()) {
        setImportError("Please enter an import code")
        return
      }

      // Decode the base64 string
      const decoded = atob(importCode.trim())
      const importedEvents = JSON.parse(decoded)

      // Validate the imported data
      if (!Array.isArray(importedEvents)) {
        setImportError("Invalid import code")
        return
      }

      // Get existing events or initialize empty array
      const existingEvents = localStorage.getItem("publishedEvents")
      const currentEvents = existingEvents ? JSON.parse(existingEvents) : []

      // Merge events, avoiding duplicates by ID
      const mergedEvents = [...currentEvents]

      importedEvents.forEach((importedEvent) => {
        const exists = mergedEvents.some((event) => event.id === importedEvent.id)
        if (!exists) {
          mergedEvents.push(importedEvent)
        }
      })

      // Save merged events back to localStorage
      localStorage.setItem("publishedEvents", JSON.stringify(mergedEvents))

      // Close modal and reload events
      setShowImportModal(false)
      setImportCode("")
      setImportError("")
      loadEvents()
      setDebugInfo(`Successfully imported ${importedEvents.length} events`)
    } catch (err) {
      console.error("Error importing events:", err)
      setImportError("Invalid import code")
    }
  }

  return (
    <div className="bg-black text-white min-h-screen">
      <div className="container px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Scooter Events</h1>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={loadEvents} disabled={isLoading} title="Refresh events">
              <RefreshCw className={`h-5 w-5 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setShowExportModal(true)} title="Export events">
              <Download className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setShowImportModal(true)} title="Import events">
              <Upload className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Debug Info - Only visible in development */}
        {process.env.NODE_ENV !== "production" && (
          <div className="bg-gray-800 p-3 rounded-lg mb-4 text-xs">
            <p className="font-mono">{debugInfo}</p>
          </div>
        )}

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search events..."
              className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-10 pr-4 py-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="bg-gray-900 border-gray-800">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button className="bg-orange-500 hover:bg-orange-600" asChild>
              <Link href="/events/create">
                <Plus className="mr-2 h-4 w-4" />
                Create Event
              </Link>
            </Button>
          </div>
        </div>

        {/* Categories */}
        <div className="flex overflow-x-auto gap-2 mb-8 pb-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={category === selectedCategory ? "default" : "outline"}
              className={
                category === selectedCategory
                  ? "bg-orange-500 hover:bg-orange-600 whitespace-nowrap"
                  : "bg-gray-900 border-gray-800 whitespace-nowrap"
              }
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Events Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 animate-pulse">
                <div className="h-48 bg-gray-800"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-800 rounded mb-2"></div>
                  <div className="h-6 bg-gray-800 rounded mb-3"></div>
                  <div className="h-4 bg-gray-800 rounded mb-2"></div>
                  <div className="h-4 bg-gray-800 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <Link href={`/events/${event.id}`} key={event.id} className="group">
                  <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-orange-500 transition-colors">
                    <div className="h-48 relative">
                      <Image
                        src={event.image || "/placeholder.svg"}
                        alt={event.title}
                        width={400}
                        height={200}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-medium px-2 py-1 rounded">
                        {event.category}
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center text-orange-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span className="text-sm">{event.date}</span>
                        </div>
                        <div className="flex items-center text-gray-400 text-xs">
                          <Users className="h-4 w-4 mr-1" />
                          {event.attendees} attending
                        </div>
                      </div>
                      <h3 className="text-xl font-bold mb-2 group-hover:text-orange-500 transition-colors">
                        {event.title}
                      </h3>
                      <p className="text-gray-400 flex items-center text-sm mb-3">
                        <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                        {event.location}
                      </p>
                      <p className="text-gray-300 text-sm line-clamp-2">{event.description}</p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-gray-400">No events found. Try adjusting your filters or create a new event.</p>
              </div>
            )}
          </div>
        )}

        {/* Export Modal */}
        {showExportModal && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">Export Events</h2>
              <p className="mb-4">Copy this code and use it to import your events on another device:</p>
              <div className="relative">
                <textarea
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm font-mono h-24"
                  value={exportCode}
                  readOnly
                />
                <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={copyToClipboard}>
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <div className="flex justify-end mt-4">
                <Button onClick={() => setShowExportModal(false)}>Close</Button>
              </div>
            </div>
          </div>
        )}

        {/* Import Modal */}
        {showImportModal && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">Import Events</h2>
              <p className="mb-4">Paste the export code from another device:</p>
              <textarea
                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm font-mono h-24 mb-2"
                value={importCode}
                onChange={(e) => setImportCode(e.target.value)}
                placeholder="Paste export code here..."
              />
              {importError && <p className="text-red-500 text-sm mb-4">{importError}</p>}
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowImportModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleImport}>Import</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
