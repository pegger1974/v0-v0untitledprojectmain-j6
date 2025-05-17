"use client"

import Image from "next/image"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface EnhancedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  fallbackSrc?: string
  placeholderText?: string
  colorIndex?: number
  category?: string
}

export function EnhancedImage({
  src,
  alt,
  width = 500,
  height = 300,
  className,
  priority = false,
  fallbackSrc = "/placeholder.svg?height=300&width=500&query=image",
  placeholderText,
  colorIndex = 0,
  category,
}: EnhancedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  // Color palette for placeholders
  const colors = [
    "#f97316", // orange-500
    "#06b6d4", // cyan-500
    "#8b5cf6", // violet-500
    "#ec4899", // pink-500
    "#14b8a6", // teal-500
    "#f59e0b", // amber-500
    "#10b981", // emerald-500
    "#ef4444", // red-500
  ]

  // Get a color for the placeholder
  const color = colors[colorIndex % colors.length]

  const handleLoad = () => {
    setIsLoading(false)
  }

  const handleError = () => {
    console.warn(`Failed to load image: ${src}`)
    setError(true)
    setIsLoading(false)
  }

  // Use a placeholder URL if the src is missing or on error
  const imageSrc = error || !src ? fallbackSrc : src

  return (
    <div className={cn("relative", className)} style={{ backgroundColor: color }}>
      <Image
        src={imageSrc || "/placeholder.svg"}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        onError={handleError}
        onLoad={handleLoad}
        className={cn(
          "w-full h-full object-cover",
          isLoading ? "opacity-0" : "opacity-100",
          "transition-opacity duration-300",
        )}
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-white font-medium text-sm">{alt || placeholderText || category || "Loading..."}</p>
        </div>
      )}
    </div>
  )
}
