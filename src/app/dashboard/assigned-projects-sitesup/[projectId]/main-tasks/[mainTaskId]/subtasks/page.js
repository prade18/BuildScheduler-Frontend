'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import CreateSubtaskForm from '../../../../../../../components/CreateSubtaskForm';
import AssignWorkerModal from '../../../../../../../components/AssignWorkerModal';
import { format, parseISO } from 'date-fns';
import { FaTimesCircle } from 'react-icons/fa';

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

// All possible Task Statuses for the dropdown
const TASK_STATUSES = [
  'PLANNED',
  'ASSIGNED',
  'IN_PROGRESS',
  'ON_HOLD',
  'COMPLETED',
  'CANCELLED',
  'DELAYED',
];

export default function SubtasksPage() {
  const router = useRouter();
  const params = useParams();
  const { projectId, mainTaskId } = params;

  const [subtasks, setSubtasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', content: '' });
  const [editingSubtaskId, setEditingSubtaskId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Edit form suggestions
  const [allSkills, setAllSkills] = useState([]);
  const [editSkillSearchTerm, setEditSkillSearchTerm] = useState('');
  const [filteredEditSkills, setFilteredEditSkills] = useState([]);
  const [selectedEditSkillObjects, setSelectedEditSkillObjects] = useState([]);

  const [allEquipment, setAllEquipment] = useState([]);
  const [editEquipmentSearchTerm, setEditEquipmentSearchTerm] = useState('');
  const [filteredEditEquipment, setFilteredEditEquipment] = useState([]);
  const [selectedEditEquipmentObjects, setSelectedEditEquipmentObjects] = useState([]);

  const editSkillsSuggestionsRef = useRef(null);
  const editEquipmentSuggestionsRef = useRef(null);

  useEffect(() => {
    if (mainTaskId) {
      fetchSubtasks();
      fetchAllSkillsAndEquipment();
    }

    const handleClickOutside = (event) => {
      if (editSkillsSuggestionsRef.current && !editSkillsSuggestionsRef.current.contains(event.target)) {
        setFilteredEditSkills([]);
      }
      if (editEquipmentSuggestionsRef.current && !editEquipmentSuggestionsRef.current.contains(event.target)) {
        setFilteredEditEquipment([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mainTaskId]);

  const fetchAllSkillsAndEquipment = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const skillsRes = await fetch('http://localhost:8080/api/worker/profile/skills', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (skillsRes.ok) {
        const data = await skillsRes.json();
        if (data.success) setAllSkills(data.data);
      }
    } catch (error) {
      console.error('Error fetching skills:', error);
    }

    try {
      const equipmentRes = await fetch('http://localhost:8080/api/equipment/all', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (equipmentRes.ok) {
        const data = await equipmentRes.json();
        if (data.success) setAllEquipment(data.data);
      }
    } catch (error) {
      console.error('Error fetching equipment:', error);
    }
  };

  const fetchSubtasks = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) return router.push('/login');

      const res = await fetch(
        `http://localhost:8080/api/site-supervisor/main-tasks/${mainTaskId}/subtasks`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error('Failed to fetch subtasks.');

      const data = await res.json();
      if (data.success) setSubtasks(data.data);
      else throw new Error(data.message || 'Fetch failed.');
    } catch (error) {
      setMessage({ type: 'error', content: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (subtask) => {
    setEditingSubtaskId(subtask.id);
    setEditFormData({
      ...subtask,
      plannedStart: subtask.plannedStart ? format(parseISO(subtask.plannedStart), "yyyy-MM-dd'T'HH:mm") : '',
      plannedEnd: subtask.plannedEnd ? format(parseISO(subtask.plannedEnd), "yyyy-MM-dd'T'HH:mm") : '',
      requiredSkills: subtask.requiredSkills || [],
      equipmentIds: subtask.equipmentNeeds?.map((eq) => eq.id) || [],
    });

    setSelectedEditSkillObjects(
      (subtask.requiredSkills || [])
        .map((name) => allSkills.find((s) => s.name === name))
        .filter(Boolean)
    );
    setSelectedEditEquipmentObjects(subtask.equipmentNeeds || []);

    setEditSkillSearchTerm('');
    setFilteredEditSkills([]);
    setEditEquipmentSearchTerm('');
    setFilteredEditEquipment([]);
  };

  const handleEditFormChange = (e) => {
    const { name, value, type } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value, 10) : value,
    }));
  };

  // --- Skills Handling ---
  const handleEditSkillSearchChange = (e) => {
    const term = e.target.value;
    setEditSkillSearchTerm(term);
    const filtered = allSkills.filter(
      (s) =>
        s.name.toLowerCase().includes(term.toLowerCase()) &&
        !selectedEditSkillObjects.some((sel) => sel.id === s.id)
    );
    setFilteredEditSkills(filtered);
  };

  const handleEditSkillSelect = (skill) => {
    if (!selectedEditSkillObjects.some((s) => s.id === skill.id)) {
      setSelectedEditSkillObjects((prev) => [...prev, { id: skill.id, name: skill.name }]);
      setEditFormData((prev) => ({ ...prev, requiredSkills: [...prev.requiredSkills, skill.name] }));
      setEditSkillSearchTerm('');
      setFilteredEditSkills([]);
    }
  };

  const handleRemoveEditSkill = (id) => {
    setSelectedEditSkillObjects((prev) => {
      const newSelected = prev.filter((s) => s.id !== id);
      setEditFormData((f) => ({ ...f, requiredSkills: newSelected.map(s => s.name) }));
      return newSelected;
    });
  };

  // --- Equipment Handling ---
  const handleEditEquipmentSearchChange = (e) => {
    const term = e.target.value;
    setEditEquipmentSearchTerm(term);
    const filtered = allEquipment.filter(
      (eq) =>
        eq.name.toLowerCase().includes(term.toLowerCase()) &&
        !selectedEditEquipmentObjects.some((sel) => sel.id === eq.id)
    );
    setFilteredEditEquipment(filtered);
  };

  const handleEditEquipmentSelect = (eq) => {
    if (!selectedEditEquipmentObjects.some((s) => s.id === eq.id)) {
      setSelectedEditEquipmentObjects((prev) => [...prev, { id: eq.id, name: eq.name, model: eq.model }]);
      setEditFormData((prev) => ({ ...prev, equipmentIds: [...prev.equipmentIds, eq.id] }));
      setEditEquipmentSearchTerm('');
      setFilteredEditEquipment([]);
    }
  };

  const handleRemoveEditEquipment = (id) => {
    setSelectedEditEquipmentObjects((prev) => {
        const newSelected = prev.filter((eq) => eq.id !== id);
        setEditFormData((f) => ({ ...f, equipmentIds: newSelected.map(eq => eq.id) }));
        return newSelected;
    });
  };

  const handleUpdateSubtask = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) return router.push('/login');

      const payload = { ...editFormData };
      const res = await fetch(`http://localhost:8080/api/site-supervisor/subtasks/${editingSubtaskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Update failed.');

      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', content: 'Updated successfully!' });
        setEditingSubtaskId(null);
        fetchSubtasks();
      }
    } catch (error) {
      setMessage({ type: 'error', content: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubtask = async (id) => {
    if (!window.confirm('Delete this subtask?')) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:8080/api/site-supervisor/subtasks/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage({ type: 'success', content: 'Deleted successfully!' });
      fetchSubtasks();
    } catch (error) {
      setMessage({ type: 'error', content: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:8080/api/site-supervisor/subtasks/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error('Status update failed.');

      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', content: `Status updated to ${newStatus.replace(/_/g, ' ')}` });
        fetchSubtasks();
      }
    } catch (error) {
      setMessage({ type: 'error', content: error.message });
    } finally {
      setLoading(false);
    }
  };

  // ✅ NEW: Remove Worker Assignment
  const handleRemoveAssignment = async (assignmentId) => {
    if (!window.confirm('Remove this worker assignment?')) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) return router.push('/login');

      const res = await fetch(`http://localhost:8080/api/site-supervisor/assignments/${assignmentId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', content: 'Worker unassigned successfully!' });
        fetchSubtasks(); // Refresh
      } else {
        throw new Error(data.message || 'Unassignment failed.');
      }
    } catch (error) {
      setMessage({ type: 'error', content: error.message });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-xl font-semibold text-indigo-600 animate-pulse">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6 md:p-10">
      {/* Toast Message */}
      {message.content && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-lg text-sm font-medium transition-all duration-300 ${
            message.type === 'success'
              ? 'bg-green-500 text-white'
              : 'bg-red-500 text-white'
          } flex items-center justify-between max-w-sm`}
        >
          {message.content}
          <button
            onClick={() => setMessage({ type: '', content: '' })}
            className="ml-4 font-bold text-lg"
          >
            &times;
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 text-center mb-6">
          Subtasks for Main Task #{mainTaskId}
        </h1>

        {/* Create Subtask */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="w-full py-3 text-base font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition"
          >
            {showCreateForm ? '❌ Hide Form' : '➕ Create New Subtask'}
          </button>
          {showCreateForm && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <CreateSubtaskForm
                mainTaskId={mainTaskId}
                onSubtaskCreated={() => {
                  fetchSubtasks();
                  setShowCreateForm(false);
                }}
              />
            </div>
          )}
        </div>

        {/* Subtasks List */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">📋 All Subtasks</h2>

          {subtasks.length === 0 ? (
            <p className="text-gray-500 text-center py-10 italic">No subtasks yet.</p>
          ) : (
            <div className="space-y-6">
              {subtasks.map((subtask) => (
                <div
                  key={subtask.id}
                  className="border border-gray-200 rounded-xl shadow-lg p-6 bg-white hover:shadow-xl transition-all"
                >
                  {editingSubtaskId === subtask.id ? (
                    // Edit Form
                    <form onSubmit={handleUpdateSubtask} className="space-y-4">
                      <input
                        name="title"
                        value={editFormData.title || ''}
                        onChange={handleEditFormChange}
                        className="w-full border border-gray-300 rounded p-2"
                        required
                      />
                      <textarea
                        name="description"
                        value={editFormData.description || ''}
                        onChange={handleEditFormChange}
                        rows="2"
                        className="w-full border border-gray-300 rounded p-2"
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className="block">
                          <span className="text-gray-700">Planned Start:</span>
                          <input
                            name="plannedStart"
                            type="datetime-local"
                            value={editFormData.plannedStart || ''}
                            onChange={handleEditFormChange}
                            className="mt-1 w-full border border-gray-300 rounded p-2"
                            required
                          />
                        </label>
                        <label className="block">
                          <span className="text-gray-700">Planned End:</span>
                          <input
                            name="plannedEnd"
                            type="datetime-local"
                            value={editFormData.plannedEnd || ''}
                            onChange={handleEditFormChange}
                            className="mt-1 w-full border border-gray-300 rounded p-2"
                            required
                          />
                        </label>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className="block">
                          <span className="text-gray-700">Estimated Hours:</span>
                          <input
                            name="estimatedHours"
                            type="number"
                            value={editFormData.estimatedHours || 0}
                            onChange={handleEditFormChange}
                            className="mt-1 w-full border border-gray-300 rounded p-2"
                            required
                          />
                        </label>
                        <label className="block">
                          <span className="text-gray-700">Required Workers:</span>
                          <input
                            name="requiredWorkers"
                            type="number"
                            value={editFormData.requiredWorkers || 0}
                            onChange={handleEditFormChange}
                            className="mt-1 w-full border border-gray-300 rounded p-2"
                            required
                          />
                        </label>
                      </div>
                      
                      {/* START: SKILLS AND EQUIPMENT EDIT UI */}
                      {/* Required Skills */}
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Required Skills</label>
                        <div className="relative" ref={editSkillsSuggestionsRef}>
                          <input
                            type="text"
                            value={editSkillSearchTerm}
                            onChange={handleEditSkillSearchChange}
                            placeholder="Search for skills..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          />
                          {filteredEditSkills.length > 0 && (
                            <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-40 overflow-y-auto shadow-lg">
                              {filteredEditSkills.map((skill) => (
                                <li
                                  key={skill.id}
                                  onClick={() => handleEditSkillSelect(skill)}
                                  className="px-4 py-2 cursor-pointer hover:bg-indigo-50 text-gray-800"
                                >
                                  {skill.name}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {selectedEditSkillObjects.map((skill) => (
                            <span
                              key={skill.id}
                              className="inline-flex items-center px-3 py-1 text-sm font-medium text-indigo-700 bg-indigo-100 rounded-full"
                            >
                              {skill.name}
                              <FaTimesCircle
                                className="ml-2 cursor-pointer text-indigo-500 hover:text-indigo-700"
                                onClick={() => handleRemoveEditSkill(skill.id)}
                              />
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Equipment Needed */}
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Equipment Needed</label>
                        <div className="relative" ref={editEquipmentSuggestionsRef}>
                          <input
                            type="text"
                            value={editEquipmentSearchTerm}
                            onChange={handleEditEquipmentSearchChange}
                            placeholder="Search for equipment..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          />
                          {filteredEditEquipment.length > 0 && (
                            <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-40 overflow-y-auto shadow-lg">
                              {filteredEditEquipment.map((eq) => (
                                <li
                                  key={eq.id}
                                  onClick={() => handleEditEquipmentSelect(eq)}
                                  className="px-4 py-2 cursor-pointer hover:bg-indigo-50 text-gray-800"
                                >
                                  {eq.name} ({eq.model})
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {selectedEditEquipmentObjects.map((eq) => (
                            <span
                              key={eq.id}
                              className="inline-flex items-center px-3 py-1 text-sm font-medium text-purple-700 bg-purple-100 rounded-full"
                            >
                              {eq.name} ({eq.model})
                              <FaTimesCircle
                                className="ml-2 cursor-pointer text-purple-500 hover:text-purple-700"
                                onClick={() => handleRemoveEditEquipment(eq.id)}
                              />
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <label className="block mt-4">
                        <span className="text-gray-700">Equipment Request Notes:</span>
                        <textarea
                          name="equipmentRequestNotes"
                          value={editFormData.equipmentRequestNotes || ''}
                          onChange={handleEditFormChange}
                          rows="2"
                          className="mt-1 w-full border border-gray-300 rounded p-2"
                        />
                      </label>
                      {/* END: SKILLS AND EQUIPMENT EDIT UI */}
                      
                      <div className="flex justify-end space-x-3 mt-4">
                        <button
                          type="button"
                          onClick={() => setEditingSubtaskId(null)}
                          className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
                        >
                          Save
                        </button>
                      </div>
                    </form>
                  ) : (
                    // Display Mode
                    <>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{subtask.title}</h3>
                          <p className="text-gray-600 text-sm">{subtask.description}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(subtask.status)}
                          <select
                            value={subtask.status}
                            onChange={(e) => handleStatusChange(subtask.id, e.target.value)}
                            className="text-sm border border-gray-300 rounded px-2 py-1"
                          >
                            {TASK_STATUSES.map((s) => (
                              <option key={s} value={s}>
                                {s.replace(/_/g, ' ')}
                              </option>
                            ))}
                          </select>
                        </div>
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
                        </div>
                      )}
                      
                      {/* 🔹 Equipment Assigned (New Section) */}
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

                      {/* 🔹 Assigned Workers with Remove Button */}
                      {subtask.workerAssignments?.length > 0 && (
                        <div className="mt-5 p-4 bg-green-50 border border-green-200 rounded-xl">
                          <h4 className="font-bold text-green-800 flex items-center text-sm mb-3">
                            👷 Assigned Workers
                          </h4>
                          <ul className="space-y-2">
                            {subtask.workerAssignments.map((assignment) => (
                              <li
                                key={assignment.id}
                                className="bg-white text-sm p-3 rounded-md shadow-sm border border-green-200 flex justify-between items-center hover:shadow transition-shadow"
                              >
                                <div>
                                  <strong>{assignment.worker.username}</strong>
                                  <span className="text-gray-600 ml-2">({assignment.worker.email})</span>
                                  <div className="text-xs text-gray-500 mt-1">
                                    Assignment ID: {assignment.id}
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleRemoveAssignment(assignment.id)}
                                  disabled={loading}
                                  className="px-3 py-1 text-xs font-semibold text-white bg-red-500 hover:bg-red-600 disabled:opacity-70 rounded-md transition-colors"
                                >
                                  Remove
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Worker Assignment */}
                      <AssignWorkerModal
                        subtask={subtask}
                        onAssignmentSuccess={fetchSubtasks}
                      />

                      {/* Edit/Delete */}
                      <div className="mt-6 flex justify-end space-x-3">
                        <button
                          onClick={() => handleEditClick(subtask)}
                          className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteSubtask(subtask.id)}
                          className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}