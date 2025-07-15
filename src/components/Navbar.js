// 'use client'

// import Link from 'next/link'
// import { useSelector, useDispatch } from 'react-redux'
// import { logout } from '../redux/authSlice'
// import { useRouter } from 'next/navigation'

// export default function Navbar() {
//   const token = useSelector((state) => state.auth.token)
//   const role = useSelector((state) => state.auth.role)
//   const dispatch = useDispatch()
//   const router = useRouter()

//   const optionsByRole = {
//     ADMIN: ['Create Project', 'Assign Roles', 'Manage Users'],
//     SUPERVISOR: ['Assign Workers', 'View Schedule'],
//     WORKER: ['View Tasks', 'Mark Availability'],
//     EQUIPMENT_MANAGER: ['Manage Equipment', 'Prevent Conflicts'],
//   }

//   const handleLogout = () => {
//     dispatch(logout())
//     router.push('/login')
//   }

//   return (
//     //<nav className="flex items-center justify-between bg-gray-800 text-white px-6 py-4">
//     //<nav className="flex items-center justify-between bg-white/70 backdrop-blur-md text-gray-800 px-6 py-4 shadow-md rounded-b-lg">
//     //<nav className="flex items-center justify-between bg-gradient-to-r from-blue-200/80 to-purple-200/80 backdrop-blur-md text-gray-800 px-6 py-4 shadow-md rounded-b-lg">
//     <nav className="flex items-center justify-between bg-gray-800 text-white px-6 py-4">
//       <Link href="/" className="text-xl font-bold">BuildScheduler</Link>

//       {token ? (
//         <div className="flex gap-6 items-center">
//           <div className="flex gap-4">
//             {(optionsByRole[role] || []).map((opt) => (
//               <span key={opt} className="text-sm">{opt}</span>
//             ))}
//           </div>
//           <button
//             onClick={handleLogout}
//             className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 text-sm"
//           >
//             Logout
//           </button>
//         </div>
//       ) : (
//         <div className="flex gap-4">
//           <Link
//             href="/register"
//             className="bg-purple-600 px-4 py-2 rounded hover:bg-purple-700 text-sm"
//         >
//             Register
//         </Link>
//         <Link
//             href="/login"
//             className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 text-sm"
//             >
//             Login
//         </Link>
//         </div>
//       )}
//     </nav>
//   )
// }






// 'use client'

// import Link from 'next/link'
// import { useEffect, useState } from 'react'
// import { useSelector } from 'react-redux'

// export default function Navbar() {
//   const { token, role } = useSelector((state) => state.auth)
//   const [hasMounted, setHasMounted] = useState(false)

//   useEffect(() => {
//     setHasMounted(true)
//   }, [])

//   if (!hasMounted) return null

//   const optionsByRole = {
//     ROLE_PROJECT_MANAGER: ['Dashboard', 'Manage Projects'],
//     ROLE_SITE_SUPERVISOR: ['Tasks', 'Workers'],
//     ROLE_EQUIPMENT_MANAGER: ['Equipment'],
//     ROLE_WORKER: ['My Tasks', 'My Skills'],
//   }

//   return (
//     <nav className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200 shadow-sm">
//       <div className="text-xl font-bold text-gray-800">BuildScheduler</div>

//       {token ? (
//         <div className="flex gap-6 items-center">
//           <div className="flex gap-4">
//             {(optionsByRole[role] || []).map((opt) => (
//               <span
//                 key={opt}
//                 className="text-sm text-gray-600 hover:text-blue-600 cursor-pointer"
//               >
//                 {opt}
//               </span>
//             ))}
//           </div>
//           <Link
//             href="/logout"
//             className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm"
//           >
//             Logout
//           </Link>
//         </div>
//       ) : (
//         <div className="flex gap-4">
//           <Link
//             href="/register"
//             className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 text-sm"
//           >
//             Register
//           </Link>
//           <Link
//             href="/login"
//             className="bg-white text-gray-800 px-4 py-2 rounded hover:bg-gray-300 text-sm"
//           >
//             Login
//           </Link>
//         </div>
//       )}
//     </nav>
//   )
// }




