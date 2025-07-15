// 'use client'

// import { useSelector, useDispatch } from 'react-redux'
// import { logout } from '../redux/authSlice'
// import { useRouter } from 'next/navigation'
// import { useState } from 'react'
// import {
//   User,
//   Mail,
//   Phone,
//   BadgeCheck,
//   LogOut,
//   ChevronDown
// } from 'lucide-react'

// export default function DashboardNavbar() {
//   const dispatch = useDispatch()
//   const router = useRouter()
//   const { userInfo } = useSelector((state) => state.auth)
//   const [dropdownOpen, setDropdownOpen] = useState(false)

//   const handleLogout = () => {
//     dispatch(logout())
//     router.push('/login')
//   }

//   const avatarUrl = userInfo?.username
//     ? `https://ui-avatars.com/api/?name=${userInfo.username}&background=random&rounded=true`
//     : 'https://via.placeholder.com/40'

//   return (
//     <header className="w-full bg-white shadow-md px-6 py-3 flex justify-end items-center">
//       <div className="relative">
//         <button
//           onClick={() => setDropdownOpen(!dropdownOpen)}
//           className="flex items-center gap-3 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
//         >
//           <img
//             src={avatarUrl}
//             alt="User Avatar"
//             className="w-8 h-8 rounded-full border border-gray-300"
//           />
//           <span className="font-semibold text-gray-800">
//             {typeof window !== 'undefined' && userInfo?.username}
//           </span>
//           <ChevronDown
//             className={`w-4 h-4 transform transition ${dropdownOpen ? 'rotate-180' : ''}`}
//           />
//         </button>

//         {dropdownOpen && (
//           <div className="absolute right-0 mt-2 w-72 bg-white border rounded-lg shadow-lg z-50 p-4 text-sm text-gray-700 space-y-2">
//             <div className="space-y-2">
//               <div className="flex items-center gap-2">
//                 <Mail className="w-4 h-4 text-gray-500" />
//                 <span>{userInfo?.email}</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Phone className="w-4 h-4 text-gray-500" />
//                 <span>{userInfo?.phone}</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <BadgeCheck className="w-4 h-4 text-gray-500" />
//                 <span>{userInfo?.role?.replace('ROLE_', '')}</span>
//               </div>
//             </div>
//             <hr />
//             <button
//               onClick={handleLogout}
//               className="w-full flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold"
//             >
//               <LogOut className="w-4 h-4" />
//               Logout
//             </button>
//           </div>
//         )}
//       </div>
//     </header>
//   )
// }




// 'use client'

// import { useSelector, useDispatch } from 'react-redux'
// import { logout } from '../redux/authSlice'
// import { useRouter } from 'next/navigation'
// import { useState, useMemo } from 'react'
// import { User, Mail, Phone, BadgeCheck, LogOut, ChevronDown } from 'lucide-react'

// export default function DashboardNavbar() {
//   const dispatch = useDispatch()
//   const router = useRouter()
//   const { userInfo } = useSelector((state) => state.auth)
//   const [dropdownOpen, setDropdownOpen] = useState(false)

//   const handleLogout = () => {
//     dispatch(logout())
//     router.push('/login')
//   }

//   const avatarUrl = useMemo(() => {
//     if (!userInfo?.username) return 'https://via.placeholder.com/128'
//     return `https://ui-avatars.com/api/?name=${encodeURIComponent(
//       userInfo.username
//     )}&background=random&rounded=true&size=128&bold=true`
//   }, [userInfo?.username])

//   return (
//     <header className="w-full bg-white shadow-sm px-6 py-3 flex justify-end items-center border-b border-gray-100">
//       <div className="relative">
//         <button
//           onClick={() => setDropdownOpen(!dropdownOpen)}
//           className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
//           aria-label="User menu"
//         >
//           <img
//             src={avatarUrl}
//             alt="User Avatar"
//             className="w-8 h-8 rounded-full border-2 border-gray-200"
//           />
//           <span className="font-medium text-gray-800">
//             {userInfo?.username || 'Guest'}
//           </span>
//           <ChevronDown
//             className={`w-4 h-4 text-gray-500 transition-transform ${
//               dropdownOpen ? 'rotate-180' : ''
//             }`}
//           />
//         </button>

