import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Users, MapPin, ArrowRight } from "lucide-react"
import Image from "next/image"

// Featured listings with actual images that match descriptions
const featuredListings = [
  {
    id: "featured-1",
    title: "Classic White Vespa - Pristine Condition",
    description: "Beautiful white Vespa in pristine condition with black seat and chrome details.",
    price: 5200,
    location: "New York",
    image: "/images/listings/white-vespa-classic.png", // Updated to use the new white Vespa image
  },
  {
    id: "featured-2",
    title: "Vintage Silver Vespa - Collector's Item",
    description: "Rare silver Vespa in excellent condition with classic styling.",
    price: 4800,
    location: "Los Angeles",
    image: "/images/listings/silver-vespa-classic.png", // Updated to use the new silver Vespa image
  },
  {
    id: "featured-3",
    title: "Classic Red Vespa - Collector's Dream",
    description: "Stunning red Vespa with gleaming chrome trim and white-wall tires.",
    price: 4200,
    location: "Chicago",
    image: "/images/listings/red-vespa.png",
  },
  {
    id: "featured-4",
    title: "Vintage Orange Lambretta - Electronic Model",
    description: "Rare orange Lambretta Electronic model in exceptional condition.",
    price: 4800,
    location: "Miami",
    image: "/images/listings/orange-lambretta-front.png",
  },
]

// Featured events with actual event poster images
const featuredEvents = [
  {
    id: "1",
    title: "SCOOTER-FEST 19",
    date: "May 18, 2025",
    location: "Leek Town Centre, Market Place & Derby St",
    attendees: 42,
    image: "/images/events/norfolk-scooter-run.jpg", // Updated to use Norfolk Scooter Run image
  },
  {
    id: "2",
    title: "30 JAHRE VESPA-CLUB KÖFLACH",
    date: "August 9, 2025",
    location: "MAD CLUB KOSIR, Bärnbach, Austria",
    attendees: 86,
    image: "/images/events/vespa-club-koflach.jpg",
  },
  {
    id: "3",
    title: "EAST BELFAST SCOOTER RALLY",
    date: "August 8, 2025",
    location: "Shorts Sports & Social Club, Belfast",
    attendees: 28,
    image: "/images/events/east-belfast-rally.png",
  },
]

