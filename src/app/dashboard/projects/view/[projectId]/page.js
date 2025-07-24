// // // src/app/dashboard/projects/view/[projectId]/page.js


// 'use client'

// import { useEffect, useState, useCallback } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import axios from 'axios';

// export default function ProjectDetailsPage() {
//   const { projectId } = useParams();
//   const router = useRouter();
  
//   // State variables
//   const [project, setProject] = useState(null);
//   const [error, setError] = useState(null);
//   const [users, setUsers] = useState([]);
//   const [selectedSupervisor, setSelectedSupervisor] = useState('');
//   const [selectedEquipmentManager, setSelectedEquipmentManager] = useState('');
//   const [mainTasks, setMainTasks] = useState([]);
//   const [mainTasksError, setMainTasksError] = useState('');
//   const [subtasks, setSubtasks] = useState({});
//   const [tasks, setTasks] = useState([]);

//   const [loadingStates, setLoadingStates] = useState({
//     supervisor: false,
//     equipmentManager: false,
//     mainTasks: false,
//     project: true,
//     users: true
//   });

//   // New states for task editing
//   const [editingTaskId, setEditingTaskId] = useState(null);
//   // const [editingTaskData, setEditingTaskData] = useState({
//   //   title: '',
//   //   description: '',
//   //   plannedStartDate: '',
//   //   plannedEndDate: '',
//   //   priority: '',
//   //   estimatedHours: '',
//   //   supervisorId: ''
//   // });
//   const [editingTaskData, setEditingTaskData] = useState({
//   title: '',
//   description: '',
//   plannedStartDate: '',
//   plannedEndDate: '',
//   priority: '',
//   estimatedHours: '',
//   supervisorId: ''
// });


//   // Pagination states
//   const [currentPage, setCurrentPage] = useState(0);
//   const [pageSize, setPageSize] = useState(10);
//   const [totalPages, setTotalPages] = useState(0);
//   const [totalTasks, setTotalTasks] = useState(0);

//   // Fetch project and users
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setError(null);
//         const token = localStorage.getItem('token');
//         if (!token) {
//           setError('Authentication token not found');
//           setTimeout(() => router.push('/login'), 1500);
//           return;
//         }

//         const [projectRes, usersRes] = await Promise.all([
//           axios.get(`http://localhost:8080/api/pm/projects/${projectId}`, {
//             headers: {
//               'Authorization': `Bearer ${token}`,
//               'Content-Type': 'application/json'
//             },
//             timeout: 10000
//           }),
//           axios.get(`http://localhost:8080/api/pm/users`, {
//             headers: {
//               'Authorization': `Bearer ${token}`,
//               'Content-Type': 'application/json'
//             },
//             timeout: 10000
//           })
//         ]);

//         // Handle project response
//         if (projectRes.status !== 200 || !projectRes.data?.data) {
//           throw new Error(projectRes.data?.message || 'Failed to load project');
//         }
//         setProject(projectRes.data.data);

//         // Handle users response
//         if (usersRes.status === 200 && usersRes.data?.data) {
//           setUsers(usersRes.data.data);
//         }
        
//       } catch (err) {
//         handleFetchError(err, 'project');
//       } finally {
//         setLoadingStates(prev => ({
//           ...prev, 
//           project: false,
//           users: false
//         }));
//       }
//     };

//     if (projectId) {
//       fetchData();
//     }
//   }, [projectId, router]);

//   // Handle errors
//   const handleFetchError = (err, context = '') => {
//     let errorMessage = `Failed to load ${context} data`;
    
//     if (err.response) {
//       // Server responded with error status
//       if (err.response.status === 401) {
//         errorMessage = 'Your session has expired. Redirecting to login...';
//         setTimeout(() => router.push('/login'), 1500);
//       } else if (err.response.status === 500) {
//         errorMessage = 'Server error: Please try again later';
//       } else if (err.response.data?.message) {
//         errorMessage = `Server error: ${err.response.data.message}`;
//       } else {
//         errorMessage = `Server error: ${err.response.status} ${err.response.statusText}`;
//       }
//     } else if (err.request) {
//       // Request was made but no response
//       errorMessage = 'No response from server. Please check your network connection.';
//     } else if (err.message) {
//       // Other errors
//       if (err.message.includes('timeout')) {
//         errorMessage = 'Request timed out. Please try again.';
//       } else {
//         errorMessage = `Error: ${err.message}`;
//       }
//     }
    
//     if (context === 'project') {
//       setError(errorMessage);
//     } else if (context === 'mainTasks') {
//       setMainTasksError(errorMessage);
//     }
    
//     console.error(`${context} fetch error:`, err);
//   };

//   // Memoized filtered users
//   const siteSupervisors = users.filter(user => user.role === 'ROLE_SITE_SUPERVISOR');
//   const equipmentManagers = users.filter(user => user.role === 'ROLE_EQUIPMENT_MANAGER');

//   // Assignment handlers with loading states
//   const handleAssignSupervisor = async () => {
//     if (!selectedSupervisor) return;
    
//     setLoadingStates(prev => ({...prev, supervisor: true}));
//     try {
//       await axios.post(
//         `http://localhost:8080/api/pm/projects/${projectId}/assign-supervisor?supervisorId=${selectedSupervisor}`,
//         {},
//         { 
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//           timeout: 10000
//         }
//       );
//       setProject(prev => ({
//         ...prev,
//         siteSupervisor: siteSupervisors.find(s => s.id.toString() === selectedSupervisor)
//       }));
//     } catch (err) {
//       handleFetchError(err);
//       alert(err.response?.data?.message || "Failed to assign supervisor");
//     } finally {
//       setLoadingStates(prev => ({...prev, supervisor: false}));
//     }
//   };

//   const handleAssignEquipmentManager = async () => {
//     if (!selectedEquipmentManager) return;
    
//     setLoadingStates(prev => ({...prev, equipmentManager: true}));
//     try {
//       await axios.post(
//         `http://localhost:8080/api/pm/projects/${projectId}/assign-equipment-manager?equipmentManagerId=${selectedEquipmentManager}`,
//         {},
//         { 
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//           timeout: 10000
//         }
//       );
//       setProject(prev => ({
//         ...prev,
//         equipmentManager: equipmentManagers.find(m => m.id.toString() === selectedEquipmentManager)
//       }));
//     } catch (err) {
//       handleFetchError(err);
//       alert(err.response?.data?.message || "Failed to assign equipment manager");
//     } finally {
//       setLoadingStates(prev => ({...prev, equipmentManager: false}));
//     }
//   };

