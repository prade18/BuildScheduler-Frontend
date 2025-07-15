'use client'
import { useSelector } from 'react-redux'

export default function RoleOptions() {
  const role = useSelector((state) => state.auth.role)

  const optionsByRole = {
    ADMIN: ['Create Project', 'Assign Roles', 'Manage Users'],
    SUPERVISOR: ['Assign Workers', 'View Schedule'],
    WORKER: ['View Tasks', 'Mark Availability'],
    EQUIPMENT_MANAGER: ['Manage Equipment', 'Prevent Conflicts'],
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Your Role: {role}</h2>
      <ul className="list-disc ml-6 text-lg">
        {optionsByRole[role]?.map((opt) => (
          <li key={opt}>{opt}</li>
        )) || <li>No options available</li>}
      </ul>
    </div>
  )
}
