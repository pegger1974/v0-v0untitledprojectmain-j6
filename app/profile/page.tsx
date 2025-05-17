"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Edit, MapPin, Calendar, ShoppingBag, MessageSquare, Users, Star, ArrowLeft, Plus, Loader2 } from "lucide-react"
import { getSupabaseClient } from "@/lib/supabase-client"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [listings, setListings] = useState([])
  const [events, setEvents] = useState([])

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      setIsLoading(true)
      const supabase = getSupabaseClient()

      // Get current user
      const {
        data: { session },
        error: authError,
      } = await supabase.auth.getSession()

      if (authError || !session) {
        console.error("Auth error:", authError)
        // If not logged in, redirect to login
        router.push("/login?redirect=/profile")
        return
      }

      setUser(session.user)

      // Get user profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .maybeSingle()

      if (profileError && profileError.code !== "PGRST116") {
        console.error("Error fetching profile:", profileError)
      }

      // If profile doesn't exist, create a default one
      if (!profileData) {
        const defaultProfile = {
          id: session.user.id,
          username: `user_${session.user.id.substring(0, 8)}`,
          full_name: session.user.user_metadata?.full_name || "New User",
          avatar_url: session.user.user_metadata?.avatar_url || null,
          email: session.user.email,
          updated_at: new Date().toISOString(),
        }

        // Try to create the profile
        const { data: newProfile, error: createError } = await supabase
          .from("profiles")
          .insert(defaultProfile)
          .select()
          .single()

        if (createError) {
          console.error("Error creating profile:", createError)
          setProfile(defaultProfile)
        } else {
          setProfile(newProfile)
        }
      } else {
        setProfile(profileData)
      }

      // Fetch user's listings
      const { data: listingsData } = await supabase
        .from("marketplace_listings")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false })

      if (listingsData) {
        setListings(listingsData)
      }

      // Fetch user's events
      const { data: eventsData } = await supabase
        .from("events")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false })

      if (eventsData) {
        setEvents(eventsData)
      }

      setIsLoading(false)
    }

    fetchUserAndProfile()
  }, [router])

  // Mock data for stats, followers, etc.
  const mockStats = {
    listings: listings.length || 0,
    events: events.length || 0,
    followers: 248,
    following: 124,
    rating: 4.8,
    reviews: 36,
  }

  if (isLoading) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
          <p className="mt-2 text-gray-400">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Cover Image */}
      <div className="relative h-64 md:h-80 w-full">
        <Image
          src={profile?.cover_image_url || "/placeholder.svg?height=400&width=800&query=abstract+background"}
          alt="Cover"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70"></div>

        <div className="container relative z-10 h-full flex items-end pb-4">
          <Button variant="ghost" size="icon" className="absolute top-4 left-4 bg-black/50 hover:bg-black/70" asChild>
            <Link href="/">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 border-gray-600"
            onClick={() => router.push("/profile/edit")}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        </div>
      </div>

      <div className="container px-4 pb-12">
        {/* Profile Header */}
        <div className="relative -mt-20 mb-8 flex flex-col md:flex-row md:items-end gap-6">
          <div className="relative z-10">
            <div className="relative h-32 w-32 rounded-full border-4 border-black overflow-hidden bg-gray-800">
              <Image
                src={profile?.avatar_url || "/images/avatars/default-avatar.png"}
                alt={profile?.full_name || "User"}
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-bold">{profile?.full_name || "New User"}</h1>
            <p className="text-gray-400">{profile?.username ? `@${profile.username}` : ""}</p>
            <p className="mt-3 text-gray-300 max-w-2xl">{profile?.bio || "No bio yet."}</p>
            <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-400">
              {profile?.location && (
                <div className="flex items-center">
                  <MapPin className="mr-1 h-4 w-4" />
                  {profile.location}
                </div>
              )}
              <div className="flex items-center">
                <Calendar className="mr-1 h-4 w-4" />
                Joined{" "}
                {new Date(user?.created_at || Date.now()).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </div>
              {profile?.website && (
                <a
                  href={profile.website.startsWith("http") ? profile.website : `https://${profile.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-500 hover:underline"
                >
                  {profile.website.replace(/(^\w+:|^)\/\//, "")}
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-8">
          <div className="bg-gray-900 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold">{mockStats.listings}</p>
            <p className="text-sm text-gray-400">Listings</p>
          </div>
          <div className="bg-gray-900 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold">{mockStats.events}</p>
            <p className="text-sm text-gray-400">Events</p>
          </div>
          <div className="bg-gray-900 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold">{mockStats.followers}</p>
            <p className="text-sm text-gray-400">Followers</p>
          </div>
          <div className="bg-gray-900 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold">{mockStats.following}</p>
            <p className="text-sm text-gray-400">Following</p>
          </div>
          <div className="bg-gray-900 rounded-lg p-4 text-center col-span-2 sm:col-span-1 md:col-span-2">
            <div className="flex items-center justify-center">
              <p className="text-2xl font-bold mr-1">{mockStats.rating}</p>
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
            </div>
            <p className="text-sm text-gray-400">{mockStats.reviews} Reviews</p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="listings">
          <TabsList className="bg-gray-900 border border-gray-800">
            <TabsTrigger value="listings" className="data-[state=active]:bg-orange-500">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Listings
            </TabsTrigger>
            <TabsTrigger value="events" className="data-[state=active]:bg-orange-500">
              <Calendar className="mr-2 h-4 w-4" />
              Events
            </TabsTrigger>
            <TabsTrigger value="followers" className="data-[state=active]:bg-orange-500">
              <Users className="mr-2 h-4 w-4" />
              Followers
            </TabsTrigger>
            <TabsTrigger value="reviews" className="data-[state=active]:bg-orange-500">
              <MessageSquare className="mr-2 h-4 w-4" />
              Reviews
            </TabsTrigger>
          </TabsList>

          <TabsContent value="listings" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.length > 0 ? (
                listings.map((listing: any) => (
                  <Link href={`/marketplace/${listing.id}`} key={listing.id} className="group">
                    <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-orange-500 transition-colors">
                      <div className="aspect-square relative">
                        <Image
                          src={listing.image_url || "/images/listings/silver-vespa-classic.png"}
                          alt={listing.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-bold mb-2 group-hover:text-orange-500 transition-colors">
                          {listing.title}
                        </h3>
                        <div className="flex items-center justify-between">
                          <span className="text-orange-500 font-bold">${listing.price}</span>
                          <span className="text-xs text-gray-400">
                            {new Date(listing.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-400 mb-4">You don't have any listings yet.</p>
                </div>
              )}
              <Link href="/marketplace/create" className="group">
                <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-orange-500 transition-colors h-full flex flex-col items-center justify-center p-8">
                  <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-4">
                    <Plus className="h-8 w-8 text-gray-400 group-hover:text-orange-500 transition-colors" />
                  </div>
                  <p className="text-lg font-medium text-center group-hover:text-orange-500 transition-colors">
                    Create New Listing
                  </p>
                </div>
              </Link>
            </div>
          </TabsContent>

          <TabsContent value="events" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.length > 0 ? (
                events.map((event: any) => (
                  <Link href={`/events/${event.id}`} key={event.id} className="group">
                    <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-orange-500 transition-colors">
                      <div className="h-48 relative">
                        <Image
                          src={event.image_url || "/images/events/norfolk-scooter-run.jpg"}
                          alt={event.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-bold mb-2 group-hover:text-orange-500 transition-colors">
                          {event.title}
                        </h3>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-gray-400 text-sm">
                            <Calendar className="mr-1 h-4 w-4" />
                            {new Date(event.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center text-gray-400 text-xs">
                            <Users className="mr-1 h-4 w-4" />
                            {event.attendees?.length || 0} attending
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-400 mb-4">You don't have any events yet.</p>
                </div>
              )}
              <Link href="/events/create" className="group">
                <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-orange-500 transition-colors h-full flex flex-col items-center justify-center p-8">
                  <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-4">
                    <Plus className="h-8 w-8 text-gray-400 group-hover:text-orange-500 transition-colors" />
                  </div>
                  <p className="text-lg font-medium text-center group-hover:text-orange-500 transition-colors">
                    Create New Event
                  </p>
                </div>
              </Link>
            </div>
          </TabsContent>

          <TabsContent value="followers" className="mt-6">
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-800">
                      <Image
                        src={`/images/avatars/default-avatar.png`}
                        alt="Follower"
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium">Scooter Fan {i}</p>
                      <p className="text-xs text-gray-400">@scooterfan{i}</p>
                    </div>
                    <Button variant="outline" size="sm" className="ml-auto bg-gray-800 border-gray-700">
                      Following
                    </Button>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <Button variant="outline" className="bg-gray-800 border-gray-700">
                  View All Followers
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border-b border-gray-800 pb-6 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-800">
                        <Image
                          src={`/images/avatars/default-avatar.png`}
                          alt="Reviewer"
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium">Reviewer {i}</p>
                        <div className="flex items-center">
                          {Array(5)
                            .fill(0)
                            .map((_, j) => (
                              <Star
                                key={j}
                                className={`h-4 w-4 ${j < 5 - (i % 2) ? "text-yellow-500 fill-yellow-500" : "text-gray-600"}`}
                              />
                            ))}
                          <span className="ml-2 text-xs text-gray-400">2 months ago</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-300">
                      {i === 1
                        ? "Great seller! The scooter was exactly as described and shipping was fast. Would definitely buy from again."
                        : i === 2
                          ? "Very knowledgeable about vintage scooters. Answered all my questions promptly and the part I bought was in excellent condition."
                          : "Smooth transaction from start to finish. The item arrived well-packaged and in perfect condition. Highly recommend!"}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <Button variant="outline" className="bg-gray-800 border-gray-700">
                  View All Reviews
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