//   // Fetch main tasks with pagination
//   const fetchMainTasks = useCallback(async () => {
//     try {
//       setLoadingStates(prev => ({...prev, mainTasks: true}));
//       setMainTasksError('');
//       const token = localStorage.getItem('token');
      
//       if (!token) {
//         setMainTasksError('Authentication token not found');
//         return;
//       }

//       const res = await axios.get(
//         `http://localhost:8080/api/pm/projects/${projectId}/main-tasks`,
//         {
//           params: {
//             page: currentPage,
//             size: pageSize
//           },
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//           timeout: 10000
//         }
//       );
      
//       if (res.status === 200 && res.data?.data) {
//         setMainTasks(Array.isArray(res.data.data.content) ? res.data.data.content : []);
//         setTotalPages(res.data.data.totalPages);
//         setTotalTasks(res.data.data.totalElements);
//       } else {
//         throw new Error('Invalid main tasks response');
//       }
//     } catch (err) {
//       handleFetchError(err, 'mainTasks');
//     } finally {
//       setLoadingStates(prev => ({...prev, mainTasks: false}));
//     }
//   }, [projectId, currentPage, pageSize]);

//   useEffect(() => {
//     if (projectId && !loadingStates.project) {
//       fetchMainTasks();
//     }
//   }, [projectId, fetchMainTasks, loadingStates.project]);

//   // Main task creation
//   const handleCreateMainTask = async (e) => {
//     e.preventDefault();
//     const formData = new FormData(e.target);
//     const token = localStorage.getItem('token');
    
//     try {
//       setLoadingStates(prev => ({...prev, mainTasks: true}));
//       setMainTasksError('');
      
//       // Create task
//       await axios.post(
//         `http://localhost:8080/api/pm/projects/${projectId}/main-tasks`,
//         {
//           title: formData.get('title'),
//           description: formData.get('description'),
//           plannedStartDate: formData.get('plannedStartDate'),
//           plannedEndDate: formData.get('plannedEndDate'),
//           priority: Number(formData.get('priority')),
//           estimatedHours: Number(formData.get('estimatedHours')),
//           supervisorId: Number(formData.get('supervisorId'))
//         },
//         { 
//           headers: { Authorization: `Bearer ${token}` },
//           timeout: 10000
//         }
//       );
      
//       // Refresh tasks after successful creation
//       setCurrentPage(0); // Reset to first page
//       await fetchMainTasks();
//       e.target.reset();
      
//       // Show success message
//       setMainTasksError('');
//     } catch (err) {
//       handleFetchError(err, 'mainTasks');
//       alert(err.response?.data?.message || "Failed to create task");
//     } finally {
//       setLoadingStates(prev => ({...prev, mainTasks: false}));
//     }
//   };

//   // Handle edit button click
//   const handleEditTask = (task) => {
//     setEditingTaskId(task.id);
//     setEditingTaskData({
//       title: task.title,
//       description: task.description,
//       plannedStartDate: task.plannedStartDate.substring(0, 10),
//       plannedEndDate: task.plannedEndDate.substring(0, 10),
//       priority: task.priority,
//       estimatedHours: task.estimatedHours,
//       supervisorId: task.supervisor?.id || ''
//     });
//   };

//   // Handle update task
//   const handleUpdateTask = async (e) => {
//     e.preventDefault();
//     const token = localStorage.getItem('token');
    
//     try {
//       setLoadingStates(prev => ({...prev, mainTasks: true}));
//       setMainTasksError('');
      
//       // Update task
//       await axios.put(
//         `http://localhost:8080/api/pm/projects/${projectId}/main-tasks/${editingTaskId}`,
//         {
//           title: editingTaskData.title,
//           description: editingTaskData.description,
//           plannedStartDate: editingTaskData.plannedStartDate,
//           plannedEndDate: editingTaskData.plannedEndDate,
//           priority: Number(editingTaskData.priority),
//           estimatedHours: Number(editingTaskData.estimatedHours),
//           supervisorId: Number(editingTaskData.supervisorId)
//         },
//         { 
//           headers: { Authorization: `Bearer ${token}` },
//           timeout: 10000
//         }
//       );
      
//       // Refresh tasks after successful update
//       await fetchMainTasks();
//       setEditingTaskId(null);
      
//       // Show success message
//       setMainTasksError('');
//     } catch (err) {
//       handleFetchError(err, 'mainTasks');
//       alert(err.response?.data?.message || "Failed to update task");
//     } finally {
//       setLoadingStates(prev => ({...prev, mainTasks: false}));
//     }
//   };

//   // Handle delete task
//   const handleDeleteTask = async (taskId) => {
//     if (!window.confirm('Are you sure you want to delete this task?')) return;
    
//     const token = localStorage.getItem('token');
    
//     try {
//       setLoadingStates(prev => ({...prev, mainTasks: true}));
//       setMainTasksError('');
      
//       await axios.delete(
//         `http://localhost:8080/api/pm/projects/${projectId}/main-tasks/${taskId}`,
//         { 
//           headers: { Authorization: `Bearer ${token}` },
//           timeout: 10000
//         }
//       );
      
//       // Refresh tasks after successful deletion
//       await fetchMainTasks();
//     } catch (err) {
//       handleFetchError(err, 'mainTasks');
//       alert(err.response?.data?.message || "Failed to delete task");
//     } finally {
//       setLoadingStates(prev => ({...prev, mainTasks: false}));
//     }
//   };

//   // Handle edit form input changes
//   const handleEditChange = (e) => {
//     const { name, value } = e.target;
//     setEditingTaskData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   // Handle page change
//   const handlePageChange = (newPage) => {
//     if (newPage >= 0 && newPage < totalPages) {
//       setCurrentPage(newPage);
//     }
//   };

