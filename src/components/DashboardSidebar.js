// 'use client'

// import Link from 'next/link'
// import { useSelector } from 'react-redux'
// import { useEffect, useState } from 'react'

// const links = {
//   ROLE_WORKER: [
//     { name: 'My Skills', href: '/dashboard/skills' },
//     { name: 'Assigned Work', href: '/dashboard/tasks' },
//   ],
//   ROLE_PROJECT_MANAGER: [
//     { name: 'Projects', href: '/dashboard/projects' },
//     { name: 'Assign Tasks', href: '/dashboard/assign' },
//   ],
//   ROLE_EQUIPMENT_MANAGER: [
//     { name: 'Equipment', href: '/dashboard/equipment' },
//   ],
//   ROLE_SITE_SUPERVISOR: [
//     { name: 'Site Schedule', href: '/dashboard/schedule' },
//     { name: 'Assign Workers', href: '/dashboard/assign-workers' },
//   ],
// }

// export default function DashboardSidebar() {
//   const { userInfo } = useSelector((state) => state.auth)
//   const [roleLinks, setRoleLinks] = useState([])

//   useEffect(() => {
//     if (userInfo?.role) {
//       setRoleLinks(links[userInfo.role] || [])
//     }
//   }, [userInfo])

//   return (
//     <aside className="w-64 h-screen bg-slate-800 text-white p-6">
//       <nav className="flex flex-col space-y-2">
//         {roleLinks.map((link) => (
//           <Link
//             key={link.name}
//             href={link.href}
//             className="block px-4 py-2 rounded hover:bg-slate-600 transition-colors"
//           >
//             {link.name}
//           </Link>
//         ))}
//       </nav>
//     </aside>
//   )
// }



// 'use client'

// import Link from 'next/link'
// import { useSelector } from 'react-redux'
// import { useEffect, useState } from 'react'

// export default function DashboardSidebar() {
//   const { userInfo } = useSelector((state) => state.auth)
//   const [activeLinks, setActiveLinks] = useState([])

//   // Role-based links with Unicode icons
//   const roleBasedLinks = {
//     ROLE_WORKER: [
//       { name: 'My Skills', href: '/dashboard/skills', icon: '🛠️' },
//       { name: 'Assigned Work', href: '/dashboard/tasks', icon: '📋' },
//     ],
//     ROLE_PROJECT_MANAGER: [
//       { name: 'Projects', href: '/dashboard/projects', icon: '📊' },
//       { name: 'Assign Tasks', href: '/dashboard/assign', icon: '👥' },
//     ],
//     ROLE_EQUIPMENT_MANAGER: [
//       { name: 'Equipment', href: '/dashboard/equipment', icon: '🔧' },
//     ],
//     ROLE_SITE_SUPERVISOR: [
//       { name: 'Site Schedule', href: '/dashboard/schedule', icon: '📅' },
//       { name: 'Assign Workers', href: '/dashboard/assign-workers', icon: '👷' },
//     ],
//   }

//   useEffect(() => {
//     setActiveLinks(userInfo?.role ? roleBasedLinks[userInfo.role] || [] : [])
//   }, [userInfo])

//   return (
//     <aside className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col">
//       <div className="p-6 pb-2">
//         <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
//           <span className="text-xl">📊</span>
//           Dashboard
//         </h2>
//         <nav className="flex flex-col gap-1">
//           {activeLinks.map((link) => (
//             <Link
//               key={link.href}
//               href={link.href}
//               className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors"
//             >
//               <span className="text-lg">{link.icon}</span>
//               <span className="font-medium">{link.name}</span>
//             </Link>
//           ))}
//         </nav>
//       </div>
//     </aside>
//   )
// }




// 'use client'

// import Link from 'next/link'
// import { useSelector } from 'react-redux'
// import {
//   LayoutDashboard,
//   Users,
//   ClipboardList,
//   PlusCircle,
//   HardHat,
//   Settings,
// } from 'lucide-react'

// export default function DashboardSidebar() {
//   const { userInfo } = useSelector((state) => state.auth)
//   const role = userInfo?.role

//   const links = {
//     ROLE_MANAGER: [
//       { name: 'Create Project', href: '/dashboard/projects/create', icon: <PlusCircle size={18} /> },
//       { name: 'View Projects', href: '/dashboard/projects', icon: <ClipboardList size={18} /> },
//     ],
//     ROLE_SUPERVISOR: [
//       { name: 'Assigned Tasks', href: '/dashboard/tasks', icon: <ClipboardList size={18} /> },
//     ],
//     ROLE_WORKER: [
//       { name: 'My Skills', href: '/dashboard/skills', icon: <HardHat size={18} /> },
//       { name: 'Assigned Work', href: '/dashboard/work', icon: <ClipboardList size={18} /> },
//     ],
//   }