export default function Home() {
  // Check if Supabase is configured
  const supabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      {!supabaseConfigured && (
        <div className="container mx-auto mt-4">
          <div className="bg-orange-500/20 border border-orange-500 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-orange-500 mb-2">Setup Required</h3>
            <p className="text-white">Please set up Supabase by adding the following environment variables:</p>
            <ul className="list-disc list-inside mt-2 text-gray-200">
              <li>NEXT_PUBLIC_SUPABASE_URL</li>
              <li>NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
            </ul>
          </div>
        </div>
      )}

      <main className="flex-1">
        {/* Hero Section - Background image removed */}
        <section className="relative w-full py-20 md:py-32 bg-gradient-to-b from-gray-900 to-black">
          <div className="container relative z-10 px-4 md:px-6">
            <div className="max-w-3xl space-y-6">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                The Ultimate <span className="text-orange-500">Scooter</span> Marketplace & Community
              </h1>
              <p className="max-w-[600px] text-gray-300 md:text-xl">
                Buy, sell, and connect with fellow scooter enthusiasts. Join the fastest growing scooter community and
                marketplace platform for scooters, parts, apparel, and accessories.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button size="lg" className="bg-orange-500 text-white hover:bg-orange-600" asChild>
                  <Link href="/signup">
                    Join now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" className="bg-orange-500 text-white hover:bg-orange-600" asChild>
                  <Link href="/marketplace">Explore the marketplace</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Why join ScootX?</h2>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 rounded-lg border border-gray-800 p-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-500">
                  <ShoppingBag className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold">Marketplace</h3>
                <p className="text-gray-400">
                  Buy and sell scooters, parts, accessories, helmets, apparel, and more with our secure and easy-to-use
                  marketplace platform.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border border-gray-800 p-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-500">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold">Social</h3>
                <p className="text-gray-400">
                  Connect with fellow scooter enthusiasts, share experiences, and build your network.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border border-gray-800 p-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-500">
                  <MapPin className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold">Events</h3>
                <p className="text-gray-400">
                  Discover and join local scooter meetups, races, and community events in your area.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Listings Section */}
        <section className="w-full py-16 md:py-24 bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Featured Listings</h2>
              <p className="text-gray-400 max-w-[800px]">
                Check out these popular scooters, accessories, and apparel from our marketplace
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredListings.map((listing, index) => (
                <Link href={`/marketplace/${listing.id}`} key={listing.id} className="group">
                  <div className="group relative overflow-hidden rounded-lg border border-gray-800 bg-black">
                    <div className="aspect-square overflow-hidden">
                      <Image
                        src={listing.image || "/placeholder.svg"}
                        alt={listing.title}
                        width={400}
                        height={400}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg">{listing.title}</h3>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-orange-500 font-bold">${listing.price.toFixed(2)}</span>
                        <span className="text-xs text-gray-400">{listing.location}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-10 flex justify-center">
              <Button className="bg-orange-500 text-white hover:bg-orange-600" asChild>
                <Link href="/marketplace">View all listings</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Community Section */}
        <section className="w-full py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 lg:grid-cols-2 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Join our growing social network</h2>
                <p className="text-gray-400 md:text-lg">
                  Connect with thousands of scooter enthusiasts, share your experiences, get advice, and stay updated on
                  the latest trends and events.
                </p>
                <ul className="space-y-3">
                  {[
                    "Participate in discussions and forums",
                    "Share photos and videos of your rides",
                    "Get expert advice on maintenance and upgrades",
                    "Find riding buddies in your area",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-orange-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Button className="bg-orange-500 text-white hover:bg-orange-600" asChild>
                  <Link href="/social">Join the social network</Link>
                </Button>
              </div>
              <div className="relative h-[400px] overflow-hidden rounded-lg border border-gray-800">
                <Image
                  src="/images/events/vespa-world-days.png"
                  alt="ScootX - Buy. Sell. Ride. Talk."
                  width={600}
                  height={400}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Upcoming Events Section */}
        <section className="w-full py-16 md:py-24 bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Upcoming Events</h2>
              <p className="text-gray-400 max-w-[800px]">Join fellow scooter enthusiasts at these upcoming events</p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {featuredEvents.map((event, index) => (
                <Link href={`/events/${event.id}`} key={event.id} className="group">
                  <div className="rounded-lg border border-gray-800 bg-black overflow-hidden">
                    <div className="h-48 relative">
                      <Image
                        src={event.image || "/placeholder.svg"}
                        alt={event.title}
                        width={400}
                        height={200}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-orange-500 font-medium">{event.date}</span>
                        <span className="text-xs bg-gray-800 px-2 py-1 rounded-full">{event.attendees} attending</span>
                      </div>
                      <h3 className="text-xl font-bold mb-2 group-hover:text-orange-500 transition-colors">
                        {event.title}
                      </h3>
                      <p className="text-gray-400 flex items-center gap-1 text-sm">
                        <MapPin className="h-4 w-4" />
                        {event.location}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-10 flex justify-center">
              <Button className="bg-orange-500 text-white hover:bg-orange-600" asChild>
                <Link href="/events">View all events</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 p-8 md:p-12 shadow-lg">
              <div className="grid gap-6 md:grid-cols-2 items-center">
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold tracking-tighter md:text-4xl text-white">
                    Ready to join the ScootX social network?
                  </h2>
                  <p className="text-white/90 md:text-lg">
                    Sign up today and become part of the fastest growing scooter marketplace and social network.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-end">
                  <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100" asChild>
                    <Link href="/signup">Sign up now</Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-orange-500 hover:bg-white/20"
                    asChild
                  >
                    <Link href="/about">Learn more</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
