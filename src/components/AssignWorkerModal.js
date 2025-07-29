// components/AssignWorkerModal.jsx
'use client';

import { useState } from 'react';

export default function AssignWorkerModal({ subtask, onAssignmentSuccess }) {
  const [suggestedWorkers, setSuggestedWorkers] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [assignmentDetails, setAssignmentDetails] = useState(null);
  const [workerNotes, setWorkerNotes] = useState('');
  const [message, setMessage] = useState({ type: '', content: '' });

  const handleSearchWorkers = async () => {
    setSearching(true);
    setMessage({ type: '', content: '' });
    setSuggestedWorkers([]);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      const res = await fetch(
        `http://localhost:8080/api/site-supervisor/subtasks/${subtask.id}/workers/search`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      if (data.success) {
        setSuggestedWorkers(data.data);
        setMessage({ type: 'success', content: data.message || 'Workers found!' });
      } else {
        throw new Error(data.message || 'No workers found.');
      }
    } catch (error) {
      console.error('Search workers error:', error);
      setMessage({ type: 'error', content: error.message });
    } finally {
      setSearching(false);
    }
  };

  const handleAssignClick = (worker) => {
    setAssignmentDetails({
      subtaskId: subtask.id,
      workerId: worker.id,
      workerName: worker.username,
      subtaskTitle: subtask.title,
      plannedStart: subtask.plannedStart,
      plannedEnd: subtask.plannedEnd,
    });
    setWorkerNotes('');
    setShowModal(true);
  };

  const confirmAssignment = async () => {
    if (!assignmentDetails) return;
    setMessage({ type: '', content: '' });

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      const payload = {
        workerId: assignmentDetails.workerId,
        assignmentStart: assignmentDetails.plannedStart,
        assignmentEnd: assignmentDetails.plannedEnd,
        workerNotes,
      };

      const res = await fetch(
        `http://localhost:8080/api/site-supervisor/subtasks/${assignmentDetails.subtaskId}/workers/assign`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', content: data.message || 'Worker assigned successfully!' });
        setShowModal(false);
        setAssignmentDetails(null);
        setWorkerNotes('');
        onAssignmentSuccess?.();
      } else {
        throw new Error(data.message || 'Assignment failed.');
      }
    } catch (error) {
      console.error('Assign worker error:', error);
      setMessage({ type: 'error', content: error.message });
    }
  };

  return (
    <>
      {/* Search Button */}
      <div className="mt-6">
        <button
          onClick={handleSearchWorkers}
          disabled={searching}
          className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-70 transition-colors"
        >
          {searching ? 'Searching...' : '🔍 Search Workers'}
        </button>
      </div>

      {/* Message */}
      {message.content && (
        <div
          className={`mt-2 text-sm p-2 rounded text-center ${
            message.type === 'error'
              ? 'bg-red-100 text-red-800'
              : 'bg-green-100 text-green-800'
          }`}
        >
          {message.content}
        </div>
      )}

      {/* Suggested Workers List */}
      {suggestedWorkers.length > 0 && (
        <div className="mt-4 p-5 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl shadow-inner">
          <h4 className="text-lg font-bold text-green-800 mb-4 flex items-center">
            🧑‍🔧 <span className="ml-1.5">Suggested Workers</span>
          </h4>
          <ul className="space-y-4">
            {suggestedWorkers.map((worker) => (
              <li
                key={worker.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-green-100 hover:shadow transition-shadow"
              >
                <div className="flex-1">
                  <p className="font-bold text-gray-900">{worker.username}</p>
                  <p className="text-sm text-gray-600">📧 {worker.email}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    <strong>Skills:</strong>{' '}
                    {worker.skills?.length > 0 ? worker.skills.join(', ') : 'N/A'}
                  </p>
                </div>
                <button
                  onClick={() => handleAssignClick(worker)}
                  className="mt-3 sm:mt-0 sm:ml-4 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow transition-colors"
                >
                  Assign
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* No Workers Found */}
      {suggestedWorkers.length === 0 && !searching && !message.content && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm text-center italic">
          No matching workers found.
        </div>
      )}

      {/* Assignment Modal */}
      {showModal && assignmentDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md animate-fade-in-up transform transition-all">
            <h3 className="text-xl font-bold text-gray-900 mb-1">Assign Worker</h3>
            <p className="text-sm text-gray-600 mb-4">
              Confirm assignment to <span className="font-semibold text-indigo-700">{assignmentDetails.subtaskTitle}</span>
            </p>

            <div className="bg-indigo-50 p-4 rounded-lg mb-4">
              <p className="text-sm">
                <strong>Worker:</strong>{' '}
                <span className="font-medium text-indigo-800">{assignmentDetails.workerName}</span>
              </p>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes (Optional):
              </label>
              <textarea
                value={workerNotes}
                onChange={(e) => setWorkerNotes(e.target.value)}
                rows="3"
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Add instructions or special notes..."
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setAssignmentDetails(null);
                  setWorkerNotes('');
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmAssignment}
                className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow transition-colors"
              >
                Assign Worker
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}