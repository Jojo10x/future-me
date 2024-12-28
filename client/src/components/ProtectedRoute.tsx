'use client'

import { useAuth } from '../app/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Loader from './Loader'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return <Loader/>
  }

  if (!user) {
    return null 
  }

  return <>{children}</>
}