'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { format, parseISO } from 'date-fns';
import { FaSpinner, FaUserPlus, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

// Assuming you have this component in '@/components/MainTaskList'
import MainTaskList from '@/components/MainTaskList'; 

export default function ProjectDetailPage() {
  const { projectId } = useParams();
  const { token } = useSelector((state) => state.auth || {});

  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [availableSupervisors, setAvailableSupervisors] = useState([]);
  const [availableEquipmentManagers, setAvailableEquipmentManagers] = useState([]);

  const [selectedSupervisorId, setSelectedSupervisorId] = useState('');
  const [selectedEquipmentManagerId, setSelectedEquipmentManagerId] = useState('');

  const [assigningSupervisor, setAssigningSupervisor] = useState(false);
  const [assigningEquipmentManager, setAssigningEquipmentManager] = useState(false);
  const [assignStatusMessage, setAssignStatusMessage] = useState({ type: '', text: '' });

  const getPriorityText = (priority) => {
    switch (priority) {
      case 1:
        return 'Low';
      case 2:
        return 'Medium';
      case 3:
        return 'High';
      case 4:
        return 'Critical';
      default:
        return 'N/A';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PLANNING':
        return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'ON_HOLD':
        return 'bg-gray-100 text-gray-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const fetchProjectAndUsers = async () => {
    if (!token || !projectId) {
      setError('Authentication token or Project ID missing.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setAssignStatusMessage({ type: '', text: '' });

    try {
      const projectRes = await fetch(
        `http://localhost:8080/api/pm/projects/${projectId}/structure`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const projectJson = await projectRes.json();

      if (!projectRes.ok || !projectJson.success) {
        throw new Error(projectJson.message || 'Failed to fetch project details.');
      }
      setProjectData(projectJson.data.project);

      const usersRes = await fetch('http://localhost:8080/api/pm/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const usersJson = await usersRes.json();

      if (!usersRes.ok || !usersJson.success) {
        throw new Error(usersJson.message || 'Failed to fetch users.');
      }

      const supervisors = usersJson.data.filter(
        (user) => user.role === 'ROLE_SITE_SUPERVISOR'
      );
      const equipmentManagers = usersJson.data.filter(
        (user) => user.role === 'ROLE_EQUIPMENT_MANAGER'
      );

      setAvailableSupervisors(supervisors);
      setAvailableEquipmentManagers(equipmentManagers);

      if (projectJson.data.project.siteSupervisor) {
        setSelectedSupervisorId(projectJson.data.project.siteSupervisor.id.toString());
      } else {
        setSelectedSupervisorId('');
      }
      if (projectJson.data.project.equipmentManager) {
        setSelectedEquipmentManagerId(projectJson.data.project.equipmentManager.id.toString());
      } else {
        setSelectedEquipmentManagerId('');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while fetching data.');
      console.error('Fetch Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectAndUsers();
  }, [projectId, token]);

  const handleAssignPersonnel = async (type) => {
    let url = '';
    let selectedId = '';
    let setAssigningState;

    if (type === 'supervisor') {
      url = `http://localhost:8080/api/pm/projects/${projectId}/assign-supervisor?supervisorId=${selectedSupervisorId}`;
      selectedId = selectedSupervisorId;
      setAssigningState = setAssigningSupervisor;
    } else {
      url = `http://localhost:8080/api/pm/projects/${projectId}/assign-equipment-manager?equipmentManagerId=${selectedEquipmentManagerId}`;
      selectedId = selectedEquipmentManagerId;
      setAssigningState = setAssigningEquipmentManager;
    }

    if (!selectedId) {
      setAssignStatusMessage({ type: 'error', text: `Please select a ${type}.` });
      setTimeout(() => setAssignStatusMessage({ type: '', text: '' }), 3000);
      return;
    }

    setAssigningState(true);
    setAssignStatusMessage({ type: '', text: '' });

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setAssignStatusMessage({ type: 'success', text: `${type} assigned successfully!` });
        fetchProjectAndUsers();
      } else {
        throw new Error(data.message || `Failed to assign ${type}.`);
      }
    } catch (err) {
      setAssignStatusMessage({ type: 'error', text: err.message || `Error assigning ${type}.` });
      console.error(`Assignment Error (${type}):`, err);
    } finally {
      setAssigningState(false);
      setTimeout(() => setAssignStatusMessage({ type: '', text: '' }), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <FaSpinner className="animate-spin text-4xl text-indigo-600" />
        <p className="ml-4 text-xl text-gray-600">Loading project details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50 p-6">
        <p className="text-xl text-red-600 mb-4">Error: {error}</p>
        <button
          onClick={fetchProjectAndUsers}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!projectData) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 p-6">
        <p className="text-xl text-gray-600">Project not found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">Project Details</h1>

      {/* Project Overview Card */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-200">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-3xl font-bold text-gray-900">{projectData.title}</h2>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(projectData.status)}`}>
            {projectData.status.replace(/_/g, ' ')}
          </span>
        </div>
        <p className="text-gray-600 text-lg mb-4">{projectData.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-gray-700">
          <div>
            <p className="font-semibold">Start Date:</p>
            <p>{projectData.startDate ? format(parseISO(projectData.startDate), 'PPP') : 'N/A'}</p>
          </div>
          <div>
            <p className="font-semibold">End Date:</p>
            <p>{projectData.endDate ? format(parseISO(projectData.endDate), 'PPP') : 'N/A'}</p>
          </div>
          <div>
            <p className="font-semibold">Estimated Budget:</p>
            <p>${projectData.estimatedBudget?.toLocaleString() || 'N/A'}</p>
          </div>
          <div>
            <p className="font-semibold">Location:</p>
            <p>{projectData.location || 'N/A'}</p>
          </div>
          <div>
            <p className="font-semibold">Priority:</p>
            <p>{getPriorityText(projectData.priority)}</p>
          </div>
          <div>
            <p className="font-semibold">Completion:</p>
            <p>{projectData.completionPercentage?.toFixed(2)}%</p>
          </div>
          {projectData.projectManager && (
            <div>
              <p className="font-semibold">Project Manager:</p>
              <p>{projectData.projectManager.username}</p>
            </div>
          )}
          {projectData.siteSupervisor && (
            <div>
              <p className="font-semibold">Site Supervisor:</p>
              <p>{projectData.siteSupervisor.username}</p>
            </div>
          )}
          {projectData.equipmentManager && (
            <div>
              <p className="font-semibold">Equipment Manager:</p>
              <p>{projectData.equipmentManager.username}</p>
            </div>
          )}
          {projectData.overdue && (
            <div className="col-span-full">
              <p className="text-red-600 font-semibold">Status: Overdue!</p>
            </div>
          )}
        </div>
      </div>

      ---

      {/* Assign Personnel Section - Improved UI with persistent dropdowns */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Assign Personnel</h2>
        
        {assignStatusMessage.text && (
          <div
            className={`p-4 mb-4 rounded-md text-sm flex items-center ${
              assignStatusMessage.type === 'success'
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {assignStatusMessage.type === 'success' ? <FaCheckCircle className="mr-2" /> : <FaExclamationCircle className="mr-2" />}
            {assignStatusMessage.text}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Site Supervisor Assignment Card */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Site Supervisor</h3>
            <div className="flex flex-col space-y-4">
              <select
                className="w-full border-gray-300 rounded-md shadow-sm text-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
                value={selectedSupervisorId}
                onChange={(e) => setSelectedSupervisorId(e.target.value)}
                disabled={assigningSupervisor}
              >
                <option value="">Select Site Supervisor</option>
                {availableSupervisors.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.username} ({user.email})
                  </option>
                ))}
              </select>
              <button
                onClick={() => handleAssignPersonnel('supervisor')}
                className="w-full px-4 py-3 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                disabled={assigningSupervisor || !selectedSupervisorId}
              >
                {assigningSupervisor ? (
                  <FaSpinner className="animate-spin mr-2" />
                ) : (
                  <FaUserPlus className="mr-2" />
                )}
                Assign/Change Supervisor
              </button>
            </div>
          </div>

          {/* Equipment Manager Assignment Card */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Equipment Manager</h3>
            <div className="flex flex-col space-y-4">
              <select
                className="w-full border-gray-300 rounded-md shadow-sm text-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
                value={selectedEquipmentManagerId}
                onChange={(e) => setSelectedEquipmentManagerId(e.target.value)}
                disabled={assigningEquipmentManager}
              >
                <option value="">Select Equipment Manager</option>
                {availableEquipmentManagers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.username} ({user.email})
                  </option>
                ))}
              </select>
              <button
                onClick={() => handleAssignPersonnel('equipment manager')}
                className="w-full px-4 py-3 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                disabled={assigningEquipmentManager || !selectedEquipmentManagerId}
              >
                {assigningEquipmentManager ? (
                  <FaSpinner className="animate-spin mr-2" />
                ) : (
                  <FaUserPlus className="mr-2" />
                )}
                Assign/Change Equipment Manager
              </button>
            </div>
          </div>
        </div>
      </div>

      ---
      
      {/* Main Tasks Section - Pass the entire projectData */}
      {projectData && <MainTaskList project={projectData} />}
      
    </div>
  );
}