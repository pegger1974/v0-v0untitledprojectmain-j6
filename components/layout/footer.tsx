import Link from "next/link"
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-black border-t border-gray-800 py-8 md:py-12">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-white font-bold">
              X
            </div>
            <span className="text-xl font-bold text-white">ScootX</span>
          </div>

          <div className="flex gap-6 mb-4 md:mb-0">
            <Link href="/marketplace" className="text-gray-400 hover:text-orange-500">
              Marketplace
            </Link>
            <Link href="/social" className="text-gray-400 hover:text-orange-500">
              Social
            </Link>
            <Link href="/events" className="text-gray-400 hover:text-orange-500">
              Events
            </Link>
            <Link href="/about" className="text-gray-400 hover:text-orange-500">
              About
            </Link>
          </div>

          <div className="flex gap-4">
            <Link href="#" className="text-gray-400 hover:text-orange-500">
              <Facebook size={20} />
              <span className="sr-only">Facebook</span>
            </Link>
            <Link href="#" className="text-gray-400 hover:text-orange-500">
              <Twitter size={20} />
              <span className="sr-only">Twitter</span>
            </Link>
            <Link href="#" className="text-gray-400 hover:text-orange-500">
              <Instagram size={20} />
              <span className="sr-only">Instagram</span>
            </Link>
            <Link href="#" className="text-gray-400 hover:text-orange-500">
              <Youtube size={20} />
              <span className="sr-only">YouTube</span>
            </Link>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} ScootX. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
