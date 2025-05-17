"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MessageSquare, ArrowLeft } from "lucide-react"

export default function MessagesPage() {
  // This would normally come from a database
  const messages = []

  return (
    <div className="bg-black text-white min-h-screen">
      <div className="container px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Messages</h1>
        </div>

        {messages.length > 0 ? (
          <div className="space-y-4">{/* Messages would be mapped here */}</div>
        ) : (
          <div className="bg-gray-900 rounded-lg p-8 border border-gray-800 text-center">
            <MessageSquare className="h-16 w-16 mx-auto text-gray-600 mb-4" />
            <h2 className="text-2xl font-bold mb-2">No Messages Yet</h2>
            <p className="text-gray-400 max-w-md mx-auto mb-6">
              You don't have any messages yet. Connect with other scooter enthusiasts to start a conversation.
            </p>
            <Button className="bg-orange-500 hover:bg-orange-600" asChild>
              <Link href="/social">Explore Social</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
