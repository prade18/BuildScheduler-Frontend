// src/app/dashboard/project-manager/page.js
'use client';

import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile } from '../../../redux/authSlice';
import { useRouter } from 'next/navigation';

export default function ProjectManagerDashboardPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { data: userProfile, loading, error } = useSelector((state) => state.auth.userProfile);

  const hasFetched = useRef(false);

  useEffect(() => {
    if (!userProfile && !loading && !hasFetched.current) {
      dispatch(fetchUserProfile());
      hasFetched.current = true;
    }
  }, [dispatch, userProfile, loading]);

  const rawRoleName = userProfile?.roles?.[0]?.name || '';
  const roleToDisplay = rawRoleName.replace('ROLE_', '').replace(/_/g, ' ');

  // Authorization check for Project Manager role
  useEffect(() => {
    const expectedRole = 'ROLE_PROJECT_MANAGER';

    if (userProfile && rawRoleName !== expectedRole) {
      console.warn(`Unauthorized access attempt to Project Manager Dashboard by role: ${rawRoleName}. Redirecting.`);
      router.replace('/dashboard');
    } else if (error && typeof error === 'string' && error.includes('No authentication token found')) {
      router.replace('/login');
    }
  }, [userProfile, rawRoleName, error, router]);

  // --- Loading and Error States ---
  if (loading || !userProfile) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-xl font-semibold text-indigo-600 animate-pulse">Loading Project Manager Dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-red-100">
        <p className="text-xl font-semibold text-red-700">Error: {error}</p>
      </div>
    );
  }

  // Helper function to format profile values (reused)
  const formatProfileValue = (key, value) => {
    // Exclude 'data', 'loading', 'error' which are internal state properties if they somehow appear in userProfile
    // Also exclude 'managedProjects' from this general formatter as it has its own structured display
    if (value === null || value === undefined || (Array.isArray(value) && value.length === 0) || (typeof value === 'object' && Object.keys(value).length === 0 && !['roles', 'managedProjects'].includes(key))) {
      return '-';
    }
    if (key === 'roles' && Array.isArray(value)) {
      return value.map(role => (role && role.name ? role.name.replace('ROLE_', '').replace(/_/g, ' ') : 'Unknown Role')).join(', ');
    }
    if (Array.isArray(value)) {
      return value.map(item => {
          if (item && typeof item === 'object') {
            return item.username || item.name || item.title || `ID: ${item.id || 'Unknown'}`;
          }
          return String(item);
        }).join(', ');
    }
    if (typeof value === 'object') {
      return value.username || value.email || value.name || `ID: ${value.id || 'Unknown Object'}`;
    }
    return String(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-6 md:p-10">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl p-6 md:p-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 tracking-tight leading-tight">
          Welcome, {userProfile.username || roleToDisplay}!
        </h1>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          This is your dedicated dashboard for Project Management, showing all your profile details.
        </p>

        {/* --- All Project Manager Profile Data (Dynamically rendered from all JSON keys except managedProjects) --- */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Your Complete Profile Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-base text-gray-700">
            {Object.keys(userProfile).map((key) => {
              if (['data', 'loading', 'error', 'managedProjects'].includes(key)) { // Exclude 'managedProjects' here to display it separately
                return null;
              }

              const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
              const value = formatProfileValue(key, userProfile[key]);

              return <DetailItem key={key} label={label} value={value} />;
            })}
          </div>
        </section>

        {/* --- Project Manager Specific: Managed Projects Table --- */}
        <section className="mb-8">
          <h3 className="font-semibold text-gray-600 text-lg mt-6 mb-3">Managed Projects:</h3>
          {userProfile.managedProjects && userProfile.managedProjects.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
                <thead>
                  <tr className="bg-gray-100 text-left text-gray-600 uppercase text-sm leading-normal">
                    <th className="py-3 px-6 text-left">Title</th>
                    <th className="py-3 px-6 text-left">Status</th>
                    <th className="py-3 px-6 text-left">Start Date</th>
                    <th className="py-3 px-6 text-left">End Date</th>
                    <th className="py-3 px-6 text-left">Location</th>
                    <th className="py-3 px-6 text-left">Budget (Est.)</th>
                    <th className="py-3 px-6 text-left">Completion %</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 text-sm font-light">
                  {userProfile.managedProjects.map((project) => (
                    <tr key={project.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-6 text-left whitespace-nowrap">{project.title}</td>
                      <td className="py-3 px-6 text-left">{project.status}</td>
                      <td className="py-3 px-6 text-left">{project.startDate}</td>
                      <td className="py-3 px-6 text-left">{project.endDate}</td>
                      <td className="py-3 px-6 text-left">{project.location}</td>
                      <td className="py-3 px-6 text-left">{project.estimatedBudget?.toFixed(2) || '-'}</td>
                      <td className="py-3 px-6 text-left">{project.completionPercentage?.toFixed(0) || 0}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No projects currently managed.</p>
          )}
        </section>

      </div>
    </div>
  );
}

// Helper component for displaying individual detail items (reused)
function DetailItem({ label, value }) {
  return (
    <div>
      <h3 className="font-semibold text-gray-600 text-sm mb-1">{label}:</h3>
      <p className="font-medium text-gray-800">{value}</p>
    </div>
  );
}