// 'use client'

// import Link from 'next/link'
// import { useSelector, useDispatch } from 'react-redux'
// import { logout } from '../redux/authSlice'
// import { useRouter } from 'next/navigation'
// import { useEffect, useState } from 'react'

// export default function Navbar() {
//   const dispatch = useDispatch()
//   const router = useRouter()

//   const [isClient, setIsClient] = useState(false)

//   useEffect(() => {
//     setIsClient(true)
//   }, [])

//   const token = useSelector((state) => state.auth.token)
//   const role = useSelector((state) => state.auth.role)

//   const handleLogout = () => {
//     dispatch(logout())
//     router.push('/login')
//   }

//   const optionsByRole = {
//     ADMIN: ['Create Project', 'Assign Roles', 'Manage Users'],
//     SUPERVISOR: ['Assign Workers', 'View Schedule'],
//     WORKER: ['View Tasks', 'Mark Availability'],
//     EQUIPMENT_MANAGER: ['Manage Equipment', 'Prevent Conflicts'],
//   }

//   if (!isClient) return null // Prevents hydration error

//   return (
//     <nav className="flex items-center justify-between bg-gray-800 text-white px-6 py-4">
//       <Link href="/" className="text-xl font-bold">BuildScheduler</Link>

//       {token ? (
//         <div className="flex gap-6 items-center">
//           <div className="flex gap-4">
//             {(optionsByRole[role] || []).map((opt) => (
//               <span key={opt} className="text-sm">{opt}</span>
//             ))}
//           </div>
//           <button
//             onClick={handleLogout}
//             className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 text-sm"
//           >
//             Logout
//           </button>
//         </div>
//       ) : (
//         <div className="flex gap-4">
//           <Link
//             href="/register"
//             className="bg-purple-600 px-4 py-2 rounded hover:bg-purple-700 text-sm"
//           >
//             Register
//           </Link>
//           <Link
//             href="/login"
//             className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 text-sm"
//           >
//             Login
//           </Link>
//         </div>
//       )}
//     </nav>
//   )
// }




// 'use client'

// import { useSelector, useDispatch } from 'react-redux'
// import { logout } from '../redux/authSlice'
// import { useRouter } from 'next/navigation'
// import { useEffect, useState } from 'react'
// import Link from 'next/link'

// export default function Navbar() {
//   const [hasMounted, setHasMounted] = useState(false)

//   const dispatch = useDispatch()
//   const router = useRouter()
//   const token = useSelector((state) => state.auth.token)
//   const role = useSelector((state) => state.auth.role)

//   useEffect(() => {
//     setHasMounted(true)
//   }, [])

//   const optionsByRole = {
//     ADMIN: ['Create Project', 'Assign Roles', 'Manage Users'],
//     SUPERVISOR: ['Assign Workers', 'View Schedule'],
//     WORKER: ['View Tasks', 'Mark Availability'],
//     EQUIPMENT_MANAGER: ['Manage Equipment', 'Prevent Conflicts'],
//   }

//   const handleLogout = () => {
//     dispatch(logout())
//     router.push('/login')
//   }

//   // 💡 Prevent rendering on server to avoid hydration mismatch
//   if (!hasMounted) return null

//   return (
//     <nav className="flex items-center justify-between bg-gray-800 text-white px-6 py-4">
//       <Link href="/" className="text-xl font-bold">
//         BuildScheduler
//       </Link>

//       {token ? (
//         <div className="flex gap-6 items-center">
//           <div className="flex gap-4">
//             {(optionsByRole[role] || []).map((opt) => (
//               <span key={opt} className="text-sm">{opt}</span>
//             ))}
//           </div>
//           <button
//             onClick={handleLogout}
//             className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 text-sm"
//           >
//             Logout
//           </button>
//         </div>
//       ) : (
//         <div className="flex gap-4">
//           <Link
//             href="/register"
//             className="bg-purple-600 px-4 py-2 rounded hover:bg-purple-700 text-sm"
//           >
//             Register
//           </Link>
//           <Link
//             href="/login"
//             className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 text-sm"
//           >
//             Login
//           </Link>
//         </div>
//       )}
//     </nav>
//   )
// }





