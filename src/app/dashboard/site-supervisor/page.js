// src/app/dashboard/site-supervisor/page.js
'use client';

import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile } from '../../../redux/authSlice'; // Adjust path if your authSlice location changes
import { useRouter } from 'next/navigation';

export default function SiteSupervisorDashboardPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  // Select user profile data, loading state, and error from Redux store
  const { data: userProfile, loading, error } = useSelector((state) => state.auth.userProfile);

  // Use a ref to prevent multiple dispatches of fetchUserProfile on component re-renders
  const hasFetched = useRef(false);

  useEffect(() => {
    // If userProfile is not yet loaded, not currently loading, and hasn't been fetched before
    if (!userProfile && !loading && !hasFetched.current) {
      dispatch(fetchUserProfile()); // Dispatch the async thunk to fetch user profile
      hasFetched.current = true; // Mark as fetched to prevent re-fetching
    }
  }, [dispatch, userProfile, loading]); // Dependencies for useEffect

  // Extract raw role name and format it for display
  const rawRoleName = userProfile?.roles?.[0]?.name || '';
  const roleToDisplay = rawRoleName.replace('ROLE_', '').replace(/_/g, ' ');

  // Authorization and Redirection Logic
  useEffect(() => {
    const expectedRole = 'ROLE_SITE_SUPERVISOR'; // The specific role this dashboard is for

    // If user profile is loaded and their role doesn't match the expected role for this page
    if (userProfile && rawRoleName !== expectedRole) {
      console.warn(`Unauthorized access attempt to Site Supervisor Dashboard by role: ${rawRoleName}. Redirecting.`);
      router.replace('/dashboard'); // Redirect to the main dashboard for correct routing
    } else if (error && typeof error === 'string' && error.includes('No authentication token found')) {
      // If there's an authentication error (e.g., no token), redirect to login
      router.replace('/login');
    }
  }, [userProfile, rawRoleName, error, router]); // Dependencies for useEffect

  // --- Loading State UI ---
  if (loading || !userProfile) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-xl font-semibold text-indigo-600 animate-pulse">Loading Site Supervisor Dashboard...</p>
      </div>
    );
  }

  // --- Error State UI ---
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-red-100">
        <p className="text-xl font-semibold text-red-700">Error: {error}</p>
      </div>
    );
  }

  // Helper function to format various types of profile values for display
  const formatProfileValue = (key, value) => {
    // Handle null, undefined, empty arrays, or empty objects (unless it's the 'roles' key)
    if (value === null || value === undefined || (Array.isArray(value) && value.length === 0) || (typeof value === 'object' && Object.keys(value).length === 0 && !['roles'].includes(key))) {
      return '-'; // Display a dash for empty/null values
    }
    // Format 'roles' array into a readable string
    if (key === 'roles' && Array.isArray(value)) {
      return value.map(role => (role && role.name ? role.name.replace('ROLE_', '').replace(/_/g, ' ') : 'Unknown Role')).join(', ');
    }
    // Format arrays of objects (e.g., managedTeam, supervisedWorkers) into a comma-separated list of usernames/names/titles
    if (Array.isArray(value)) {
      return value.map(item => {
          if (item && typeof item === 'object') {
            return item.username || item.name || item.title || `ID: ${item.id || 'Unknown'}`;
          }
          return String(item);
        }).join(', ');
    }
    // Format simple objects (e.g., siteSupervisor, projectManager fields which might be single user objects)
    if (typeof value === 'object') {
      return value.username || value.email || value.name || `ID: ${value.id || 'Unknown Object'}`;
    }
    // Default for primitive values (strings, numbers, booleans)
    return String(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-6 md:p-10">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl p-6 md:p-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 tracking-tight leading-tight">
          Welcome, {userProfile.username || roleToDisplay}!
        </h1>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          This is your dedicated dashboard for Site Supervision, showing all your profile details.
        </p>

        {/* --- Dynamic Display of All Profile Data --- */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Your Complete Profile Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-base text-gray-700">
            {/* Iterate over all keys in the userProfile object */}
            {Object.keys(userProfile).map((key) => {
              // Exclude internal Redux state properties that shouldn't be displayed as profile data
              if (['data', 'loading', 'error'].includes(key)) {
                return null;
              }

              // Format the key for a user-friendly label (e.g., "profileStatus" -> "Profile Status")
              const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
              // Get the formatted value using the helper function
              const value = formatProfileValue(key, userProfile[key]);

              // Render each detail item
              return <DetailItem key={key} label={label} value={value} />;
            })}
          </div>
        </section>

      </div>
    </div>
  );
}

// Helper component for displaying individual detail items (reused across dashboards)
function DetailItem({ label, value }) {
  return (
    <div>
      <h3 className="font-semibold text-gray-600 text-sm mb-1">{label}:</h3>
      <p className="font-medium text-gray-800">{value}</p>
    </div>
  );
}