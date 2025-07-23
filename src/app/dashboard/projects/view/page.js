// // src/app/dashboard/projects/view/page.js
// 'use client'

// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';

// export default function ViewProjectsPage() {
//   const [projects, setProjects] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [pagination, setPagination] = useState({
//     currentPage: 0,
//     totalPages: 0,
//     totalItems: 0,
//     pageSize: 10
//   });
//   const router = useRouter();

//   useEffect(() => {
//     fetchProjects(0);
//   }, []);

//   const fetchProjects = async (page) => {
//     try {
//       setLoading(true);
//       setError('');
      
//       const token = localStorage.getItem('token');
//       if (!token) {
//         setError('Authentication token not found. Please log in again.');
//         router.push('/login');
//         return;
//       }

//       const response = await axios.get(
//         `http://localhost:8080/api/pm/projects/manager?page=${page}&size=${pagination.pageSize}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           },
//           timeout: 10000 // 10 seconds timeout
//         }
//       );

//       // Handle API response structure
//       if (response.data && response.data.data) {
//         setProjects(response.data.data.content || []);
//         setPagination({
//           currentPage: response.data.data.number || page,
//           totalPages: response.data.data.totalPages || 0,
//           totalItems: response.data.data.totalElements || 0,
//           pageSize: response.data.data.size || pagination.pageSize
//         });
//       } else {
//         throw new Error('Invalid API response structure');
//       }
//     } catch (err) {
//       handleFetchError(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFetchError = (err) => {
//     let errorMessage = 'Failed to load projects';
    
//     if (err.response) {
//       // Server responded with error status
//       if (err.response.status === 401) {
//         setError('Your session has expired. Please log in again.');
//         setTimeout(() => router.push('/login'), 2000);
//         return;
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
    
//     setError(errorMessage);
//     console.error('Project fetch error:', err);
//   };

//   const handlePageChange = (newPage) => {
//     if (newPage >= 0 && newPage < pagination.totalPages) {
//       fetchProjects(newPage);
//     }
//   };

//   const renderPagination = () => {
//     if (pagination.totalPages <= 1) return null;

//     // Calculate visible page range (max 5 pages)
//     let startPage = Math.max(0, pagination.currentPage - 2);
//     let endPage = Math.min(pagination.totalPages - 1, startPage + 4);
    
//     // Adjust if we're at the beginning
//     if (endPage - startPage < 4) {
//       startPage = Math.max(0, endPage - 4);
//     }

//     const pageNumbers = [];
//     for (let i = startPage; i <= endPage; i++) {
//       pageNumbers.push(i);
//     }

//     return (
//       <div className="flex items-center justify-between mt-6 px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
//         <div className="flex-1 flex justify-between sm:hidden">
//           <button
//             onClick={() => handlePageChange(pagination.currentPage - 1)}
//             disabled={pagination.currentPage === 0}
//             className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
//           >
//             Previous
//           </button>
//           <button
//             onClick={() => handlePageChange(pagination.currentPage + 1)}
//             disabled={pagination.currentPage === pagination.totalPages - 1}
//             className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
//           >
//             Next
//           </button>
//         </div>
        
//         <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
//           <div>
//             <p className="text-sm text-gray-700">
//               Showing <span className="font-medium">{Math.min(pagination.currentPage * pagination.pageSize + 1, pagination.totalItems)}</span> to{' '}
//               <span className="font-medium">
//                 {Math.min((pagination.currentPage + 1) * pagination.pageSize, pagination.totalItems)}
//               </span>{' '}
//               of <span className="font-medium">{pagination.totalItems}</span> projects
//             </p>
//           </div>
//           <div>
//             <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
//               <button
//                 onClick={() => handlePageChange(pagination.currentPage - 1)}
//                 disabled={pagination.currentPage === 0}
//                 className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
//               >
//                 <span className="sr-only">Previous</span>
//                 &larr; Prev
//               </button>
              
//               <div className="flex">
//                 {pageNumbers.map(page => (
//                   <button
//                     key={page}
//                     onClick={() => handlePageChange(page)}
//                     className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium
//                       ${page === pagination.currentPage 
//                         ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600' 
//                         : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'}`}
//                   >
//                     {page + 1}
//                   </button>
//                 ))}
//               </div>
              
