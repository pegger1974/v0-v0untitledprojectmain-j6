"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export default function SignupPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") || "/dashboard"
  const { user, signUp, isLoading: authLoading } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Redirect if already logged in
  useEffect(() => {
    if (user && !authLoading) {
      router.push(redirect)
    }
  }, [user, authLoading, router, redirect])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = "You must agree to the terms and conditions"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const { data, error } = await signUp(formData.email, formData.password)

      if (error) {
        setErrors({ form: error.message || "An error occurred during signup. Please try again." })
        return
      }

      // Redirect will happen automatically via the useEffect
    } catch (error) {
      console.error("Signup error:", error)
      setErrors({ form: "An error occurred during signup. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-black text-white min-h-screen">
      <div className="container px-4 py-8">
        <Button variant="ghost" size="icon" className="mb-6" asChild>
          <Link href="/">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>

        <div className="max-w-md mx-auto">
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-white font-bold">
                X
              </div>
              <span className="text-2xl font-bold">ScootX</span>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-center mb-8">Create Your Account</h1>

          {errors.form && (
            <div className="bg-red-500/20 border border-red-500 text-red-500 rounded-lg p-3 mb-6">{errors.form}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full bg-gray-900 border ${
                  errors.name ? "border-red-500" : "border-gray-800"
                } rounded-lg px-4 py-2`}
                placeholder="John Smith"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full bg-gray-900 border ${
                  errors.email ? "border-red-500" : "border-gray-800"
                } rounded-lg px-4 py-2`}
                placeholder="you@example.com"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full bg-gray-900 border ${
                  errors.password ? "border-red-500" : "border-gray-800"
                } rounded-lg px-4 py-2`}
                placeholder="••••••••"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full bg-gray-900 border ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-800"
                } rounded-lg px-4 py-2`}
                placeholder="••••••••"
              />
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className="rounded border-gray-800 bg-gray-900 text-orange-500 focus:ring-orange-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="agreeTerms" className="text-gray-300">
                  I agree to the{" "}
                  <Link href="/terms" className="text-orange-500 hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-orange-500 hover:underline">
                    Privacy Policy
                  </Link>
                </label>
                {errors.agreeTerms && <p className="text-red-500 text-xs mt-1">{errors.agreeTerms}</p>}
              </div>
            </div>

            <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600" disabled={isLoading}>
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Already have an account?{" "}
              <Link href="/login" className="text-orange-500 hover:underline">
                Log in
              </Link>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-800">
            <p className="text-center text-sm text-gray-400 mb-4">Or sign up with</p>
            <div className="flex gap-4 justify-center">
              <Button variant="outline" className="flex-1 bg-gray-900 border-gray-800">
                <svg width="20" height="20" viewBox="0 0 24 24" className="mr-2">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </Button>
              <Button variant="outline" className="flex-1 bg-gray-900 border-gray-800">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="mr-2">
                  <path
                    d="M9.19795 21.5H13.198V13.4901H16.8021L17.198 9.50977H13.198V7.5C13.198 6.94772 13.6457 6.5 14.198 6.5H17.198V2.5H14.198C11.4365 2.5 9.19795 4.73858 9.19795 7.5V9.50977H7.19795L6.80206 13.4901H9.19795V21.5Z"
                    fill="currentColor"
                  />
                </svg>
                Facebook
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
