"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { getSupabaseClient } from "@/lib/supabase-client"
import type { Session, User } from "@supabase/supabase-js"

// Extended user type with additional properties
interface ExtendedUser extends User {
  name?: string
  username?: string
  avatarUrl?: string
}

interface AuthContextType {
  user: ExtendedUser | null
  session: Session | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any | null }>
  signUp: (email: string, password: string) => Promise<{ error: any | null; data: any | null }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: any | null }>
  refreshUserProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ExtendedUser | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = getSupabaseClient()

  // Function to fetch user profile data
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, username, avatar_url")
        .eq("id", userId)
        .single()

      if (data && !error) {
        return {
          name: data.full_name,
          username: data.username,
          avatarUrl: data.avatar_url,
        }
      }
    } catch (error) {
      console.error("Error fetching user profile:", error)
    }
    return null
  }

  // Function to update user with profile data
  const updateUserWithProfile = async (currentUser: User) => {
    const profileData = await fetchUserProfile(currentUser.id)
    if (profileData) {
      setUser({
        ...currentUser,
        ...profileData,
      })
    } else {
      setUser(currentUser)
    }
  }

  // Function to refresh user profile data
  const refreshUserProfile = async () => {
    if (!session?.user) return
    await updateUserWithProfile(session.user)
  }

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session)

      if (session?.user) {
        await updateUserWithProfile(session.user)
      } else {
        setUser(null)
      }

      setIsLoading(false)
    })

    // Initial session fetch
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session)

      if (session?.user) {
        await updateUserWithProfile(session.user)
      } else {
        setUser(null)
      }

      setIsLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      return { error }
    } catch (error) {
      return { error }
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({ email, password })

      // Create a profile record if signup is successful
      if (data.user && !error) {
        const { error: profileError } = await supabase.from("profiles").insert([
          {
            id: data.user.id,
            email: email,
            username: email.split("@")[0],
            created_at: new Date().toISOString(),
          },
        ])

        if (profileError) {
          console.error("Error creating user profile:", profileError)
        }
      }

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      return { error }
    } catch (error) {
      return { error }
    }
  }

  const value = {
    user,
    session,
    isLoading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    refreshUserProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
