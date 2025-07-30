'use client'; // This is a Client Component as it uses useState, useEffect, useParams, useRouter

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';

export default function AssignedProjectDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.projectId; // This captures the [projectId] from the URL, e.g., '1'
  const [project, setProject] = useState(null);
  const [mainTasks, setMainTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', content: '' });

  useEffect(() => {
    // Ensure projectId is available from the URL parameters
    if (!projectId) {
        setLoading(false);
        setMessage({ type: 'error', content: 'Project ID not found in URL.' });
        return;
    }

    const fetchProjectData = async () => {
      try {
        setLoading(true); // Start loading indicator
        setMessage({ type: '', content: '' }); // Clear any previous messages

        const accessToken = localStorage.getItem('accessToken');
        const token = localStorage.getItem('token');

        if (!accessToken && !token) {
          router.push('/login'); // Redirect to login if no token is found
          return;
        }
        
        const response = await axios.get(`http://localhost:8080/api/pm/projects/${projectId}/structure`, {
          headers: { Authorization: `Bearer ${accessToken || token}` }
        });

        if (response.data.success) {
          const { project, mainTasks } = response.data.data;
          setProject(project);
          setMainTasks(mainTasks);
        } else {
          throw new Error(response.data.message || 'Failed to fetch project details.');
        }

      } catch (error) {
        console.error("Fetch error in AssignedProjectDetailsPage:", error);
        setMessage({ type: 'error', content: error.message || 'An unexpected error occurred while loading project.' });
      } finally {
        setLoading(false); // End loading indicator regardless of success or failure
      }
    };

    fetchProjectData();
  }, [projectId, router]);

  // Function to redirect to the subtasks page for a specific main task
  const handleSubtaskRedirect = (mainTaskId) => {
    // Constructs the URL for the nested subtasks route based on the current project and main task
    // e.g., /dashboard/equipment-assigned-projects/1/main-tasks/5/subtasks
    router.push(`/dashboard/equipment-assigned-projects/${projectId}/main-tasks/${mainTaskId}/subtasks`);
  };

  // --- Loading and Error States ---
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-xl font-semibold text-indigo-600 animate-pulse">Loading project details...</p>
      </div>
    );
  }

  // If loading is false and no project data is found (e.g., failed fetch, 404)
  if (!project) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-xl font-semibold text-red-500">
          Project not found or an error occurred. {message.content && `(${message.content})`}
        </p>
      </div>
    );
  }

  // --- Main Component Render ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-6 md:p-10">
      {/* Message/Notification Display */}
      {message.content && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg text-sm transition-opacity duration-300 ${
          message.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        } flex items-center justify-between animate-fade-in-down`}>
          <span>{message.content}</span>
          <button onClick={() => setMessage({ type: '', content: '' })} className="ml-4 text-white hover:text-gray-200 font-bold text-lg leading-none">&times;</button>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Project Overview Section */}
        <div className="bg-white rounded-xl shadow-2xl p-6 md:p-10 transform hover:scale-[1.005] transition-transform duration-300 ease-in-out border border-gray-200">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight leading-tight">
            {project.title}
          </h1>
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            {project.description}
          </p>

          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">Project Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6 text-base text-gray-700">
              <DetailItem label="Project ID" value={project.id} />
              <DetailItem label="Status" value={
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      project.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                      project.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-800' :
                      project.status === 'PLANNING' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                  }`}>
                    {project.status.replace(/_/g, ' ')}
                  </span>
              } />
              <DetailItem label="Priority" value={project.priority} />
              <DetailItem label="Project Manager" value={project.projectManager?.username || '-'} />
              <DetailItem label="Site Supervisor" value={project.siteSupervisor?.username || '-'} />
              <DetailItem label="Equipment Manager" value={project.equipmentManager?.username || '-'} />
              <DetailItem label="Planned Start" value={project.startDate ? new Date(project.startDate).toLocaleDateString() : '-'} />
              <DetailItem label="Planned End" value={project.endDate ? new Date(project.endDate).toLocaleDateString() : '-'} />
              <DetailItem label="Estimated Budget" value={project.estimatedBudget != null ? `₹${project.estimatedBudget.toLocaleString('en-IN')}` : '-'} />
              <DetailItem label="Actual Budget" value={project.actualBudget != null ? `₹${project.actualBudget.toLocaleString('en-IN')}` : '-'} />
              <DetailItem label="Location" value={project.location || '-'} />
              <DetailItem label="Overdue" value={
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    project.overdue ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                }`}>
                  {project.overdue ? 'Yes' : 'No'}
                </span>
              } />
              <div className="sm:col-span-2 lg:col-span-3">
                <h3 className="font-semibold text-gray-600 mb-2">Project Completion:</h3>
                <div className="w-48 bg-gray-200 rounded-full h-4 relative">
                    <div
                        className="bg-indigo-500 h-4 rounded-full flex items-center justify-end pr-2 text-white text-xs font-bold transition-all duration-500 ease-out"
                        style={{ width: `${project.completionPercentage || 0}%` }}
                    >
                        {project.completionPercentage > 0.0 ? `${Math.round(project.completionPercentage)}%` : ''}
                    </div>
                    {project.completionPercentage === 0.0 && (
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-sm text-gray-600 font-medium">0%</span>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Tasks Section */}
        <div className="bg-white rounded-xl shadow-2xl p-6 md:p-10 border border-gray-200">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">Main Tasks</h2>
          {mainTasks.length === 0 ? (
              <p className="text-gray-600 italic text-lg text-center py-8">No main tasks have been defined for this project yet.</p>
          ) : (
              <div className="grid grid-cols-1 gap-6">
                  {mainTasks.map(task => (
                      <div
                        key={task.id}
                        className="bg-white border border-gray-200 rounded-xl shadow-lg p-6 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 ease-in-out"
                      >
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex-grow">
                                <h3 className="text-xl font-bold text-gray-900 leading-tight">
                                    {task.title}
                                </h3>
                                <p className="text-gray-700 text-sm mt-1 leading-relaxed">
                                    {task.description}
                                </p>
                            </div>
                            <div className="flex space-x-2 ml-4 flex-shrink-0">
                                <button
                                    onClick={() => handleSubtaskRedirect(task.id)}
                                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-1 px-2 rounded-md transition-colors duration-200 flex items-center text-xs"
                                    aria-label={`View subtasks for ${task.title}`}
                                    title="View/Manage Subtasks"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M8.586 2.586A2 2 0 0110 2h4a2 2 0 012 2v4a2 2 0 01-.586 1.414l-8 8A2 2 0 015 18a2 2 0 01-1.414-.586l-4-4A2 2 0 010 12V8a2 2 0 01.586-1.414l8-8zM14 7a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                    </svg>
                                    Subtasks
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-2 gap-x-6 text-sm text-gray-700 mt-4">
                            <DetailItem label="Status" value={
                                <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                                    task.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                    task.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-800' :
                                    task.status === 'PLANNING' ? 'bg-blue-100 text-blue-800' :
                                    task.status === 'PLANNED' ? 'bg-gray-100 text-gray-800' :
                                    'bg-gray-100 text-gray-800'
                                }`}>
                                    {task.status.replace(/_/g, ' ')}
                                </span>
                            } isBadge={true} />
                            <DetailItem label="Supervisor" value={task.supervisorName || '-'} />
                            <DetailItem label="Equipment Manager" value={task.equipmentManagerName || '-'} />
                            <DetailItem label="Est. Hours" value={`${task.estimatedHours}h`} />
                            <DetailItem label="Planned Start" value={task.plannedStartDate ? new Date(task.plannedStartDate).toLocaleDateString() : '-'} />
                            <DetailItem label="Planned End" value={task.plannedEndDate ? new Date(task.plannedEndDate).toLocaleDateString() : '-'} />
                            <DetailItem label="Overdue" value={
                                <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                                    task.overdue ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                }`}>
                                    {task.overdue ? 'Yes' : 'No'}
                                </span>
                            } isBadge={true} />
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <h4 className="font-semibold text-gray-600 mb-2 text-sm">Task Completion:</h4>
                            <div className="w-full bg-gray-200 rounded-full h-3 relative">
                                <div
                                    className="bg-indigo-500 h-3 rounded-full flex items-center justify-end pr-1 text-white text-xs font-bold transition-all duration-500 ease-out"
                                    style={{ width: `${task.completionPercentage || 0}%` }}
                                >
                                    {task.completionPercentage > 0 ? `${Math.round(task.completionPercentage)}%` : ''}
                                </div>
                                {task.completionPercentage === 0 && (
                                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-600 font-medium">0%</span>
                                )}
                            </div>
                        </div>
                      </div>
                  ))}
              </div>
          )}
          {/* Pagination is no longer needed since all main tasks are returned at once */}
        </div>
      </div>
    </div>
  );
}

const DetailItem = ({ label, value, isBadge = false }) => (
  <div className="flex items-center">
    <h3 className="font-semibold text-gray-600 text-sm mr-1">{label}:</h3>
    {isBadge ? value : <p className="text-gray-800 text-sm">{value}</p>}
  </div>
);