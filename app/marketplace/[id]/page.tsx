"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  MapPin,
  Calendar,
  MessageSquare,
  Heart,
  Share2,
  Flag,
  ChevronLeft,
  ChevronRight,
  Star,
  Phone,
  Mail,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"

// Sample listings data with unique images that match descriptions
const listings = [
  {
    id: "listing-1",
    title: "2020 Vespa Primavera 150",
    description:
      "Excellent condition Vespa Primavera with only 1,200 miles. Includes windshield and rear rack. This scooter has been meticulously maintained and garage kept since purchase. The 150cc engine provides plenty of power for city commuting and weekend rides. Features include anti-lock brakes, LED lighting, and a USB charging port. The original owner's manual and two sets of keys are included.",
    price: 4200,
    location: "San Francisco, CA",
    image: "/images/listings/vespa-primavera-parked.png",
    category: "Scooters",
    condition: "Excellent",
    seller: {
      id: "user-1",
      name: "John Vespa",
      rating: 4.8,
      memberSince: "May 2023",
      responseRate: "98%",
      responseTime: "Within 2 hours",
      listings: 5,
      avatar: "/images/avatars/john-vespa.png",
      phone: "+1 (555) 123-4567",
      email: "john@example.com",
    },
    details: {
      brand: "Vespa",
      model: "Primavera",
      year: 2020,
      mileage: 1200,
      engineSize: "150cc",
      color: "White",
      features: ["Anti-lock brakes", "LED lighting", "USB charging port", "Windshield", "Rear rack"],
    },
    images: [
      "/images/listings/vespa-primavera-parked.png",
      "/images/listings/silver-vespa-front.png",
      "/images/listings/silver-vespa-side.png",
      "/images/listings/white-vespa-classic.png",
    ],
    postedDate: "2 weeks ago",
    views: 156,
  },
  {
    id: "listing-2",
    title: "Vintage 1965 Lambretta TV 175 Electronic",
    description:
      "Fully restored classic Lambretta Electronic model. New paint, rebuilt engine, and all original parts. This is a rare find for collectors and enthusiasts. The restoration was completed by a certified Lambretta specialist using only genuine parts. The scooter runs perfectly and is ready to ride or display. Comes with a certificate of authenticity and detailed restoration documentation.",
    price: 8500,
    location: "Chicago, IL",
    image: "/images/listings/orange-lambretta-front.png",
    category: "Scooters",
    condition: "Restored",
    seller: {
      id: "user-2",
      name: "Vintage Scooters",
      rating: 4.9,
      memberSince: "January 2020",
      responseRate: "100%",
      responseTime: "Within 1 hour",
      listings: 12,
      avatar: "/images/avatars/default-avatar.png",
      phone: "+1 (555) 987-6543",
      email: "vintage@example.com",
    },
    details: {
      brand: "Lambretta",
      model: "TV 175 Electronic",
      year: 1965,
      mileage: 500,
      engineSize: "175cc",
      color: "Orange",
      features: ["Restored", "Original parts", "Certificate of authenticity", "Chrome accessories"],
    },
    images: ["/images/listings/orange-lambretta-front.png", "/images/listings/orange-lambretta.png"],
    postedDate: "1 month ago",
    views: 243,
  },
  {
    id: "listing-3",
    title: "Scooter Helmet - Size M",
    description:
      "Like-new full-face helmet, only worn a few times. Size medium, DOT certified. This premium helmet provides excellent protection while remaining lightweight and comfortable. Features include a quick-release visor, ventilation system, and removable liner for easy cleaning. The helmet comes in its original box with all accessories.",
    price: 120,
    location: "Austin, TX",
    image: "/images/listings/scooter-helmet.png",
    category: "Apparel",
    condition: "Like New",
    seller: {
      id: "user-3",
      name: "ScooterGear",
      rating: 4.7,
      memberSince: "March 2022",
      responseRate: "95%",
      responseTime: "Within 3 hours",
      listings: 28,
      avatar: "/images/avatars/default-avatar.png",
      phone: "+1 (555) 456-7890",
      email: "gear@example.com",
    },
    details: {
      brand: "Shoei",
      model: "RF-1200",
      size: "Medium",
      color: "Black",
      certification: "DOT, SNELL",
      features: ["Full-face", "Quick-release visor", "Ventilation system", "Removable liner"],
    },
    images: ["/images/listings/scooter-helmet.png"],
    postedDate: "3 weeks ago",
    views: 87,
  },
  {
    id: "listing-4",
    title: "Performance Exhaust for Vespa GTS 300",
    description:
      "Akrapovic exhaust system for Vespa GTS 300. Increases performance and has a great sound. This high-quality exhaust is made from titanium and carbon fiber, reducing weight while improving performance. Installation is straightforward with the included mounting hardware. The exhaust has been used for only 500 miles and is in excellent condition.",
    price: 450,
    location: "Miami, FL",
    image: "/images/listings/scooter-exhaust.png",
    category: "Parts",
    condition: "New",
    seller: {
      id: "user-4",
      name: "ScooterParts",
      rating: 4.6,
      memberSince: "July 2021",
      responseRate: "92%",
      responseTime: "Within 5 hours",
      listings: 45,
      avatar: "/images/avatars/default-avatar.png",
      phone: "+1 (555) 789-0123",
      email: "parts@example.com",
    },
    details: {
      brand: "Akrapovic",
      compatibility: "Vespa GTS 300 (2019-2023)",
      material: "Titanium and carbon fiber",
      weight: "2.3 kg",
      includes: ["Exhaust", "Mounting hardware", "Installation guide"],
    },
    images: ["/images/listings/scooter-exhaust.png"],
    postedDate: "1 week ago",
    views: 112,
  },
  {
    id: "listing-5",
    title: "Classic White Vespa - Fully Restored",
    description:
      "Beautifully restored classic white Vespa with black seat and chrome details. Runs perfectly. This vintage Vespa has been completely restored from the ground up. The engine has been rebuilt, the electrical system has been updated, and the paint is fresh. All chrome parts have been re-plated and shine like new. The scooter starts easily and runs smoothly. A true head-turner that gets compliments wherever it goes.",
    price: 5200,
    location: "Portland, OR",
    image: "/images/listings/white-vespa-classic.png",
    category: "Scooters",
    condition: "Restored",
    seller: {
      id: "user-5",
      name: "ScooterLover",
      rating: 4.5,
      memberSince: "April 2021",
      responseRate: "90%",
      responseTime: "Within 6 hours",
      listings: 8,
      avatar: "/images/avatars/default-avatar.png",
      phone: "+1 (555) 234-5678",
      email: "lover@example.com",
    },
    details: {
      brand: "Vespa",
      model: "VBB",
      year: 1964,
      mileage: 1000,
      engineSize: "150cc",
      color: "White",
      features: ["Restored", "New paint", "Rebuilt engine", "Chrome details", "Black seat"],
    },
    images: ["/images/listings/white-vespa-classic.png"],
    postedDate: "3 weeks ago",
    views: 178,
  },
  {
    id: "listing-6",
    title: "Vintage Silver Vespa - Collector's Item",
    description:
      "Rare silver Vespa in excellent condition. All original parts with recent mechanical overhaul. This collector's item has been carefully preserved over the years. The silver paint is original and in remarkable condition for its age. The engine has recently been serviced with new gaskets, seals, and tuning. The scooter starts on the first kick and runs beautifully. A perfect addition to any vintage scooter collection.",
    price: 4800,
    location: "Seattle, WA",
    image: "/images/listings/silver-vespa-classic.png",
    category: "Scooters",
    condition: "Excellent",
    seller: {
      id: "user-6",
      name: "VintageVespas",
      rating: 4.9,
      memberSince: "February 2019",
      responseRate: "98%",
      responseTime: "Within 2 hours",
      listings: 15,
      avatar: "/images/avatars/default-avatar.png",
      phone: "+1 (555) 345-6789",
      email: "vintage@example.com",
    },
    details: {
      brand: "Vespa",
      model: "GS",
      year: 1962,
      mileage: 12000,
      engineSize: "160cc",
      color: "Silver",
      features: ["Original paint", "Original parts", "Recent mechanical overhaul", "Collector's item"],
    },
    images: [
      "/images/listings/silver-vespa-classic.png",
      "/images/listings/silver-vespa-front.png",
      "/images/listings/silver-vespa-side.png",
    ],
    postedDate: "1 month ago",
    views: 203,
  },
]

