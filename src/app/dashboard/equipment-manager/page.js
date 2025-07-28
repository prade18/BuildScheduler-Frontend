// // src/app/dashboard/equipment-manager/page.js
// 'use client';

// import { useEffect, useRef } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// // Changed from '@/redux/authSlice' to relative path
// import { fetchUserProfile } from '../../../redux/authSlice';
// import { useRouter } from 'next/navigation';

// export default function EquipmentManagerDashboardPage() {
//   const dispatch = useDispatch();
//   const router = useRouter();

//   const { data: userProfile, loading, error } = useSelector((state) => state.auth.userProfile);

//   const hasFetched = useRef(false);

//   useEffect(() => {
//     if (!userProfile && !loading && !hasFetched.current) {
//       dispatch(fetchUserProfile());
//       hasFetched.current = true;
//     }
//   }, [dispatch, userProfile, loading]);

//   const rawRoleName = userProfile?.roles?.[0]?.name || '';
//   const roleToDisplay = rawRoleName.replace('ROLE_', '').replace(/_/g, ' ');

//   useEffect(() => {
//     if (userProfile && rawRoleName !== 'ROLE_EQUIPMENT_MANAGER') {
//       console.warn(`Unauthorized access attempt to Equipment Manager Dashboard by role: ${rawRoleName}. Redirecting.`);
//       router.replace('/dashboard');
//     } else if (error && typeof error === 'string' && error.includes('No authentication token found')) {
//       router.replace('/login');
//     }
//   }, [userProfile, rawRoleName, error, router]);

//   if (loading || !userProfile) {
//     return (
//       <div className="flex justify-center items-center h-screen bg-gray-100">
//         <p className="text-xl font-semibold text-indigo-600 animate-pulse">Loading Equipment Manager Dashboard...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex justify-center items-center h-screen bg-red-100">
//         <p className="text-xl font-semibold text-red-700">Error: {error}</p>
//       </div>
//     );
//   }

//   const formatProfileValue = (key, value) => {
//     if (value === null || value === undefined || (Array.isArray(value) && value.length === 0) || (typeof value === 'object' && Object.keys(value).length === 0 && !['roles'].includes(key))) {
//       return '-';
//     }
//     if (key === 'roles' && Array.isArray(value)) {
//       return value.map(role => (role && role.name ? role.name.replace('ROLE_', '').replace(/_/g, ' ') : 'Unknown Role')).join(', ');
//     }
//     if (Array.isArray(value)) {
//       return value.map(item => {
//           if (item && typeof item === 'object') {
//             return item.username || item.name || item.title || `ID: ${item.id || 'Unknown'}`;
//           }
//           return String(item);
//         }).join(', ');
//     }
//     if (typeof value === 'object') {
//       return value.username || value.email || value.name || `ID: ${value.id || 'Unknown Object'}`;
//     }
//     return String(value);
//   };

//   const allProfileKeysForDynamicDisplay = [
//     'id', 'username', 'email', 'phone', 'roles', 'skills', 'certifications', 'profileStatus',
//     'address',
//     'siteSupervisor', 'projectManager', 'worksUnder', 'managedTeam', 'managedProjects',
//     'supervisedWorkers', 'supervisedTasks', 'managedEquipment', 'workerAssignments',
//     'workerAvailabilitySlots'
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-6 md:p-10">
//       <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl p-6 md:p-10">
//         <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 tracking-tight leading-tight">
//           Welcome, {userProfile.username || roleToDisplay}!
//         </h1>
//         <p className="text-lg text-gray-700 mb-8 leading-relaxed">
//           This is your dedicated dashboard for Equipment Management, showing all your profile details.
//         </p>

//         <section className="mb-8">
//           <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Your Complete Profile Overview</h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-base text-gray-700">
//             {allProfileKeysForDynamicDisplay.map((key) => {
//               if (!Object.prototype.hasOwnProperty.call(userProfile, key)) {
//                 return null;
//               }
//               const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
//               const value = formatProfileValue(key, userProfile[key]);
//               return <DetailItem key={key} label={label} value={value} />;
//             })}
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// }