//   return (
//     <aside className="w-64 h-screen bg-slate-900 text-white flex flex-col">
//       <div className="p-6 text-xl font-bold border-b border-slate-700">
//         BuildScheduler
//       </div>

//       <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
//         {(links[role] || []).map((link) => (
//           <Link
//             key={link.name}
//             href={link.href}
//             className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors duration-200"
//           >
//             {link.icon}
//             {link.name}
//           </Link>
//         ))}
//       </nav>
//     </aside>
//   )
// }







// 'use client'

// import Link from 'next/link'
// import { useSelector } from 'react-redux'
// import { useEffect, useState } from 'react'

// export default function DashboardSidebar() {
//   const { userInfo } = useSelector((state) => state.auth)
//   const [activeLinks, setActiveLinks] = useState([])

//   const roleBasedLinks = {
//     ROLE_WORKER: [
//       { name: 'My Skills', href: '/dashboard/skills', icon: '🛠️' },
//       { name: 'My Tasks', href: '/dashboard/tasks', icon: '📋' },
//     ],
//     ROLE_PROJECT_MANAGER: [
//       { name: 'Create Project', href: '/dashboard/projects/create', icon: '📁' },
//       { name: 'View Projects', href: '/dashboard/projects', icon: '📂' },
//     ],
//     ROLE_EQUIPMENT_MANAGER: [
//       { name: 'Manage Equipment', href: '/dashboard/equipment', icon: '🧰' },
//       { name: 'Schedule Maintenance', href: '/dashboard/maintenance', icon: '🗓' },
//     ],
//     ROLE_SITE_SUPERVISOR: [
//       { name: 'Worker Schedule', href: '/dashboard/schedule', icon: '📅' },
//       { name: 'Assign Workers', href: '/dashboard/assign-workers', icon: '👷' },
//     ],
//   }

//   useEffect(() => {
//     setActiveLinks(userInfo?.role ? roleBasedLinks[userInfo.role] || [] : [])
//   }, [userInfo])

//   return (
//     <aside className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col">
//       <div className="p-6 pb-2">
//         <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
//           <span className="text-xl">📊</span>
//           Dashboard
//         </h2>
//         <nav className="flex flex-col gap-1">
//           {activeLinks.map((link) => (
//             <Link
//               key={link.href}
//               href={link.href}
//               className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors"
//             >
//               <span className="text-lg">{link.icon}</span>
//               <span className="font-medium">{link.name}</span>
//             </Link>
//           ))}
//         </nav>
//       </div>
//     </aside>
//   )
// }






// 'use client'

// import Link from 'next/link'
// import { useSelector } from 'react-redux'
// import { useEffect, useState } from 'react'

// export default function DashboardSidebar() {
//   const { userInfo } = useSelector((state) => state.auth)
//   const [activeLinks, setActiveLinks] = useState([])
//   const [hasMounted, setHasMounted] = useState(false)

//   const roleBasedLinks = {
//     ROLE_WORKER: [
//       { name: 'My Skills', href: '/dashboard/skills', icon: '🛠️' },
//       { name: 'My Tasks', href: '/dashboard/tasks', icon: '📋' },
//     ],
//     ROLE_PROJECT_MANAGER: [
//       { name: 'Create Project', href: '/dashboard/projects/create', icon: '📁' },
//       { name: 'View Projects', href: '/dashboard/projects', icon: '📂' },
//     ],
//     ROLE_EQUIPMENT_MANAGER: [
//       { name: 'Manage Equipment', href: '/dashboard/equipment', icon: '🧰' },
//       { name: 'Schedule Maintenance', href: '/dashboard/maintenance', icon: '🗓' },
//     ],
//     ROLE_SITE_SUPERVISOR: [
//       { name: 'Worker Schedule', href: '/dashboard/schedule', icon: '📅' },
//       { name: 'Assign Workers', href: '/dashboard/assign-workers', icon: '👷' },
//     ],
//   }

//   useEffect(() => {
//     setHasMounted(true)
//     if (userInfo?.role) {
//       setActiveLinks(roleBasedLinks[userInfo.role] || [])
//     }
//   }, [userInfo])

//   if (!hasMounted) return null // Prevent SSR mismatch

//   return (
//     <aside className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col">
//       <div className="p-6 pb-2">
//         <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
//           <span className="text-xl">📊</span>
//           Dashboard
//         </h2>
//         <nav className="flex flex-col gap-1">
//           {activeLinks.map((link) => (
//             <Link
//               key={link.href}
//               href={link.href}
//               className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors"
//             >
//               <span className="text-lg">{link.icon}</span>
//               <span className="font-medium">{link.name}</span>
//             </Link>
//           ))}
//         </nav>
//       </div>
//     </aside>
//   )
// }





