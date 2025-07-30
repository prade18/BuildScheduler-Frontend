'use client'; // This is crucial for using hooks like useState, useEffect, useRouter

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation'; // Import useRouter for client-side navigation

// Define the React component function
const EquipmentAssignedProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter(); // Initialize the router hook

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true); // Set loading to true before fetching
        setError(null);   // Clear previous errors

        const accessToken = localStorage.getItem('accessToken');
        const token = localStorage.getItem('token');

        // Optional: Redirect to login if no token is found
        if (!accessToken && !token) {
          router.push('/login'); // Assuming you have a /login route
          return;
        }

        const response = await axios.get('http://localhost:8080/api/equipment-manager/projects', {
          headers: {
            Authorization: `Bearer ${accessToken || token}`,
          },
        });

        if (response.data.success) {
          setProjects(response.data.data);
        } else {
          setError(response.data.message || 'Failed to fetch projects.');
        }
      } catch (err) {
        console.error('Error fetching equipment manager projects:', err);
        setError('Error fetching projects. Please try again.');
      } finally {
        setLoading(false); // Set loading to false after fetching (success or error)
      }
    };

    fetchProjects();
  }, [router]); // Add router to dependency array as it's used inside useEffect

  // Function to handle row click
  const handleRowClick = (projectId) => {
    // Navigate to the dynamic route: /dashboard/equipment-assigned-projects/[projectId]
    // For example, if projectId is 123, it will go to /dashboard/equipment-assigned-projects/123
    router.push(`/dashboard/equipment-assigned-projects/${projectId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-xl font-semibold text-indigo-600 animate-pulse">
          Loading assigned projects...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-xl font-semibold text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Assigned Projects</h1>

      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-100">
            <tr className="text-left text-gray-600 text-sm uppercase tracking-wider">
              <th className="py-3 px-6 font-semibold">Project Title</th>
              <th className="py-3 px-6 font-semibold">Status</th>
              <th className="py-3 px-6 font-semibold">Priority</th>
              <th className="py-3 px-6 font-semibold">Manager</th>
              <th className="py-3 px-6 font-semibold">Planned Dates</th>
              <th className="py-3 px-6 font-semibold">Completion</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm divide-y divide-gray-200">
            {projects.map((project) => (
              <tr
                key={project.id}
                className="transition-colors duration-200 hover:bg-indigo-50 cursor-pointer"
                onClick={() => handleRowClick(project.id)} // Attach the click handler here
              >
                <td className="py-4 px-6">
                  <div className="font-semibold text-base text-gray-800">{project.title}</div>
                  <div className="text-gray-500 text-xs">{project.description}</div>
                </td>
                <td className="py-4 px-6">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      project.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                      project.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-800' :
                      project.status === 'PLANNING' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {project.status.replace(/_/g, ' ')}
                  </span>
                </td>
                <td className="py-4 px-6">{project.priority}</td>
                <td className="py-4 px-6">{project.projectManagerName || 'N/A'}</td>
                <td className="py-4 px-6 text-xs">
                  {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'N/A'} to <br />
                  {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'N/A'}
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-purple-700">
                      {Math.round(project.completionPercentage || 0)}%
                    </span>
                    <div className="w-28 bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-purple-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${project.completionPercentage || 0}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500 text-base">
                  No assigned projects found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Crucial: Export the component as the default export
export default EquipmentAssignedProjectsPage;