// src/app/dashboard/projects/view/[projectId]/page.js  for structure view
'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useSelector } from 'react-redux' // Assuming Redux for auth token
import { format, parseISO } from 'date-fns'
import MainTaskList from '@/components/MainTaskList' // Import the new component

export default function ProjectDetailPage() {
  const { projectId } = useParams()
  const { token } = useSelector((state) => state.auth)

  const [projectData, setProjectData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const getPriorityText = (priority) => {
    switch (priority) {
      case 1: return 'Low';
      case 2: return 'Medium';
      case 3: return 'High';
      case 4: return 'Critical';
      default: return 'N/A';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PLANNING': return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'ON_HOLD': return 'bg-gray-100 text-gray-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  useEffect(() => {
    const fetchProjectStructure = async () => {
      if (!token || !projectId) {
        setError("Authentication token or Project ID missing.");
        setLoading(false);
        return;
      }

      try {
        const projectRes = await fetch(`http://localhost:8080/api/pm/projects/${projectId}/structure`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const projectData = await projectRes.json();

        if (projectRes.ok && projectData.success) {
          setProjectData(projectData.data.project); // Only take the 'project' object
        } else {
          setError(projectData.message || 'Failed to fetch project details.');
          console.error('API Error:', projectData.message);
        }
      } catch (err) {
        setError('An error occurred while fetching project details.');
        console.error('Fetch Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectStructure();
  }, [projectId, token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-xl text-gray-600">Loading project details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 p-6">
        <p className="text-xl text-red-600">Error: {error}</p>
      </div>
    );
  }

  if (!projectData) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 p-6">
        <p className="text-xl text-gray-600">Project not found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">Project Details</h1>

      {/* Project Overview Card */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-200">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-3xl font-bold text-gray-900">{projectData.title}</h2>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(projectData.status)}`}>
            {projectData.status.replace(/_/g, ' ')}
          </span>
        </div>
        <p className="text-gray-600 text-lg mb-4">{projectData.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-gray-700">
          <div>
            <p className="font-semibold">Start Date:</p>
            <p>{projectData.startDate ? format(parseISO(projectData.startDate), 'PPP') : 'N/A'}</p>
          </div>
          <div>
            <p className="font-semibold">End Date:</p>
            <p>{projectData.endDate ? format(parseISO(projectData.endDate), 'PPP') : 'N/A'}</p>
          </div>
          <div>
            <p className="font-semibold">Estimated Budget:</p>
            <p>${projectData.estimatedBudget?.toLocaleString() || 'N/A'}</p>
          </div>
          <div>
            <p className="font-semibold">Location:</p>
            <p>{projectData.location || 'N/A'}</p>
          </div>
          <div>
            <p className="font-semibold">Priority:</p>
            <p>{getPriorityText(projectData.priority)}</p>
          </div>
          <div>
            <p className="font-semibold">Completion:</p>
            <p>{projectData.completionPercentage?.toFixed(2)}%</p>
          </div>
          {projectData.projectManager && (
            <div>
              <p className="font-semibold">Project Manager:</p>
              <p>{projectData.projectManager.username}</p>
            </div>
          )}
          {projectData.siteSupervisor && (
            <div>
              <p className="font-semibold">Site Supervisor:</p>
              <p>{projectData.siteSupervisor.username}</p>
            </div>
          )}
          {projectData.equipmentManager && (
            <div>
              <p className="font-semibold">Equipment Manager:</p>
              <p>{projectData.equipmentManager.username}</p>
            </div>
          )}
          {projectData.overdue && (
            <div className="col-span-full">
              <p className="text-red-600 font-semibold">Status: Overdue!</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Tasks Section - Pass the entire projectData */}
      <MainTaskList project={projectData} />
    </div>
  );
}