//   if (loadingStates.project) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
//         <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mb-4"></div>
//         <p className="text-gray-600">Loading project details...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
//         <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
//           <div className="text-red-500 mb-6">
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
//           </div>
//           <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Project</h2>
//           <p className="text-gray-600 mb-6">{error}</p>
//           <div className="flex flex-col sm:flex-row gap-4 justify-center">
//             <button 
//               onClick={() => router.reload()}
//               className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
//             >
//               <span className="flex items-center justify-center">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//                 </svg>
//                 Try Again
//               </span>
//             </button>
//             <button 
//               onClick={() => router.push('/dashboard/projects/view')}
//               className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
//             >
//               Back to Projects
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }
//   const handleSubtaskClick = async (task) => {
//     try {
//       const response = await axios.get(`http://localhost:8080/api/site-supervisor/main-tasks/${task.id}/subtasks`);
//       setSubtasks((prev) => ({
//         ...prev,
//         [task.id]: response.data, // store subtasks per task ID
//       }));
//     } catch (error) {
//       console.error('Failed to fetch subtasks:', error);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="bg-white shadow rounded-lg overflow-hidden">
//           {/* Project Details Header */}
//           <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-blue-50">
//             <div className="flex flex-col md:flex-row md:items-center md:justify-between">
//               <div>
//                 <h1 className="text-2xl font-bold text-gray-800">Project Details</h1>
//                 <p className="mt-1 text-sm text-gray-600">ID: {project?.id}</p>
//               </div>
//               <div className="mt-4 md:mt-0">
//                 <button 
//                   onClick={() => router.push('/dashboard/projects/view')}
//                   className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
//                 >
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//                   </svg>
//                   Back to Projects
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Project Details */}
//           <div className="p-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              

//               <div className="bg-white p-6 rounded-lg border border-gray-200">
//                 <h2 className="text-lg font-semibold text-gray-800 mb-4">Project Information</h2>
//                 {project ? (
//                   <div className="space-y-4">
//                     <div>
//                       <h3 className="text-sm font-medium text-gray-500">Title</h3>
//                       <p className="mt-1 text-lg font-medium text-gray-900">{project.title}</p>
//                     </div>
//                     <div>
//                       <h3 className="text-sm font-medium text-gray-500">Description</h3>
//                       <p className="mt-1 text-gray-600">{project.description}</p>
//                     </div>
//                     <div className="grid grid-cols-2 gap-4">
//                       <div>
//                         <h3 className="text-sm font-medium text-gray-500">Start Date</h3>
//                         <p className="mt-1 text-gray-600">{new Date(project.startDate).toLocaleDateString()}</p>
//                       </div>
//                       <div>
//                         <h3 className="text-sm font-medium text-gray-500">End Date</h3>
//                         <p className="mt-1 text-gray-600">{new Date(project.endDate).toLocaleDateString()}</p>
//                       </div>
//                     </div>
//                     <div className="grid grid-cols-2 gap-4">
//                       <div>
//                         <h3 className="text-sm font-medium text-gray-500">Status</h3>
//                         <p className="mt-1">
//                           <span className={`px-2 py-1 rounded-full text-xs font-medium
//                             ${project.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 
//                               project.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' : 
//                               project.status === 'ON_HOLD' ? 'bg-yellow-100 text-yellow-800' :
//                               'bg-red-100 text-red-800'}`}>
//                             {project.status}
//                           </span>
//                         </p>
//                       </div>
//                       <div>
//                         <h3 className="text-sm font-medium text-gray-500">Priority</h3>
//                         <p className="mt-1 text-gray-600">{project.priority}</p>
//                       </div>
//                     </div>
//                   </div>
//                 ) : (
//                   <p>Loading project information...</p>
//                 )}
//               </div>

//               <div className="bg-white p-6 rounded-lg border border-gray-200">
//                 <h2 className="text-lg font-semibold text-gray-800 mb-4">Team Assignment</h2>
                
//                 {/* Site Supervisor Assignment */}
//                 <div className="mb-6">
//                   <h3 className="text-sm font-medium text-gray-700 mb-2">Site Supervisor</h3>
//                   <div className="flex items-center">
//                     <select
//                       className="flex-grow border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                       value={selectedSupervisor}
//                       onChange={(e) => setSelectedSupervisor(e.target.value)}
//                       disabled={loadingStates.supervisor}
//                     >
//                       <option value="">Select Site Supervisor</option>
//                       {siteSupervisors.map(user => (
//                         <option key={user.id} value={user.id}>
//                           {user.name || user.username || `User ${user.id}`}
//                         </option>
//                       ))}
//                     </select>
//                     <button
//                       onClick={handleAssignSupervisor}
//                       disabled={loadingStates.supervisor || !selectedSupervisor}
//                       className="ml-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
//                     >
//                       {loadingStates.supervisor ? 'Assigning...' : 'Assign'}
//                     </button>
//                   </div>
//                   {project?.siteSupervisor && (
//                     <div className="mt-3 p-3 bg-blue-50 rounded-md">
//                       <p className="text-sm font-medium">Current: {project.siteSupervisor.name}</p>
//                     </div>
//                   )}
//                 </div>

//                 {/* Equipment Manager Assignment */}
//                 <div>
//                   <h3 className="text-sm font-medium text-gray-700 mb-2">Equipment Manager</h3>
//                   <div className="flex items-center">
//                     <select
//                       className="flex-grow border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                       value={selectedEquipmentManager}
//                       onChange={(e) => setSelectedEquipmentManager(e.target.value)}
//                       disabled={loadingStates.equipmentManager}
//                     >
//                       <option value="">Select Equipment Manager</option>
//                       {equipmentManagers.map(user => (
//                         <option key={user.id} value={user.id}>
//                           {user.name || user.username || `User ${user.id}`}
//                         </option>
//                       ))}
//                     </select>
//                     <button
//                       onClick={handleAssignEquipmentManager}
//                       disabled={loadingStates.equipmentManager || !selectedEquipmentManager}
//                       className="ml-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
//                     >
//                       {loadingStates.equipmentManager ? 'Assigning...' : 'Assign'}
//                     </button>
//                   </div>
//                   {project?.equipmentManager && (
//                     <div className="mt-3 p-3 bg-blue-50 rounded-md">
//                       <p className="text-sm font-medium">Current: {project.equipmentManager.name}</p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Main Tasks Section */}
//             <div className="mt-8">
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-xl font-semibold text-gray-800">Main Tasks</h2>
//                 <button 
//                   onClick={() => document.getElementById('taskForm').scrollIntoView({ behavior: 'smooth' })}
//                   className="text-indigo-600 hover:text-indigo-800 flex items-center"
//                 >
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//                   </svg>
//                   Add New Task
//                 </button>
//               </div>

//               {mainTasksError ? (
//                 <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
//                   <div className="flex">
//                     <div className="flex-shrink-0">
//                       <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
//                         <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//                       </svg>
//                     </div>
//                     <div className="ml-3">
//                       <p className="text-sm text-red-700">
//                         {mainTasksError}
//                         <button 
//                           onClick={fetchMainTasks}
//                           className="ml-2 text-red-800 underline"
//                         >
//                           Try again
//                         </button>
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               ) : null}