// 'use client'

// import Link from 'next/link'
// import { useSelector } from 'react-redux'
// import { useEffect, useState } from 'react'

// export default function DashboardSidebar() {
//   const { userInfo } = useSelector((state) => state.auth)
//   const [activeLinks, setActiveLinks] = useState([])
//   const [hasMounted, setHasMounted] = useState(false)

//   useEffect(() => {
//     setHasMounted(true)
//   }, [])

//   const roleBasedLinks = {
//     ROLE_WORKER: [
//       { name: 'My Skills', href: '/dashboard/skills', icon: '🛠️' },
//       { name: 'My Tasks', href: '/dashboard/tasks', icon: '📋' },
//     ],
//     ROLE_PROJECT_MANAGER: [
//       { name: 'Create Project', href: '/dashboard/projects/create', icon: '📁' },
//       { name: 'View Projects', href: '/dashboard/projects', icon: '📂' },
//     ],
//     ROLE_EQUIPMENT_MANAGER: [
//       { name: 'Manage Equipment', href: '/dashboard/equipment', icon: '🧰' },
//       { name: 'Schedule Maintenance', href: '/dashboard/maintenance', icon: '🗓' },
//     ],
//     ROLE_SITE_SUPERVISOR: [
//       { name: 'Worker Schedule', href: '/dashboard/schedule', icon: '📅' },
//       { name: 'Assign Workers', href: '/dashboard/assign-workers', icon: '👷' },
//     ],
//   }

//   useEffect(() => {
//     if (hasMounted && userInfo?.role) {
//       setActiveLinks(roleBasedLinks[userInfo.role] || [])
//     }
//   }, [userInfo, hasMounted])

//   if (!hasMounted) return null

//   return (
//     <aside className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col">
//       <div className="p-6 pb-2">
//         <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
//           <span className="text-xl">📊</span>
//           BuildScheduler
//         </h2>
//         <nav className="flex flex-col gap-1">
//           {activeLinks.map((link) => (
//             <Link
//               key={link.href}
//               href={link.href}
//               className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors"
//             >
//               <span className="text-lg">{link.icon}</span>
//               <span className="font-medium">{link.name}</span>
//             </Link>
//           ))}
//         </nav>
//       </div>
//     </aside>
//   )
// }





// 'use client'

// import Link from 'next/link'
// import { useSelector } from 'react-redux'
// import { useEffect, useState } from 'react'

// // MUI Icons
// import DashboardIcon from '@mui/icons-material/Dashboard'
// import BuildIcon from '@mui/icons-material/Build'
// import AssignmentIcon from '@mui/icons-material/Assignment'
// import FolderOpenIcon from '@mui/icons-material/FolderOpen'
// import FolderSpecialIcon from '@mui/icons-material/FolderSpecial'
// import HandymanIcon from '@mui/icons-material/Handyman'
// import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
// import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
// import CheckCircleIcon from '@mui/icons-material/CheckCircle'
// import HistoryEduIcon from '@mui/icons-material/HistoryEdu'
// import AccessTimeIcon from '@mui/icons-material/AccessTime'




// export default function DashboardSidebar() {
//   const { userInfo } = useSelector((state) => state.auth)
//   const [activeLinks, setActiveLinks] = useState([])

//   const roleBasedLinks = {
//     ROLE_WORKER: [
//       { name: 'My Skills', href: '/dashboard/skills', icon: <BuildIcon fontSize="small" /> },
//   { name: 'My Tasks', href: '/dashboard/tasks', icon: <AssignmentIcon fontSize="small" /> },
//   { name: 'My Schedule', href: '/dashboard/schedule', icon: <CalendarMonthIcon fontSize="small" /> },
//   { name: 'My Availability', href: '/dashboard/availability', icon: <AccessTimeIcon fontSize="small" /> },
//   { name: 'My Experience', href: '/dashboard/experience', icon: <HistoryEduIcon fontSize="small" /> },
//   { name: 'My Certificates', href: '/dashboard/certificates', icon: <CheckCircleIcon fontSize="small" /> },
//     ],
//     ROLE_PROJECT_MANAGER: [
//       { name: 'Create Project', href: '/dashboard/projects/create', icon: <FolderSpecialIcon fontSize="small" /> },
//       { name: 'View Projects', href: '/dashboard/projects', icon: <FolderOpenIcon fontSize="small" /> },
//       { name: 'Assign Roles', href: '/dashboard/assign-roles', icon: <PeopleAltIcon fontSize="small" /> },

