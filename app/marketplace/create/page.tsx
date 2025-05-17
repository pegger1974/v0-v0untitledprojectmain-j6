"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Upload, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function CreateListingPage() {
  const router = useRouter()
  const [images, setImages] = useState<string[]>([])
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Scooters",
    condition: "New",
    price: "",
    location: "",
  })

  // Categories and conditions
  const categories = ["Scooters", "Parts", "Accessories", "Apparel", "Tools"]
  const conditions = ["New", "Like New", "Good", "Fair", "Restored", "Project"]

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      const imageUrl = URL.createObjectURL(file)
      setImages((prev) => [...prev, imageUrl])
      if (!previewImage) {
        setPreviewImage(imageUrl)
      }
    }
  }

  // Remove an image
  const removeImage = (index: number) => {
    const newImages = [...images]
    const removedImage = newImages.splice(index, 1)[0]
    setImages(newImages)

    // If the removed image was the preview, set a new preview
    if (previewImage === removedImage) {
      setPreviewImage(newImages.length > 0 ? newImages[0] : null)
    }
  }

  // Set an image as the preview
  const setAsPreview = (imageUrl: string) => {
    setPreviewImage(imageUrl)
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would send the data to the server
    console.log("Form submitted:", { ...formData, images })

    // Redirect to payment page
    router.push("/marketplace/create/payment")
  }

  return (
    <div className="bg-black text-white min-h-screen">
      <div className="container px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/marketplace">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Create New Listing</h1>
        </div>

        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          {/* Images Section */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Listing Images</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
                <div className="aspect-square relative bg-gray-800 rounded-lg overflow-hidden mb-4">
                  {previewImage ? (
                    <Image src={previewImage || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-400">No preview image</p>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-400 mb-2">Preview image (click on a thumbnail to set as preview)</p>
              </div>

              <div>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {images.map((imageUrl, index) => (
                    <div
                      key={index}
                      className={`aspect-square relative rounded-lg overflow-hidden cursor-pointer border-2 ${
                        previewImage === imageUrl ? "border-orange-500" : "border-transparent"
                      }`}
                      onClick={() => setAsPreview(imageUrl)}
                    >
                      <Image
                        src={imageUrl || "/placeholder.svg"}
                        alt={`Image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        className="absolute top-1 right-1 bg-black bg-opacity-50 rounded-full p-1"
                        onClick={(e) => {
                          e.stopPropagation()
                          removeImage(index)
                        }}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  {images.length < 6 && (
                    <label className="aspect-square flex items-center justify-center bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors">
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                      <Upload className="h-6 w-6 text-gray-400" />
                    </label>
                  )}
                </div>
                <p className="text-sm text-gray-400">
                  Upload up to 6 images. First image will be the cover (or click to choose).
                </p>
              </div>
            </div>
          </div>

          {/* Listing Details */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Listing Details</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2"
                  placeholder="e.g., 2020 Vespa Primavera 150"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2"
                  placeholder="Describe your item in detail. Include condition, features, history, etc."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium mb-1">
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="condition" className="block text-sm font-medium mb-1">
                    Condition *
                  </label>
                  <select
                    id="condition"
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2"
                  >
                    {conditions.map((condition) => (
                      <option key={condition} value={condition}>
                        {condition}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium mb-1">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium mb-1">
                    Location *
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2"
                    placeholder="City, State"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" className="bg-gray-900 border-gray-800" asChild>
              <Link href="/marketplace">Cancel</Link>
            </Button>
            <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
              Continue to Publish
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
