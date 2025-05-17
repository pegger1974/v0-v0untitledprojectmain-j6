"use client"

import { Button } from "@/components/ui/button"
import { Mail, Phone } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="bg-black text-white min-h-screen">
      <div className="container px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">About ScootX</h1>

        {/* Our Story */}
        <section className="mb-12">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                ScootX was founded in 2023 by a group of passionate scooter enthusiasts who saw a need for a dedicated
                platform that brings together the global scooter community.
              </p>
              <p>
                What started as a small forum for sharing restoration tips and organizing local meetups has grown into
                the world's largest scooter marketplace and social platform, connecting tens of thousands of enthusiasts
                across the globe.
              </p>
              <p>
                Our mission is simple: to create a vibrant ecosystem where scooter lovers can buy and sell scooters and
                parts, share their passion, learn from each other, and participate in events that celebrate scooter
                culture.
              </p>
            </div>
          </div>
        </section>

        {/* What We Offer */}
        <section className="mb-12 py-12 bg-gray-900 rounded-lg">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-center">What We Offer</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-black p-6 rounded-lg border border-gray-800">
                <h3 className="text-xl font-bold mb-3 text-center">Marketplace</h3>
                <p className="text-gray-400 text-center">
                  Buy and sell scooters, parts, accessories, and apparel with our secure and easy-to-use marketplace
                  platform.
                </p>
              </div>
              <div className="bg-black p-6 rounded-lg border border-gray-800">
                <h3 className="text-xl font-bold mb-3 text-center">Social Network</h3>
                <p className="text-gray-400 text-center">
                  Connect with fellow enthusiasts, share your scooter adventures, join groups, and build your network.
                </p>
              </div>
              <div className="bg-black p-6 rounded-lg border border-gray-800">
                <h3 className="text-xl font-bold mb-3 text-center">Events</h3>
                <p className="text-gray-400 text-center">
                  Discover and join local scooter meetups, rallies, and community events in your area.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="mb-12">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-center">Get In Touch</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-orange-500 p-3 rounded-full">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">Email Us</h3>
                    <p className="text-gray-400">info@scootx.com</p>
                    <p className="text-gray-400">support@scootx.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-orange-500 p-3 rounded-full">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">Call Us</h3>
                    <p className="text-gray-400">+84 0386384641</p>
                    <p className="text-gray-400">Mon-Fri, 9am-5pm EST</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-900 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4">Send Us a Message</h3>
                <form className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full bg-black border border-gray-800 rounded-lg px-4 py-2"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full bg-black border border-gray-800 rounded-lg px-4 py-2"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-1">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      className="w-full bg-black border border-gray-800 rounded-lg px-4 py-2"
                    ></textarea>
                  </div>
                  <Button className="w-full bg-orange-500 hover:bg-orange-600">Send Message</Button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 bg-gradient-to-r from-orange-600 to-orange-500 rounded-lg">
          <div className="max-w-3xl mx-auto text-center px-4">
            <h2 className="text-2xl font-bold mb-4">Ready to join the ScootX community?</h2>
            <p className="text-xl mb-8">
              Sign up today and connect with thousands of scooter enthusiasts around the world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100" asChild>
                <Link href="/signup">Sign Up Now</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-orange-600" asChild>
                <Link href="/">Learn More</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
