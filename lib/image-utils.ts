/**
 * Gets a placeholder image URL with the specified parameters
 * @param category The category of image (e.g., 'scooter', 'event', 'helmet')
 * @param width The width of the image
 * @param height The height of the image
 * @returns A placeholder image URL
 */
export function getPlaceholderImage(category: string, width = 400, height = 400): string {
  return `/placeholder.svg?height=${height}&width=${width}&query=${encodeURIComponent(category)}`
}

/**
 * Determines if a URL is a placeholder or a real image
 * @param url The image URL to check
 * @returns True if the URL is a placeholder
 */
export function isPlaceholder(url: string): boolean {
  return url.includes("/placeholder.svg")
}

/**
 * Gets the appropriate image path based on the category
 * @param path The image path or URL
 * @param category The category folder (e.g., 'listings', 'events', 'users')
 * @returns The full image path
 */
export function getImagePath(path: string, category?: string): string {
  // If the path is already a full URL or starts with a slash, return it as is
  if (!path || path.startsWith("http") || path.startsWith("/placeholder")) {
    return path
  }

  // If the path already starts with a slash, return it as is
  if (path.startsWith("/")) {
    return path
  }

  // Otherwise, construct the path with the category
  return category ? `/images/${category}/${path}` : `/images/${path}`
}

/**
 * Gets a list of predefined images for a specific category
 * @param category The category of images to get
 * @returns An array of image paths
 */
export function getCategoryImages(category: string): string[] {
  const categoryMap: Record<string, string[]> = {
    scooters: [
      "/images/listings/silver-vespa-front.png",
      "/images/listings/silver-vespa-side.png",
      "/images/listings/orange-lambretta.png",
      "/images/listings/vespa-primavera-parked.png",
      "/images/listings/red-vespa.png",
    ],
    events: [
      "/images/events/scooter-fest-19.png",
      "/images/events/vespa-club-koflach.png",
      "/images/events/east-belfast-rally.png",
      "/images/events/vespa-world-days.png",
    ],
    accessories: [
      "/images/listings/scooter-helmet.png",
      "/images/listings/scooter-cover.png",
      "/images/listings/scooter-exhaust.png",
    ],
    users: [
      "/images/avatars/default-avatar.png",
      "/images/avatars/john-vespa.png",
      "/images/avatars/sarah-lambretta.png",
      "/images/avatars/mike-scooter.png",
    ],
  }

  return categoryMap[category] || []
}