//               {loadingStates.mainTasks ? (
//                 <div className="flex justify-center py-8">
//                   <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
//                 </div>
//               ) : mainTasks.length > 0 ? (
//                 <>
                  
//                     <div className="flex flex-col gap-4">

//                     {mainTasks.map(task => (
//                       <div key={task.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow relative">
//                         {/* Visible Edit and Delete buttons */}
//                         <div className="absolute top-3 right-3 flex gap-2">
//                           <button 
//                             onClick={() => handleEditTask(task)}
//                             className="p-1 bg-indigo-100 text-indigo-600 rounded-md hover:bg-indigo-200"
//                             title="Edit Task"
//                           >
//                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//                             </svg>
//                           </button>
//                           <button 
//                             onClick={() => handleDeleteTask(task.id)}
//                             className="p-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
//                             title="Delete Task"
//                           >
//                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                             </svg>
//                           </button>
//                         </div>
                        
//                         <h3 className="font-medium text-lg text-gray-900 mb-2 pr-8">{task.title}</h3>
//                         <p className="text-gray-600 text-sm mb-3">{task.description}</p>
//                         {/* <div className="flex justify-between text-sm text-gray-500">
//                           <span>Start: {new Date(task.plannedStartDate).toLocaleDateString()}</span>
//                           <span>End: {new Date(task.plannedEndDate).toLocaleDateString()}</span>
//                         </div> */}
//                         <div className="text-sm text-gray-500 space-y-1">
//                             <div>Start: {new Date(task.plannedStartDate).toLocaleDateString()}</div>
//                             <div>End: {new Date(task.plannedEndDate).toLocaleDateString()}</div>
//                         </div>

//                         {/* 👇 Subtask button */}
//                         <div className="mt-3 flex justify-end">
//                           <button
//                             onClick={() => handleSubtaskClick(task)}
//                             className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
//                           >
//                             Subtask
//                           </button>
//                         </div>

//                       </div>
//                     ))}
//                   </div>
                  
//                   {/* Pagination controls */}
//                   <div className="mt-6 flex items-center justify-between">
//                     <div className="text-sm text-gray-600">
//                       Showing {mainTasks.length} of {totalTasks} tasks
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <button
//                         onClick={() => handlePageChange(currentPage - 1)}
//                         disabled={currentPage === 0}
//                         className={`px-3 py-1 rounded-md ${currentPage === 0 
//                           ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
//                           : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'}`}
//                       >
//                         Previous
//                       </button>
                      
//                       <div className="flex space-x-1">
//                         {[...Array(totalPages)].map((_, i) => (
//                           <button
//                             key={i}
//                             onClick={() => handlePageChange(i)}
//                             className={`w-8 h-8 rounded-md ${
//                               currentPage === i
//                                 ? 'bg-indigo-600 text-white'
//                                 : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                             }`}
//                           >
//                             {i + 1}
//                           </button>
//                         ))}
//                       </div>
                      
//                       <button
//                         onClick={() => handlePageChange(currentPage + 1)}
//                         disabled={currentPage === totalPages - 1}
//                         className={`px-3 py-1 rounded-md ${currentPage === totalPages - 1 
//                           ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
//                           : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'}`}
//                       >
//                         Next
//                       </button>
//                     </div>
//                   </div>
//                 </>
//               ) : (
//                 <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
//                   <div className="flex">
//                     <div className="flex-shrink-0">
//                       <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
//                         <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                       </svg>
//                     </div>
//                     <div className="ml-3">
//                       <p className="text-sm text-yellow-700">
//                         No tasks created yet. Add your first task below.
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Create/Update Task Form */}
//               <div id="taskForm" className="mt-12 bg-gray-50 p-6 rounded-lg border border-gray-200">
//                 <h2 className="text-xl font-semibold text-gray-800 mb-4">
//                   {editingTaskId ? 'Update Task' : 'Create New Main Task'}
//                 </h2>
                
//                 <form onSubmit={editingTaskId ? handleUpdateTask : handleCreateMainTask} className="space-y-4">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
//                       {/* <input 
//                         id="title"
//                         name="title" 
//                         placeholder="Task title" 
//                         required 
//                         className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                         value={editingTaskId ? editingTaskData.title : undefined}
//                         onChange={editingTaskId ? handleEditChange : undefined}
//                       /> */}
//                       {/* <input 
//                             id="title"
//                             name="title" 
//                             placeholder="Task title" 
//                             required 
//                             className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                             value={editingTaskData?.title ?? ""}
//                             onChange={editingTaskId ? handleEditChange : () => {}}
//                       />                */}
//                       <input 
//   id="title"
//   name="title" 
//   placeholder="Task title" 
//   required 
//   className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//   value={editingTaskData?.title ?? ""}
//   onChange={handleEditChange}
// />


//                           </div>
//                     <div>
//                       <label htmlFor="supervisorId" className="block text-sm font-medium text-gray-700 mb-1">
//                         Supervisor
//                       </label>
//                       <select
//                         id="supervisorId"
//                         name="supervisorId"
//                         className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                         value={editingTaskId ? editingTaskData.supervisorId : undefined}
//                         onChange={editingTaskId ? handleEditChange : undefined}
//                         required
//                       >
//                         <option value="" disabled>Select Supervisor</option>
//                         {siteSupervisors.map((sup) => (
//                           <option key={sup.id} value={sup.id}>
//                             {sup.name || sup.username}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                   </div>
                  
//                   <div>
//                     <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//                     <textarea 
//                       id="description"
//                       name="description" 
//                       placeholder="Task description" 
//                       required 
//                       className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                       rows="3"
//                       value={editingTaskId ? editingTaskData.description : undefined}
//                       onChange={editingTaskId ? handleEditChange : undefined}
//                     />
//                   </div>
                  
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <label htmlFor="plannedStartDate" className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
//                       {/* <input 
//                         id="plannedStartDate"
//                         name="plannedStartDate" 
//                         type="date" 
//                         required 
//                         className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                         value={editingTaskId ? editingTaskData.plannedStartDate : undefined}
//                         onChange={editingTaskId ? handleEditChange : undefined}
//                       /> */}
//                       {/* <input 
//                             id="plannedStartDate"
//                             name="plannedStartDate" 
//                             type="date" 
//                             required 
//                             className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                             value={editingTaskId ? (editingTaskData.plannedStartDate || "") : ""}
//                             onChange={editingTaskId ? handleEditChange : () => {}}
//                         /> */}
//                         <input 
//   id="plannedStartDate"
//   name="plannedStartDate" 
//   type="date" 
//   required 
//   className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//   value={editingTaskData?.plannedStartDate ?? ""}
//   onChange={handleEditChange}
// />


