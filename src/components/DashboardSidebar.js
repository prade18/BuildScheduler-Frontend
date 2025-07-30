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
import NotificationsIcon from '@mui/icons-material/Notifications'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices'

export default function DashboardSidebar() {
  const { userInfo } = useSelector((state) => state.auth)
  const [activeLinks, setActiveLinks] = useState([])

  const roleBasedLinks = {
    ROLE_WORKER: [
      { name: 'My Skills', href: '/dashboard/skills', icon: <BuildIcon fontSize="small" /> },
      { name: 'My Tasks', href: '/dashboard/tasks', icon: <AssignmentIcon fontSize="small" /> },
      { name: 'My Schedule', href: '/dashboard/schedule', icon: <CalendarMonthIcon fontSize="small" /> },
      { name: 'My Certificates', href: '/dashboard/certificates', icon: <CheckCircleIcon fontSize="small" /> },
      { name: 'Assigned Projects', href: '/dashboard/assignedprojectsforworker', icon: <AssignmentIcon fontSize="small" /> },
      { name: 'Notifications', href: '/dashboard/notifications', icon: <NotificationsIcon fontSize="small" /> },
    ],
    ROLE_PROJECT_MANAGER: [
      { name: 'Create Project', href: '/dashboard/projects/create', icon: <FolderSpecialIcon fontSize="small" /> },
      { name: 'View Projects', href: '/dashboard/projects/view', icon: <FolderOpenIcon fontSize="small" /> },
      { name: 'Assign Roles', href: '/dashboard/assign-roles', icon: <PeopleAltIcon fontSize="small" /> },
      { name: 'Notifications', href: '/dashboard/notifications', icon: <NotificationsIcon fontSize="small" /> },
    ],
    ROLE_EQUIPMENT_MANAGER: [
      { name: 'Assigned Projects', href: '/dashboard/equipment-assigned-projects', icon: <AssignmentIcon fontSize="small" /> },
      { name: 'Your Equipments', href: '/dashboard/equipment', icon: <HandymanIcon fontSize="small" /> },
      { name: 'Add Equipment', href: '/dashboard/equipment/add', icon: <AddCircleIcon fontSize="small" /> },
      { name: 'Add Non-Availability', href: '/dashboard/non-availability', icon: <AddCircleIcon fontSize="small" /> },
      { name: 'Maintenance Alerts', href: '/dashboard/maintenance', icon: <MiscellaneousServicesIcon fontSize="small" /> },
      { name: 'Notifications', href: '/dashboard/notifications', icon: <NotificationsIcon fontSize="small" /> },
    ],
    ROLE_SITE_SUPERVISOR: [
      { name: 'Assigned Projects', href: '/dashboard/assigned-projects-sitesup', icon: <AssignmentIcon fontSize="small" /> },
      { name: 'Notifications', href: '/dashboard/notifications', icon: <NotificationsIcon fontSize="small" /> },
    ],
  }

  useEffect(() => {
    const specificLinks = userInfo?.role ? roleBasedLinks[userInfo.role] || [] : []
    setActiveLinks(specificLinks)
  }, [userInfo])

  return (
    <aside className="w-64 h-screen bg-blue-50 border-r border-blue-100 flex flex-col">
      <div className="p-6 pb-2">
        <h2 className="text-lg font-semibold text-blue-800 mb-6 flex items-center gap-2">
          <DashboardIcon fontSize="small" className="text-blue-700" />
          BuildScheduler
        </h2>
        <nav className="flex flex-col gap-1">
          {/* Always show Dashboard link at the top */}
          <Link
            key="/dashboard"
            href="/dashboard"
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-blue-800 hover:bg-blue-100 hover:text-blue-900 transition-colors"
          >
            <span className="text-blue-700">
              <DashboardIcon fontSize="small" />
            </span>
            <span className="font-medium">Dashboard</span>
          </Link>

          {/* Show role-specific links below */}
          {activeLinks.map((link) => (
            <Link
              key={`${link.href}-${link.name}`}
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
