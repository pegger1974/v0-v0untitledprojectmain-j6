"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CreditCard, CheckCircle } from "lucide-react"
import { PricingTierSelector } from "@/components/payment/pricing-tier-selector"
import { listingPricing, type PricingTier } from "@/lib/pricing"
import Image from "next/image"

export default function ListingPaymentPage() {
  const [selectedTier, setSelectedTier] = useState<PricingTier>(
    listingPricing.tiers.find((tier) => tier.recommended) || listingPricing.tiers[0],
  )
  const [paymentStep, setPaymentStep] = useState<"select-tier" | "payment-details" | "confirmation">("select-tier")
  const [isProcessing, setIsProcessing] = useState(false)

  const handleTierSelect = (tier: PricingTier) => {
    setSelectedTier(tier)
  }

  const handleContinue = () => {
    if (paymentStep === "select-tier") {
      if (selectedTier.price === 0) {
        // If free tier, skip payment details
        setPaymentStep("confirmation")
      } else {
        setPaymentStep("payment-details")
      }
    } else if (paymentStep === "payment-details") {
      // Simulate payment processing
      setIsProcessing(true)
      setTimeout(() => {
        setIsProcessing(false)
        setPaymentStep("confirmation")
      }, 1500)
    }
  }

  return (
    <div className="bg-black text-white min-h-screen">
      <div className="container px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" asChild>
            <Link
              href={paymentStep === "select-tier" ? "/marketplace/create" : "#"}
              onClick={() => {
                if (paymentStep !== "select-tier") {
                  setPaymentStep("select-tier")
                }
              }}
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Publish Your Listing</h1>
        </div>

        {/* Progress Steps */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  paymentStep === "select-tier" ? "bg-orange-500" : "bg-green-500"
                }`}
              >
                <span className="text-white font-bold">1</span>
              </div>
              <span className="text-sm mt-2">Select Plan</span>
            </div>
            <div className="flex-1 h-1 mx-2 bg-gray-800">
              <div className={`h-full ${paymentStep !== "select-tier" ? "bg-green-500" : "bg-gray-800"}`}></div>
            </div>
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  paymentStep === "payment-details"
                    ? "bg-orange-500"
                    : paymentStep === "confirmation"
                      ? "bg-green-500"
                      : "bg-gray-800"
                }`}
              >
                <span className="text-white font-bold">2</span>
              </div>
              <span className="text-sm mt-2">Payment</span>
            </div>
            <div className="flex-1 h-1 mx-2 bg-gray-800">
              <div className={`h-full ${paymentStep === "confirmation" ? "bg-green-500" : "bg-gray-800"}`}></div>
            </div>
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  paymentStep === "confirmation" ? "bg-green-500" : "bg-gray-800"
                }`}
              >
                <span className="text-white font-bold">3</span>
              </div>
              <span className="text-sm mt-2">Confirmation</span>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {paymentStep === "select-tier" && (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-2">Choose Your Listing Plan</h2>
                <p className="text-gray-400">
                  Select the plan that best fits your needs. Upgrade for better visibility and more features.
                </p>
              </div>
              <PricingTierSelector
                tiers={listingPricing.tiers}
                onSelect={handleTierSelect}
                selectedTierId={selectedTier.id}
              />
            </>
          )}

          {paymentStep === "payment-details" && (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-2">Payment Details</h2>
                <p className="text-gray-400">Enter your payment information to complete your purchase.</p>
              </div>

              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 mb-6">
                <h3 className="text-xl font-bold mb-4">Order Summary</h3>
                <div className="flex justify-between mb-2">
                  <span>{selectedTier.name}</span>
                  <span>${selectedTier.price.toFixed(2)}</span>
                </div>
                {selectedTier.duration && (
                  <div className="text-sm text-gray-400 mb-4">
                    Your listing will be active for {selectedTier.duration} days
                  </div>
                )}
                <div className="border-t border-gray-800 pt-4 mt-4">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${selectedTier.price.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 mb-6">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <CreditCard className="mr-2 h-5 w-5" />
                  Card Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="cardNumber" className="block text-sm font-medium mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      className="w-full bg-black border border-gray-800 rounded-lg px-4 py-2"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="expiry" className="block text-sm font-medium mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        id="expiry"
                        placeholder="MM/YY"
                        className="w-full bg-black border border-gray-800 rounded-lg px-4 py-2"
                      />
                    </div>
                    <div>
                      <label htmlFor="cvc" className="block text-sm font-medium mb-1">
                        CVC
                      </label>
                      <input
                        type="text"
                        id="cvc"
                        placeholder="123"
                        className="w-full bg-black border border-gray-800 rounded-lg px-4 py-2"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">
                      Name on Card
                    </label>
                    <input
                      type="text"
                      id="name"
                      placeholder="John Smith"
                      className="w-full bg-black border border-gray-800 rounded-lg px-4 py-2"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {paymentStep === "confirmation" && (
            <div className="bg-gray-900 rounded-lg p-8 border border-gray-800 text-center">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center">
                  <CheckCircle className="h-10 w-10 text-green-500" />
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-2">Your Listing is Now Live!</h2>
              <p className="text-gray-400 mb-6">
                {selectedTier.price === 0
                  ? "Your free listing has been published successfully."
                  : "Your payment was successful and your listing has been published."}
              </p>
              <div className="mb-8">
                <div className="bg-black rounded-lg p-4 inline-block">
                  <Image
                    src="/used-scooter-listing.png"
                    alt="Listing preview"
                    width={300}
                    height={200}
                    className="rounded-lg"
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-orange-500 hover:bg-orange-600" asChild>
                  <Link href="/marketplace">View All Listings</Link>
                </Button>
                <Button variant="outline" className="bg-gray-800 hover:bg-gray-700" asChild>
                  <Link href="/dashboard/listings">Manage Your Listings</Link>
                </Button>
              </div>
            </div>
          )}

          {paymentStep !== "confirmation" && (
            <div className="mt-8 flex justify-end">
              <Button className="bg-orange-500 hover:bg-orange-600" onClick={handleContinue} disabled={isProcessing}>
                {isProcessing ? "Processing..." : paymentStep === "select-tier" ? "Continue" : "Pay Now"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
