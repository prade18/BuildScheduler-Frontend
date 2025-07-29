// src/app/dashboard/projects/view/[projectId]/subtask/[maintaskid]/page.js
'use client'; // This directive is necessary for client-side components in Next.js App Router

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useRouter } from 'next/navigation'; // For getting route params and navigation
import { format, parseISO } from 'date-fns'; // For date formatting

export default function SubtaskList() {
  const { token } = useSelector((state) => state.auth);
  const params = useParams(); // Hook to get dynamic route parameters
  const router = useRouter(); // Hook to programmatically navigate

  const projectId = params.projectId; // Get projectId from the URL
  const mainTaskId = params.maintaskid; // Get mainTaskId from the URL

  const [subtasks, setSubtasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper function to get priority text
  const getPriorityText = (priority) => {
    switch (priority) {
      case 1: return 'Low';
      case 2: return 'Medium';
      case 3: return 'High';
      case 4: return 'Critical';
      default: return 'N/A';
    }
  };

  // Helper function to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'PLANNED': return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'ON_HOLD': return 'bg-gray-100 text-gray-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const fetchSubtasks = async () => {
    if (!token || !mainTaskId) {
      setError("Authentication token or Main Task ID missing for subtasks.");
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/api/site-supervisor/main-tasks/${mainTaskId}/subtasks`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setSubtasks(data.data || []);
      } else {
        setError(data.message || 'Failed to fetch subtasks.');
        console.error('API Error:', data.message);
      }
    } catch (err) {
      setError('An error occurred while fetching subtasks.');
      console.error('Fetch Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubtasks();
  }, [mainTaskId, token]); // Re-fetch if mainTaskId or token changes

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <p className="text-lg text-gray-600">Loading subtasks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-10 text-center">
        <p className="text-lg text-red-600">Error: {error}</p>
        <button
          onClick={() => router.back()} // Go back to the previous page
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center mb-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 mr-4"
        >
          &larr; Back to Main Tasks
        </button>
        <h1 className="text-4xl font-extrabold text-gray-900">Subtasks for Main Task #{mainTaskId}</h1>
      </div>

      {subtasks.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center border border-gray-200 mt-8">
          <p className="text-xl text-gray-600">No subtasks defined for this main task yet.</p>
          <p className="text-gray-500 mt-2">Add subtasks to manage detailed work.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {subtasks.map((subtask) => (
            <div key={subtask.id} className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold text-gray-900">{subtask.title}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(subtask.status)}`}>
                  {subtask.status.replace(/_/g, ' ')}
                </span>
              </div>
              <p className="text-gray-600 mb-4 text-sm">{subtask.description}</p>

              <div className="space-y-2 text-gray-700 text-sm">
                <div>
                  <p className="font-semibold">Planned: </p>
                  <p>{subtask.plannedStart ? format(parseISO(subtask.plannedStart), 'MMM d, yyyy HH:mm') : 'N/A'} - {subtask.plannedEnd ? format(parseISO(subtask.plannedEnd), 'MMM d, yyyy HH:mm') : 'N/A'}</p>
                </div>
                <div>
                  <p className="font-semibold">Priority: </p>
                  <p>{getPriorityText(subtask.priority)}</p>
                </div>
                <div>
                  <p className="font-semibold">Est. Hours: </p>
                  <p>{subtask.estimatedHours || 'N/A'}</p>
                </div>
                <div>
                  <p className="font-semibold">Required Workers: </p>
                  <p>{subtask.requiredWorkers || 'N/A'}</p>
                </div>
                {subtask.requiredSkills && subtask.requiredSkills.length > 0 && (
                  <div>
                    <p className="font-semibold">Required Skills:</p>
                    <p className="flex flex-wrap gap-1">
                      {subtask.requiredSkills.map((skill, index) => (
                        <span key={index} className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">{skill}</span>
                      ))}
                    </p>
                  </div>
                )}
                {subtask.equipmentNeeds && subtask.equipmentNeeds.length > 0 && (
                  <div>
                    <p className="font-semibold">Equipment Needed:</p>
                    <ul className="list-disc list-inside text-xs">
                      {subtask.equipmentNeeds.map((eq) => (
                        <li key={eq.id}>{eq.name} ({eq.model})</li>
                      ))}
                    </ul>
                  </div>
                )}
                {subtask.equipmentRequestNotes && (
                  <div>
                    <p className="font-semibold">Equipment Notes:</p>
                    <p className="text-xs italic">{subtask.equipmentRequestNotes}</p>
                  </div>
                )}
              </div>
              {/* Add buttons for subtask specific actions here if needed later (e.g., Edit Subtask) */}
              {/* <div className="flex justify-end gap-3 mt-6">
                <button className="px-3 py-1 bg-blue-500 text-white rounded-md">Edit Subtask</button>
              </div> */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}