export interface PricingTier {
  id: string
  name: string
  description: string
  price: number
  features: string[]
  recommended?: boolean
  duration?: number // in days
}

export interface PricingCategory {
  id: string
  name: string
  description: string
  tiers: PricingTier[]
}

// Pricing for marketplace listings
export const listingPricing: PricingCategory = {
  id: "marketplace",
  name: "Marketplace Listings",
  description: "Choose how you want to list your item on the marketplace",
  tiers: [
    {
      id: "basic",
      name: "Basic Listing",
      description: "Standard listing with basic visibility",
      price: 0,
      duration: 30,
      features: ["Listed for 30 days", "Up to 3 photos", "Standard search visibility", "Email support"],
    },
    {
      id: "premium",
      name: "Premium Listing",
      description: "Enhanced visibility and longer duration",
      price: 9.99,
      duration: 60,
      recommended: true,
      features: [
        "Listed for 60 days",
        "Up to 10 photos",
        "Featured in category pages",
        "Priority search placement",
        "Phone support",
      ],
    },
    {
      id: "featured",
      name: "Featured Listing",
      description: "Maximum visibility for faster sales",
      price: 19.99,
      duration: 90,
      features: [
        "Listed for 90 days",
        "Unlimited photos",
        "Featured on homepage",
        "Top search results",
        "Highlighted with special badge",
        "Priority support",
      ],
    },
  ],
}

// Pricing for events
export const eventPricing: PricingCategory = {
  id: "events",
  name: "Event Listings",
  description: "Choose how you want to promote your event",
  tiers: [
    {
      id: "community",
      name: "Community Event",
      description: "For small community gatherings",
      price: 0,
      features: ["Basic event page", "Listed in event directory", "Up to 50 attendees", "Basic event management tools"],
    },
    {
      id: "professional",
      name: "Professional Event",
      description: "For larger organized events",
      price: 29.99,
      recommended: true,
      features: [
        "Enhanced event page",
        "Featured in category pages",
        "Up to 500 attendees",
        "Advanced event management",
        "Attendee messaging",
        "Custom registration forms",
      ],
    },
    {
      id: "premium",
      name: "Premium Event",
      description: "For major events and rallies",
      price: 99.99,
      features: [
        "Premium event page with custom branding",
        "Featured on homepage",
        "Unlimited attendees",
        "Complete event management suite",
        "Ticket sales and management",
        "Dedicated support manager",
        "Post-event analytics",
      ],
    },
  ],
}

// Get pricing for a specific category
export function getPricing(category: "marketplace" | "events"): PricingCategory {
  return category === "marketplace" ? listingPricing : eventPricing
}

// Calculate the total price with any add-ons
export function calculatePrice(baseTier: PricingTier, addOns: { id: string; price: number }[] = []): number {
  return baseTier.price + addOns.reduce((total, addon) => total + addon.price, 0)
}