//         {dropdownOpen && (
//           <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-md z-50 overflow-hidden py-2 text-sm text-gray-700">
//             <div className="px-4 py-3 space-y-2">
//               <div className="flex items-center gap-3 text-gray-600">
//                 <Mail className="w-4 h-4 flex-shrink-0" />
//                 <span className="truncate">{userInfo?.email || 'N/A'}</span>
//               </div>
//               <div className="flex items-center gap-3 text-gray-600">
//                 <Phone className="w-4 h-4 flex-shrink-0" />
//                 <span>{userInfo?.phone || 'N/A'}</span>
//               </div>
//               <div className="flex items-center gap-3 text-gray-600">
//                 <BadgeCheck className="w-4 h-4 flex-shrink-0" />
//                 <span>
//                   {userInfo?.role
//                     ? userInfo.role.replace('ROLE_', '').replaceAll('_', ' ')
//                     : 'N/A'}
//                 </span>
//               </div>
//             </div>
//             <hr className="border-gray-100" />
//             <button
//               onClick={handleLogout}
//               className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-500 hover:bg-red-50 transition-colors font-medium"
//             >
//               <LogOut className="w-4 h-4" />
//               Logout
//             </button>
//           </div>
//         )}
//       </div>
//     </header>
//   )
// }







// 'use client'

// import { useSelector, useDispatch } from 'react-redux'
// import { logout } from '../redux/authSlice'
// import { useRouter } from 'next/navigation'
// import { useState, useMemo } from 'react'
// import { User, Mail, Phone, BadgeCheck, LogOut, ChevronDown } from 'lucide-react'

// export default function DashboardNavbar() {
//   const dispatch = useDispatch()
//   const router = useRouter()
//   const { userInfo } = useSelector((state) => state.auth)
//   const [dropdownOpen, setDropdownOpen] = useState(false)

//   const handleLogout = () => {
//     dispatch(logout())
//     router.push('/login')
//   }

//   const avatarUrl = useMemo(() => {
//     if (!userInfo?.username) return 'https://via.placeholder.com/128'
//     return `https://ui-avatars.com/api/?name=${encodeURIComponent(
//       userInfo.username
//     )}&background=random&rounded=true&size=128&bold=true`
//   }, [userInfo?.username])

//   return (
//     <header className="w-full bg-white shadow-sm px-6 py-3 flex justify-end items-center border-b border-gray-100">
//       <div className="relative">
//         <button
//           onClick={() => setDropdownOpen(!dropdownOpen)}
//           className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
//           aria-label="User menu"
//         >
//           <img
//             src={avatarUrl}
//             alt="User Avatar"
//             className="w-8 h-8 rounded-full border-2 border-gray-200"
//           />
//           <span className="font-medium text-gray-800">
//             {userInfo?.username || 'Guest'}
//           </span>
//           <ChevronDown
//             className={`w-4 h-4 text-gray-500 transition-transform ${
//               dropdownOpen ? 'rotate-180' : ''
//             }`}
//           />
//         </button>

//         {dropdownOpen && (
//           <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-md z-50 overflow-hidden py-2 text-sm text-gray-700">
//             <div className="px-4 py-3 space-y-2">
//               <div className="flex items-center gap-3 text-gray-600">
//                 <Mail className="w-4 h-4 flex-shrink-0" />
//                 <span className="truncate">{userInfo?.email || 'N/A'}</span>
//               </div>
//               <div className="flex items-center gap-3 text-gray-600">
//                 <Phone className="w-4 h-4 flex-shrink-0" />
//                 <span>{userInfo?.phone || 'N/A'}</span>
//               </div>
//               <div className="flex items-center gap-3 text-gray-600">
//                 <BadgeCheck className="w-4 h-4 flex-shrink-0" />
//                 <span>
//                   {userInfo?.role
//                     ? userInfo.role.replace('ROLE_', '').replaceAll('_', ' ')
//                     : 'N/A'}
//                 </span>
//               </div>
//             </div>
//             <hr className="border-gray-100" />
//             <button
//               onClick={handleLogout}
//               className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-500 hover:bg-red-50 transition-colors font-medium"
//             >
//               <LogOut className="w-4 h-4" />
//               Logout
//             </button>
//           </div>
//         )}
//       </div>
//     </header>
//   )
// }


// 'use client'

// import { useSelector, useDispatch } from 'react-redux'
// import { logout } from '../redux/authSlice'
// import { useRouter } from 'next/navigation'
// import { useState, useMemo, useEffect } from 'react'
// import { User, Mail, Phone, BadgeCheck, LogOut, ChevronDown } from 'lucide-react'

// export default function DashboardNavbar() {
//   const dispatch = useDispatch()
//   const router = useRouter()
//   const { userInfo } = useSelector((state) => state.auth)
//   const [dropdownOpen, setDropdownOpen] = useState(false)
//   const [hasMounted, setHasMounted] = useState(false)

//   useEffect(() => {
//     setHasMounted(true)
//   }, [])

