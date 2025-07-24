'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';

export default function AssignedProjectDetailsPage() {
  const { projectId } = useParams();
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjectStructure = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');

        const response = await axios.get(
          `http://localhost:8080/api/pm/projects/${projectId}/structure`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'X-Refresh-Token': refreshToken,
            },
          }
        );

        setProjectData(response.data.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load project structure.');
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchProjectStructure();
    }
  }, [projectId]);

  if (loading) return <div className="p-4">Loading project details...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-6 space-y-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold text-indigo-600">
        Project: {projectData?.project?.projectName || 'Unnamed'}
      </h1>

      <div className="space-y-4">
        <p><strong>Location:</strong> {projectData?.project?.location}</p>
        <p><strong>Description:</strong> {projectData?.project?.description}</p>
        <p><strong>Start Date:</strong> {projectData?.project?.startDate}</p>
        <p><strong>End Date:</strong> {projectData?.project?.endDate}</p>
      </div>

      <div>
        <h2 className="text-xl font-semibold mt-6 mb-2 text-gray-700">Main Tasks</h2>
        {projectData?.mainTasks?.length > 0 ? (
          <ul className="space-y-2">
            {projectData.mainTasks.map((task) => (
              <li key={task.id} className="border p-4 rounded shadow-sm">
                <p><strong>Task Name:</strong> {task.taskName}</p>
                <p><strong>Status:</strong> {task.status}</p>
                <p><strong>Planned Start:</strong> {task.plannedStartDate}</p>
                <p><strong>Planned End:</strong> {task.plannedEndDate}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No main tasks found for this project.</p>
        )}
      </div>
    </div>
  );
}
