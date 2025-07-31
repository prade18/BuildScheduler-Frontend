'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { format } from 'date-fns';
import { FaSpinner, FaExclamationCircle, FaArrowLeft, FaTasks, FaEye } from 'react-icons/fa';

// Reusable DetailItem Component for consistent display
const DetailItem = ({ label, value, isBadge = false }) => (
  <div className="flex items-center">
    <h3 className="font-semibold text-gray-600 text-sm mr-1">{label}:</h3>
    {isBadge ? value : <p className="text-gray-800 text-sm">{value}</p>}
  </div>
);

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

export default function AssignedProjectDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const projectID = params.projectID;

  const [project, setProject] = useState(null);
  const [mainTasks, setMainTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', content: '' });

  useEffect(() => {
    if (projectID) {
      const fetchProjectData = async () => {
        setLoading(true);
        setMessage({ type: '', content: '' });

        try {
          const token = localStorage.getItem('token');
          if (!token) {
            router.push('/login');
            return;
          }

          const response = await axios.get(`http://localhost:8080/api/pm/projects/${projectID}/structure`, {
            headers: { Authorization: `Bearer ${token}` }
          });

          if (response.data.success) {
            const { project, mainTasks } = response.data.data;
            setProject(project);
            setMainTasks(mainTasks);
          } else {
            console.error("API Response Error:", response.data);
            throw new Error(response.data.message || 'Failed to fetch project details.');
          }
        } catch (error) {
          console.error("Fetch error in AssignedProjectDetailsPage:", error);
          setMessage({
            type: 'error',
            content: `Failed to load project details: ${error.response?.data?.message || error.message || 'Network error'}.`
          });
        } finally {
          setLoading(false);
        }
      };

      fetchProjectData();
    } else {
      setLoading(false);
      setMessage({ type: 'error', content: 'Project ID not found in URL. Please navigate from your projects list.' });
    }
  }, [projectID, router]);

  // UPDATED: This function now points to the new subtasks page
  const handleSubtaskRedirect = (mainTaskId) => {
    router.push(`/dashboard/assignedprojectsforworker/${projectID}/main-tasks/${mainTaskId}/subtasks`);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 p-6">
        <FaSpinner className="animate-spin text-5xl text-indigo-600" />
        <p className="mt-4 text-2xl font-semibold text-indigo-600">Loading project details...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 p-6">
        <div className="bg-white p-8 rounded-xl shadow-md text-center">
          <FaExclamationCircle className="text-red-500 text-4xl mb-4" />
          <p className="text-xl text-red-500 font-semibold mb-4">
            Project not found or an error occurred. {message.content && `(${message.content})`}
          </p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors"
          >
            <FaArrowLeft className="inline-block mr-2" /> Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-6 md:p-10">
      {message.content && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg text-sm transition-opacity duration-300 ${
          message.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        } flex items-center justify-between animate-fade-in-down`}>
          <span>{message.content}</span>
          <button onClick={() => setMessage({ type: '', content: '' })} className="ml-4 text-white hover:text-gray-200 font-bold text-lg leading-none">&times;</button>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center mb-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 mr-4"
          >
            <FaArrowLeft className="inline-block mr-2" /> Back to Projects
          </button>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Project Details
          </h1>
        </div>

        <div className="bg-white rounded-xl shadow-2xl p-6 md:p-10 transform hover:scale-[1.005] transition-transform duration-300 ease-in-out border border-gray-200">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight leading-tight">
            {project.title}
          </h2>
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            {project.description}
          </p>
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">Project Overview</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6 text-base text-gray-700">
              <DetailItem label="Project ID" value={project.id} />
              <DetailItem label="Status" value={getStatusBadge(project.status)} isBadge={true} />
              <DetailItem label="Priority" value={project.priority} />
              <DetailItem label="Project Manager" value={project.projectManager?.username || '-'} />
              <DetailItem label="Site Supervisor" value={project.siteSupervisor?.username || '-'} />
              <DetailItem label="Equipment Manager" value={project.equipmentManager?.username || '-'} />
              <DetailItem label="Planned Start" value={project.startDate ? format(new Date(project.startDate), 'MMM d, yyyy') : '-'} />
              <DetailItem label="Planned End" value={project.endDate ? format(new Date(project.endDate), 'MMM d, yyyy') : '-'} />
              <DetailItem label="Estimated Budget" value={project.estimatedBudget != null ? `₹${project.estimatedBudget.toLocaleString('en-IN')}` : '-'} />
              <DetailItem label="Actual Budget" value={project.actualBudget != null ? `₹${project.actualBudget.toLocaleString('en-IN')}` : '-'} />
              <DetailItem label="Location" value={project.location || '-'} />
              <DetailItem label="Overdue" value={
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  project.overdue ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                }`}>
                  {project.overdue ? 'Yes' : 'No'}
                </span>
              } isBadge={true} />
              <div className="sm:col-span-2 lg:col-span-3">
                <h3 className="font-semibold text-gray-600 mb-2">Project Completion:</h3>
                <div className="w-full bg-gray-200 rounded-full h-4 relative">
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

        <div className="bg-white rounded-xl shadow-2xl p-6 md:p-10 border border-gray-200">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
            <FaTasks className="inline-block mr-2 text-blue-600" />
            Main Tasks
          </h2>
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
                        <FaEye className="h-3 w-3 mr-1" />
                        Subtasks
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-2 gap-x-6 text-sm text-gray-700 mt-4">
                    <DetailItem label="Status" value={getStatusBadge(task.status)} isBadge={true} />
                    <DetailItem label="Supervisor" value={task.supervisorName || '-'} />
                    <DetailItem label="Equipment Manager" value={task.equipmentManagerName || '-'} />
                    <DetailItem label="Est. Hours" value={`${task.estimatedHours}h`} />
                    <DetailItem label="Planned Start" value={task.plannedStartDate ? format(new Date(task.plannedStartDate), 'MMM d, yyyy') : '-'} />
                    <DetailItem label="Planned End" value={task.plannedEndDate ? format(new Date(task.plannedEndDate), 'MMM d, yyyy') : '-'} />
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
        </div>
      </div>
    </div>
  );
}