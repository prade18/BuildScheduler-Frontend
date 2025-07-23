// // // src/app/dashboard/projects/view/[projectId]/page.js


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
  const [subtasks, setSubtasks] = useState({});
  const [tasks, setTasks] = useState([]);

  const [loadingStates, setLoadingStates] = useState({
    supervisor: false,
    equipmentManager: false,
    mainTasks: false,
    project: true,
    users: true
  });

  // New states for task editing
  const [editingTaskId, setEditingTaskId] = useState(null);
  // const [editingTaskData, setEditingTaskData] = useState({
  //   title: '',
  //   description: '',
  //   plannedStartDate: '',
  //   plannedEndDate: '',
  //   priority: '',
  //   estimatedHours: '',
  //   supervisorId: ''
  // });
  const [editingTaskData, setEditingTaskData] = useState({
  title: '',
  description: '',
  plannedStartDate: '',
  plannedEndDate: '',
  priority: '',
  estimatedHours: '',
  supervisorId: ''
});


  // Pagination states
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);

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

  // Fetch main tasks with pagination
  const fetchMainTasks = useCallback(async () => {
    try {
      setLoadingStates(prev => ({...prev, mainTasks: true}));
      setMainTasksError('');
      const token = localStorage.getItem('token');
      
      if (!token) {
        setMainTasksError('Authentication token not found');
        return;
      }

      const res = await axios.get(
        `http://localhost:8080/api/pm/projects/${projectId}/main-tasks`,
        {
          params: {
            page: currentPage,
            size: pageSize
          },
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          timeout: 10000
        }
      );
      
      if (res.status === 200 && res.data?.data) {
        setMainTasks(Array.isArray(res.data.data.content) ? res.data.data.content : []);
        setTotalPages(res.data.data.totalPages);
        setTotalTasks(res.data.data.totalElements);
      } else {
        throw new Error('Invalid main tasks response');
      }
    } catch (err) {
      handleFetchError(err, 'mainTasks');
    } finally {
      setLoadingStates(prev => ({...prev, mainTasks: false}));
    }
  }, [projectId, currentPage, pageSize]);

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
      setCurrentPage(0); // Reset to first page
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

  // Handle edit button click
  const handleEditTask = (task) => {
    setEditingTaskId(task.id);
    setEditingTaskData({
      title: task.title,
      description: task.description,
      plannedStartDate: task.plannedStartDate.substring(0, 10),
      plannedEndDate: task.plannedEndDate.substring(0, 10),
      priority: task.priority,
      estimatedHours: task.estimatedHours,
      supervisorId: task.supervisor?.id || ''
    });
  };

  // Handle update task
  const handleUpdateTask = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    try {
      setLoadingStates(prev => ({...prev, mainTasks: true}));
      setMainTasksError('');
      
      // Update task
      await axios.put(
        `http://localhost:8080/api/pm/projects/${projectId}/main-tasks/${editingTaskId}`,
        {
          title: editingTaskData.title,
          description: editingTaskData.description,
          plannedStartDate: editingTaskData.plannedStartDate,
          plannedEndDate: editingTaskData.plannedEndDate,
          priority: Number(editingTaskData.priority),
          estimatedHours: Number(editingTaskData.estimatedHours),
          supervisorId: Number(editingTaskData.supervisorId)
        },
        { 
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000
        }
      );
      
      // Refresh tasks after successful update
      await fetchMainTasks();
      setEditingTaskId(null);
      
      // Show success message
      setMainTasksError('');
    } catch (err) {
      handleFetchError(err, 'mainTasks');
      alert(err.response?.data?.message || "Failed to update task");
    } finally {
      setLoadingStates(prev => ({...prev, mainTasks: false}));
    }
  };

  // Handle delete task
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    const token = localStorage.getItem('token');
    
    try {
      setLoadingStates(prev => ({...prev, mainTasks: true}));
      setMainTasksError('');
      
      await axios.delete(
        `http://localhost:8080/api/pm/projects/${projectId}/main-tasks/${taskId}`,
        { 
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000
        }
      );
      
      // Refresh tasks after successful deletion
      await fetchMainTasks();
    } catch (err) {
      handleFetchError(err, 'mainTasks');
      alert(err.response?.data?.message || "Failed to delete task");
    } finally {
      setLoadingStates(prev => ({...prev, mainTasks: false}));
    }
  };

  // Handle edit form input changes
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingTaskData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
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
  const handleSubtaskClick = async (task) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/site-supervisor/main-tasks/${task.id}/subtasks`);
      setSubtasks((prev) => ({
        ...prev,
        [task.id]: response.data, // store subtasks per task ID
      }));
    } catch (error) {
      console.error('Failed to fetch subtasks:', error);
    }
  };

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
                <>
                  
                    <div className="flex flex-col gap-4">

                    {mainTasks.map(task => (
                      <div key={task.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow relative">
                        {/* Visible Edit and Delete buttons */}
                        <div className="absolute top-3 right-3 flex gap-2">
                          <button 
                            onClick={() => handleEditTask(task)}
                            className="p-1 bg-indigo-100 text-indigo-600 rounded-md hover:bg-indigo-200"
                            title="Edit Task"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button 
                            onClick={() => handleDeleteTask(task.id)}
                            className="p-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                            title="Delete Task"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                        
                        <h3 className="font-medium text-lg text-gray-900 mb-2 pr-8">{task.title}</h3>
                        <p className="text-gray-600 text-sm mb-3">{task.description}</p>
                        {/* <div className="flex justify-between text-sm text-gray-500">
                          <span>Start: {new Date(task.plannedStartDate).toLocaleDateString()}</span>
                          <span>End: {new Date(task.plannedEndDate).toLocaleDateString()}</span>
                        </div> */}
                        <div className="text-sm text-gray-500 space-y-1">
                            <div>Start: {new Date(task.plannedStartDate).toLocaleDateString()}</div>
                            <div>End: {new Date(task.plannedEndDate).toLocaleDateString()}</div>
                        </div>

                        {/* 👇 Subtask button */}
                        <div className="mt-3 flex justify-end">
                          <button
                            onClick={() => handleSubtaskClick(task)}
                            className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                          >
                            Subtask
                          </button>
                        </div>

                      </div>
                    ))}
                  </div>
                  
                  {/* Pagination controls */}
                  <div className="mt-6 flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Showing {mainTasks.length} of {totalTasks} tasks
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 0}
                        className={`px-3 py-1 rounded-md ${currentPage === 0 
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                          : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'}`}
                      >
                        Previous
                      </button>
                      
                      <div className="flex space-x-1">
                        {[...Array(totalPages)].map((_, i) => (
                          <button
                            key={i}
                            onClick={() => handlePageChange(i)}
                            className={`w-8 h-8 rounded-md ${
                              currentPage === i
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {i + 1}
                          </button>
                        ))}
                      </div>
                      
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages - 1}
                        className={`px-3 py-1 rounded-md ${currentPage === totalPages - 1 
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                          : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'}`}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </>
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

              {/* Create/Update Task Form */}
              <div id="taskForm" className="mt-12 bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  {editingTaskId ? 'Update Task' : 'Create New Main Task'}
                </h2>
                
                <form onSubmit={editingTaskId ? handleUpdateTask : handleCreateMainTask} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      {/* <input 
                        id="title"
                        name="title" 
                        placeholder="Task title" 
                        required 
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={editingTaskId ? editingTaskData.title : undefined}
                        onChange={editingTaskId ? handleEditChange : undefined}
                      /> */}
                      {/* <input 
                            id="title"
                            name="title" 
                            placeholder="Task title" 
                            required 
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={editingTaskData?.title ?? ""}
                            onChange={editingTaskId ? handleEditChange : () => {}}
                      />                */}
                      <input 
  id="title"
  name="title" 
  placeholder="Task title" 
  required 
  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
  value={editingTaskData?.title ?? ""}
  onChange={handleEditChange}
/>


                          </div>
                    <div>
                      <label htmlFor="supervisorId" className="block text-sm font-medium text-gray-700 mb-1">
                        Supervisor
                      </label>
                      <select
                        id="supervisorId"
                        name="supervisorId"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={editingTaskId ? editingTaskData.supervisorId : undefined}
                        onChange={editingTaskId ? handleEditChange : undefined}
                        required
                      >
                        <option value="" disabled>Select Supervisor</option>
                        {siteSupervisors.map((sup) => (
                          <option key={sup.id} value={sup.id}>
                            {sup.name || sup.username}
                          </option>
                        ))}
                      </select>
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
                      value={editingTaskId ? editingTaskData.description : undefined}
                      onChange={editingTaskId ? handleEditChange : undefined}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="plannedStartDate" className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                      {/* <input 
                        id="plannedStartDate"
                        name="plannedStartDate" 
                        type="date" 
                        required 
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={editingTaskId ? editingTaskData.plannedStartDate : undefined}
                        onChange={editingTaskId ? handleEditChange : undefined}
                      /> */}
                      {/* <input 
                            id="plannedStartDate"
                            name="plannedStartDate" 
                            type="date" 
                            required 
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={editingTaskId ? (editingTaskData.plannedStartDate || "") : ""}
                            onChange={editingTaskId ? handleEditChange : () => {}}
                        /> */}
                        <input 
  id="plannedStartDate"
  name="plannedStartDate" 
  type="date" 
  required 
  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
  value={editingTaskData?.plannedStartDate ?? ""}
  onChange={handleEditChange}
/>


                    </div>
                    <div>
                      <label htmlFor="plannedEndDate" className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                      {/* <input 
                        id="plannedEndDate"
                        name="plannedEndDate" 
                        type="date" 
                        required 
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={editingTaskId ? editingTaskData.plannedEndDate : undefined}
                        onChange={editingTaskId ? handleEditChange : undefined}
                      /> */}
                                  {/* <input 
                                  id="plannedEndDate"
                                  name="plannedEndDate" 
                                  type="date" 
                                  required 
                                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                  value={editingTaskId ? (editingTaskData.plannedEndDate || '') : ''}
                                  onChange={editingTaskId ? handleEditChange : () => {}}
                                /> */}
                                <input 
  id="plannedEndDate"
  name="plannedEndDate" 
  type="date" 
  required 
  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
  value={editingTaskData?.plannedEndDate ?? ''}
  onChange={handleEditChange}
/>

                                                      

                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">Priority (1-10)</label>
                      {/* <input 
                        id="priority"
                        name="priority" 
                        type="number" 
                        min="1" 
                        max="10" 
                        placeholder="Priority" 
                        required 
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={editingTaskId ? editingTaskData.priority : undefined}
                        onChange={editingTaskId ? handleEditChange : undefined}
                      /> */}
                      <input 
                            id="priority"
                            name="priority" 
                            type="number" 
                            min="1"                           
                            max="10" 
                            placeholder="Priority" 
                            required 
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={editingTaskData.priority}
                            onChange={handleEditChange}
                        />

                    </div>
                    <div>
                      <label htmlFor="estimatedHours" className="block text-sm font-medium text-gray-700 mb-1">Estimated Hours</label>
                      {/* <input 
                        id="estimatedHours"
                        name="estimatedHours" 
                        type="number" 
                        placeholder="Estimated Hours" 
                        required 
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={editingTaskId ? editingTaskData.estimatedHours : undefined}
                        onChange={editingTaskId ? handleEditChange : undefined}
                      /> */}                           
                        <input 
                            id="estimatedHours"
                            name="estimatedHours" 
                            type="number" 
                            placeholder="Estimated Hours" 
                            required 
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={editingTaskData.estimatedHours}
                            onChange={handleEditChange}
                        />

                    </div>
                  </div>
                  
                  <div className="pt-4 flex space-x-3">
                    <button 
                      type="submit" 
                      disabled={loadingStates.mainTasks}
                      className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      {loadingStates.mainTasks 
                        ? (editingTaskId ? 'Updating Task...' : 'Creating Task...') 
                        : (editingTaskId ? 'Update Task' : 'Create Main Task')}
                    </button>
                    
                    {editingTaskId && (
                      <button 
                        type="button"
                        onClick={() => setEditingTaskId(null)}
                        className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div>
      {tasks.map((task) => (
        <div key={task.id} className="bg-white rounded-lg shadow-md p-4 mb-4 relative">
          <h3 className="text-lg font-semibold">{task.title}</h3>
          <p className="text-gray-600">{task.description}</p>
          <div className="text-sm text-gray-500 space-y-1 mt-2">
            <div>Start: {new Date(task.plannedStartDate).toLocaleDateString()}</div>
            <div>End: {new Date(task.plannedEndDate).toLocaleDateString()}</div>
          </div>

          <div className="mt-3 flex justify-end">
            <button
              onClick={() => handleSubtaskClick(task)}
              className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
            >
              Subtask
            </button>
          </div>

          {subtasks[task.id] && (
            <div className="mt-3">
              <h4 className="font-medium text-sm">Subtasks:</h4>
              <ul className="list-disc list-inside text-sm text-gray-700">
                {subtasks[task.id].map((subtask) => (
                  <li key={subtask.id}>{subtask.title}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
      </div>
      
    </div>
    
  );
}







                          

