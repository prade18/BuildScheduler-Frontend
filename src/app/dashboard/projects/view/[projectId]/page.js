// src/app/dashboard/projects/view/[projectId]/page.js
'use client'

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';

export default function ProjectDetailsPage() {
  const { projectId } = useParams();
  const router = useRouter();
  
  // State variables
  const [project, setProject] = useState(null);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedSupervisor, setSelectedSupervisor] = useState('');
  const [selectedEquipmentManager, setSelectedEquipmentManager] = useState('');
  const [mainTasks, setMainTasks] = useState([]);
  const [mainTasksError, setMainTasksError] = useState('');
  const [loadingStates, setLoadingStates] = useState({
    supervisor: false,
    equipmentManager: false,
    mainTasks: false,
    project: true,
    users: true
  });

  // Fetch project and users
  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication token not found');
          setTimeout(() => router.push('/login'), 1500);
          return;
        }

        const [projectRes, usersRes] = await Promise.all([
          axios.get(`http://localhost:8080/api/pm/projects/${projectId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            timeout: 10000
          }),
          axios.get(`http://localhost:8080/api/pm/users`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            timeout: 10000
          })
        ]);

        // Handle project response
        if (projectRes.status !== 200 || !projectRes.data?.data) {
          throw new Error(projectRes.data?.message || 'Failed to load project');
        }
        setProject(projectRes.data.data);

        // Handle users response
        if (usersRes.status === 200 && usersRes.data?.data) {
          setUsers(usersRes.data.data);
        }
        
      } catch (err) {
        handleFetchError(err, 'project');
      } finally {
        setLoadingStates(prev => ({
          ...prev, 
          project: false,
          users: false
        }));
      }
    };

    if (projectId) {
      fetchData();
    }
  }, [projectId, router]);

  // Handle errors
  const handleFetchError = (err, context = '') => {
    let errorMessage = `Failed to load ${context} data`;
    
    if (err.response) {
      // Server responded with error status
      if (err.response.status === 401) {
        errorMessage = 'Your session has expired. Redirecting to login...';
        setTimeout(() => router.push('/login'), 1500);
      } else if (err.response.status === 500) {
        errorMessage = 'Server error: Please try again later';
      } else if (err.response.data?.message) {
        errorMessage = `Server error: ${err.response.data.message}`;
      } else {
        errorMessage = `Server error: ${err.response.status} ${err.response.statusText}`;
      }
    } else if (err.request) {
      // Request was made but no response
      errorMessage = 'No response from server. Please check your network connection.';
    } else if (err.message) {
      // Other errors
      if (err.message.includes('timeout')) {
        errorMessage = 'Request timed out. Please try again.';
      } else {
        errorMessage = `Error: ${err.message}`;
      }
    }
    
    if (context === 'project') {
      setError(errorMessage);
    } else if (context === 'mainTasks') {
      setMainTasksError(errorMessage);
    }
    
    console.error(`${context} fetch error:`, err);
  };

  // Memoized filtered users
  const siteSupervisors = users.filter(user => user.role === 'ROLE_SITE_SUPERVISOR');
  const equipmentManagers = users.filter(user => user.role === 'ROLE_EQUIPMENT_MANAGER');

  // Assignment handlers with loading states
  const handleAssignSupervisor = async () => {
    if (!selectedSupervisor) return;
    
    setLoadingStates(prev => ({...prev, supervisor: true}));
    try {
      await axios.post(
        `http://localhost:8080/api/pm/projects/${projectId}/assign-supervisor?supervisorId=${selectedSupervisor}`,
        {},
        { 
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          timeout: 10000
        }
      );
      setProject(prev => ({
        ...prev,
        siteSupervisor: siteSupervisors.find(s => s.id.toString() === selectedSupervisor)
      }));
    } catch (err) {
      handleFetchError(err);
      alert(err.response?.data?.message || "Failed to assign supervisor");
    } finally {
      setLoadingStates(prev => ({...prev, supervisor: false}));
    }
  };

  const handleAssignEquipmentManager = async () => {
    if (!selectedEquipmentManager) return;
    
    setLoadingStates(prev => ({...prev, equipmentManager: true}));
    try {
      await axios.post(
        `http://localhost:8080/api/pm/projects/${projectId}/assign-equipment-manager?equipmentManagerId=${selectedEquipmentManager}`,
        {},
        { 
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          timeout: 10000
        }
      );
      setProject(prev => ({
        ...prev,
        equipmentManager: equipmentManagers.find(m => m.id.toString() === selectedEquipmentManager)
      }));
    } catch (err) {
      handleFetchError(err);
      alert(err.response?.data?.message || "Failed to assign equipment manager");
    } finally {
      setLoadingStates(prev => ({...prev, equipmentManager: false}));
    }
  };

  // Fixed: Use consistent endpoint for fetching tasks
  const fetchMainTasks = useCallback(async () => {
    try {
      setLoadingStates(prev => ({...prev, mainTasks: true}));
      setMainTasksError('');
      const token = localStorage.getItem('token');
      
      if (!token) {
        setMainTasksError('Authentication token not found');
        return;
      }

      // FIXED: Use the same /pm endpoint as other requests
      const res = await axios.get(
        `http://localhost:8080/api/pm/projects/${projectId}/main-tasks`, 
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          timeout: 10000
        }
      );
      
      if (res.status === 200 && res.data?.data) {
        setMainTasks(Array.isArray(res.data.data) ? res.data.data : []);
      } else {
        throw new Error('Invalid main tasks response');
      }
    } catch (err) {
      handleFetchError(err, 'mainTasks');
    } finally {
      setLoadingStates(prev => ({...prev, mainTasks: false}));
    }
  }, [projectId]);

  useEffect(() => {
    if (projectId && !loadingStates.project) {
      fetchMainTasks();
    }
  }, [projectId, fetchMainTasks, loadingStates.project]);

  // Main task creation
  const handleCreateMainTask = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const token = localStorage.getItem('token');
    
    try {
      setLoadingStates(prev => ({...prev, mainTasks: true}));
      setMainTasksError('');
      
      // Create task
      await axios.post(
        `http://localhost:8080/api/pm/projects/${projectId}/main-tasks`,
        {
          title: formData.get('title'),
          description: formData.get('description'),
          plannedStartDate: formData.get('plannedStartDate'),
          plannedEndDate: formData.get('plannedEndDate'),
          priority: Number(formData.get('priority')),
          estimatedHours: Number(formData.get('estimatedHours')),
          supervisorId: Number(formData.get('supervisorId'))
        },
        { 
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000
        }
      );
      
      // Refresh tasks after successful creation
      await fetchMainTasks();
      e.target.reset();
      
      // Show success message
      setMainTasksError('');
    } catch (err) {
      handleFetchError(err, 'mainTasks');
      alert(err.response?.data?.message || "Failed to create task");
    } finally {
      setLoadingStates(prev => ({...prev, mainTasks: false}));
    }
  };

  if (loadingStates.project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mb-4"></div>
        <p className="text-gray-600">Loading project details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-red-500 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Project</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => router.reload()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              <span className="flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Try Again
              </span>
            </button>
            <button 
              onClick={() => router.push('/dashboard/projects/view')}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              Back to Projects
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Project Details Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-blue-50">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Project Details</h1>
                <p className="mt-1 text-sm text-gray-600">ID: {project?.id}</p>
              </div>
              <div className="mt-4 md:mt-0">
                <button 
                  onClick={() => router.push('/dashboard/projects/view')}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Projects
                </button>
              </div>
            </div>
          </div>

          {/* Project Details */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Project Information</h2>
                {project ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Title</h3>
                      <p className="mt-1 text-lg font-medium text-gray-900">{project.title}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Description</h3>
                      <p className="mt-1 text-gray-600">{project.description}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Start Date</h3>
                        <p className="mt-1 text-gray-600">{new Date(project.startDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">End Date</h3>
                        <p className="mt-1 text-gray-600">{new Date(project.endDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Status</h3>
                        <p className="mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium
                            ${project.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 
                              project.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' : 
                              project.status === 'ON_HOLD' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'}`}>
                            {project.status}
                          </span>
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Priority</h3>
                        <p className="mt-1 text-gray-600">{project.priority}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p>Loading project information...</p>
                )}
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Team Assignment</h2>
                
                {/* Site Supervisor Assignment */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Site Supervisor</h3>
                  <div className="flex items-center">
                    <select
                      className="flex-grow border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={selectedSupervisor}
                      onChange={(e) => setSelectedSupervisor(e.target.value)}
                      disabled={loadingStates.supervisor}
                    >
                      <option value="">Select Site Supervisor</option>
                      {siteSupervisors.map(user => (
                        <option key={user.id} value={user.id}>
                          {user.name || user.username || `User ${user.id}`}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={handleAssignSupervisor}
                      disabled={loadingStates.supervisor || !selectedSupervisor}
                      className="ml-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                    >
                      {loadingStates.supervisor ? 'Assigning...' : 'Assign'}
                    </button>
                  </div>
                  {project?.siteSupervisor && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-md">
                      <p className="text-sm font-medium">Current: {project.siteSupervisor.name}</p>
                    </div>
                  )}
                </div>

                {/* Equipment Manager Assignment */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Equipment Manager</h3>
                  <div className="flex items-center">
                    <select
                      className="flex-grow border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={selectedEquipmentManager}
                      onChange={(e) => setSelectedEquipmentManager(e.target.value)}
                      disabled={loadingStates.equipmentManager}
                    >
                      <option value="">Select Equipment Manager</option>
                      {equipmentManagers.map(user => (
                        <option key={user.id} value={user.id}>
                          {user.name || user.username || `User ${user.id}`}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={handleAssignEquipmentManager}
                      disabled={loadingStates.equipmentManager || !selectedEquipmentManager}
                      className="ml-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                    >
                      {loadingStates.equipmentManager ? 'Assigning...' : 'Assign'}
                    </button>
                  </div>
                  {project?.equipmentManager && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-md">
                      <p className="text-sm font-medium">Current: {project.equipmentManager.name}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Main Tasks Section */}
            <div className="mt-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Main Tasks</h2>
                <button 
                  onClick={() => document.getElementById('taskForm').scrollIntoView({ behavior: 'smooth' })}
                  className="text-indigo-600 hover:text-indigo-800 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add New Task
                </button>
              </div>

              {mainTasksError ? (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">
                        {mainTasksError}
                        <button 
                          onClick={fetchMainTasks}
                          className="ml-2 text-red-800 underline"
                        >
                          Try again
                        </button>
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}

              {loadingStates.mainTasks ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
                </div>
              ) : mainTasks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mainTasks.map(task => (
                    <div key={task.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <h3 className="font-medium text-lg text-gray-900 mb-2">{task.title}</h3>
                      <p className="text-gray-600 text-sm mb-3">{task.description}</p>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>Start: {new Date(task.plannedStartDate).toLocaleDateString()}</span>
                        <span>End: {new Date(task.plannedEndDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        No tasks created yet. Add your first task below.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Create Main Task Form */}
              <div id="taskForm" className="mt-12 bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Create New Main Task</h2>
                
                <form onSubmit={handleCreateMainTask} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input 
                        id="title"
                        name="title" 
                        placeholder="Task title" 
                        required 
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    {/* <div>
                      <label htmlFor="supervisorId" className="block text-sm font-medium text-gray-700 mb-1">Supervisor</label>
                      <select
                        id="supervisorId"
                        name="supervisorId"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={selectedSupervisor}
                        onChange={(e) => setSelectedSupervisor(e.target.value)}
                        required
                      >
                        <option value="" disabled>Select Supervisor</option>
                        {siteSupervisors.map((sup) => (
                          <option key={sup.id} value={sup.id}>
                            {sup.name}
                          </option>
                        ))}
                      </select>
                    </div> */}
                    {/* <div className="relative">
  <label htmlFor="supervisorId" className="block text-sm font-medium text-gray-700 mb-1">
    Supervisor
  </label>
  <select
    id="supervisorId"
    name="supervisorId"
    className="appearance-none w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 bg-white pr-10"
    value={selectedSupervisor}
    onChange={(e) => setSelectedSupervisor(e.target.value)}
    required
  >
    <option value="" disabled className="text-gray-400">
      Select Supervisor
    </option>
    {siteSupervisors.map((sup) => (
      <option 
        key={sup.id} 
        value={sup.id}
        className="text-gray-900"
      >
        {sup.name} ({sup.id})
      </option>
    ))}
  </select>
  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 pt-6 text-gray-700">
    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
    </svg>
  </div>
</div> */}
<div className="relative">
  <label htmlFor="supervisorId" className="block text-sm font-medium text-gray-700 mb-1">
    Supervisor
  </label>
  <select
    id="supervisorId"
    name="supervisorId"
    className="appearance-none w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 bg-white pr-10"
    value={selectedSupervisor}
    onChange={(e) => setSelectedSupervisor(e.target.value)}
    required
  >
    <option value="" disabled className="text-gray-400">
      Select Supervisor
    </option>
    {siteSupervisors.map((sup) => (
      <option 
        key={sup.id} 
        value={sup.id}
        className="text-gray-900"
      >
        {sup.name || sup.username}  {/* Only show name or username */}
      </option>
    ))}
  </select>
  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 pt-6 text-gray-700">
    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
    </svg>
  </div>
</div>
                  </div>
                  
                  <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea 
                        id="description"
                        name="description" 
                        placeholder="Task description" 
                        required 
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        rows="3"
                      />
                    </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="plannedStartDate" className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                      <input 
                        id="plannedStartDate"
                        name="plannedStartDate" 
                        type="date" 
                        required 
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="plannedEndDate" className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                      <input 
                        id="plannedEndDate"
                        name="plannedEndDate" 
                        type="date" 
                        required 
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">Priority (1-10)</label>
                      <input 
                        id="priority"
                        name="priority" 
                        type="number" 
                        min="1" 
                        max="10" 
                        placeholder="Priority" 
                        required 
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="estimatedHours" className="block text-sm font-medium text-gray-700 mb-1">Estimated Hours</label>
                      <input 
                        id="estimatedHours"
                        name="estimatedHours" 
                        type="number" 
                        placeholder="Estimated Hours" 
                        required 
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <button 
                      type="submit" 
                      disabled={loadingStates.mainTasks}
                      className="w-full md:w-auto px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      {loadingStates.mainTasks ? 'Creating Task...' : 'Create Main Task'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}