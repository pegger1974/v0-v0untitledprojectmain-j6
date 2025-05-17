"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Search, Filter, Plus, MapPin } from "lucide-react"

// Sample listings data with unique images that match descriptions
const listings = [
  {
    id: "listing-1",
    title: "2020 Vespa Primavera 150",
    description: "Excellent condition Vespa Primavera with only 1,200 miles. Includes windshield and rear rack.",
    price: 4200,
    location: "San Francisco, CA",
    image: "/images/listings/vespa-primavera-parked.png",
    category: "Scooters",
    condition: "Excellent",
    seller: {
      name: "John Vespa",
      rating: 4.8,
    },
  },
  {
    id: "listing-2",
    title: "Vintage 1965 Lambretta TV 175 Electronic",
    description:
      "Fully restored classic Lambretta Electronic model. New paint, rebuilt engine, and all original parts.",
    price: 8500,
    location: "Chicago, IL",
    image: "/images/listings/orange-lambretta-front.png",
    category: "Scooters",
    condition: "Restored",
    seller: {
      name: "Vintage Scooters",
      rating: 4.9,
    },
  },
  {
    id: "listing-3",
    title: "Scooter Helmet - Size M",
    description: "Like-new full-face helmet, only worn a few times. Size medium, DOT certified.",
    price: 120,
    location: "Austin, TX",
    image: "/images/listings/scooter-helmet.png",
    category: "Apparel",
    condition: "Like New",
    seller: {
      name: "ScooterGear",
      rating: 4.7,
    },
  },
  {
    id: "listing-4",
    title: "Performance Exhaust for Vespa GTS 300",
    description: "Akrapovic exhaust system for Vespa GTS 300. Increases performance and has a great sound.",
    price: 450,
    location: "Miami, FL",
    image: "/images/listings/scooter-exhaust.png",
    category: "Parts",
    condition: "New",
    seller: {
      name: "ScooterParts",
      rating: 4.6,
    },
  },
  {
    id: "listing-5",
    title: "Classic White Vespa - Fully Restored",
    description: "Beautifully restored classic white Vespa with black seat and chrome details. Runs perfectly.",
    price: 5200,
    location: "Portland, OR",
    image: "/images/listings/white-vespa-classic.png", // Using the new white Vespa image
    category: "Scooters",
    condition: "Restored",
    seller: {
      name: "ScooterLover",
      rating: 4.5,
    },
  },
  {
    id: "listing-6",
    title: "Vintage Silver Vespa - Collector's Item",
    description: "Rare silver Vespa in excellent condition. All original parts with recent mechanical overhaul.",
    price: 4800,
    location: "Seattle, WA",
    image: "/images/listings/silver-vespa-classic.png", // Using the new silver Vespa image
    category: "Scooters",
    condition: "Excellent",
    seller: {
      name: "VintageVespas",
      rating: 4.9,
    },
  },
]

// Categories
const categories = ["All", "Scooters", "Parts", "Accessories", "Apparel", "Tools"]

// Conditions
const conditions = ["All", "New", "Like New", "Good", "Fair", "Restored", "Project"]

export default function MarketplacePage() {
  return (
    <div className="bg-black text-white min-h-screen">
      <div className="container px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Scooter Marketplace</h1>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search listings..."
              className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-10 pr-4 py-2"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="bg-gray-900 border-gray-800">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button className="bg-orange-500 hover:bg-orange-600" asChild>
              <Link href="/marketplace/create">
                <Plus className="mr-2 h-4 w-4" />
                Create Listing
              </Link>
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2">
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Condition</label>
            <select className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2">
              {conditions.map((condition) => (
                <option key={condition} value={condition}>
                  {condition}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Price Range</label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2"
              />
              <input
                type="number"
                placeholder="Max"
                className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Location</label>
            <input
              type="text"
              placeholder="City, State"
              className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2"
            />
          </div>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <Link href={`/marketplace/${listing.id}`} key={listing.id} className="group">
              <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-orange-500 transition-colors">
                <div className="aspect-square relative">
                  <Image
                    src={listing.image || "/placeholder.svg"}
                    alt={listing.title}
                    width={300}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-medium px-2 py-1 rounded">
                    {listing.category}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-orange-500 transition-colors">
                    {listing.title}
                  </h3>
                  <p className="text-gray-400 flex items-center text-sm mb-2">
                    <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                    {listing.location}
                  </p>
                  <p className="text-gray-300 text-sm line-clamp-2 mb-3">{listing.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-orange-500 font-bold text-xl">${listing.price}</span>
                    <span className="text-xs bg-gray-800 px-2 py-1 rounded-full">{listing.condition}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-8">
          <div className="flex gap-2">
            <Button variant="outline" className="bg-gray-900 border-gray-800" disabled>
              Previous
            </Button>
            <Button variant="outline" className="bg-orange-500 border-orange-500">
              1
            </Button>
            <Button variant="outline" className="bg-gray-900 border-gray-800">
              2
            </Button>
            <Button variant="outline" className="bg-gray-900 border-gray-800">
              3
            </Button>
            <Button variant="outline" className="bg-gray-900 border-gray-800">
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
