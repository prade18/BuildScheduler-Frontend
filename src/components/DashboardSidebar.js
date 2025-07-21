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
      { name: 'View Projects', href: '/dashboard/projects/view', icon: <FolderOpenIcon fontSize="small" /> },
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















