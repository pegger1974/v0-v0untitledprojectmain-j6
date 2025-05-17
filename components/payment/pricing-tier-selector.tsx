"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import type { PricingTier } from "@/lib/pricing"

interface PricingTierSelectorProps {
  tiers: PricingTier[]
  onSelect: (tier: PricingTier) => void
  selectedTierId?: string
}

export function PricingTierSelector({ tiers, onSelect, selectedTierId }: PricingTierSelectorProps) {
  const [selected, setSelected] = useState<string>(
    selectedTierId || tiers.find((tier) => tier.recommended)?.id || tiers[0].id,
  )

  const handleSelect = (tier: PricingTier) => {
    setSelected(tier.id)
    onSelect(tier)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {tiers.map((tier) => {
        const isSelected = selected === tier.id
        return (
          <div
            key={tier.id}
            className={`rounded-lg border ${
              isSelected ? "border-orange-500 bg-orange-500/10" : "border-gray-800 bg-gray-900 hover:border-gray-700"
            } p-6 transition-colors`}
          >
            {tier.recommended && (
              <div className="mb-4 rounded-full bg-orange-500 px-3 py-1 text-xs font-medium text-white w-fit">
                Recommended
              </div>
            )}
            <h3 className="text-xl font-bold">{tier.name}</h3>
            <p className="mt-1 text-sm text-gray-400">{tier.description}</p>
            <div className="mt-4 flex items-baseline">
              <span className="text-3xl font-bold">{tier.price === 0 ? "Free" : `$${tier.price.toFixed(2)}`}</span>
              {tier.duration && <span className="ml-1 text-sm text-gray-400">/{tier.duration} days</span>}
            </div>
            <ul className="mt-6 space-y-3">
              {tier.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <Check className="mr-2 h-5 w-5 flex-shrink-0 text-orange-500" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            <Button
              className={`mt-6 w-full ${
                isSelected ? "bg-orange-500 hover:bg-orange-600" : "bg-gray-800 hover:bg-gray-700"
              }`}
              onClick={() => handleSelect(tier)}
            >
              {isSelected ? "Selected" : "Select"}
            </Button>
          </div>
        )
      })}
    </div>
  )
}
