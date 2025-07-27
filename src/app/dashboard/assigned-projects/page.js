'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AssignedProjects() {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', content: '' });

  useEffect(() => {
    const fetchAssignedProjects = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const res = await fetch('http://localhost:8080/api/site-supervisor/projects', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Failed to fetch assigned projects.');
        }

        const data = await res.json();
        if (data.success) {
          setProjects(data.data);
        } else {
          throw new Error(data.message || 'Failed to fetch assigned projects. Unknown error.');
        }
      } catch (error) {
        console.error("Fetch assigned projects error:", error);
        setMessage({ type: 'error', content: error.message || 'An unexpected error occurred while fetching projects.' });
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedProjects();
  }, [router]);

  const handleViewProjectDetails = (projectId) => {
    router.push(`/dashboard/assigned-projects/${projectId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-xl font-semibold text-indigo-600 animate-pulse">Loading your assigned projects...</p>
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
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 tracking-tight leading-tight text-center">
          My Assigned Projects
        </h1>

        {projects.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center border border-gray-200">
            <p className="text-xl text-gray-600 font-medium">No projects currently assigned to you.</p>
            <p className="text-gray-500 mt-2">Please check back later or contact your Project Manager.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Table Header like structure for consistency */}
            <div className="hidden md:grid grid-cols-6 lg:grid-cols-7 gap-4 px-6 py-3 bg-gray-50 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <div className="col-span-2">Project Title</div>
                <div>Status</div>
                <div>Priority</div>
                <div>Manager</div>
                <div>Planned Dates</div>
                <div className="hidden lg:block">Completion</div> {/* Only show on larger screens */}
            </div>

            {/* List Items */}
            <div className="divide-y divide-gray-200">
              {projects.map((project) => (
                <div 
                  key={project.id} 
                  onClick={() => handleViewProjectDetails(project.id)}
                  className="block px-6 py-4 hover:bg-indigo-50 transition-colors duration-200 cursor-pointer"
                >
                  <div className="md:grid md:grid-cols-6 lg:grid-cols-7 gap-4 items-center">
                    {/* Project Title & Description (Mobile: Stacked, Desktop: Col 1-2) */}
                    <div className="col-span-2 mb-2 md:mb-0">
                      <h2 className="text-lg font-semibold text-gray-900 truncate" title={project.title}>
                        {project.title}
                      </h2>
                      <p className="text-gray-600 text-sm line-clamp-2 md:line-clamp-1">
                        {project.description}
                      </p>
                    </div>

                    {/* Status (Col 3) */}
                    <div className="mb-2 md:mb-0">
                      <DetailItem label="Status" value={
                        <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                            project.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                            project.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-800' :
                            project.status === 'PLANNING' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                        }`}>
                          {project.status.replace(/_/g, ' ')}
                        </span>
                      } isBadge={true} hideLabelOnDesktop={true} />
                    </div>

                    {/* Priority (Col 4) */}
                    <div className="mb-2 md:mb-0">
                      <DetailItem label="Priority" value={project.priority} hideLabelOnDesktop={true} />
                    </div>

                    {/* Project Manager (Col 5) */}
                    <div className="mb-2 md:mb-0">
                      <DetailItem label="Manager" value={project.projectManagerName || '-'} hideLabelOnDesktop={true} />
                    </div>

                    {/* Planned Dates (Col 6) */}
                    <div className="mb-2 md:mb-0">
                        <DetailItem label="Planned Dates" value={`${project.startDate} to ${project.endDate}`} hideLabelOnDesktop={true} />
                    </div>
                    
                    {/* Completion Percentage (Col 7 - Hidden on smaller screens) */}
                    <div className="col-span-full md:col-span-1 lg:block mb-2 md:mb-0">
                        <h4 className="font-semibold text-gray-600 text-sm md:hidden">Completion:</h4> {/* Label for mobile */}
                        <div className="w-full bg-gray-200 rounded-full h-2 relative">
                            <div 
                                className="bg-indigo-500 h-2 rounded-full flex items-center justify-end pr-1 text-white text-xs font-bold transition-all duration-500 ease-out" 
                                style={{ width: `${project.completionPercentage}%` }}
                            >
                                {project.completionPercentage > 0 ? `${Math.round(project.completionPercentage)}%` : ''}
                            </div>
                            {project.completionPercentage === 0 && (
                                <span className="absolute left-1 top-1/2 -translate-y-1/2 text-xs text-gray-600 font-medium">0%</span>
                            )}
                        </div>
                    </div>
                  </div>

                  {/* Other details for mobile/smaller screens (optional, if space allows) */}
                  <div className="md:hidden grid grid-cols-2 gap-y-1 gap-x-4 text-sm text-gray-700 mt-2 border-t pt-2 border-gray-100">
                    <DetailItem label="Project ID" value={project.id} />
                    <DetailItem label="Estimated Budget" value={project.estimatedBudget != null ? `₹${project.estimatedBudget.toLocaleString('en-IN')}` : '-'} />
                    <DetailItem label="Location" value={project.location || '-'} />
                    <DetailItem label="Overdue" value={
                      <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                          project.overdue ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                          {project.overdue ? 'Yes' : 'No'}
                      </span>
                    } isBadge={true} />
                    {project.equipmentManager && (
                      <DetailItem label="Eq. Manager" value={project.equipmentManager.username} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Reusable DetailItem Component (updated to conditionally hide label on desktop)
const DetailItem = ({ label, value, isBadge = false, hideLabelOnDesktop = false }) => (
  <div className="flex items-center">
    <h3 className={`font-semibold text-gray-600 text-sm mr-1 ${hideLabelOnDesktop ? 'md:hidden' : ''}`}>{label}:</h3>
    {isBadge ? value : <p className="text-gray-800 text-sm">{value}</p>}
  </div>
);