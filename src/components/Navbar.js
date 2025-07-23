'use client'

import Link from 'next/link'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../redux/authSlice'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const dispatch = useDispatch()
  const router = useRouter()
  const pathname = usePathname()
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  const token = useSelector((state) => state.auth.token)
  const role = useSelector((state) => state.auth.role)

  const optionsByRole = {
    ADMIN: ['Create Project', 'Assign Roles', 'Manage Users'],
    SUPERVISOR: ['Assign Workers', 'View Schedule'],
    WORKER: ['View Tasks', 'Mark Availability'],
    EQUIPMENT_MANAGER: ['Manage Equipment', 'Prevent Conflicts'],
  }

  // const handleLogout = () => {
  //   dispatch(logout())
  //   router.push('/login')
  // }

  // ✅ Hide navbar on /dashboard and its subroutes
  if (pathname.startsWith('/dashboard')) return null
  if (!hasMounted) return null

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-white/70 border-none shadow-none px-6 py-4 flex items-center justify-between !border-none !shadow-none">
      <Link href="/" className="text-xl font-semibold text-indigo-700">
        BuildScheduler
      </Link>

      {token ? (
        <div className="flex gap-6 items-center">
          <div className="flex gap-4">
            {(optionsByRole[role] || []).map((opt) => (
              <span key={opt} className="text-sm text-gray-700 font-medium">
                {opt}
              </span>
            ))}
          </div>
          {/* <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-3 py-1.5 rounded-md hover:bg-red-600 text-sm shadow"
          >
            Logout
          </button> */}
        </div>
      ) : null}
    </nav>
  )
}





