//   const avatarUrl = useMemo(() => {
//     if (!userInfo?.username) return 'https://via.placeholder.com/128'
//     return `https://ui-avatars.com/api/?name=${encodeURIComponent(
//       userInfo.username
//     )}&background=random&rounded=true&size=128&bold=true`
//   }, [userInfo?.username])

//   if (!hasMounted || !userInfo) return null

//   const handleLogout = () => {
//     dispatch(logout())
//     //router.push('/login')
//     router.push('/')
//   }

//   return (
//     <header className="w-full bg-white shadow-sm px-6 py-3 flex justify-end items-center border-b border-gray-100">
//       <div className="relative">
//         <button
//           onClick={() => setDropdownOpen(!dropdownOpen)}
//           className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
//           aria-label="User menu"
//         >
//           <img
//             src={avatarUrl}
//             alt="User Avatar"
//             className="w-8 h-8 rounded-full border-2 border-gray-200"
//           />
//           <span className="font-medium text-gray-800">
//             {userInfo?.username || 'Guest'}
//           </span>
//           <ChevronDown
//             className={`w-4 h-4 text-gray-500 transition-transform ${
//               dropdownOpen ? 'rotate-180' : ''
//             }`}
//           />
//         </button>

//         {dropdownOpen && (
//           <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-md z-50 overflow-hidden py-2 text-sm text-gray-700">
//             <div className="px-4 py-3 space-y-2">
//               <div className="flex items-center gap-3 text-gray-600">
//                 <Mail className="w-4 h-4 flex-shrink-0" />
//                 <span className="truncate">{userInfo?.email || 'N/A'}</span>
//               </div>
//               <div className="flex items-center gap-3 text-gray-600">
//                 <Phone className="w-4 h-4 flex-shrink-0" />
//                 <span>{userInfo?.phone || 'N/A'}</span>
//               </div>
//               <div className="flex items-center gap-3 text-gray-600">
//                 <BadgeCheck className="w-4 h-4 flex-shrink-0" />
//                 <span>
//                   {userInfo?.role
//                     ? userInfo.role.replace('ROLE_', '').replaceAll('_', ' ')
//                     : 'N/A'}
//                 </span>
//               </div>
//             </div>
//             <hr className="border-gray-100" />
//             <button
//               onClick={handleLogout}
//               className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-500 hover:bg-red-50 transition-colors font-medium"
//             >
//               <LogOut className="w-4 h-4" />
//               Logout
//             </button>
//           </div>
//         )}
//       </div>
//     </header>
//   )
// }




'use client'

import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../redux/authSlice'
import { useRouter } from 'next/navigation'
import { useState, useMemo, useEffect } from 'react'
import { Mail, Phone, BadgeCheck, LogOut, ChevronDown } from 'lucide-react'

export default function DashboardNavbar() {
  const dispatch = useDispatch()
  const router = useRouter()
  const { userInfo } = useSelector((state) => state.auth)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  const avatarUrl = useMemo(() => {
    if (!userInfo?.username) return 'https://via.placeholder.com/128'
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      userInfo.username
    )}&background=random&rounded=true&size=128&bold=true`
  }, [userInfo?.username])

  if (!hasMounted || !userInfo) return null

  const handleLogout = () => {
    dispatch(logout())
    router.push('/')
  }

  return (
    <header className="w-full bg-[#f0f4ff] shadow-sm px-6 py-4 flex justify-between items-center border-b border-gray-200">
      
      {/* Tagline */}
      <div className="text-black font-bold text-lg tracking-wide">
        Smart Workforce & Equipment Planning
      </div>

      {/* User dropdown */}
      <div className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
          aria-label="User menu"
        >
          <img
            src={avatarUrl}
            alt="User Avatar"
            className="w-8 h-8 rounded-full border-2 border-gray-200"
          />
          <span className="font-medium text-gray-800">
            {userInfo?.username || 'Guest'}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-gray-500 transition-transform ${
              dropdownOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-md z-50 overflow-hidden py-2 text-sm text-gray-700">
            <div className="px-4 py-3 space-y-2">
              <div className="flex items-center gap-3 text-gray-600">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{userInfo?.email || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>{userInfo?.phone || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <BadgeCheck className="w-4 h-4 flex-shrink-0" />
                <span>
                  {userInfo?.role
                    ? userInfo.role.replace('ROLE_', '').replaceAll('_', ' ')
                    : 'N/A'}
                </span>
              </div>
            </div>
            <hr className="border-gray-100" />
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-500 hover:bg-red-50 transition-colors font-medium"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

















