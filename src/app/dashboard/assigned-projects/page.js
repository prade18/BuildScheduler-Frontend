'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AssignedProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8080/api/site-supervisor/projects', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }

        const data = await response.json();
        setProjects(data.data || []);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleViewDetails = (projectId) => {
    router.push(`/dashboard/project-details/${projectId}`);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString('en-IN');
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">Assigned Projects</h1>

      {loading ? (
        <p className="text-gray-500">Loading projects...</p>
      ) : Array.isArray(projects) && projects.length > 0 ? (
        projects.map((project) => (
          <div
            key={project.id}
            className="bg-white shadow-md rounded-xl p-6 mb-4 flex flex-col md:flex-row justify-between md:items-center hover:shadow-lg transition-shadow"
          >
            <div className="space-y-2 text-sm text-gray-700">
              <p><strong>Project Name:</strong> {project.projectName || project.name || 'Unnamed Project'}</p>
              <p><strong>Location:</strong> {project.location || 'N/A'}</p>
              <p><strong>Start Date:</strong> {formatDate(project.startDate)}</p>
              <p><strong>End Date:</strong> {formatDate(project.endDate)}</p>
            </div>
            <div className="mt-4 md:mt-0">
              <button
                onClick={() => handleViewDetails(project.id)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                View Details
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No assigned projects found.</p>
      )}
    </div>
  );
}
