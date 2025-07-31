'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useRouter } from 'next/navigation';
import { format, parseISO } from 'date-fns';

// Reusable DetailItem Component
const DetailItem = ({ label, value, className = '' }) => (
  <div className={`flex items-center text-sm ${className}`}>
    <h3 className="font-semibold text-gray-600 mr-1">{label}:</h3>
    <p className="text-gray-800">{value}</p>
  </div>
);

// Helper for status badges
const getStatusBadge = (status) => {
  let bgColor = 'bg-gray-100';
  let textColor = 'text-gray-800';
  switch (status) {
    case 'PLANNED':
      bgColor = 'bg-blue-100';
      textColor = 'text-blue-800';
      break;
    case 'ASSIGNED':
      bgColor = 'bg-indigo-100';
      textColor = 'text-indigo-800';
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

export default function SubtaskList() {
  const { token } = useSelector((state) => state.auth);
  const params = useParams();
  const router = useRouter();

  const projectId = params.projectId;
  const mainTaskId = params.maintaskid;

  const [subtasks, setSubtasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSubtasks = async () => {
    if (!token || !mainTaskId) {
      setError("Authentication token or Main Task ID missing.");
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
  }, [mainTaskId, token]);

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
          onClick={() => router.back()}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center mb-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 mr-4"
          >
            &larr; Back
          </button>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 text-center">
            Subtasks for Main Task #{mainTaskId}
          </h1>
        </div>

        {subtasks.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-200">
            <p className="text-xl text-gray-600">No subtasks defined for this main task yet.</p>
            <p className="text-gray-500 mt-2">Add subtasks to manage detailed work.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {subtasks.map((subtask) => (
              <div
                key={subtask.id}
                className="border border-gray-200 rounded-xl shadow-lg p-6 bg-white hover:shadow-xl transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{subtask.title}</h3>
                    <p className="text-gray-600 text-sm">{subtask.description}</p>
                  </div>
                  {getStatusBadge(subtask.status)}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-gray-700">
                  <DetailItem
                    label="Start"
                    value={subtask.plannedStart ? format(parseISO(subtask.plannedStart), 'dd MMM HH:mm') : '-'}
                  />
                  <DetailItem
                    label="End"
                    value={subtask.plannedEnd ? format(parseISO(subtask.plannedEnd), 'dd MMM HH:mm') : '-'}
                  />
                  <DetailItem label="Hours" value={`${subtask.estimatedHours}h`} />
                  <DetailItem label="Workers" value={subtask.requiredWorkers} />
                  <DetailItem label="Priority" value={subtask.priority} />
                </div>

                {/* 🔹 Required Skills */}
                {subtask.requiredSkills?.length > 0 && (
                  <div className="mt-5 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                    <h4 className="font-bold text-yellow-800 flex items-center text-sm mb-2">
                      🔧 Required Skills
                    </h4>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {subtask.requiredSkills.map((skill, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-yellow-200 text-yellow-800 text-xs font-bold rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* 🔹 Equipment Needed (Requested) */}
                {subtask.equipmentNeeds?.length > 0 && (
                  <div className="mt-5 p-4 bg-purple-50 border border-purple-200 rounded-xl">
                    <h4 className="font-bold text-purple-800 flex items-center text-sm mb-2">
                      🛠️ Equipment Requested
                    </h4>
                    <ul className="space-y-1">
                      {subtask.equipmentNeeds.map((eq) => (
                        <li key={eq.id} className="text-sm">
                          <strong>{eq.name}</strong> ({eq.model})
                        </li>
                      ))}
                    </ul>
                    {subtask.equipmentRequestNotes && (
                      <p className="text-xs text-purple-700 mt-2 italic">
                        Notes: {subtask.equipmentRequestNotes}
                      </p>
                    )}
                  </div>
                )}
                
                {/* 🔹 Equipment Assigned */}
                {subtask.equipmentAssignments?.length > 0 && (
                  <div className="mt-5 p-4 bg-teal-50 border border-teal-200 rounded-xl">
                    <h4 className="font-bold text-teal-800 flex items-center text-sm mb-3">
                      🚚 Equipment Assigned
                    </h4>
                    <ul className="space-y-2">
                      {subtask.equipmentAssignments.map((assignment) => (
                        <li
                          key={assignment.id}
                          className="bg-white text-sm p-3 rounded-md shadow-sm border border-teal-200"
                        >
                          <div>
                            <strong>{assignment.equipment.name}</strong> ({assignment.equipment.model})
                            <span className="text-xs text-gray-500 block mt-1">
                              Assigned by: {assignment.assignedBy.username}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 🔹 Assigned Workers */}
                {subtask.workerAssignments?.length > 0 && (
                  <div className="mt-5 p-4 bg-green-50 border border-green-200 rounded-xl">
                    <h4 className="font-bold text-green-800 flex items-center text-sm mb-3">
                      👷 Assigned Workers
                    </h4>
                    <ul className="space-y-2">
                      {subtask.workerAssignments.map((assignment) => (
                        <li
                          key={assignment.id}
                          className="bg-white text-sm p-3 rounded-md shadow-sm border border-green-200"
                        >
                          <div>
                            <strong>{assignment.worker.username}</strong>
                            <span className="text-gray-600 ml-2">({assignment.worker.email})</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}