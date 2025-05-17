"use client"

import { useEffect, useRef } from "react"
import { usePathname, useSearchParams } from "next/navigation"

export function PageViewTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const prevPathRef = useRef<string | null>(null)

  useEffect(() => {
    try {
      // Only track if the path has changed (not on initial render)
      if (prevPathRef.current !== null && prevPathRef.current !== pathname) {
        console.log("Page view:", pathname)
        // Tracking disabled for now to prevent errors
      }

      // Update the previous path
      prevPathRef.current = pathname
    } catch (error) {
      console.error("Error in PageViewTracker:", error)
    }
  }, [pathname, searchParams])

  return null
}