//                     </div>
//                     <div>
//                       <label htmlFor="plannedEndDate" className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
//                       {/* <input 
//                         id="plannedEndDate"
//                         name="plannedEndDate" 
//                         type="date" 
//                         required 
//                         className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                         value={editingTaskId ? editingTaskData.plannedEndDate : undefined}
//                         onChange={editingTaskId ? handleEditChange : undefined}
//                       /> */}
//                                   {/* <input 
//                                   id="plannedEndDate"
//                                   name="plannedEndDate" 
//                                   type="date" 
//                                   required 
//                                   className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                                   value={editingTaskId ? (editingTaskData.plannedEndDate || '') : ''}
//                                   onChange={editingTaskId ? handleEditChange : () => {}}
//                                 /> */}
//                                 <input 
//   id="plannedEndDate"
//   name="plannedEndDate" 
//   type="date" 
//   required 
//   className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//   value={editingTaskData?.plannedEndDate ?? ''}
//   onChange={handleEditChange}
// />

                                                      

//                     </div>
//                   </div>
                  
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">Priority (1-10)</label>
//                       {/* <input 
//                         id="priority"
//                         name="priority" 
//                         type="number" 
//                         min="1" 
//                         max="10" 
//                         placeholder="Priority" 
//                         required 
//                         className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                         value={editingTaskId ? editingTaskData.priority : undefined}
//                         onChange={editingTaskId ? handleEditChange : undefined}
//                       /> */}
//                       <input 
//                             id="priority"
//                             name="priority" 
//                             type="number" 
//                             min="1"                           
//                             max="10" 
//                             placeholder="Priority" 
//                             required 
//                             className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                             value={editingTaskData.priority}
//                             onChange={handleEditChange}
//                         />

//                     </div>
//                     <div>
//                       <label htmlFor="estimatedHours" className="block text-sm font-medium text-gray-700 mb-1">Estimated Hours</label>
//                       {/* <input 
//                         id="estimatedHours"
//                         name="estimatedHours" 
//                         type="number" 
//                         placeholder="Estimated Hours" 
//                         required 
//                         className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                         value={editingTaskId ? editingTaskData.estimatedHours : undefined}
//                         onChange={editingTaskId ? handleEditChange : undefined}
//                       /> */}                           
//                         <input 
//                             id="estimatedHours"
//                             name="estimatedHours" 
//                             type="number" 
//                             placeholder="Estimated Hours" 
//                             required 
//                             className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                             value={editingTaskData.estimatedHours}
//                             onChange={handleEditChange}
//                         />

//                     </div>
//                   </div>
                  
//                   <div className="pt-4 flex space-x-3">
//                     <button 
//                       type="submit" 
//                       disabled={loadingStates.mainTasks}
//                       className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
//                     >
//                       {loadingStates.mainTasks 
//                         ? (editingTaskId ? 'Updating Task...' : 'Creating Task...') 
//                         : (editingTaskId ? 'Update Task' : 'Create Main Task')}
//                     </button>
                    
//                     {editingTaskId && (
//                       <button 
//                         type="button"
//                         onClick={() => setEditingTaskId(null)}
//                         className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
//                       >
//                         Cancel
//                       </button>
//                     )}
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div>
//       {tasks.map((task) => (
//         <div key={task.id} className="bg-white rounded-lg shadow-md p-4 mb-4 relative">
//           <h3 className="text-lg font-semibold">{task.title}</h3>
//           <p className="text-gray-600">{task.description}</p>
//           <div className="text-sm text-gray-500 space-y-1 mt-2">
//             <div>Start: {new Date(task.plannedStartDate).toLocaleDateString()}</div>
//             <div>End: {new Date(task.plannedEndDate).toLocaleDateString()}</div>
//           </div>

//           <div className="mt-3 flex justify-end">
//             <button
//               onClick={() => handleSubtaskClick(task)}
//               className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
//             >
//               Subtask
//             </button>
//           </div>

//           {subtasks[task.id] && (
//             <div className="mt-3">
//               <h4 className="font-medium text-sm">Subtasks:</h4>
//               <ul className="list-disc list-inside text-sm text-gray-700">
//                 {subtasks[task.id].map((subtask) => (
//                   <li key={subtask.id}>{subtask.title}</li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </div>
//       ))}
//     </div>
//       </div>
      
//     </div>
    
//   );
// }

























