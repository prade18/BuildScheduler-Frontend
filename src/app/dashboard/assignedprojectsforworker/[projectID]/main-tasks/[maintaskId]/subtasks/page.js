'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { format, parseISO } from 'date-fns';
import { FaArrowLeft, FaSpinner, FaExclamationCircle, FaClipboardList, FaCheckCircle, FaUser } from 'react-icons/fa';
import axios from 'axios';

// Helper function to decode JWT token to get user info
const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Failed to decode token:', e);
    return null;
  }
};

// Reusable DetailItem Component for consistent display
const DetailItem = ({ label, value, className = '' }) => (
  <div className={`flex items-center text-sm ${className}`}>
    <h3 className="font-semibold text-gray-600 mr-1.5 min-w-max">{label}:</h3>
    <p className="text-gray-800 truncate max-w-xs">{value || '-'}</p>
  </div>
);

// Status Badge Component
const getStatusBadge = (status) => {
  let bgColor = 'bg-gray-100';
  let textColor = 'text-gray-800';
  let ringColor = 'ring-gray-200';

  switch (status) {
    case 'PLANNED':
      bgColor = 'bg-blue-50'; textColor = 'text-blue-700'; ringColor = 'ring-blue-200';
      break;
    case 'ASSIGNED':
      bgColor = 'bg-indigo-50'; textColor = 'text-indigo-700'; ringColor = 'ring-indigo-200';
      break;
    case 'IN_PROGRESS':
      bgColor = 'bg-yellow-50'; textColor = 'text-yellow-700'; ringColor = 'ring-yellow-200';
      break;
    case 'COMPLETED':
      bgColor = 'bg-green-50'; textColor = 'text-green-700'; ringColor = 'ring-green-200';
      break;
    case 'ON_HOLD':
      bgColor = 'bg-purple-50'; textColor = 'text-purple-700'; ringColor = 'ring-purple-200';
      break;
    case 'CANCELLED':
      bgColor = 'bg-red-50'; textColor = 'text-red-700'; ringColor = 'ring-red-200';
      break;
    case 'DELAYED':
      bgColor = 'bg-orange-50'; textColor = 'text-orange-700'; ringColor = 'ring-orange-200';
      break;
    default:
      break;
  }
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor} ring-1 ${ringColor} shadow-sm`}
    >
      {status.replace(/_/g, ' ')}
    </span>
  );
};

export default function SubtasksPage() {
  const router = useRouter();
  const params = useParams();
  const mainTaskId = params.maintaskId;
  const projectID = params.projectID;

  const [subtasks, setSubtasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null); // State to hold the current user's ID

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = decodeToken(token);
      if (decoded && decoded.userId) {
        setCurrentUserId(decoded.userId);
      }
    }
  }, []);

  useEffect(() => {
    if (mainTaskId) {
      const fetchSubtasks = async () => {
        setLoading(true);
        setError(null);
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            router.push('/login');
            return;
          }
          
          const res = await axios.get(`http://localhost:8080/api/site-supervisor/main-tasks/${mainTaskId}/subtasks`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (res.data.success) {
            setSubtasks(res.data.data);
          } else {
            setError(res.data.message || 'Failed to fetch subtasks.');
          }
        } catch (err) {
          setError(err.response?.data?.message || 'An error occurred while fetching subtasks.');
          console.error('Fetch Error:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchSubtasks();
    } else {
      setLoading(false);
      setError('Main Task ID not found in URL. Please navigate from a project\'s main tasks.');
    }
  }, [mainTaskId, projectID, router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
        <FaSpinner className="animate-spin text-5xl text-indigo-600" />
        <p className="mt-4 text-2xl font-semibold text-indigo-600">Loading subtasks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 p-6">
        <div className="bg-white p-8 rounded-xl shadow-md text-center">
          <FaExclamationCircle className="text-red-500 text-4xl mb-4" />
          <p className="text-xl text-red-500 font-semibold mb-4">Error: {error}</p>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center mb-6">
          <button
            onClick={() => router.push(`/dashboard/assignedprojectsforworker/${projectID}`)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 mr-4"
          >
            <FaArrowLeft className="inline-block mr-2" /> Back to Main Tasks
          </button>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Subtasks for Main Task #{mainTaskId}
          </h1>
        </div>

        <div className="bg-white rounded-xl shadow-2xl p-6 md:p-10 border border-gray-200">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
            <FaClipboardList className="inline-block mr-2 text-blue-600" />
            Subtask List
          </h2>
          {subtasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📋</div>
              <p className="text-gray-500 text-lg">No subtasks found for this main task.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {subtasks.map((subtask) => {
                const isCurrentUserAssigned = subtask.workerAssignments?.some(
                  (assignment) => assignment.worker.id === currentUserId
                );
                
                return (
                  <div
                    key={subtask.id}
                    className={`bg-white rounded-2xl shadow-lg border-2 overflow-hidden hover:shadow-xl transition-all duration-300 ${
                      isCurrentUserAssigned ? 'border-green-500' : 'border-gray-200'
                    }`}
                  >
                    {/* Header */}
                    <div className="p-6 border-b bg-gradient-to-r from-gray-50 to-indigo-50">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900">
                            {subtask.title}
                            {isCurrentUserAssigned && (
                              <span className="ml-3 px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
                                <FaCheckCircle className="inline mr-1" /> Assigned to you
                              </span>
                            )}
                          </h3>
                          <p className="text-gray-600 mt-1">{subtask.description}</p>
                        </div>
                        <div>{getStatusBadge(subtask.status)}</div>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                        <DetailItem
                          label="Planned Start"
                          value={subtask.plannedStart ? format(parseISO(subtask.plannedStart), 'dd MMM HH:mm') : '-'}
                        />
                        <DetailItem
                          label="Planned End"
                          value={subtask.plannedEnd ? format(parseISO(subtask.plannedEnd), 'dd MMM HH:mm') : '-'}
                        />
                        <DetailItem label="Est. Hours" value={`${subtask.estimatedHours}h`} />
                        <DetailItem label="Workers Needed" value={subtask.requiredWorkers} />
                        <DetailItem label="Priority" value={subtask.priority} />
                      </div>

                      {/* 🔹 Required Skills */}
                      {subtask.requiredSkills?.length > 0 && (
                        <div className="mt-6 p-5 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                          <h4 className="font-bold text-yellow-800 flex items-center gap-2 text-sm mb-4">
                            <span className="text-lg">🛠️</span>
                            Required Skills
                          </h4>
                          <div className="flex flex-wrap gap-2">
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
                      
                      {/* 🔹 Equipment Assigned */}
                      {subtask.equipmentAssignments?.length > 0 && (
                        <div className="mt-6 p-5 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl border border-teal-200">
                          <h4 className="font-bold text-teal-800 flex items-center gap-2 text-sm mb-4">
                            <span className="text-lg">🚚</span>
                            Equipment Assigned
                            {isCurrentUserAssigned && (
                              <span className="ml-3 px-2 py-0.5 bg-white text-teal-700 text-xs font-semibold rounded-full shadow-sm">
                                You can use this equipment
                              </span>
                            )}
                          </h4>
                          <ul className="space-y-3">
                            {subtask.equipmentAssignments.map((assignment) => (
                              <li
                                key={assignment.id}
                                className="bg-white text-sm p-3 rounded-md shadow-sm border border-teal-200"
                              >
                                <p>
                                  <strong>{assignment.equipment.name}</strong> ({assignment.equipment.model})
                                </p>
                                <p className="text-xs text-gray-600 mt-1">
                                  Assigned by: {assignment.assignedBy?.username || 'N/A'}
                                </p>
                                <p className="text-xs text-gray-600">
                                  Period:{' '}
                                  {assignment.startTime ? format(parseISO(assignment.startTime), 'dd MMM HH:mm') : '-'} →{' '}
                                  {assignment.endTime ? format(parseISO(assignment.endTime), 'dd MMM HH:mm') : '-'}
                                </p>
                                {assignment.notes && (
                                  <p className="text-xs text-gray-700 italic mt-1">Notes: "{assignment.notes}"</p>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* 🔹 Assigned Workers */}
                      {subtask.workerAssignments?.length > 0 && (
                        <div className="mt-6 p-5 bg-gradient-to-r from-green-50 to-lime-50 rounded-xl border border-green-200">
                          <h4 className="font-bold text-green-800 flex items-center gap-2 text-sm mb-4">
                            <span className="text-lg">👷</span>
                            Assigned Workers
                          </h4>
                          <ul className="space-y-3">
                            {subtask.workerAssignments.map((assignment) => (
                              <li
                                key={assignment.id}
                                className={`bg-white text-sm p-3 rounded-md shadow-sm border ${
                                  assignment.worker.id === currentUserId ? 'border-green-400' : 'border-green-200'
                                }`}
                              >
                                <p className="flex items-center">
                                  <strong>{assignment.worker.username}</strong>
                                  <span className="text-gray-600 ml-2">({assignment.worker.email})</span>
                                  {assignment.worker.id === currentUserId && (
                                    <FaUser className="ml-auto text-green-600" title="This is you" />
                                  )}
                                </p>
                                <p className="text-xs text-gray-600 mt-1">
                                  Assigned by: {assignment.assignedBy?.username || 'N/A'}
                                </p>
                                <p className="text-xs text-gray-600">
                                  Period:{' '}
                                  {assignment.assignmentStart ? format(parseISO(assignment.assignmentStart), 'dd MMM HH:mm') : '-'} →{' '}
                                  {assignment.assignmentEnd ? format(parseISO(assignment.assignmentEnd), 'dd MMM HH:mm') : '-'}
                                </p>
                                {assignment.notes && (
                                  <p className="text-xs text-gray-700 italic mt-1">Notes: "{assignment.notes}"</p>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}