// 'use client'

// import Link from 'next/link'
// import { useSelector, useDispatch } from 'react-redux'
// import { logout } from '../redux/authSlice'
// import { useRouter } from 'next/navigation'
// import { useEffect, useState } from 'react'

// export default function Navbar() {
//   const dispatch = useDispatch()
//   const router = useRouter()
//   const [hasMounted, setHasMounted] = useState(false)

//   const token = useSelector((state) => state.auth.token)
//   const role = useSelector((state) => state.auth.role)

//   useEffect(() => {
//     setHasMounted(true)
//   }, [])

//   if (!hasMounted) return null

//   const optionsByRole = {
//     ADMIN: ['Create Project', 'Assign Roles', 'Manage Users'],
//     SUPERVISOR: ['Assign Workers', 'View Schedule'],
//     WORKER: ['View Tasks', 'Mark Availability'],
//     EQUIPMENT_MANAGER: ['Manage Equipment', 'Prevent Conflicts'],
//   }

//   const handleLogout = () => {
//     dispatch(logout())
//     router.push('/login')
//   }

//   return (
//     // You can switch any of the below nav styles based on your design preference
//     //<nav className="flex items-center justify-between bg-white/70 backdrop-blur-md text-gray-800 px-6 py-4 shadow-md rounded-b-lg">
//     //<nav className="flex items-center justify-between bg-gradient-to-r from-blue-200/80 to-purple-200/80 backdrop-blur-md text-gray-800 px-6 py-4 shadow-md rounded-b-lg">
//     <nav className="flex items-center justify-between bg-gray-800 text-white px-6 py-4">
//       <Link href="/" className="text-xl font-bold">BuildScheduler</Link>

//       {token ? (
//         <div className="flex gap-6 items-center">
//           <div className="flex gap-4">
//             {(optionsByRole[role] || []).map((opt) => (
//               <span key={opt} className="text-sm">{opt}</span>
//             ))}
//           </div>
//           <button
//             onClick={handleLogout}
//             className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 text-sm"
//           >
//             Logout
//           </button>
//         </div>
//       ) : (
//         <div className="flex gap-4">
//           <Link
//             href="/register"
//             className="bg-purple-600 px-4 py-2 rounded hover:bg-purple-700 text-sm"
//           >
//             Register
//           </Link>
//           <Link
//             href="/login"
//             className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 text-sm"
//           >
//             Login
//           </Link>
//         </div>
//       )}
//     </nav>
//   )
// }




// 'use client'

// import Link from 'next/link'
// import { useSelector, useDispatch } from 'react-redux'
// import { logout } from '../redux/authSlice'
// import { useRouter } from 'next/navigation'
// import { useEffect, useState } from 'react'

// export default function Navbar() {
//   const dispatch = useDispatch()
//   const router = useRouter()

//   // Hydration-safe mounting
//   const [hasMounted, setHasMounted] = useState(false)

//   // Move Redux selectors inside the effect-safe block
//   const token = useSelector((state) => state.auth.token)
//   const role = useSelector((state) => state.auth.role)

//   useEffect(() => {
//     setHasMounted(true)
//   }, [])

//   if (!hasMounted) return null // Avoid hydration mismatch

//   const optionsByRole = {
//     ADMIN: ['Create Project', 'Assign Roles', 'Manage Users'],
//     SUPERVISOR: ['Assign Workers', 'View Schedule'],
//     WORKER: ['View Tasks', 'Mark Availability'],
//     EQUIPMENT_MANAGER: ['Manage Equipment', 'Prevent Conflicts'],
//   }

//   const handleLogout = () => {
//     dispatch(logout())
//     router.push('/login')
//   }

//   return (
//     <nav className="flex items-center justify-between bg-gray-800 text-white px-6 py-4">
//       <Link href="/" className="text-xl font-bold">BuildScheduler</Link>