'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function ProjectDetails() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.projectId;
  const [project, setProject] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSupervisor, setSelectedSupervisor] = useState('');
  const [selectedEquipmentManager, setSelectedEquipmentManager] = useState('');
  const [message, setMessage] = useState({ type: '', content: '' });

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskPlannedStartDate, setNewTaskPlannedStartDate] = useState('');
  const [newTaskPlannedEndDate, setNewTaskPlannedEndDate] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('');
  const [newTaskEstimatedHours, setNewTaskEstimatedHours] = useState('');

  const [editingTask, setEditingTask] = useState(null);
  const [updatedTaskTitle, setUpdatedTaskTitle] = useState('');
  const [updatedTaskDescription, setUpdatedTaskDescription] = useState('');
  const [updatedTaskPlannedStartDate, setUpdatedTaskPlannedStartDate] = useState('');
  const [updatedTaskPlannedEndDate, setUpdatedTaskPlannedEndDate] = useState('');
  const [updatedTaskPriority, setUpdatedTaskPriority] = useState('');
  const [updatedTaskEstimatedHours, setUpdatedTaskEstimatedHours] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const projectRes = await fetch(`http://localhost:8080/api/pm/projects/${projectId}/structure`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!projectRes.ok) {
          const errorData = await projectRes.json();
          throw new Error(errorData.message || 'Failed to fetch project');
        }
        const projectData = await projectRes.json();
        
        if (!projectData.success) {
          throw new Error(projectData.message);
        }
        setProject(projectData.data);

        const usersRes = await fetch('http://localhost:8080/api/pm/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!usersRes.ok) {
          const errorData = await usersRes.json();
          throw new Error(errorData.message || 'Failed to fetch users');
        }
        const usersData = await usersRes.json();
        
        if (!usersData.success) {
          throw new Error(usersData.message);
        }
        setUsers(usersData.data);
        
      } catch (error) {
        console.error("Fetch error:", error);
        setMessage({ type: 'error', content: error.message || 'An unexpected error occurred.' });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId, router]);

  useEffect(() => {
    if (editingTask) {
      setUpdatedTaskTitle(editingTask.title || '');
      setUpdatedTaskDescription(editingTask.description || '');
      setUpdatedTaskPlannedStartDate(editingTask.plannedStartDate || '');
      setUpdatedTaskPlannedEndDate(editingTask.plannedEndDate || '');
      setUpdatedTaskPriority(editingTask.priority || '');
      setUpdatedTaskEstimatedHours(editingTask.estimatedHours || '');
    }
  }, [editingTask]);

  const assignSupervisor = async () => {
    if (!selectedSupervisor) {
        setMessage({ type: 'error', content: 'Please select a supervisor.' });
        return;
    }
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage({ type: 'error', content: 'Authentication token not found. Please log in again.' });
        router.push('/login');
        return;
      }

      const res = await fetch(
        `http://localhost:8080/api/pm/projects/${projectId}/assign-supervisor?supervisorId=${selectedSupervisor}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      const data = await res.json(); 

      if (data.success) {
        setProject(prev => ({
          ...prev,
          project: {
            ...prev.project,
            siteSupervisor: users.find(u => u.id == selectedSupervisor) 
          }
        }));
        setMessage({ type: 'success', content: 'Site Supervisor assigned successfully!' });
        setSelectedSupervisor('');
      } else {
        throw new Error(data.message || 'Failed to assign Site Supervisor. Unknown error.'); 
      }
    } catch (error) {
      console.error("Assign Supervisor error:", error);
      setMessage({ type: 'error', content: error.message });
    }
  };

  const assignEquipmentManager = async () => {
    if (!selectedEquipmentManager) {
        setMessage({ type: 'error', content: 'Please select an equipment manager.' });
        return;
    }
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage({ type: 'error', content: 'Authentication token not found. Please log in again.' });
        router.push('/login');
        return;
      }

      const res = await fetch(
        `http://localhost:8080/api/pm/projects/${projectId}/assign-equipment-manager?equipmentManagerId=${selectedEquipmentManager}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      const data = await res.json(); 

      if (data.success) {
        setProject(prev => ({
          ...prev,
          project: {
            ...prev.project,
            equipmentManager: users.find(u => u.id == selectedEquipmentManager) 
          }
        }));
        setMessage({ type: 'success', content: 'Equipment Manager assigned successfully!' });
        setSelectedEquipmentManager(''); 
      } else {
        throw new Error(data.message || 'Failed to assign Equipment Manager. Unknown error.');
      }
    } catch (error) {
      console.error("Assign Equipment Manager error:", error);
      setMessage({ type: 'error', content: error.message });
    }
  };

  const handleCreateMainTask = async (e) => {
    e.preventDefault();

    if (!project.project.siteSupervisor?.id) {
      setMessage({ type: 'error', content: 'Please assign a Site Supervisor to the project before creating a task.' });
      return;
    }
    
    const estimatedHoursNum = parseInt(newTaskEstimatedHours);
    if (isNaN(estimatedHoursNum) || estimatedHoursNum <= 0) {
      setMessage({ type: 'error', content: 'Estimated Hours must be a positive number.' });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage({ type: 'error', content: 'Authentication token not found. Please log in again.' });
        router.push('/login');
        return;
      }

      const newTaskData = {
        title: newTaskTitle,
        description: newTaskDescription,
        plannedStartDate: newTaskPlannedStartDate,
        plannedEndDate: newTaskPlannedEndDate,
        priority: parseInt(newTaskPriority),
        estimatedHours: estimatedHoursNum,
        supervisorId: project.project.siteSupervisor.id
      };

      const res = await fetch(`http://localhost:8080/api/pm/projects/${projectId}/main-tasks`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTaskData)
      });

      const data = await res.json();

      if (data.success) {
        setMessage({ type: 'success', content: 'Main Task created successfully!' });
        setProject(prev => ({
          ...prev,
          mainTasks: [...prev.mainTasks, data.data] 
        }));
        setNewTaskTitle('');
        setNewTaskDescription('');
        setNewTaskPlannedStartDate('');
        setNewTaskPlannedEndDate('');
        setNewTaskPriority('');
        setNewTaskEstimatedHours('');
      } else {
        throw new Error(data.message || 'Failed to create main task. Unknown error.');
      }
    } catch (error) {
      console.error("Create Task error:", error);
      setMessage({ type: 'error', content: error.message });
    }
  };

  const handleUpdateMainTask = async (e) => {
    e.preventDefault();

    if (!editingTask) return; 

    const updatedEstimatedHoursNum = parseInt(updatedTaskEstimatedHours);
    if (isNaN(updatedEstimatedHoursNum) || updatedEstimatedHoursNum <= 0) {
      setMessage({ type: 'error', content: 'Estimated Hours must be a positive number.' });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage({ type: 'error', content: 'Authentication token not found. Please log in again.' });
        router.push('/login');
        return;
      }

      const updatedTaskData = {
        id: editingTask.id, 
        title: updatedTaskTitle,
        description: updatedTaskDescription,
        plannedStartDate: updatedTaskPlannedStartDate,
        plannedEndDate: updatedTaskPlannedEndDate,
        priority: parseInt(updatedTaskPriority),
        estimatedHours: updatedEstimatedHoursNum,
        supervisorId: editingTask.supervisorId, 
      };
      
      const res = await fetch(`http://localhost:8080/api/pm/projects/${projectId}/main-tasks/${editingTask.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedTaskData)
      });

      const data = await res.json();

      if (data.success) {
        setMessage({ type: 'success', content: 'Main Task updated successfully!' });
        setProject(prev => ({
          ...prev,
          mainTasks: prev.mainTasks.map(task => 
            task.id === data.data.id ? data.data : task 
          ) 
        }));
        setEditingTask(null);
      } else {
        throw new Error(data.message || 'Failed to update main task. Unknown error.');
      }
    } catch (error) {
      console.error("Update Task error:", error);
      setMessage({ type: 'error', content: error.message });
    }
  };

  const handleDeleteMainTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task and all its subtasks? This action cannot be undone.')) {
      return;
    }
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage({ type: 'error', content: 'Authentication token not found. Please log in again.' });
        router.push('/login');
        return;
      }

      const res = await fetch(`http://localhost:8080/api/pm/projects/${projectId}/main-tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to delete task.');
      }

      setMessage({ type: 'success', content: 'Main Task and its subtasks deleted successfully!' });
      setProject(prev => ({
        ...prev,
        mainTasks: prev.mainTasks.filter(task => task.id !== taskId)
      }));
    } catch (error) {
      console.error("Delete Task error:", error);
      setMessage({ type: 'error', content: error.message });
    }
  };

  const handleSubtaskRedirect = (taskId) => {
      router.push(`/dashboard/projects/view/${projectId}/tasks/${taskId}/subtasks`);
  };

  if (loading) return <div className="flex justify-center items-center h-screen bg-gray-100"><p className="text-xl font-semibold text-indigo-600 animate-pulse">Loading project details...</p></div>;
  if (!project) return <div className="flex justify-center items-center h-screen bg-gray-100"><p className="text-xl font-semibold text-red-500">Project not found or an error occurred.</p></div>;

  const siteSupervisors = users.filter(user => 
    user.role === 'ROLE_SITE_SUPERVISOR'
  );
  
  const equipmentManagers = users.filter(user => 
    user.role === 'ROLE_EQUIPMENT_MANAGER'
  );

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
        <div className="bg-white rounded-xl shadow-2xl p-6 md:p-10 transform hover:scale-[1.005] transition-transform duration-300 ease-in-out border border-gray-200">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight leading-tight">
            {project.project.title}
          </h1>
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            {project.project.description}
          </p>
          
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">Project Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6 text-base text-gray-700">
              <DetailItem label="Project ID" value={project.project.id} />
              <DetailItem label="Status" value={
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    project.project.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                    project.project.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-800' :
                    project.project.status === 'PLANNING' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                }`}>
                  {project.project.status.replace(/_/g, ' ')}
                </span>
              } />
              <DetailItem label="Priority" value={project.project.priority} />
              <DetailItem label="Planned Start" value={project.project.startDate} />
              <DetailItem label="Planned End" value={project.project.endDate} />
              <DetailItem label="Actual Start" value={project.project.actualStartDate || '-'} />
              <DetailItem label="Actual End" value={project.project.actualEndDate || '-'} />
              <DetailItem label="Estimated Budget" value={project.project.estimatedBudget != null ? `₹${project.project.estimatedBudget.toLocaleString('en-IN')}` : '-'} />
              <DetailItem label="Actual Budget" value={project.project.actualBudget != null ? `₹${project.project.actualBudget.toLocaleString('en-IN')}` : '-'} />
              <DetailItem label="Location" value={project.project.location || '-'} />
              <DetailItem label="Overdue" value={
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    project.project.overdue ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                }`}>
                    {project.project.overdue ? 'Yes' : 'No'}
                </span>
              } />
              <div className="sm:col-span-2 lg:col-span-3">
                <h3 className="font-semibold text-gray-600 mb-2">Project Completion:</h3>
                <div className="w-48 bg-gray-200 rounded-full h-4 relative">
                    <div 
                        className="bg-indigo-500 h-4 rounded-full flex items-center justify-end pr-2 text-white text-xs font-bold transition-all duration-500 ease-out" 
                        style={{ width: `${project.project.completionPercentage}%` }}
                    >
                        {project.project.completionPercentage > 0.0 ? `${Math.round(project.project.completionPercentage)}%` : ''}
                    </div>
                    {project.project.completionPercentage === 0.0 && (
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-sm text-gray-600 font-medium">0%</span>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-2xl p-6 md:p-10 border border-gray-200">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">Personnel Management</h2>
          
          <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">Assigned Roles</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-base">
            <PersonnelItem 
              role="Project Manager" 
              person={project.project.projectManager} 
            />
            <PersonnelItem 
              role="Site Supervisor" 
              person={project.project.siteSupervisor} 
            />
            <PersonnelItem 
              role="Equipment Manager" 
              person={project.project.equipmentManager} 
            />
          </div>

          <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 mt-8 pt-6 border-t border-gray-200">Assign New Personnel</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AssignmentSection 
              title="Assign Site Supervisor"
              users={siteSupervisors}
              selectedValue={selectedSupervisor}
              onChange={e => setSelectedSupervisor(e.target.value)}
              onAssign={assignSupervisor}
              buttonColor="bg-indigo-600 hover:bg-indigo-700"
            />

            <AssignmentSection 
              title="Assign Equipment Manager"
              users={equipmentManagers}
              selectedValue={selectedEquipmentManager}
              onChange={e => setSelectedEquipmentManager(e.target.value)}
              onAssign={assignEquipmentManager}
              buttonColor="bg-purple-600 hover:bg-purple-700"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-2xl p-6 md:p-10 border border-gray-200">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">Create New Main Task</h2>
          <form onSubmit={handleCreateMainTask} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="taskTitle" className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
              <input
                type="text"
                id="taskTitle"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                required
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="taskDescription" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                id="taskDescription"
                rows="3"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 resize-y"
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                required
              ></textarea>
            </div>
            <div>
              <label htmlFor="plannedStartDate" className="block text-sm font-medium text-gray-700 mb-1">Planned Start Date</label>
              <input
                type="date"
                id="plannedStartDate"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                value={newTaskPlannedStartDate}
                onChange={(e) => setNewTaskPlannedStartDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="plannedEndDate" className="block text-sm font-medium text-gray-700 mb-1">Planned End Date</label>
              <input
                type="date"
                id="plannedEndDate"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                value={newTaskPlannedEndDate}
                onChange={(e) => setNewTaskPlannedEndDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                id="priority"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value)}
                required
              >
                <option value="">Select Priority</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="estimatedHours" className="block text-sm font-medium text-gray-700 mb-1">Estimated Hours</label>
              <input
                type="text" 
                id="estimatedHours"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                value={newTaskEstimatedHours}
                onChange={(e) => setNewTaskEstimatedHours(e.target.value.replace(/\D/g, ''))} 
                pattern="\d*" 
                inputMode="numeric" 
                required
              />
            </div>
            <div className="md:col-span-2 text-center mt-4">
              <button
                type="submit"
                className={`w-full md:w-auto px-6 py-3 rounded-md text-white font-semibold transition duration-300 ease-in-out shadow-md hover:shadow-lg ${
                  !project.project.siteSupervisor?.id 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-green-700'
                }`}
                disabled={!project.project.siteSupervisor?.id}
              >
                {project.project.siteSupervisor?.id ? 'Create Main Task' : 'Assign Site Supervisor First'}
              </button>
              {!project.project.siteSupervisor?.id && (
                <p className="text-red-500 text-sm mt-2">A Site Supervisor must be assigned to the project before creating tasks.</p>
              )}
            </div>
          </form>
        </div>

        <div className="bg-white rounded-xl shadow-2xl p-6 md:p-10 border border-gray-200">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">Main Tasks</h2>
          {project.mainTasks.length === 0 ? (
              <p className="text-gray-600 italic text-lg text-center py-8">No main tasks have been defined for this project yet. Time to get started!</p>
          ) : (
              <div className="grid grid-cols-1 gap-6">
                  {project.mainTasks.map(task => (
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
                                    onClick={() => setEditingTask(task)}
                                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-2 rounded-md transition-colors duration-200 flex items-center text-xs"
                                    aria-label={`Edit task ${task.title}`}
                                    title="Edit Task"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.38-2.828-2.828z" />
                                    </svg>
                                    Edit
                                </button>
                                <button 
                                    onClick={() => handleDeleteMainTask(task.id)}
                                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded-md transition-colors duration-200 flex items-center text-xs"
                                    aria-label={`Delete task ${task.title}`}
                                    title="Delete Task"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 11-2 0v6a1 1 0 112 0V8z" clipRule="evenodd" />
                                    </svg>
                                    Delete
                                </button>
                                <button 
                                    onClick={() => handleSubtaskRedirect(task.id)}
                                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-1 px-2 rounded-md transition-colors duration-200 flex items-center text-xs"
                                    aria-label={`View subtasks for ${task.title}`}
                                    title="View/Manage Subtasks"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M8.586 2.586A2 2 0 0110 2h4a2 2 0 012 2v4a2 2 0 01-.586 1.414l-8 8A2 2 0 015 18a2 2 0 01-1.414-.586l-4-4A2 2 0 010 12V8a2 2 0 01.586-1.414l8-8zM14 7a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                    </svg>
                                    Subtask
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-2 gap-x-6 text-sm text-gray-700 mt-4">
                          <DetailItem label="Status" value={
                              <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                                  task.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                  task.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-800' :
                                  task.status === 'PLANNING' ? 'bg-blue-100 text-blue-800' :
                                  'bg-gray-100 text-gray-800'
                              }`}>
                                {task.status.replace(/_/g, ' ')}
                              </span>
                          } isBadge={true} />
                          <DetailItem label="Supervisor" value={task.supervisorName || '-'} />
                          <DetailItem label="Est. Hours" value={`${task.estimatedHours}h`} />
                          <DetailItem label="Planned Start" value={task.plannedStartDate} />
                          <DetailItem label="Planned End" value={task.plannedEndDate} />
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
                                    style={{ width: `${task.completionPercentage}%` }}
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

        {editingTask && (
          <div className="bg-white rounded-xl shadow-2xl p-6 md:p-10 border border-gray-200">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">Update Main Task: {editingTask.title}</h2>
            <form onSubmit={handleUpdateMainTask} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="updatedTaskTitle" className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
                <input
                  type="text"
                  id="updatedTaskTitle"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  value={updatedTaskTitle}
                  onChange={(e) => setUpdatedTaskTitle(e.target.value)}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="updatedTaskDescription" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  id="updatedTaskDescription"
                  rows="3"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 resize-y"
                  value={updatedTaskDescription}
                  onChange={(e) => setUpdatedTaskDescription(e.target.value)}
                  required
                ></textarea>
              </div>
              <div>
                <label htmlFor="updatedPlannedStartDate" className="block text-sm font-medium text-gray-700 mb-1">Planned Start Date</label>
                <input
                  type="date"
                  id="updatedPlannedStartDate"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  value={updatedTaskPlannedStartDate}
                  onChange={(e) => setUpdatedTaskPlannedStartDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="updatedPlannedEndDate" className="block text-sm font-medium text-gray-700 mb-1">Planned End Date</label>
                <input
                  type="date"
                  id="updatedPlannedEndDate"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  value={updatedTaskPlannedEndDate}
                  onChange={(e) => setUpdatedPlannedEndDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="updatedPriority" className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  id="updatedPriority"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  value={updatedTaskPriority}
                  onChange={(e) => setUpdatedTaskPriority(e.target.value)}
                  required
                >
                  <option value="">Select Priority</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="updatedEstimatedHours" className="block text-sm font-medium text-gray-700 mb-1">Estimated Hours</label>
                <input
                  type="text" 
                  id="updatedEstimatedHours"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                  value={updatedTaskEstimatedHours}
                  onChange={(e) => setUpdatedEstimatedHours(e.target.value.replace(/\D/g, ''))} 
                  pattern="\d*" 
                  inputMode="numeric" 
                  required
                />
              </div>
              <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                <button
                  type="button" 
                  onClick={() => setEditingTask(null)} 
                  className="px-6 py-3 rounded-md bg-gray-500 hover:bg-gray-600 text-white font-semibold transition duration-300 ease-in-out shadow-md hover:shadow-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold transition duration-300 ease-in-out shadow-md hover:shadow-lg"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        )}
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

const PersonnelItem = ({ role, person }) => (
  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm">
    <h3 className="font-semibold text-gray-600 mb-1">{role}:</h3>
    <p className="text-gray-800 font-medium">{person?.username || '-'}</p>
    {person?.email && <p className="text-gray-500 text-xs">{person.email}</p>}
  </div>
);

const AssignmentSection = ({ title, users, selectedValue, onChange, onAssign, buttonColor }) => (
  <div className="border border-gray-200 p-5 rounded-lg bg-white shadow-sm">
    <h2 className="text-lg font-semibold text-gray-800 mb-3">{title}</h2>
    <div className="flex flex-col sm:flex-row gap-2 items-center">
      <select 
        className="flex-1 p-1.5 border border-gray-300 rounded-md bg-white text-gray-700 text-xs focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-all duration-200 max-w-[180px]"
        value={selectedValue}
        onChange={onChange}
      >
        <option value="">Select User</option>
        {users.map(user => (
          <option key={user.id} value={user.id}>
            {user.username} ({user.email})
          </option>
        ))}
      </select>
      <button 
        onClick={onAssign}
        className={`${buttonColor} text-white px-3 py-1.5 rounded-md transition duration-300 ease-in-out disabled:bg-gray-300 disabled:cursor-not-allowed text-xs font-medium shadow-md hover:shadow-lg flex-shrink-0`}
        disabled={!selectedValue}
      >
        Assign
      </button>
    </div>
  </div>
);






                          

