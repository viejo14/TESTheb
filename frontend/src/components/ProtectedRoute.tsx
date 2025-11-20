import { useContext, type ReactElement } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

type ProtectedRouteProps = {
  children: ReactElement
  role?: 'admin' | 'client'
}

export default function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const { user, loading } = useContext(AuthContext)

  if (loading) return <p>Cargando...</p>
  if (!user) return <Navigate to="/login" replace />
  if (role && user.role !== role) return <Navigate to="/" replace />

  return children
}
