// 'use client'

// import DashboardSidebar from '../../components/DashboardSidebar'
// import DashboardNavbar from '../../components/DashboardNavbar'

// export default function DashboardLayout({ children }) {
//   return (
//     <div className="flex h-screen">
//       <DashboardSidebar />
//       <div className="flex-1 flex flex-col">
//         <DashboardNavbar />
//         <main className="flex-1 overflow-y-auto p-4 bg-gray-100">
//           {children}
//         </main>
//       </div>
//     </div>
//   )
// }



//app/dashboard/layout.js
// import DashboardSidebar from '../../components/DashboardSidebar'
// import DashboardNavbar from '../../components/DashboardNavbar'
//  //import '../../styles/globals.css' // if needed

// export const metadata = {
//   title: 'Dashboard',
//   description: 'User dashboard layout'
// }

// export default function DashboardLayout({ children }) {
//   return (
//     <div className="flex h-screen">
//       <DashboardSidebar />
//       <div className="flex flex-col flex-1 overflow-y-auto">
//         <DashboardNavbar />
//         <main className="p-6">{children}</main>
//       </div>
//     </div>
//   )
// }



import DashboardSidebar from '../../components/DashboardSidebar'
import DashboardNavbar from '../../components/DashboardNavbar'

export const metadata = {
  title: 'Dashboard',
}

export default function DashboardLayout({ children }) {
  return (
    <div className="flex">
      <DashboardSidebar />
      <div className="flex flex-col flex-1">
        <DashboardNavbar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}




// src/app/dashboard/layout.js

// import DashboardSidebar from '../../components/DashboardSidebar'
// import DashboardNavbar from '../../components/DashboardNavbar'
// //import '../../styles/globals.css' // Optional if using Tailwind only

// export const metadata = {
//   title: 'Dashboard',
// }

// export default function DashboardLayout({ children }) {
//   return (
//     <div className="flex h-screen">
//       {/* Sidebar fixed width */}
//       <DashboardSidebar />

//       {/* Main content area with navbar + page */}
//       <div className="flex flex-col flex-1 overflow-hidden">
//         <DashboardNavbar />
//         <main className="flex-1 overflow-auto bg-gray-50 p-4">{children}</main>
//       </div>
//     </div>
//   )
// }


// import DashboardSidebar from '../../../components/DashboardSidebar'
// import DashboardNavbar from '../../../components/DashboardNavbar'

// export const metadata = {
//   title: 'Dashboard',
// }

// export default function DashboardLayout({ children }) {
//   return (
//     <div className="flex h-screen">
//       {/* Sidebar fixed width */}
//       <DashboardSidebar />

//       {/* Main content area with navbar + page */}
//       <div className="flex flex-col flex-1 overflow-hidden">
//         <DashboardNavbar />
//         <main className="flex-1 overflow-auto bg-gray-50 p-4">{children}</main>
//       </div>
//     </div>
//   )
// }


// import DashboardSidebar from '../../components/DashboardSidebar'
// import DashboardNavbar from '../../components/DashboardNavbar'

// export const metadata = {
//   title: 'Dashboard',
// }

// export default function DashboardLayout({ children }) {
//   return (
//     <div className="flex h-screen">
//       <DashboardSidebar />
//       <div className="flex flex-col flex-1 overflow-hidden">
//         <DashboardNavbar />
//         <main className="flex-1 overflow-auto bg-gray-50 p-4">{children}</main>
//       </div>
//     </div>
//   )
// }



