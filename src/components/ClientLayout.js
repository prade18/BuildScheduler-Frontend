'use client'

import { usePathname } from 'next/navigation'
import Navbar from './Navbar'

export default function ClientLayout({ children }) {
  const pathname = usePathname()
  const showNavbar = !pathname.startsWith('/dashboard')

  return (
    <>
      {showNavbar && <Navbar />}
      {children}
    </>
  )
}