//       {token ? (
//         <div className="flex gap-6 items-center">
//           <div className="flex gap-4">
//             {(optionsByRole[role] || []).map((opt) => (
//               <span key={opt} className="text-sm">{opt}</span>
//             ))}
//           </div>
//           <button
//             onClick={handleLogout}
//             className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 text-sm"
//           >
//             Logout
//           </button>
//         </div>
//       ) : (
//         <div className="flex gap-4">
//           <Link
//             href="/register"
//             className="bg-purple-600 px-4 py-2 rounded hover:bg-purple-700 text-sm"
//           >
//             Register
//           </Link>
//           <Link
//             href="/login"
//             className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 text-sm"
//           >
//             Login
//           </Link>
//         </div>
//       )}
//     </nav>
//   )
// }



// 'use client'

// import Link from 'next/link'
// import { useSelector, useDispatch } from 'react-redux'
// import { logout } from '../redux/authSlice'
// import { useRouter } from 'next/navigation'
// import { useEffect, useState } from 'react'

// export default function Navbar() {
//   const dispatch = useDispatch()
//   const router = useRouter()

//   const [hasMounted, setHasMounted] = useState(false)

//   // Mount check to prevent SSR mismatch
//   useEffect(() => {
//     setHasMounted(true)
//   }, [])

//   // Use selectors AFTER client has mounted
//   const token = useSelector((state) => state.auth.token)
//   const role = useSelector((state) => state.auth.role)

//   const optionsByRole = {
//     ADMIN: ['Create Project', 'Assign Roles', 'Manage Users'],
//     SUPERVISOR: ['Assign Workers', 'View Schedule'],
//     WORKER: ['View Tasks', 'Mark Availability'],
//     EQUIPMENT_MANAGER: ['Manage Equipment', 'Prevent Conflicts'],
//   }

//   const handleLogout = () => {
//     dispatch(logout())
//     router.push('/login')
//   }

//   if (!hasMounted) return null

//   return (
//     <nav className="flex items-center justify-between bg-gray-800 text-white px-6 py-4">
//       <Link href="/" className="text-xl font-bold">BuildScheduler</Link>

//       {token ? (
//         <div className="flex gap-6 items-center">
//           <div className="flex gap-4">
//             {(optionsByRole[role] || []).map((opt) => (
//               <span key={opt} className="text-sm">{opt}</span>
//             ))}
//           </div>
//           <button
//             onClick={handleLogout}
//             className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 text-sm"
//           >
//             Logout
//           </button>
//         </div>
//       ) : (
//         <div className="flex gap-4">
//           <Link
//             href="/register"
//             className="bg-purple-600 px-4 py-2 rounded hover:bg-purple-700 text-sm"
//           >
//             Register
//           </Link>
//           <Link
//             href="/login"
//             className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 text-sm"
//           >
//             Login
//           </Link>
//         </div>
//       )}
//     </nav>
//   )
// }


// 'use client'

// import Link from 'next/link'
// import { useSelector, useDispatch } from 'react-redux'
// import { logout } from '../redux/authSlice'
// import { useRouter } from 'next/navigation'
// import { useEffect, useState } from 'react'

// export default function Navbar() {
//   const dispatch = useDispatch()
//   const router = useRouter()
//   const [hasMounted, setHasMounted] = useState(false)

//   useEffect(() => {
//     setHasMounted(true)
//   }, [])

//   const token = useSelector((state) => state.auth.token)
//   const role = useSelector((state) => state.auth.role)

//   const optionsByRole = {
//     ADMIN: ['Create Project', 'Assign Roles', 'Manage Users'],
//     SUPERVISOR: ['Assign Workers', 'View Schedule'],
//     WORKER: ['View Tasks', 'Mark Availability'],
//     EQUIPMENT_MANAGER: ['Manage Equipment', 'Prevent Conflicts'],
//   }

//   const handleLogout = () => {
//     dispatch(logout())
//     router.push('/login')
//   }

//   if (!hasMounted) return null

//   return (
//     <nav className="flex items-center justify-between bg-white text-gray-800 px-6 py-4 shadow-md">
//       <Link href="/" className="text-xl font-bold text-blue-600">
//         BuildScheduler
//       </Link>

