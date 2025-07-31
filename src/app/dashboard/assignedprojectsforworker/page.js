'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { format, parseISO } from 'date-fns';
import { FaSpinner, FaExclamationCircle, FaBuilding, FaEye } from 'react-icons/fa';

export default function AssignedProjectsForWorkerPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token'); // Get token from localStorage
        if (!token) {
          router.push('/login'); // Redirect to login if no token
          return;
        }

        const res = await fetch('http://localhost:8080/api/worker/profile/projects', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok && data.success) {
          setProjects(data.data);
        } else {
          setError(data.message || 'Failed to fetch projects.');
          console.error('API Error:', data.message);
        }
      } catch (err) {
        setError('An error occurred while fetching projects.');
        console.error('Fetch Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [router]);

  // Helper function to get status badge styling
  const getStatusBadge = (status) => {
    let bgColor = 'bg-gray-100';
    let textColor = 'text-gray-800';
    switch (status) {
      case 'PLANNING':
        bgColor = 'bg-blue-100';
        textColor = 'text-blue-800';
        break;
      case 'IN_PROGRESS':
        bgColor = 'bg-yellow-100';
        textColor = 'text-yellow-800';
        break;
      case 'COMPLETED':
        bgColor = 'bg-green-100';
        textColor = 'text-green-800';
        break;
      case 'ON_HOLD':
        bgColor = 'bg-purple-100';
        textColor = 'text-purple-800';
        break;
      case 'CANCELLED':
        bgColor = 'bg-red-100';
        textColor = 'text-red-800';
        break;
      case 'DELAYED':
        bgColor = 'bg-orange-100';
        textColor = 'text-orange-800';
        break;
      default:
        break;
    }
    return (
      <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${bgColor} ${textColor}`}>
        {status.replace(/_/g, ' ')}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
        <FaSpinner className="animate-spin text-5xl text-indigo-600" />
        <p className="mt-4 text-2xl font-semibold text-indigo-600">Loading your projects...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 p-6">
        <div className="bg-white p-8 rounded-xl shadow-md text-center">
          <FaExclamationCircle className="text-red-500 text-4xl mb-4" />
          <p className="text-xl text-red-500 font-semibold mb-4">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight text-center mb-8">
          <FaBuilding className="inline-block mr-3 text-indigo-600" />
          Your Assigned Projects
        </h1>

        {projects.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl shadow-xl text-center border border-gray-200">
            <p className="text-xl text-gray-600">You are not currently assigned to any projects.</p>
            <p className="text-gray-500 mt-2">Check back later or contact your Project Manager.</p>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Project Title
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dates
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Completion
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">View</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {projects.map((project) => (
                    <tr key={project.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {project.title}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {project.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(project.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {project.startDate ? format(parseISO(project.startDate), 'MMM d, yyyy') : 'N/A'} -{' '}
                        {project.endDate ? format(parseISO(project.endDate), 'MMM d, yyyy') : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {project.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {project.priority}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="w-24 bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{ width: `${project.completionPercentage}%` }}
                          ></div>
                        </div>
                        <span className="text-xs ml-2">{project.completionPercentage.toFixed(1)}%</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => router.push(`/dashboard/assignedprojectsforworker/${project.id}`)}
                          className="text-indigo-600 hover:text-indigo-900 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm bg-indigo-50 hover:bg-indigo-100 transition-colors"
                        >
                          <FaEye className="mr-1" /> View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}