//               <button
//                 onClick={() => handlePageChange(pagination.currentPage + 1)}
//                 disabled={pagination.currentPage === pagination.totalPages - 1}
//                 className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
//               >
//                 <span className="sr-only">Next</span>
//                 Next &rarr;
//               </button>
//             </nav>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
//         <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mb-4"></div>
//         <p className="text-gray-600">Loading projects...</p>
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
//           <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Projects</h2>
//           <p className="text-gray-600 mb-6">{error}</p>
//           <div className="flex flex-col sm:flex-row gap-4 justify-center">
//             <button 
//               onClick={() => fetchProjects(0)}
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
//               onClick={() => router.push('/dashboard')}
//               className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
//             >
//               Back to Dashboard
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="bg-white shadow rounded-lg overflow-hidden">
//           <div className="px-6 py-4 border-b border-gray-200">
//             <div className="flex flex-col md:flex-row md:items-center md:justify-between">
//               <div>
//                 <h1 className="text-2xl font-bold text-gray-800">Project Management</h1>
//                 <p className="mt-1 text-sm text-gray-600">View and manage all projects</p>
//               </div>
//               <div className="mt-4 md:mt-0">
//                 <Link 
//                   href="/dashboard/projects/create"
//                   className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
//                 >
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//                   </svg>
//                   Create New Project
//                 </Link>
//               </div>
//             </div>
//           </div>

//           <div className="px-6 py-4 bg-gray-50 text-sm text-gray-500">
//             <div className="flex flex-col sm:flex-row justify-between">
//               <div>
//                 Showing {projects.length} of {pagination.totalItems} projects
//               </div>
//               <div className="mt-2 sm:mt-0">
//                 Page {pagination.currentPage + 1} of {pagination.totalPages}
//               </div>
//             </div>
//           </div>

