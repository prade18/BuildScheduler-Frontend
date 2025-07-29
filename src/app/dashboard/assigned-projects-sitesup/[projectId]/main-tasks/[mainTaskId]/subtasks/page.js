'use client';
import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import CreateSubtaskForm from '../../../../../../../components/CreateSubtaskForm'; // Adjust path as needed
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

// All possible Task Statuses for the dropdown
const TASK_STATUSES = [
    'PLANNED', 'ASSIGNED', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED', 'CANCELLED', 'DELAYED'
];


export default function SubtasksPage() {
    const router = useRouter();
    const params = useParams();
    const { projectId, mainTaskId } = params; // Extract both IDs from the URL

    const [subtasks, setSubtasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', content: '' });
    const [editingSubtaskId, setEditingSubtaskId] = useState(null);
    const [editFormData, setEditFormData] = useState({});
    const [showCreateForm, setShowCreateForm] = useState(false);

    // --- State for Edit Form Skills Suggestions ---
    const [allSkills, setAllSkills] = useState([]); // Stores all possible skill objects {id, name}
    const [editSkillSearchTerm, setEditSkillSearchTerm] = useState('');
    const [filteredEditSkills, setFilteredEditSkills] = useState([]);
    const [selectedEditSkillObjects, setSelectedEditSkillObjects] = useState([]); // Stores selected skill objects for display

    // --- State for Edit Form Equipment Suggestions ---
    const [allEquipment, setAllEquipment] = useState([]); // Stores all possible equipment objects {id, name, model}
    const [editEquipmentSearchTerm, setEditEquipmentSearchTerm] = useState('');
    const [filteredEditEquipment, setFilteredEditEquipment] = useState([]);
    const [selectedEditEquipmentObjects, setSelectedEditEquipmentObjects] = useState([]); // Stores selected equipment objects for display

    // --- State for Worker Search & Assignment ---
    const [suggestedWorkers, setSuggestedWorkers] = useState({}); // Stores workers for each subtask: {subtaskId: [workers...]}
    const [searchingWorkersForSubtask, setSearchingWorkersForSubtask] = useState(null); // ID of subtask currently searching workers for

    // --- New State for Assignment Modal ---
    const [showAssignmentModal, setShowAssignmentModal] = useState(false);
    const [currentAssignmentDetails, setCurrentAssignmentDetails] = useState(null); // { subtaskId, workerId, workerName, subtaskTitle }
    const [workerNotes, setWorkerNotes] = useState('');


    // Refs for click-outside-to-close logic in edit form
    const editSkillsSuggestionsRef = useRef(null);
    const editEquipmentSuggestionsRef = useRef(null);


    useEffect(() => {
        if (mainTaskId) {
            fetchSubtasks();
            fetchAllSkillsAndEquipment(); // Fetch all skills and equipment on mount
        }

        // Click outside handler for closing suggestions in edit form
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
    }, [mainTaskId]); // eslint-disable-line react-hooks/exhaustive-deps


    const fetchAllSkillsAndEquipment = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error("No token found for fetching skills/equipment.");
            return;
        }

        // Fetch Skills
        try {
            const skillsRes = await fetch('http://localhost:8080/api/worker/profile/skills', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (skillsRes.ok) {
                const data = await skillsRes.json();
                if (data.success) {
                    setAllSkills(data.data);
                } else {
                    console.error("Failed to fetch skills:", data.message);
                }
            } else {
                console.error("Failed to fetch skills:", await skillsRes.text());
            }
        } catch (error) {
            console.error("Error fetching skills:", error);
        }

        // Fetch Equipment
        try {
            const equipmentRes = await fetch('http://localhost:8080/api/equipment/all', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (equipmentRes.ok) {
                const data = await equipmentRes.json();
                if (data.success) {
                    setAllEquipment(data.data);
                } else {
                    console.error("Failed to fetch equipment:", data.message);
                }
            } else {
                console.error("Failed to fetch equipment:", await equipmentRes.text());
            }
        } catch (error) {
            console.error("Error fetching equipment:", error);
        }
    };


    const fetchSubtasks = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }

            const res = await fetch(`http://localhost:8080/api/site-supervisor/main-tasks/${mainTaskId}/subtasks`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Failed to fetch subtasks.');
            }

            const data = await res.json();
            if (data.success) {
                setSubtasks(data.data);
            } else {
                throw new Error(data.message || 'Failed to fetch subtasks. Unknown error.');
            }
        } catch (error) {
            console.error("Fetch subtasks error:", error);
            setMessage({ type: 'error', content: error.message || 'An unexpected error occurred while fetching subtasks.' });
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (subtask) => {
        setEditingSubtaskId(subtask.id);
        setEditFormData({
            ...subtask,
            // Format dates to YYYY-MM-DDTHH:mm for datetime-local input
            plannedStart: subtask.plannedStart ? format(parseISO(subtask.plannedStart), "yyyy-MM-dd'T'HH:mm") : '',
            plannedEnd: subtask.plannedEnd ? format(parseISO(subtask.plannedEnd), "yyyy-MM-dd'T'HH:mm") : '',
            // Initialize requiredSkills with actual skill names from the subtask
            // Assuming subtask.requiredSkills is an array of strings like ["Welding", "Masonry"]
            requiredSkills: subtask.requiredSkills || [],
            // equipmentIds needs to be an array of numbers, extracted from equipmentNeeds
            equipmentIds: subtask.equipmentNeeds?.map(eq => eq.id) || [],
        });

        // Initialize selectedEditSkillObjects for display
        setSelectedEditSkillObjects(
            (subtask.requiredSkills || [])
                .map(skillName => allSkills.find(s => s.name === skillName))
                .filter(Boolean) // Filter out any skills not found in allSkills
        );

        // Initialize selectedEditEquipmentObjects for display
        setSelectedEditEquipmentObjects(subtask.equipmentNeeds || []);

        // Clear search terms and filtered lists
        setEditSkillSearchTerm('');
        setFilteredEditSkills([]);
        setEditEquipmentSearchTerm('');
        setFilteredEditEquipment([]);
    };

    const handleEditFormChange = (e) => {
        const { name, value, type } = e.target;
        if (type === 'number') {
            setEditFormData(prev => ({ ...prev, [name]: parseInt(value, 10) }));
        } else {
            setEditFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    // --- Edit Form Skill Handling ---
    const handleEditSkillSearchChange = (e) => {
        const term = e.target.value;
        setEditSkillSearchTerm(term);
        const filtered = allSkills.filter(
            skill => skill.name.toLowerCase().includes(term.toLowerCase()) &&
                     !selectedEditSkillObjects.some(s => s.id === skill.id)
        );
        setFilteredEditSkills(filtered);
    };

    const handleEditSkillSelect = (skill) => {
        if (!selectedEditSkillObjects.some(s => s.id === skill.id)) {
            setSelectedEditSkillObjects(prev => ([
                ...prev,
                { id: skill.id, name: skill.name }
            ]));
            setEditFormData(prev => ({
                ...prev,
                requiredSkills: [...prev.requiredSkills, skill.name]
            }));
            setEditSkillSearchTerm('');
            setFilteredEditSkills([]);
        }
    };

    const handleRemoveEditSkill = (skillIdToRemove) => {
        setSelectedEditSkillObjects(prev => {
            const newSelected = prev.filter(skill => skill.id !== skillIdToRemove);
            setEditFormData(formPrev => ({
                ...formPrev,
                requiredSkills: newSelected.map(s => s.name)
            }));
            return newSelected;
        });
    };

    // --- Edit Form Equipment Handling ---
    const handleEditEquipmentSearchChange = (e) => {
        const term = e.target.value;
        setEditEquipmentSearchTerm(term);
        const filtered = allEquipment.filter(
            eq => eq.name.toLowerCase().includes(term.toLowerCase()) &&
                  !selectedEditEquipmentObjects.some(s => s.id === eq.id)
        );
        setFilteredEditEquipment(filtered);
    };

    const handleEditEquipmentSelect = (equipment) => {
        if (!selectedEditEquipmentObjects.some(s => s.id === equipment.id)) {
            setSelectedEditEquipmentObjects(prev => ([
                ...prev,
                { id: equipment.id, name: equipment.name, model: equipment.model } // Keep model for display
            ]));
            setEditFormData(prev => ({
                ...prev,
                equipmentIds: [...prev.equipmentIds, equipment.id]
            }));
            setEditEquipmentSearchTerm('');
            setFilteredEditEquipment([]);
        }
    };

    const handleRemoveEditEquipment = (equipmentIdToRemove) => {
        setSelectedEditEquipmentObjects(prev => {
            const newSelected = prev.filter(eq => eq.id !== equipmentIdToRemove);
            setEditFormData(formPrev => ({
                ...formPrev,
                equipmentIds: newSelected.map(eq => eq.id) // Rebuild equipmentIds from remaining selected IDs
            }));
            return newSelected;
        });
    };


    const handleUpdateSubtask = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }

            const payload = {
                title: editFormData.title,
                description: editFormData.description,
                plannedStart: editFormData.plannedStart,
                plannedEnd: editFormData.plannedEnd,
                estimatedHours: parseInt(editFormData.estimatedHours, 10),
                requiredWorkers: parseInt(editFormData.requiredWorkers, 10),
                priority: parseInt(editFormData.priority, 10),
                equipmentRequestNotes: editFormData.equipmentRequestNotes,
                equipmentIds: editFormData.equipmentIds, // This now contains numerical IDs
                requiredSkills: editFormData.requiredSkills, // This now contains string names
            };

            const res = await fetch(`http://localhost:8080/api/site-supervisor/subtasks/${editingSubtaskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Failed to update subtask.');
            }

            const data = await res.json();
            if (data.success) {
                setMessage({ type: 'success', content: 'Subtask updated successfully!' });
                setEditingSubtaskId(null); // Exit editing mode
                fetchSubtasks(); // Refresh the list
            } else {
                throw new Error(data.message || 'Failed to update subtask. Unknown error.');
            }
        } catch (error) {
            console.error("Update subtask error:", error);
            setMessage({ type: 'error', content: error.message || 'An unexpected error occurred while updating subtask.' });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteSubtask = async (subtaskId) => {
        if (!window.confirm('Are you sure you want to delete this subtask?')) {
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }

            const res = await fetch(`http://localhost:8080/api/site-supervisor/subtasks/${subtaskId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Failed to delete subtask.');
            }

            setMessage({ type: 'success', content: 'Subtask deleted successfully!' });
            fetchSubtasks(); // Refresh the list
        } catch (error) {
            console.error("Delete subtask error:", error);
            setMessage({ type: 'error', content: error.message || 'An unexpected error occurred while deleting subtask.' });
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (subtaskId, newStatus) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }

            const res = await fetch(`http://localhost:8080/api/site-supervisor/subtasks/${subtaskId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Failed to update subtask status.');
            }

            const data = await res.json();
            if (data.success) {
                setMessage({ type: 'success', content: `Subtask status updated to ${newStatus.replace(/_/g, ' ')}!` });
                fetchSubtasks(); // Refresh the list
            } else {
                throw new Error(data.message || 'Failed to update status. Unknown error.');
            }
        } catch (error) {
            console.error("Update status error:", error);
            setMessage({ type: 'error', content: error.message || 'An unexpected error occurred while updating status.' });
        } finally {
            setLoading(false);
        }
    };

    // --- Worker Search Logic ---
    const handleSearchWorkers = async (subtaskId) => {
        setSearchingWorkersForSubtask(subtaskId); // Indicate which subtask we're searching for
        setMessage({ type: '', content: '' }); // Clear any previous messages
        setSuggestedWorkers(prev => ({ ...prev, [subtaskId]: [] })); // Clear previous suggestions for this subtask

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }

            const res = await fetch(`http://localhost:8080/api/site-supervisor/subtasks/${subtaskId}/workers/search`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Failed to search for workers.');
            }

            const data = await res.json();
            if (data.success) {
                setSuggestedWorkers(prev => ({ ...prev, [subtaskId]: data.data }));
                setMessage({ type: 'success', content: data.message || 'Workers found successfully!' });
            } else {
                throw new Error(data.message || 'No workers found or an unknown error occurred.');
            }
        } catch (error) {
            console.error("Search workers error:", error);
            setMessage({ type: 'error', content: error.message || 'An unexpected error occurred while searching for workers.' });
        } finally {
            setSearchingWorkersForSubtask(null); // Reset searching state
        }
    };

    // --- Assignment Flow: Step 1 - Open Modal ---
    const handleAssignWorkerClick = (subtask, worker) => {
        // Prepare the details to be passed to the modal
        setCurrentAssignmentDetails({
            subtaskId: subtask.id,
            workerId: worker.id,
            workerName: worker.username,
            subtaskTitle: subtask.title,
            // Store planned times for backend use
            plannedStart: subtask.plannedStart,
            plannedEnd: subtask.plannedEnd,
        });
        setWorkerNotes(''); // Clear previous notes
        setShowAssignmentModal(true); // Open the modal
    };

    // --- Assignment Flow: Step 2 - Confirm Assignment from Modal ---
    const confirmAssignment = async () => {
        if (!currentAssignmentDetails) return;

        setMessage({ type: '', content: '' }); // Clear previous messages
        setLoading(true); // Set loading while assignment is in progress

        const { subtaskId, workerId, plannedStart, plannedEnd } = currentAssignmentDetails;

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }

            const payload = {
                workerId: workerId,
                assignmentStart: plannedStart, // Use subtask's original planned times
                assignmentEnd: plannedEnd,     // Use subtask's original planned times
                workerNotes: workerNotes,
            };

            const res = await fetch(`http://localhost:8080/api/site-supervisor/subtasks/${subtaskId}/workers/assign`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Failed to assign worker.');
            }

            const data = await res.json();
            if (data.success) {
                setMessage({ type: 'success', content: data.message || 'Worker assigned successfully!' });
                fetchSubtasks(); // Refresh the list to show the new assignment
                // Clear suggestions for this subtask after assignment
                setSuggestedWorkers(prev => {
                    const newState = { ...prev };
                    delete newState[subtaskId];
                    return newState;
                });
            } else {
                throw new Error(data.message || 'Failed to assign worker. Unknown error.');
            }
        } catch (error) {
            console.error("Assign worker error:", error);
            setMessage({ type: 'error', content: error.message || 'An unexpected error occurred while assigning worker.' });
        } finally {
            setLoading(false);
            setShowAssignmentModal(false); // Close the modal
            setCurrentAssignmentDetails(null); // Clear assignment details
            setWorkerNotes(''); // Clear notes
        }
    };


    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <p className="text-xl font-semibold text-indigo-600 animate-pulse">Loading subtasks...</p>
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
                    Subtasks for Main Task {mainTaskId}
                </h1>

                {/* Create Subtask Section */}
                <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8 border border-gray-200">
                    <button
                        onClick={() => setShowCreateForm(!showCreateForm)}
                        className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                    >
                        {showCreateForm ? 'Hide Create Subtask Form' : 'Create New Subtask'}
                    </button>
                    {showCreateForm && (
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <CreateSubtaskForm mainTaskId={mainTaskId} onSubtaskCreated={() => {
                                fetchSubtasks(); // Refresh subtasks after creation
                                setShowCreateForm(false); // Hide form after creation
                            }} />
                        </div>
                    )}
                </div>

                {/* Subtasks List */}
                <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8 border border-gray-200">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">All Subtasks</h2>
                    {subtasks.length === 0 ? (
                        <p className="text-gray-600 italic text-lg text-center py-8">No subtasks found for this main task.</p>
                    ) : (
                        <div className="grid grid-cols-1 gap-6">
                            {subtasks.map(subtask => (
                                <div key={subtask.id} className="bg-white border border-gray-200 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 ease-in-out">
                                    {editingSubtaskId === subtask.id ? (
                                        // Edit Form
                                        <form onSubmit={handleUpdateSubtask} className="space-y-4">
                                            <div>
                                                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                                                <input type="text" name="title" id="title" value={editFormData.title || ''} onChange={handleEditFormChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                                            </div>
                                            <div>
                                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                                                <textarea name="description" id="description" value={editFormData.description || ''} onChange={handleEditFormChange} rows="3" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"></textarea>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label htmlFor="plannedStart" className="block text-sm font-medium text-gray-700">Planned Start</label>
                                                    <input type="datetime-local" name="plannedStart" id="plannedStart" value={editFormData.plannedStart || ''} onChange={handleEditFormChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                                                </div>
                                                <div>
                                                    <label htmlFor="plannedEnd" className="block text-sm font-medium text-gray-700">Planned End</label>
                                                    <input type="datetime-local" name="plannedEnd" id="plannedEnd" value={editFormData.plannedEnd || ''} onChange={handleEditFormChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div>
                                                    <label htmlFor="estimatedHours" className="block text-sm font-medium text-gray-700">Estimated Hours</label>
                                                    <input type="number" name="estimatedHours" id="estimatedHours" value={editFormData.estimatedHours || ''} onChange={handleEditFormChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                                                </div>
                                                <div>
                                                    <label htmlFor="requiredWorkers" className="block text-sm font-medium text-gray-700">Required Workers</label>
                                                    <input type="number" name="requiredWorkers" id="requiredWorkers" value={editFormData.requiredWorkers || ''} onChange={handleEditFormChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                                                </div>
                                                <div>
                                                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Priority</label>
                                                    <input type="number" name="priority" id="priority" value={editFormData.priority || ''} onChange={handleEditFormChange} min="1" max="4" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                                                </div>
                                            </div>
                                            <div>
                                                <label htmlFor="equipmentRequestNotes" className="block text-sm font-medium text-gray-700">Equipment Notes</label>
                                                <textarea name="equipmentRequestNotes" id="equipmentRequestNotes" value={editFormData.equipmentRequestNotes || ''} onChange={handleEditFormChange} rows="2" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"></textarea>
                                            </div>

                                            {/* --- Edit Form: Required Skills Input with Suggestions --- */}
                                            <div className="relative" ref={editSkillsSuggestionsRef}>
                                                <label htmlFor="editSkillSearch" className="block text-sm font-medium text-gray-700">Required Skills</label>
                                                <input
                                                    type="text"
                                                    id="editSkillSearch"
                                                    value={editSkillSearchTerm}
                                                    onChange={handleEditSkillSearchChange}
                                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                                    placeholder="Type to add/search skills..."
                                                />
                                                {filteredEditSkills.length > 0 && (
                                                    <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto mt-1">
                                                        {filteredEditSkills.map((skill) => (
                                                            <li
                                                                key={skill.id}
                                                                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                                                onClick={() => handleEditSkillSelect(skill)}
                                                            >
                                                                {skill.name}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                                <div className="mt-2 flex flex-wrap gap-2">
                                                    {selectedEditSkillObjects.map((skill) => (
                                                        <span key={skill.id} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                                                            {skill.name}
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveEditSkill(skill.id)}
                                                                className="ml-2 -mr-0.5 h-4 w-4 rounded-full flex items-center justify-center text-indigo-600 hover:bg-indigo-200 hover:text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                            >
                                                                &times;
                                                            </button>
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* --- Edit Form: Equipment Needed Input with Suggestions --- */}
                                            <div className="relative" ref={editEquipmentSuggestionsRef}>
                                                <label htmlFor="editEquipmentSearch" className="block text-sm font-medium text-gray-700">Equipment Needed</label>
                                                <input
                                                    type="text"
                                                    id="editEquipmentSearch"
                                                    value={editEquipmentSearchTerm}
                                                    onChange={handleEditEquipmentSearchChange}
                                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                                    placeholder="Type to add/search equipment..."
                                                />
                                                {filteredEditEquipment.length > 0 && (
                                                    <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto mt-1">
                                                        {filteredEditEquipment.map((eq) => (
                                                            <li
                                                                key={eq.id}
                                                                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                                                onClick={() => handleEditEquipmentSelect(eq)}
                                                            >
                                                                {eq.name} ({eq.model || 'N/A'})
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                                <div className="mt-2 flex flex-wrap gap-2">
                                                    {selectedEditEquipmentObjects.map((eq) => (
                                                        <span key={eq.id} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                                                            {eq.name}
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveEditEquipment(eq.id)}
                                                                className="ml-2 -mr-0.5 h-4 w-4 rounded-full flex items-center justify-center text-purple-600 hover:bg-purple-200 hover:text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                            >
                                                                &times;
                                                            </button>
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>


                                            <div className="flex justify-end space-x-3 mt-4">
                                                <button type="button" onClick={() => setEditingSubtaskId(null)} className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                                    Cancel
                                                </button>
                                                <button type="submit" className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                                    Save Changes
                                                </button>
                                            </div>
                                        </form>
                                    ) : (
                                        // Display Mode
                                        <>
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-900 leading-tight mb-1">{subtask.title}</h3>
                                                    <p className="text-gray-700 text-sm">{subtask.description}</p>
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    {getStatusBadge(subtask.status)}
                                                    <select
                                                        value={subtask.status}
                                                        onChange={(e) => handleStatusChange(subtask.id, e.target.value)}
                                                        className="block w-full pl-3 pr-8 py-1 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                                        aria-label="Update subtask status"
                                                    >
                                                        {TASK_STATUSES.map(status => (
                                                            <option key={status} value={status}>{status.replace(/_/g, ' ')}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-2 gap-x-6 text-sm text-gray-700 mt-4 pt-4 border-t border-gray-100">
                                                <DetailItem label="Planned Start" value={subtask.plannedStart ? format(parseISO(subtask.plannedStart), 'dd MMM yyyy HH:mm') : '-'} />
                                                <DetailItem label="Planned End" value={subtask.plannedEnd ? format(parseISO(subtask.plannedEnd), 'dd MMM yyyy HH:mm') : '-'} />
                                                <DetailItem label="Estimated Hours" value={`${subtask.estimatedHours}h`} />
                                                <DetailItem label="Required Workers" value={subtask.requiredWorkers} />
                                                <DetailItem label="Priority" value={subtask.priority} />
                                                <DetailItem label="Equipment Notes" value={subtask.equipmentRequestNotes || '-'} />

                                                {/* Highlighted Required Skills */}
                                                <div className="col-span-full sm:col-span-2 lg:col-span-3">
                                                    <h4 className="font-semibold text-gray-600 mb-1">Required Skills:</h4>
                                                    {subtask.requiredSkills && subtask.requiredSkills.length > 0 ? (
                                                        <div className="flex flex-wrap gap-2">
                                                            {subtask.requiredSkills.map((skill, index) => (
                                                                <span key={index} className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                                                                    {skill}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <p className="text-gray-700 italic">No specific skills required.</p>
                                                    )}
                                                </div>

                                                {subtask.equipmentNeeds && subtask.equipmentNeeds.length > 0 && (
                                                    <div className="col-span-full sm:col-span-2 lg:col-span-3">
                                                        <h4 className="font-semibold text-gray-600 mb-1">Equipment Needed:</h4>
                                                        <ul className="list-disc list-inside text-gray-700">
                                                            {subtask.equipmentNeeds.map(eq => (
                                                                <li key={eq.id}>{eq.name} ({eq.model})</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}

                                                {/* Worker Assignments */}
                                                {subtask.workerAssignments && subtask.workerAssignments.length > 0 && (
                                                    <div className="col-span-full sm:col-span-2 lg:col-span-3">
                                                        <h4 className="font-semibold text-gray-600 mb-1">Assigned Workers:</h4>
                                                        <ul className="list-disc list-inside text-gray-700">
                                                            {subtask.workerAssignments.map(assignment => (
                                                                <li key={assignment.id}>{assignment.worker.username} (ID: {assignment.worker.id})</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Search Workers Button */}
                                            <div className="mt-6">
                                                <button
                                                    onClick={() => handleSearchWorkers(subtask.id)}
                                                    className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                                                    disabled={searchingWorkersForSubtask === subtask.id}
                                                >
                                                    {searchingWorkersForSubtask === subtask.id ? 'Searching...' : 'Search Workers'}
                                                </button>
                                            </div>

                                            {/* Suggested Workers Section */}
                                            {suggestedWorkers[subtask.id] && suggestedWorkers[subtask.id].length > 0 && (
                                                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                                                    <h4 className="text-lg font-semibold text-green-800 mb-3">Suggested Workers:</h4>
                                                    <ul className="space-y-3">
                                                        {suggestedWorkers[subtask.id].map(worker => (
                                                            <li key={worker.id} className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white p-3 rounded-md shadow-sm border border-green-100">
                                                                <div>
                                                                    <p className="font-medium text-gray-900">{worker.username} (ID: {worker.id})</p>
                                                                    <p className="text-sm text-gray-600">Email: {worker.email}</p>
                                                                    <p className="text-sm text-gray-600">Skills: {worker.skills && worker.skills.length > 0 ? worker.skills.join(', ') : 'N/A'}</p>
                                                                </div>
                                                                <button
                                                                    onClick={() => handleAssignWorkerClick(subtask, worker)}
                                                                    className="mt-3 md:mt-0 md:ml-4 px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                                                >
                                                                    Assign
                                                                </button>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                            {suggestedWorkers[subtask.id] && suggestedWorkers[subtask.id].length === 0 && !searchingWorkersForSubtask && (
                                                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700">
                                                    <p className="text-sm text-center">No matching workers found for this subtask.</p>
                                                </div>
                                            )}


                                            <div className="mt-6 flex justify-end space-x-3">
                                                <button
                                                    onClick={() => handleEditClick(subtask)}
                                                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteSubtask(subtask.id)}
                                                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
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

            {/* Assignment Notes Modal */}
            {showAssignmentModal && currentAssignmentDetails && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-auto animate-fade-in-up">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Assign Worker to Subtask</h3>
                        <p className="text-gray-700 mb-4">
                            Assigning <span className="font-semibold text-indigo-700">{currentAssignmentDetails.workerName}</span> 
                            (ID: {currentAssignmentDetails.workerId}) to Subtask: 
                            <span className="font-semibold text-indigo-700"> {currentAssignmentDetails.subtaskTitle}</span>.
                        </p>
                        
                        <div className="mb-4">
                            <label htmlFor="workerNotes" className="block text-sm font-medium text-gray-700 mb-1">
                                Worker Notes (Optional):
                            </label>
                            <textarea
                                id="workerNotes"
                                value={workerNotes}
                                onChange={(e) => setWorkerNotes(e.target.value)}
                                rows="4"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Add any specific notes for this assignment..."
                            ></textarea>
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    setShowAssignmentModal(false);
                                    setCurrentAssignmentDetails(null);
                                    setWorkerNotes('');
                                }}
                                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmAssignment}
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                disabled={loading}
                            >
                                {loading ? 'Assigning...' : 'Assign Worker'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}