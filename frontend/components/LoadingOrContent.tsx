'use client'
import { useAuth } from "./AuthProvider"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"

export default function LoadingOrContent({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading) {
      if (!user && pathname !== '/login' && pathname !== '/signup') {
        router.push('/login')
      } else if (user && (pathname === '/login' || pathname === '/signup')) {
        router.push('/')
      }
    }
  }, [user, isLoading, pathname, router])

  if (isLoading) {
    return <div className="text-center flex h-screen items-center justify-center">
        
    </div>
  }

  return <>{children}</>
}