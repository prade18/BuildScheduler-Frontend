// src/app/dashboard/equipment-manager/page.js
'use client';

import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// Changed from '@/redux/authSlice' to relative path
import { fetchUserProfile } from '../../../redux/authSlice';
import { useRouter } from 'next/navigation';

export default function EquipmentManagerDashboardPage() {
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

  useEffect(() => {
    if (userProfile && rawRoleName !== 'ROLE_EQUIPMENT_MANAGER') {
      console.warn(`Unauthorized access attempt to Equipment Manager Dashboard by role: ${rawRoleName}. Redirecting.`);
      router.replace('/dashboard');
    } else if (error && typeof error === 'string' && error.includes('No authentication token found')) {
      router.replace('/login');
    }
  }, [userProfile, rawRoleName, error, router]);

  if (loading || !userProfile) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-xl font-semibold text-indigo-600 animate-pulse">Loading Equipment Manager Dashboard...</p>
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

  const formatProfileValue = (key, value) => {
    if (value === null || value === undefined || (Array.isArray(value) && value.length === 0) || (typeof value === 'object' && Object.keys(value).length === 0 && !['roles'].includes(key))) {
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

  const allProfileKeysForDynamicDisplay = [
    'id', 'username', 'email', 'phone', 'roles', 'skills', 'certifications', 'profileStatus',
    'address',
    'siteSupervisor', 'projectManager', 'worksUnder', 'managedTeam', 'managedProjects',
    'supervisedWorkers', 'supervisedTasks', 'managedEquipment', 'workerAssignments',
    'workerAvailabilitySlots'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-6 md:p-10">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl p-6 md:p-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 tracking-tight leading-tight">
          Welcome, {userProfile.username || roleToDisplay}!
        </h1>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          This is your dedicated dashboard for Equipment Management, showing all your profile details.
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Your Complete Profile Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-base text-gray-700">
            {allProfileKeysForDynamicDisplay.map((key) => {
              if (!Object.prototype.hasOwnProperty.call(userProfile, key)) {
                return null;
              }
              const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
              const value = formatProfileValue(key, userProfile[key]);
              return <DetailItem key={key} label={label} value={value} />;
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

function DetailItem({ label, value }) {
  return (
    <div>
      <h3 className="font-semibold text-gray-600 text-sm mb-1">{label}:</h3>
      <p className="font-medium text-gray-800">{value}</p>
    </div>
  );
}