// Similar listings (for recommendations)
const similarListings = listings.slice(0, 3)

export default function ListingDetailPage({ params }: { params: { id: string } }) {
  const { user } = useAuth()
  const [listing, setListing] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [showContactInfo, setShowContactInfo] = useState(false)

  useEffect(() => {
    // In a real app, this would fetch the listing from an API
    // For now, we'll use our sample data
    const foundListing = listings.find((item) => item.id === params.id)

    if (foundListing) {
      setListing(foundListing)
    }

    setIsLoading(false)
  }, [params.id])

  const nextImage = () => {
    if (listing?.images) {
      setActiveImageIndex((prevIndex) => (prevIndex === listing.images.length - 1 ? 0 : prevIndex + 1))
    }
  }

  const prevImage = () => {
    if (listing?.images) {
      setActiveImageIndex((prevIndex) => (prevIndex === 0 ? listing.images.length - 1 : prevIndex - 1))
    }
  }

  if (isLoading) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="bg-black text-white min-h-screen">
        <div className="container px-4 py-8">
          <Button variant="ghost" size="icon" asChild className="mb-6">
            <Link href="/marketplace">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>

          <div className="text-center py-16">
            <h1 className="text-3xl font-bold mb-4">Listing Not Found</h1>
            <p className="text-gray-400 mb-8">The listing you're looking for doesn't exist or has been removed.</p>
            <Button className="bg-orange-500 hover:bg-orange-600" asChild>
              <Link href="/marketplace">Back to Marketplace</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-black text-white min-h-screen">
      <div className="container px-4 py-8">
        <Button variant="ghost" size="icon" asChild className="mb-6">
          <Link href="/marketplace">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
              <div className="relative aspect-video md:aspect-[4/3]">
                {listing.images && listing.images.length > 0 ? (
                  <>
                    <Image
                      src={listing.images[activeImageIndex] || "/placeholder.svg"}
                      alt={listing.title}
                      fill
                      className="object-contain"
                      priority
                    />
                    {listing.images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 rounded-full p-2 hover:bg-black/70"
                        >
                          <ChevronLeft className="h-6 w-6" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 rounded-full p-2 hover:bg-black/70"
                        >
                          <ChevronRight className="h-6 w-6" />
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-800">
                    <p className="text-gray-400">No image available</p>
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {listing.images && listing.images.length > 1 && (
                <div className="flex overflow-x-auto p-2 gap-2">
                  {listing.images.map((img: string, index: number) => (
                    <div
                      key={index}
                      className={`relative w-20 h-20 flex-shrink-0 cursor-pointer border-2 rounded ${
                        index === activeImageIndex ? "border-orange-500" : "border-transparent"
                      }`}
                      onClick={() => setActiveImageIndex(index)}
                    >
                      <Image
                        src={img || "/placeholder.svg"}
                        alt={`Thumbnail ${index + 1}`}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Listing Details */}
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h1 className="text-2xl font-bold mb-2">{listing.title}</h1>
              <div className="flex items-center text-gray-400 mb-4">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{listing.location}</span>
                <span className="mx-2">•</span>
                <Calendar className="h-4 w-4 mr-1" />
                <span>Posted {listing.postedDate}</span>
                <span className="mx-2">•</span>
                <span>{listing.views} views</span>
              </div>
              <div className="text-2xl font-bold text-orange-500 mb-6">${listing.price.toLocaleString()}</div>

              <Tabs defaultValue="description">
                <TabsList className="bg-gray-800 border border-gray-700">
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                </TabsList>
                <TabsContent value="description" className="mt-4">
                  <p className="text-gray-300 whitespace-pre-line">{listing.description}</p>
                </TabsContent>
                <TabsContent value="details" className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(listing.details).map(([key, value]) => {
                      if (key === "features") return null
                      return (
                        <div key={key} className="flex justify-between border-b border-gray-800 py-2">
                          <span className="text-gray-400 capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</span>
                          <span>{value as string}</span>
                        </div>
                      )
                    })}
                  </div>

                  {listing.details.features && (
                    <div className="mt-6">
                      <h3 className="font-bold mb-2">Features</h3>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {(listing.details.features as string[]).map((feature, index) => (
                          <li key={index} className="flex items-center">
                            <div className="h-2 w-2 rounded-full bg-orange-500 mr-2"></div>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Right Column - Seller Info and Actions */}
          <div className="space-y-6">
            {/* Seller Info */}
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-800">
                  <Image
                    src={listing.seller.avatar || "/images/avatars/default-avatar.png"}
                    alt={listing.seller.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{listing.seller.name}</h3>
                  <div className="flex items-center text-sm">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                    <span>{listing.seller.rating} rating</span>
                  </div>
                  <p className="text-xs text-gray-400">Member since {listing.seller.memberSince}</p>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Response rate:</span>
                  <span>{listing.seller.responseRate}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Response time:</span>
                  <span>{listing.seller.responseTime}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Listings:</span>
                  <span>{listing.seller.listings}</span>
                </div>
              </div>

              <div className="space-y-3">
                <Button className="w-full bg-orange-500 hover:bg-orange-600" onClick={() => setShowContactInfo(true)}>
                  <Phone className="mr-2 h-4 w-4" />
                  Show Contact Info
                </Button>

                <Button className="w-full" asChild>
                  <Link
                    href={user ? `/messages?seller=${listing.seller.id}` : `/login?redirect=/marketplace/${params.id}`}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Message Seller
                  </Link>
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <div className="flex justify-between mb-4">
                <Button variant="outline" className="flex-1 mr-2 bg-gray-800 border-gray-700">
                  <Heart className="mr-2 h-4 w-4" />
                  Save
                </Button>
                <Button variant="outline" className="flex-1 bg-gray-800 border-gray-700">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </div>
              <Button variant="outline" className="w-full bg-gray-800 border-gray-700">
                <Flag className="mr-2 h-4 w-4" />
                Report Listing
              </Button>
            </div>

            {/* Category and Condition */}
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Category:</span>
                <Link href={`/marketplace?category=${listing.category}`} className="text-orange-500 hover:underline">
                  {listing.category}
                </Link>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Condition:</span>
                <span>{listing.condition}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Listings */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Similar Listings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarListings.map((item) => (
              <Link href={`/marketplace/${item.id}`} key={item.id} className="group">
                <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-orange-500 transition-colors">
                  <div className="aspect-square relative">
                    <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
                    <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-medium px-2 py-1 rounded">
                      {item.category}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold mb-2 group-hover:text-orange-500 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-400 flex items-center text-sm mb-2">
                      <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                      {item.location}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-orange-500 font-bold text-xl">${item.price}</span>
                      <span className="text-xs bg-gray-800 px-2 py-1 rounded-full">{item.condition}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Info Dialog */}
      <Dialog open={showContactInfo} onOpenChange={setShowContactInfo}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Contact Information</DialogTitle>
            <DialogDescription className="text-gray-400">Contact details for {listing.seller.name}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex items-center">
              <Phone className="h-5 w-5 mr-3 text-orange-500" />
              <div>
                <p className="text-sm text-gray-400">Phone</p>
                <p className="font-medium">{listing.seller.phone}</p>
              </div>
            </div>

            <div className="flex items-center">
              <Mail className="h-5 w-5 mr-3 text-orange-500" />
              <div>
                <p className="text-sm text-gray-400">Email</p>
                <p className="font-medium">{listing.seller.email}</p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button className="bg-orange-500 hover:bg-orange-600">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
