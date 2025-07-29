// src/components/MainTaskList.js
'use client'

import { useEffect, useState, Fragment } from 'react'
import { useSelector } from 'react-redux'
import { format, parseISO } from 'date-fns'
import { PlusCircleIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline' // Icons
import { Dialog, Transition } from '@headlessui/react' // For modals
import Link from 'next/link' // Import Link for navigation

export default function MainTaskList({ project }) { // Accept 'project' prop
  const { token } = useSelector((state) => state.auth)

  const projectId = project?.id;

  const [mainTasks, setMainTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [currentTask, setCurrentTask] = useState(null) // For edit mode
  const [formError, setFormError] = useState('')
  const [formMessage, setFormMessage] = useState('')

  const initialFormData = {
    title: '',
    description: '',
    plannedStartDate: '',
    plannedEndDate: '',
    priority: '1',
    estimatedHours: '',
  };

  const [formData, setFormData] = useState(initialFormData);

  const priorityOptions = [
    { value: '1', label: 'Low' },
    { value: '2', label: 'Medium' },
    { value: '3', label: 'High' },
    { value: '4', label: 'Critical' },
  ]

  const getPriorityText = (priority) => {
    switch (priority) {
      case 1: return 'Low';
      case 2: return 'Medium';
      case 3: return 'High';
      case 4: return 'Critical';
      default: return 'N/A';
    }
  };

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

  const fetchMainTasks = async () => {
    if (!token || !projectId) {
      setError("Authentication token or Project ID missing for tasks.");
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/api/pm/projects/${projectId}/main-tasks?page=0&size=10`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setMainTasks(data.data.content || []);
      } else {
        setError(data.message || 'Failed to fetch main tasks.');
        console.error('API Error:', data.message);
      }
    } catch (err) {
      setError('An error occurred while fetching main tasks.');
      console.error('Fetch Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (project && token) {
      fetchMainTasks();
    }
  }, [project, token]);

  const openModal = (task = null) => {
    setIsModalOpen(true);
    setFormError('');
    setFormMessage('');

    if (task) {
      setIsEditMode(true);
      setCurrentTask(task);
      setFormData({
        title: task.title,
        description: task.description,
        plannedStartDate: task.plannedStartDate || '',
        plannedEndDate: task.plannedEndDate || '',
        priority: String(task.priority),
        estimatedHours: String(task.estimatedHours || ''),
      });
    } else {
      setIsEditMode(false);
      setCurrentTask(null);
      setFormData(initialFormData);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormError('');
    setFormMessage('');
    setFormData(initialFormData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormMessage('');

    if (new Date(formData.plannedStartDate) > new Date(formData.plannedEndDate)) {
        setFormError('Planned End Date cannot be before Planned Start Date.');
        return;
    }
    if (!formData.title || !formData.description || !formData.plannedStartDate || !formData.plannedEndDate || !formData.estimatedHours || !formData.priority) {
        setFormError('Please fill in all required fields.');
        return;
    }

    const payload = {
      ...formData,
      priority: parseInt(formData.priority),
      estimatedHours: parseInt(formData.estimatedHours),
      ...(project?.siteSupervisor?.id && { supervisorId: project.siteSupervisor.id }),
      ...(project?.equipmentManager?.id && { equipmentManagerId: project.equipmentManager.id })
    };

    try {
      let res;
      if (isEditMode) {
        res = await fetch(`http://localhost:8080/api/pm/projects/${projectId}/main-tasks/${currentTask.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch(`http://localhost:8080/api/pm/projects/${projectId}/main-tasks`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      }
      const data = await res.json();
      if (res.ok && data.success) {
        setFormMessage(`Main task ${isEditMode ? 'updated' : 'created'} successfully!`);
        fetchMainTasks();
        closeModal();
      } else {
        setFormError(data.message || `Failed to ${isEditMode ? 'update' : 'create'} main task.`);
      }
    } catch (err) {
      setFormError(err.message || 'An error occurred during task operation.');
      console.error('Task operation error:', err);
    }
  };

  const handleDelete = async (taskId) => {
    if (!confirm('Are you sure you want to delete this main task? This action cannot be undone.')) {
      return;
    }
    try {
      const res = await fetch(`http://localhost:8080/api/pm/projects/${projectId}/main-tasks/${taskId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setFormMessage('Main task deleted successfully!');
        fetchMainTasks();
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to delete main task.');
      }
    } catch (err) {
      alert('An error occurred while deleting the task.');
      console.error('Delete task error:', err);
    }
  };

  if (!project) {
    return (
        <div className="flex justify-center items-center py-10">
            <p className="text-lg text-gray-600">Loading project details...</p>
        </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <p className="text-lg text-gray-600">Loading main tasks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-10 text-center">
        <p className="text-lg text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="mt-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Main Tasks</h2>
        <button
          onClick={() => openModal()}
          className="inline-flex items-center px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <PlusCircleIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Add Main Task
        </button>
      </div>

      {mainTasks.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center border border-gray-200">
          <p className="text-xl text-gray-600">No main tasks defined for this project yet.</p>
          <p className="text-gray-500 mt-2">Click "Add Main Task" to get started!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {mainTasks.map((task) => (
            <div key={task.id} className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-2xl font-bold text-gray-900">{task.title}</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(task.status)}`}>
                  {task.status.replace(/_/g, ' ')}
                </span>
              </div>
              <p className="text-gray-600 mb-4">{task.description}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-gray-700 text-sm">
                <div>
                  <p className="font-semibold">Planned Start:</p>
                  <p>{task.plannedStartDate ? format(parseISO(task.plannedStartDate), 'PPP') : 'N/A'}</p>
                </div>
                <div>
                  <p className="font-semibold">Planned End:</p>
                  <p>{task.plannedEndDate ? format(parseISO(task.plannedEndDate), 'PPP') : 'N/A'}</p>
                </div>
                <div>
                  <p className="font-semibold">Priority:</p>
                  <p>{getPriorityText(task.priority)}</p>
                </div>
                <div>
                  <p className="font-semibold">Est. Hours:</p>
                  <p>{task.estimatedHours || 'N/A'}</p>
                </div>
                {task.supervisorName && (
                  <div>
                    <p className="font-semibold">Supervisor:</p>
                    <p>{task.supervisorName}</p>
                  </div>
                )}
                {task.equipmentManagerName && (
                  <div>
                    <p className="font-semibold">Equipment Mgr:</p>
                    <p>{task.equipmentManagerName}</p>
                  </div>
                )}
                <div>
                  <p className="font-semibold">Completion:</p>
                  <p>{task.completionPercentage?.toFixed(2)}%</p>
                </div>
                {task.overdue && (
                  <div className="col-span-full">
                    <p className="text-red-600 font-semibold">Status: Overdue!</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                {/* View Subtasks Button */}
                <Link
                  href={`/dashboard/projects/view/${projectId}/maintask/${task.id}`}
                  passHref
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                >
                  View Subtasks
                </Link>
                <button
                  onClick={() => openModal(task)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                  <PencilSquareIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(task.id)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                >
                  <TrashIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Main Task Add/Edit Modal */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-40" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-2xl font-bold leading-6 text-gray-900 mb-4">
                    {isEditMode ? 'Edit Main Task' : 'Add New Main Task'}
                  </Dialog.Title>

                  {formError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-sm">
                      {formError}
                    </div>
                  )}
                  {formMessage && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4 text-sm">
                      {formMessage}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="taskTitle" className="block text-sm font-medium text-gray-700">Title</label>
                      <input
                        type="text"
                        id="taskTitle"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="taskDescription" className="block text-sm font-medium text-gray-700">Description</label>
                      <textarea
                        id="taskDescription"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        required
                      ></textarea>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="plannedStartDate" className="block text-sm font-medium text-gray-700">Planned Start Date</label>
                        <input
                          type="date"
                          id="plannedStartDate"
                          name="plannedStartDate"
                          value={formData.plannedStartDate}
                          onChange={handleChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="plannedEndDate" className="block text-sm font-medium text-gray-700">Planned End Date</label>
                        <input
                          type="date"
                          id="plannedEndDate"
                          name="plannedEndDate"
                          value={formData.plannedEndDate}
                          onChange={handleChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Priority</label>
                        <select
                          id="priority"
                          name="priority"
                          value={formData.priority}
                          onChange={handleChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          required
                        >
                          {priorityOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="estimatedHours" className="block text-sm font-medium text-gray-700">Estimated Hours</label>
                        <input
                          type="number"
                          id="estimatedHours"
                          name="estimatedHours"
                          value={formData.estimatedHours}
                          onChange={handleChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          required
                        />
                      </div>
                    </div>

                    <div className="mt-5 sm:mt-6 flex justify-end gap-3">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                        onClick={closeModal}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      >
                        {isEditMode ? 'Update Task' : 'Create Task'}
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}