// function DetailItem({ label, value }) {
//   return (
//     <div>
//       <h3 className="font-semibold text-gray-600 text-sm mb-1">{label}:</h3>
//       <p className="font-medium text-gray-800">{value}</p>
//     </div>
//   );
// }

'use client';

import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile } from '../../../redux/authSlice';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns'; // Import date-fns for consistent date formatting

export default function EquipmentManagerDashboardPage() {
    const dispatch = useDispatch();
    const router = useRouter();

    const { data: userProfile, loading, error } = useSelector((state) => state.auth.userProfile);

    const hasFetched = useRef(false);

    useEffect(() => {
        // Only fetch if userProfile is not loaded, not currently loading, and hasn't been fetched before
        if (!userProfile && !loading && !hasFetched.current) {
            dispatch(fetchUserProfile());
            hasFetched.current = true; // Mark as fetched to prevent redundant calls
        }
    }, [dispatch, userProfile, loading]); // Dependencies for useEffect

    const rawRoleName = userProfile?.roles?.[0]?.name || '';
    const roleToDisplay = rawRoleName.replace('ROLE_', '').replace(/_/g, ' ');

    // Authorization check for Equipment Manager role
    useEffect(() => {
        const expectedRole = 'ROLE_EQUIPMENT_MANAGER';

        if (userProfile) {
            if (rawRoleName !== expectedRole) {
                console.warn(`Unauthorized access attempt to Equipment Manager Dashboard by role: ${rawRoleName}. Redirecting.`);
                router.replace('/dashboard'); // Redirect if not the expected role
            }
        } else if (error && typeof error === 'string' && error.includes('No authentication token found')) {
            router.replace('/login'); // Redirect to login if token is missing
        }
    }, [userProfile, rawRoleName, error, router]); // Dependencies for authorization check

    // --- Loading and Error States ---
    if (loading || !userProfile) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent mb-4"></div>
                    <p className="text-xl font-semibold text-teal-700">Loading Equipment Manager Dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen bg-red-50">
                <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg">
                    <p className="text-xl font-semibold text-red-700">Error: {error}</p>
                    <button
                        onClick={() => router.replace('/dashboard')}
                        className="mt-4 px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200"
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    // Helper function to format profile values
    const formatProfileValue = (key, value) => {
        // Exclude internal state properties or specific complex objects that will be displayed separately
        if (['data', 'loading', 'error', 'managedEquipment', 'managedTeam', 'managedProjects', 'supervisedWorkers', 'supervisedTasks', 'workerAssignments', 'workerAvailabilitySlots'].includes(key)) {
            return null; // Return null to indicate this key should be skipped in general display
        }
        if (value === null || value === undefined || (Array.isArray(value) && value.length === 0) || (typeof value === 'object' && Object.keys(value).length === 0 && !['roles'].includes(key))) {
            return '-'; // Display '-' for empty/null values
        }
        if (key === 'roles' && Array.isArray(value)) {
            // Format role names for display
            return value.map(role => (role && role.name ? role.name.replace('ROLE_', '').replace(/_/g, ' ') : 'Unknown Role')).join(', ');
        }
        if (key === 'skills' && Array.isArray(value)) {
            return value.join(', '); // Join skills with a comma
        }
        if (key === 'certifications' && Array.isArray(value)) {
            return value.join(', '); // Join certifications with a comma
        }
        if (key === 'worksUnder' && Array.isArray(value)) {
            return value.map(person => person.username || person.email || `ID: ${person.id}`).join(', ');
        }
        if (typeof value === 'object') {
            // Handle single nested objects (like siteSupervisor or projectManager fields for the current user's direct reporting lines)
            return value.username || value.email || value.name || `ID: ${value.id || 'Unknown Object'}`;
        }
        // Format dates if they look like date strings
        if (typeof value === 'string' && (value.includes('T') || (value.includes('-') && value.split('-').length === 3))) {
            try {
                const date = new Date(value);
                if (!isNaN(date)) {
                    return format(date, 'MMM dd, yyyy'); // Format as "Jan 01, 2025"
                }
            } catch (e) {
                // Fallback if date parsing fails
            }
        }
        return String(value);
    };

    // Helper component for displaying individual detail items
    function DetailItem({ label, value }) {
        if (value === null) return null; // Don't render if formatProfileValue returned null (for excluded keys)
        return (
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col">
                <h3 className="font-semibold text-gray-600 text-sm mb-1">{label}:</h3>
                <p className="font-medium text-gray-800 break-words">{value}</p>
            </div>
        );
    }

    // Helper component for equipment type badges
    const EquipmentTypeBadge = ({ type }) => {
        let bgColor = 'bg-gray-200';
        let textColor = 'text-gray-800';

        switch (type) {
            case 'HEAVY_MACHINERY':
                bgColor = 'bg-blue-100';
                textColor = 'text-blue-800';
                break;
            case 'POWER_TOOL':
                bgColor = 'bg-yellow-100';
                textColor = 'text-yellow-800';
                break;
            case 'SAFETY_EQUIPMENT':
                bgColor = 'bg-green-100';
                textColor = 'text-green-800';
                break;
            case 'VEHICLE':
                bgColor = 'bg-purple-100';
                textColor = 'text-purple-800';
                break;
            default:
                // Default gray
                break;
        }

        return (
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${bgColor} ${textColor}`}>
                {type?.replace(/_/g, ' ') || 'N/A'}
            </span>
        );
    };

    // Helper component for maintenance due status
    const MaintenanceDueBadge = ({ isDue }) => {
        if (isDue === null || isDue === undefined) {
            return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">Unknown</span>;
        }
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                isDue ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
            }`}>
                {isDue ? 'Due' : 'Not Due'}
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-100 p-6 md:p-10 font-inter">
            <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-2xl p-6 md:p-10 border border-gray-100">
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 tracking-tight leading-tight text-center">
                    Welcome, <span className="text-teal-600">{userProfile.username || roleToDisplay}</span>!
                </h1>
                <p className="text-lg text-gray-700 mb-8 leading-relaxed text-center">
                    This is your dedicated dashboard as an Equipment Manager, showing all your profile details, managed equipment, and your team.
                </p>

                {/* --- Equipment Manager Profile Data (Dynamically rendered) --- */}
                <section className="mb-10 p-6 bg-teal-50 rounded-lg shadow-inner border border-teal-100">
                    <h2 className="text-2xl font-bold text-gray-800 mb-5 border-b-2 border-teal-200 pb-3">Your Complete Profile Overview</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-5 gap-x-6 text-base text-gray-700">
                        {Object.keys(userProfile).map((key) => {
                            const value = formatProfileValue(key, userProfile[key]);
                            if (value === null) return null; // Skip excluded keys

                            const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

                            return <DetailItem key={key} label={label} value={value} />;
                        })}
                    </div>
                </section>

                {/* --- Equipment Manager Specific: Managed Team Table --- */}
                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-5 border-b-2 border-green-200 pb-3">Your Managed Team</h2>
                    {userProfile.managedTeam && userProfile.managedTeam.length > 0 ? (
                        <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-200">
                            <table className="min-w-full bg-white">
                                <thead>
                                    <tr className="bg-gradient-to-r from-gray-50 to-gray-100 text-left text-gray-700 uppercase text-sm leading-normal">
                                        <th className="py-3 px-6 text-left font-bold">ID</th>
                                        <th className="py-3 px-6 text-left font-bold">Username</th>
                                        <th className="py-3 px-6 text-left font-bold">Email</th>
                                        <th className="py-3 px-6 text-left font-bold">Roles</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-700 text-sm font-light divide-y divide-gray-200">
                                    {userProfile.managedTeam.map((member) => (
                                        <tr key={member.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200">
                                            <td className="py-3 px-6 text-left whitespace-nowrap">{member.id}</td>
                                            <td className="py-3 px-6 text-left font-medium text-indigo-700">{member.username}</td>
                                            <td className="py-3 px-6 text-left">{member.email}</td>
                                            <td className="py-3 px-6 text-left">
                                                {member.roles && member.roles.length > 0 ?
                                                    member.roles.map(role => role.replace('ROLE_', '').replace(/_/g, ' ')).join(', ') : '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 text-center">
                            <p className="text-gray-600 text-lg">No team members currently managed.</p>
                            <p className="text-gray-500 text-sm mt-2">Your managed team will appear here.</p>
                        </div>
                    )}
                </section>

                {/* --- Equipment Manager Specific: Managed Equipment Table --- */}
                <section>
                    <h2 className="text-2xl font-bold text-gray-800 mb-5 border-b-2 border-orange-200 pb-3">Managed Equipment</h2>
                    {userProfile.managedEquipment && userProfile.managedEquipment.length > 0 ? (
                        <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-200">
                            <table className="min-w-full bg-white">
                                <thead>
                                    <tr className="bg-gradient-to-r from-gray-50 to-gray-100 text-left text-gray-700 uppercase text-sm leading-normal">
                                        <th className="py-3 px-6 text-left font-bold">ID</th>
                                        <th className="py-3 px-6 text-left font-bold">Name</th>
                                        <th className="py-3 px-6 text-left font-bold">Model</th>
                                        <th className="py-3 px-6 text-left font-bold">Type</th>
                                        <th className="py-3 px-6 text-left font-bold">Status</th>
                                        <th className="py-3 px-6 text-right font-bold">Price</th>
                                        <th className="py-3 px-6 text-left font-bold">Last Maint.</th>
                                        <th className="py-3 px-6 text-left font-bold">Maint. Due</th>
                                        <th className="py-3 px-6 text-left font-bold">Location</th>
                                        <th className="py-3 px-6 text-left font-bold">Notes</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-700 text-sm font-light divide-y divide-gray-200">
                                    {userProfile.managedEquipment.map((equipment) => (
                                        <tr key={equipment.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200">
                                            <td className="py-3 px-6 text-left whitespace-nowrap">{equipment.id}</td>
                                            <td className="py-3 px-6 text-left font-medium text-teal-700">{equipment.name}</td>
                                            <td className="py-3 px-6 text-left">{equipment.model || '-'}</td>
                                            <td className="py-3 px-6 text-left">
                                                <EquipmentTypeBadge type={equipment.type} />
                                            </td>
                                            <td className="py-3 px-6 text-left">
                                                {/* Display currentOperationalStatus if available, else fallback to a default or type */}
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                    equipment.currentOperationalStatus === 'AVAILABLE' ? 'bg-green-100 text-green-800' :
                                                    equipment.currentOperationalStatus === 'IN_USE' ? 'bg-blue-100 text-blue-800' :
                                                    equipment.currentOperationalStatus === 'UNDER_MAINTENANCE' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {equipment.currentOperationalStatus?.replace(/_/g, ' ') || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="py-3 px-6 text-right">₹{equipment.purchasePrice?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '-'}</td>
                                            <td className="py-3 px-6 text-left">
                                                {equipment.lastMaintenanceDate ? format(new Date(equipment.lastMaintenanceDate), 'MMM dd, yyyy') : '-'}
                                            </td>
                                            <td className="py-3 px-6 text-left">
                                                <MaintenanceDueBadge isDue={equipment.maintenanceDue} />
                                            </td>
                                            <td className="py-3 px-6 text-left">{equipment.location || '-'}</td>
                                            <td className="py-3 px-6 text-left">{equipment.notes || '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 text-center">
                            <p className="text-gray-600 text-lg">No equipment currently managed.</p>
                            <p className="text-gray-500 text-sm mt-2">Add new equipment to see it here!</p>
                        </div>
                    )}
                </section>

            </div>
        </div>
    );
}