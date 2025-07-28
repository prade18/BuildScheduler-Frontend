// export default function DashboardPage() {
//   return (
//     <div>
//       <h1 className="text-2xl font-bold">Welcome to your Dashboard</h1>
//       <p>This area will show your role-based content.</p>
//     </div>
//   )
// }


// src/app/dashboard/page.js
'use client';

import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile } from '../../redux/authSlice'; // Changed from '@/redux/authSlice' to relative path
import { useRouter } from 'next/navigation';

export default function DashboardRedirectPage() {
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

  useEffect(() => {
    if (userProfile) {
      const roleName = userProfile.roles?.[0]?.name;

      switch (roleName) {
        case 'ROLE_EQUIPMENT_MANAGER':
          router.replace('/dashboard/equipment-manager');
          break;
        case 'ROLE_SITE_SUPERVISOR':
          router.replace('/dashboard/site-supervisor');
          break;
        case 'ROLE_PROJECT_MANAGER':
          router.replace('/dashboard/project-manager');
          break;
        case 'ROLE_WORKER':
          router.replace('/dashboard/worker');
          break;
        default:
          console.warn('Unknown user role or no specific dashboard defined for this role:', roleName);
          router.replace('/dashboard/general');
          break;
      }
    } else if (error && typeof error === 'string' && error.includes('No authentication token found')) {
      router.replace('/login');
    }
  }, [userProfile, error, router]);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <p className="text-xl font-semibold text-indigo-600 animate-pulse">Redirecting to your dashboard...</p>
    </div>
  );
}