'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function AssignedProjectsPage() {
  const router = useRouter();
  const [assignedProjects, setAssignedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProjects = async (accessToken) => {
    return axios.get('http://localhost:8080/api/site-supervisor/projects', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  };

  const refreshAccessToken = async (refreshToken) => {
    const response = await axios.post('http://localhost:8080/api/auth/refresh-token', {
      refreshToken: refreshToken,
    });
    return response.data.data.accessToken;
  };

  useEffect(() => {
    const loadProjects = async () => {
      try {
        let accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');

        try {
          const response = await fetchProjects(accessToken);
          setAssignedProjects(response.data.data || []);
        } catch (err) {
          if (err.response && err.response.status === 401 && refreshToken) {
            // Access token expired, try to refresh
            try {
              const newAccessToken = await refreshAccessToken(refreshToken);
              localStorage.setItem('accessToken', newAccessToken);

              const retryResponse = await fetchProjects(newAccessToken);
              setAssignedProjects(retryResponse.data.data || []);
            } catch (refreshErr) {
              console.error('Token refresh failed:', refreshErr);
              setError('Session expired. Please login again.');
              router.push('/login');
            }
          } else {
            throw err;
          }
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load assigned projects.');
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, [router]);

  const handleViewDetails = (projectId) => {
    router.push(`/dashboard/assigned-projects/${projectId}`);
  };

  if (loading) return <div className="p-4">Loading assigned projects...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold text-indigo-600 mb-4">Assigned Projects</h1>

      {assignedProjects.length === 0 ? (
        <p className="text-gray-500">No assigned projects found.</p>
      ) : (
        <ul className="space-y-4">
          {assignedProjects.map((project) => (
            <li key={project.id} className="border p-4 rounded shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <p><strong>Name:</strong> {project.projectName}</p>
                  <p><strong>Location:</strong> {project.location}</p>
                </div>
                <button
                  className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
                  onClick={() => handleViewDetails(project.id)}
                >
                  View Details
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