//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Project
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Dates
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Budget
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {projects.length === 0 ? (
//                   <tr>
//                     <td colSpan="5" className="px-6 py-8 text-center">
//                       <div className="flex flex-col items-center justify-center">
//                         <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                         </svg>
//                         <h3 className="mt-4 text-lg font-medium text-gray-900">No projects found</h3>
//                         <p className="mt-1 text-gray-500">Get started by creating a new project</p>
//                         <div className="mt-6">
//                           <Link 
//                             href="/dashboard/projects/create"
//                             className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
//                           >
//                             Create Project
//                           </Link>
//                         </div>
//                       </div>
//                     </td>
//                   </tr>
//                 ) : (
//                   projects.map((project) => (
//                     <tr key={project.id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4">
//                         <div className="flex items-center">
//                           <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
//                             <span className="text-indigo-800 font-medium">{project.title.charAt(0)}</span>
//                           </div>
//                           <div className="ml-4">
//                             <div className="text-sm font-medium text-gray-900">{project.title}</div>
//                             <div className="text-sm text-gray-500">ID: {project.id}</div>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="text-sm text-gray-900">
//                           <div>Start: {new Date(project.startDate).toLocaleDateString()}</div>
//                           <div>End: {new Date(project.endDate).toLocaleDateString()}</div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
//                           ${project.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 
//                             project.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' : 
//                             project.status === 'ON_HOLD' ? 'bg-yellow-100 text-yellow-800' :
//                             'bg-red-100 text-red-800'}`}>
//                           {project.status ? project.status.replace('_', ' ') : 'UNKNOWN'}
//                         </span>
//                         <div className="mt-2">
//                           <div className="w-full bg-gray-200 rounded-full h-2">
//                             <div 
//                               className="bg-indigo-600 h-2 rounded-full" 
//                               style={{ width: `${project.completionPercentage || 0}%` }}
//                             ></div>
//                           </div>
//                           <div className="text-xs text-gray-500 mt-1">{project.completionPercentage || 0}% complete</div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 text-sm text-gray-500">
//                         <div className="text-gray-900 font-medium">
//                           ₹{(project.estimatedBudget || 0).toLocaleString()}
//                         </div>
//                         <div>Priority: {project.priority || 'N/A'}</div>
//                       </td>
//                       <td className="px-6 py-4 text-sm font-medium">
//                         <Link 
//                           href={`/dashboard/projects/view/${project.id}`}
//                           className="inline-flex items-center text-indigo-600 hover:text-indigo-900"
//                         >
//                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                           </svg>
//                           View
//                         </Link>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {projects.length > 0 && renderPagination()}
//         </div>
//       </div>
//     </div>
//   );
// }


// src/app/dashboard/projects/view/page.js
'use client'

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ViewProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalItems: 0,
    pageSize: 10
  });
  const router = useRouter();

  useEffect(() => {
    fetchProjects(0);
  }, []);

  const fetchProjects = async (page) => {
    try {
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found. Please log in again.');
        router.push('/login');
        return;
      }

      const response = await axios.get(
        `http://localhost:8080/api/pm/projects/manager?page=${page}&size=${pagination.pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000 // 10 seconds timeout
        }
      );

      // Handle API response structure
      if (response.data && response.data.data) {
        setProjects(response.data.data.content || []);
        setPagination({
          currentPage: response.data.data.number || page,
          totalPages: response.data.data.totalPages || 0,
          totalItems: response.data.data.totalElements || 0,
          pageSize: response.data.data.size || pagination.pageSize
        });
      } else {
        throw new Error('Invalid API response structure');
      }
    } catch (err) {
      handleFetchError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchError = (err) => {
    let errorMessage = 'Failed to load projects';
    
    if (err.response) {
      // Server responded with error status
      if (err.response.status === 401) {
        setError('Your session has expired. Please log in again.');
        setTimeout(() => router.push('/login'), 2000);
        return;
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
    
    setError(errorMessage);
    console.error('Project fetch error:', err);
  };

  const deleteProject = async (projectId) => {
    if (!window.confirm(`Are you sure you want to delete project ${projectId}?`)) {
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found. Please log in again.');
        router.push('/login');
        return;
      }

      await axios.delete(
        `http://localhost:8080/api/pm/projects/${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );

      // Refresh projects after successful deletion
      fetchProjects(pagination.currentPage);
    } catch (err) {
      let errorMessage = 'Failed to delete project';
      if (err.response) {
        if (err.response.status === 401) {
          setError('Your session has expired. Please log in again.');
          setTimeout(() => router.push('/login'), 2000);
          return;
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      console.error('Delete error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      fetchProjects(newPage);
    }
  };

  const renderPagination = () => {
    if (pagination.totalPages <= 1) return null;

    // Calculate visible page range (max 5 pages)
    let startPage = Math.max(0, pagination.currentPage - 2);
    let endPage = Math.min(pagination.totalPages - 1, startPage + 4);
    
    // Adjust if we're at the beginning
    if (endPage - startPage < 4) {
      startPage = Math.max(0, endPage - 4);
    }

    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex items-center justify-between mt-6 px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 0}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages - 1}
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
        
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{Math.min(pagination.currentPage * pagination.pageSize + 1, pagination.totalItems)}</span> to{' '}
              <span className="font-medium">
                {Math.min((pagination.currentPage + 1) * pagination.pageSize, pagination.totalItems)}
              </span>{' '}
              of <span className="font-medium">{pagination.totalItems}</span> projects
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 0}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                <span className="sr-only">Previous</span>
                &larr; Prev
              </button>
              
              <div className="flex">
                {pageNumbers.map(page => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium
                      ${page === pagination.currentPage 
                        ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600' 
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'}`}
                  >
                    {page + 1}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages - 1}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                <span className="sr-only">Next</span>
                Next &rarr;
              </button>
            </nav>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mb-4"></div>
        <p className="text-gray-600">Loading projects...</p>
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
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Projects</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => fetchProjects(0)}
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
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Project Management</h1>
                <p className="mt-1 text-sm text-gray-600">View and manage all projects</p>
              </div>
              <div className="mt-4 md:mt-0">
                <Link 
                  href="/dashboard/projects/create"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Create New Project
                </Link>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 text-sm text-gray-500">
            <div className="flex flex-col sm:flex-row justify-between">
              <div>
                Showing {projects.length} of {pagination.totalItems} projects
              </div>
              <div className="mt-2 sm:mt-0">
                Page {pagination.currentPage + 1} of {pagination.totalPages}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Project
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dates
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Budget
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {projects.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="mt-4 text-lg font-medium text-gray-900">No projects found</h3>
                        <p className="mt-1 text-gray-500">Get started by creating a new project</p>
                        <div className="mt-6">
                          <Link 
                            href="/dashboard/projects/create"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                          >
                            Create Project
                          </Link>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  projects.map((project) => (
                    <tr key={project.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                            <span className="text-indigo-800 font-medium">{project.title.charAt(0)}</span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{project.title}</div>
                            <div className="text-sm text-gray-500">ID: {project.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          <div>Start: {new Date(project.startDate).toLocaleDateString()}</div>
                          <div>End: {new Date(project.endDate).toLocaleDateString()}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${project.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 
                            project.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' : 
                            project.status === 'ON_HOLD' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'}`}>
                          {project.status ? project.status.replace('_', ' ') : 'UNKNOWN'}
                        </span>
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-indigo-600 h-2 rounded-full" 
                              style={{ width: `${project.completionPercentage || 0}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">{project.completionPercentage || 0}% complete</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div className="text-gray-900 font-medium">
                          ₹{(project.estimatedBudget || 0).toLocaleString()}
                        </div>
                        <div>Priority: {project.priority || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        <div className="flex space-x-4">
                          <Link 
                            href={`/dashboard/projects/view/${project.id}`}
                            className="inline-flex items-center text-indigo-600 hover:text-indigo-900"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            View
                          </Link>
                          
                          <Link 
                            href={`/dashboard/projects/update/${project.id}`}
                            className="inline-flex items-center text-yellow-600 hover:text-yellow-900"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Update
                          </Link>
                          
                          <button
                            onClick={() => deleteProject(project.id)}
                            className="inline-flex items-center text-red-600 hover:text-red-900"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {projects.length > 0 && renderPagination()}
        </div>
      </div>
    </div>
  );
}





























