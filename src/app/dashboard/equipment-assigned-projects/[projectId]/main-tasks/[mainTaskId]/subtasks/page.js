'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { format, parseISO } from 'date-fns';

// Reusable DetailItem Component
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

// Assignment Modal Component (Enhanced)
const AssignEquipmentModal = ({ isOpen, onClose, onSubmit, equipment, subtask }) => {
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication required.');

      const body = {
        subtaskId: subtask.id,
        startTime: subtask.plannedStart,
        endTime: subtask.plannedEnd,
        equipmentNotes: notes.trim() || `Assigned for ${subtask.title}`,
      };

      const res = await fetch(
        `http://localhost:8080/api/equipment/${equipment.id}/assignments`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        }
      );

      const data = await res.json();
      if (res.ok && data.success) {
        onSubmit(data.data);
      } else {
        throw new Error(data.message || 'Failed to assign equipment.');
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl transform transition-all scale-100 hover:scale-[1.02]">
        <h3 className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
          🛠️ Assign Equipment
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          {equipment.name} ({equipment.model})
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              rows="3"
              placeholder="e.g., Used for trench digging, handle with care..."
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition disabled:opacity-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-60 disabled:cursor-not-allowed font-semibold shadow-md transform transition active:scale-95"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Assigning...
                </span>
              ) : (
                'Assign Equipment'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Delete Confirmation Modal (Stylish)
const DeleteAssignmentModal = ({ isOpen, onClose, onConfirm, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-2xl p-6 max-w-sm shadow-2xl transform transition-all scale-100">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900">Unassign Equipment?</h3>
          <p className="text-gray-600 mt-2 text-sm">
            This action cannot be undone. The equipment will be released.
          </p>
        </div>
        <div className="flex justify-end gap-3 mt-5">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition"
          >
            Keep
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold shadow-sm transform transition active:scale-95 disabled:opacity-60"
          >
            {loading ? 'Deleting...' : 'Yes, Unassign'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function EquipmentSubtasksPage() {
  const router = useRouter();
  const params = useParams();
  const { mainTaskId } = params;

  const [subtasks, setSubtasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', content: '' });

  // Modal states
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [selectedSubtask, setSelectedSubtask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    assignmentId: null,
    equipmentId: null,
    loading: false,
  });

  useEffect(() => {
    if (mainTaskId) {
      fetchSubtasks();
    }
  }, [mainTaskId]);

  const fetchSubtasks = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const res = await fetch(
        `http://localhost:8080/api/site-supervisor/main-tasks/${mainTaskId}/subtasks`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.status === 401) {
        localStorage.removeItem('token');
        router.push('/login');
        return;
      }

      if (!res.ok) throw new Error('Failed to fetch subtasks.');

      const data = await res.json();
      if (data.success) {
        setSubtasks(data.data);
      } else {
        throw new Error(data.message || 'Fetch failed.');
      }
    } catch (error) {
      setMessage({ type: 'error', content: error.message });
    } finally {
      setLoading(false);
    }
  };

  // Handle successful equipment assignment
  const handleAssignSuccess = (assignmentData, equipment, subtask) => {
    setSubtasks((prev) =>
      prev.map((st) =>
        st.id === subtask.id
          ? {
              ...st,
              equipmentAssignments: [
                ...(st.equipmentAssignments || []),
                {
                  id: assignmentData.id,
                  equipment,
                  assignedBy: {
                    id: assignmentData.assignedById,
                    username: assignmentData.assignedByUsername,
                  },
                  startTime: subtask.plannedStart,
                  endTime: subtask.plannedEnd,
                  notes: assignmentData.equipmentNotes,
                },
              ],
            }
          : st
      )
    );
    setMessage({ type: 'success', content: '✅ Equipment assigned successfully!' });
    setIsModalOpen(false);
  };

  // Open assignment modal
  const openAssignModal = (equipment, subtask) => {
    setSelectedEquipment(equipment);
    setSelectedSubtask(subtask);
    setIsModalOpen(true);
  };

  // Close modal
  const closeAssignModal = () => {
    setIsModalOpen(false);
    setSelectedEquipment(null);
    setSelectedSubtask(null);
  };

  // Handle delete assignment
  const handleDeleteAssignment = async (equipmentId, assignmentId) => {
    const token = localStorage.getItem('token');
    setDeleteModal({ open: true, assignmentId, equipmentId, loading: true });

    try {
      const res = await fetch(
        `http://localhost:8080/api/equipment/${equipmentId}/assignments/${assignmentId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        setSubtasks((prev) =>
          prev.map((st) => ({
            ...st,
            equipmentAssignments: st.equipmentAssignments?.filter((a) => a.id !== assignmentId),
          }))
        );
        setMessage({ type: 'success', content: '🗑️ Equipment unassigned successfully.' });
      } else {
        const data = await res.json();
        throw new Error(data.message || 'Failed to delete assignment.');
      }
    } catch (error) {
      setMessage({ type: 'error', content: `❌ ${error.message}` });
    } finally {
      setDeleteModal({ open: false, assignmentId: null, equipmentId: null, loading: false });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600 mb-3"></div>
          <p className="text-lg font-semibold text-indigo-600">Loading subtasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 p-4 md:p-8">
      {/* Toast Message */}
      {message.content && (
        <div
          className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium transition-all duration-300 max-w-sm flex items-center justify-between animate-fade-in-up ${
            message.type === 'success'
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
              : 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
          }`}
        >
          <span>{message.content}</span>
          <button
            onClick={() => setMessage({ type: '', content: '' })}
            className="ml-3 font-bold text-lg hover:scale-110 transition"
          >
            &times;
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 text-center mb-2 mt-4">
          Subtasks for Main Task #{mainTaskId}
        </h1>
        <p className="text-center text-gray-600 text-sm">Manage equipment assignments for each subtask.</p>

        <div className="space-y-6">
          {subtasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📋</div>
              <p className="text-gray-500 text-lg">No subtasks found for this main task.</p>
            </div>
          ) : (
            subtasks.map((subtask) => (
              <div
                key={subtask.id}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* Header */}
                <div className="p-6 border-b bg-gradient-to-r from-gray-50 to-indigo-50">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{subtask.title}</h3>
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

                  {/* 🔹 Equipment Needed */}
                  {subtask.equipmentNeeds?.length > 0 && (
                    <div className="mt-6 p-5 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                      <h4 className="font-bold text-purple-800 flex items-center gap-2 text-sm mb-4">
                        <span className="text-lg">🛠️</span>
                        Equipment Needed
                      </h4>
                      <ul className="space-y-4">
                        {subtask.equipmentNeeds.map((eq) => {
                          const assignment = subtask.equipmentAssignments?.find(
                            (ea) => ea.equipment.id === eq.id
                          );

                          return (
                            <li
                              key={eq.id}
                              className={`p-4 rounded-lg border transition-all ${
                                assignment
                                  ? 'bg-white border-purple-300 shadow-sm'
                                  : 'bg-purple-50 border-dashed border-purple-200'
                              }`}
                            >
                              <div className="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                  <strong className="text-gray-900">{eq.name}</strong>
                                  <span className="text-gray-600 ml-1">({eq.model})</span>
                                </div>

                                {assignment ? (
                                  <button
                                    onClick={() =>
                                      setDeleteModal({
                                        open: true,
                                        assignmentId: assignment.id,
                                        equipmentId: eq.id,
                                      })
                                    }
                                    className="ml-auto px-4 py-1.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-xs font-semibold rounded-full shadow-sm transform transition active:scale-95 focus:outline-none"
                                  >
                                    🗑️ Unassign
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => openAssignModal(eq, subtask)}
                                    className="ml-auto px-4 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white text-xs font-semibold rounded-full shadow-sm transform transition active:scale-95 focus:outline-none"
                                  >
                                    ➕ Assign
                                  </button>
                                )}
                              </div>

                              {/* Assignment Details */}
                              {assignment && (
                                <div className="mt-3 pt-3 border-t border-gray-100 bg-gray-50 rounded p-3 text-xs">
                                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                                    <p>
                                      <strong className="text-gray-700">By:</strong>{' '}
                                      <span className="text-gray-800">{assignment.assignedBy.username}</span>
                                    </p>
                                    <p>
                                      <strong className="text-gray-700">Period:</strong>{' '}
                                      <span className="text-gray-800">
                                        {format(parseISO(assignment.startTime), 'dd MMM HH:mm')} →{' '}
                                        {format(parseISO(assignment.endTime), 'dd MMM HH:mm')}
                                      </span>
                                    </p>
                                  </div>
                                  {assignment.notes && (
                                    <p className="mt-1 text-gray-600 italic">"{assignment.notes}"</p>
                                  )}
                                </div>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}

                  {/* 🔹 Assigned Workers */}
                  {subtask.workerAssignments?.length > 0 && (
                    <div className="mt-6 p-5 bg-green-50 rounded-xl border border-green-200">
                      <h4 className="font-bold text-green-800 flex items-center gap-2 text-sm mb-3">
                        👷 Assigned Workers
                      </h4>
                      <ul className="space-y-2">
                        {subtask.workerAssignments.map((assignment) => (
                          <li
                            key={assignment.id}
                            className="bg-white text-sm p-3 rounded-md shadow-sm border border-green-200 flex justify-between items-center"
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
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modals */}
      <AssignEquipmentModal
        isOpen={isModalOpen}
        onClose={closeAssignModal}
        onSubmit={(data) => handleAssignSuccess(data, selectedEquipment, selectedSubtask)}
        equipment={selectedEquipment}
        subtask={selectedSubtask}
      />

      <DeleteAssignmentModal
        isOpen={deleteModal.open}
        onClose={() =>
          setDeleteModal({ open: false, assignmentId: null, equipmentId: null, loading: false })
        }
        onConfirm={() =>
          handleDeleteAssignment(deleteModal.equipmentId, deleteModal.assignmentId)
        }
        loading={deleteModal.loading}
      />
    </div>
  );
}