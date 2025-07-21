import DashboardSidebar from '../../components/DashboardSidebar'
import DashboardNavbar from '../../components/DashboardNavbar'

export const metadata = {
  title: 'Dashboard',
}

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <DashboardNavbar />

        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  )
}