//     ],
//     ROLE_EQUIPMENT_MANAGER: [
//       { name: 'Manage Equipment', href: '/dashboard/equipment', icon: <HandymanIcon fontSize="small" /> },
//       { name: 'Schedule Maintenance', href: '/dashboard/maintenance', icon: <CalendarMonthIcon fontSize="small" /> },
//     ],
//     ROLE_SITE_SUPERVISOR: [
//       { name: 'Worker Schedule', href: '/dashboard/schedule', icon: <CalendarMonthIcon fontSize="small" /> },
//       { name: 'Assign Workers', href: '/dashboard/assign-workers', icon: <PeopleAltIcon fontSize="small" /> },
//     ],
//   }

//   useEffect(() => {
//     setActiveLinks(userInfo?.role ? roleBasedLinks[userInfo.role] || [] : [])
//   }, [userInfo])

//   return (
//     <aside className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col">
//       <div className="p-6 pb-2">
//         <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
//           <DashboardIcon fontSize="small" />
//           BuildScheduler
//         </h2>
//         <nav className="flex flex-col gap-1">
//           {activeLinks.map((link) => (
//             <Link
//               key={link.href}
//               href={link.href}
//               className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors"
//             >
//               {link.icon}
//               <span className="font-medium">{link.name}</span>
//             </Link>
//           ))}
//         </nav>
//       </div>
//     </aside>
//   )
// }




'use client'

import Link from 'next/link'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'

// MUI Icons
import DashboardIcon from '@mui/icons-material/Dashboard'
import BuildIcon from '@mui/icons-material/Build'
import AssignmentIcon from '@mui/icons-material/Assignment'
import FolderOpenIcon from '@mui/icons-material/FolderOpen'
import FolderSpecialIcon from '@mui/icons-material/FolderSpecial'
import HandymanIcon from '@mui/icons-material/Handyman'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import HistoryEduIcon from '@mui/icons-material/HistoryEdu'
import AccessTimeIcon from '@mui/icons-material/AccessTime'

export default function DashboardSidebar() {
  const { userInfo } = useSelector((state) => state.auth)
  const [activeLinks, setActiveLinks] = useState([])

  const roleBasedLinks = {
    ROLE_WORKER: [
      { name: 'My Skills', href: '/dashboard/skills', icon: <BuildIcon fontSize="small" /> },
      { name: 'My Tasks', href: '/dashboard/tasks', icon: <AssignmentIcon fontSize="small" /> },
      { name: 'My Schedule', href: '/dashboard/schedule', icon: <CalendarMonthIcon fontSize="small" /> },
      { name: 'My Availability', href: '/dashboard/availability', icon: <AccessTimeIcon fontSize="small" /> },
      { name: 'My Experience', href: '/dashboard/experience', icon: <HistoryEduIcon fontSize="small" /> },
      { name: 'My Certificates', href: '/dashboard/certificates', icon: <CheckCircleIcon fontSize="small" /> },
    ],
    ROLE_PROJECT_MANAGER: [
      { name: 'Create Project', href: '/dashboard/projects/create', icon: <FolderSpecialIcon fontSize="small" /> },
      { name: 'View Projects', href: '/dashboard/projects', icon: <FolderOpenIcon fontSize="small" /> },
      { name: 'Assign Roles', href: '/dashboard/assign-roles', icon: <PeopleAltIcon fontSize="small" /> },
    ],
    ROLE_EQUIPMENT_MANAGER: [
      { name: 'Manage Equipment', href: '/dashboard/equipment', icon: <HandymanIcon fontSize="small" /> },
      { name: 'Schedule Maintenance', href: '/dashboard/maintenance', icon: <CalendarMonthIcon fontSize="small" /> },
    ],
    ROLE_SITE_SUPERVISOR: [
      { name: 'Worker Schedule', href: '/dashboard/schedule', icon: <CalendarMonthIcon fontSize="small" /> },
      { name: 'Assign Workers', href: '/dashboard/assign-workers', icon: <PeopleAltIcon fontSize="small" /> },
    ],
  }

  useEffect(() => {
    setActiveLinks(userInfo?.role ? roleBasedLinks[userInfo.role] || [] : [])
  }, [userInfo])

  return (
    <aside className="w-64 h-screen bg-blue-50 border-r border-blue-100 flex flex-col">
      <div className="p-6 pb-2">
        <h2 className="text-lg font-semibold text-blue-800 mb-6 flex items-center gap-2">
          <DashboardIcon fontSize="small" className="text-blue-700" />
          BuildScheduler
        </h2>
        <nav className="flex flex-col gap-1">
          {activeLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-blue-800 hover:bg-blue-100 hover:text-blue-900 transition-colors"
            >
              <span className="text-blue-700">{link.icon}</span>
              <span className="font-medium">{link.name}</span>
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  )
}