//       {token ? (
//         <div className="flex gap-6 items-center">
//           <div className="flex gap-4">
//             {(optionsByRole[role] || []).map((opt) => (
//               <span key={opt} className="text-sm font-medium text-gray-700">
//                 {opt}
//               </span>
//             ))}
//           </div>
//           <button
//             onClick={handleLogout}
//             className="bg-red-500 px-3 py-1 rounded text-white hover:bg-red-600 text-sm"
//           >
//             Logout
//           </button>
//         </div>
//       ) : (
//         <div className="flex gap-4">
//           <Link
//             href="/register"
//             className="bg-purple-600 px-4 py-2 rounded text-white hover:bg-purple-700 text-sm"
//           >
//             Register
//           </Link>
//           <Link
//             href="/login"
//             className="bg-blue-600 px-4 py-2 rounded text-white hover:bg-blue-700 text-sm"
//           >
//             Login
//           </Link>
//         </div>
//       )}
//     </nav>
//   )
// }




// 'use client'

// import Link from 'next/link'
// import { useSelector, useDispatch } from 'react-redux'
// import { logout } from '../redux/authSlice'
// import { useRouter } from 'next/navigation'
// import { useEffect, useState } from 'react'

// export default function Navbar() {
//   const dispatch = useDispatch()
//   const router = useRouter()
//   const [hasMounted, setHasMounted] = useState(false)

//   useEffect(() => {
//     setHasMounted(true)
//   }, [])

//   const token = useSelector((state) => state.auth.token)
//   const role = useSelector((state) => state.auth.role)

//   const optionsByRole = {
//     ADMIN: ['Create Project', 'Assign Roles', 'Manage Users'],
//     SUPERVISOR: ['Assign Workers', 'View Schedule'],
//     WORKER: ['View Tasks', 'Mark Availability'],
//     EQUIPMENT_MANAGER: ['Manage Equipment', 'Prevent Conflicts'],
//   }

//   const handleLogout = () => {
//     dispatch(logout())
//     router.push('/login')
//   }

//   if (!hasMounted) return null

//   return (
//     <nav className="flex items-center justify-between bg-gray-50 text-gray-800 px-6 py-4 border-b border-gray-200">
//       <Link href="/" className="text-xl font-semibold text-blue-600">
//         BuildScheduler
//       </Link>

//       {token ? (
//         <div className="flex gap-6 items-center">
//           <div className="flex gap-4">
//             {(optionsByRole[role] || []).map((opt) => (
//               <span key={opt} className="text-sm text-gray-600 font-medium">
//                 {opt}
//               </span>
//             ))}
//           </div>
//           <button
//             onClick={handleLogout}
//             className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 text-sm"
//           >
//             Logout
//           </button>
//         </div>
//       ) : (
//         <div className="flex gap-4">
//           <Link
//             href="/register"
//             className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 text-sm"
//           >
//             Register
//           </Link>
//           <Link
//             href="/login"
//             className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
//           >
//             Login
//           </Link>
//         </div>
//       )}
//     </nav>
//   )
// }



'use client'

import Link from 'next/link'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../redux/authSlice'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const dispatch = useDispatch()
  const router = useRouter()
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

  const handleLogout = () => {
    dispatch(logout())
    router.push('/login')
  }

  if (!hasMounted) return null

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-white/70 border-b border-gray-200 shadow-sm px-6 py-4 flex items-center justify-between">
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
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-3 py-1.5 rounded-md hover:bg-red-600 text-sm shadow"
          >
            Logout
          </button>
        </div>
      ) : (
        // <div className="flex gap-4">
        //   <Link
        //     href="/register"
        //     className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 text-sm shadow"
        //   >
        //     Register
        //   </Link>
        //   <Link
        //     href="/login"
        //     className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 text-sm shadow"
        //   >
        //     Login
        //   </Link>
        // </div>
          <div className="flex gap-4">
  <Link
    href="/register"
    className="bg-slate-600 text-white px-4 py-2 rounded-md hover:bg-slate-700 text-sm shadow"
  >
    Register
  </Link>
  <Link
    href="/login"
    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 text-sm shadow"
  >
    Login
  </Link>
</div>

      )}
    </nav>
  )
}



















