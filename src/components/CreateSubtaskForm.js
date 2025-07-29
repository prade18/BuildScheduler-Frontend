'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

const CreateSubtaskForm = ({ mainTaskId, onSubtaskCreated }) => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        plannedStart: '',
        plannedEnd: '',
        estimatedHours: 0,
        requiredWorkers: 0,
        priority: 1, // Default priority
        requiredSkills: [], // Stores skill names as strings
        equipmentIds: [], // Stores equipment IDs as numbers
        equipmentRequestNotes: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', content: '' });

    // State for skills suggestions
    const [allSkills, setAllSkills] = useState([]); // Will store skill objects {id, name}
    const [skillSearchTerm, setSkillSearchTerm] = useState('');
    const [filteredSkills, setFilteredSkills] = useState([]);
    // State to store selected skill objects (name, id) for display
    const [selectedSkillObjects, setSelectedSkillObjects] = useState([]);


    // State for equipment suggestions
    const [allEquipment, setAllEquipment] = useState([]);
    const [equipmentSearchTerm, setEquipmentSearchTerm] = useState('');
    const [filteredEquipment, setFilteredEquipment] = useState([]);
    // State to store selected equipment objects (name, id) for display
    const [selectedEquipmentObjects, setSelectedEquipmentObjects] = useState([]);

    // Refs for click-outside-to-close logic
    const skillsSuggestionsRef = useRef(null);
    const equipmentSuggestionsRef = useRef(null);

    // --- Fetch all skills and equipment on component mount ---
    useEffect(() => {
        const fetchAllOptions = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error("No token found for fetching skills/equipment.");
                // Optionally redirect to login or show an error
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
                        // Assuming data.data is an array of skill objects {id, name}
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
                        setAllEquipment(data.data); // Assuming data.data is an array of equipment objects {id, name, ...}
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

        fetchAllOptions();

        // Click outside handler for closing suggestions
        const handleClickOutside = (event) => {
            if (skillsSuggestionsRef.current && !skillsSuggestionsRef.current.contains(event.target)) {
                setFilteredSkills([]);
            }
            if (equipmentSuggestionsRef.current && !equipmentSuggestionsRef.current.contains(event.target)) {
                setFilteredEquipment([]);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        if (type === 'number') {
            setFormData(prev => ({ ...prev, [name]: parseInt(value, 10) }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    // --- Skill handling ---
    const handleSkillSearchChange = (e) => {
        const term = e.target.value;
        setSkillSearchTerm(term);
        // Filter instantly, even with an empty term show all non-selected skills
        const filtered = allSkills.filter(
            skill => skill.name.toLowerCase().includes(term.toLowerCase()) &&
                     !selectedSkillObjects.some(s => s.id === skill.id) // Filter out already selected by ID
        );
        setFilteredSkills(filtered);
    };

    const handleSkillSelect = (skill) => {
        // Only add if not already selected by ID
        if (!selectedSkillObjects.some(s => s.id === skill.id)) {
            setFormData(prev => ({
                ...prev,
                requiredSkills: [...prev.requiredSkills, skill.name] // Store just the name for formData
            }));
            setSelectedSkillObjects(prev => ([
                ...prev,
                { id: skill.id, name: skill.name } // Store object for display and ID tracking
            ]));
            setSkillSearchTerm('');
            setFilteredSkills([]); // Clear suggestions after selection
        }
    };

    const handleRemoveSkill = (skillIdToRemove) => {
        setSelectedSkillObjects(prev => {
            const newSelected = prev.filter(skill => skill.id !== skillIdToRemove);
            setFormData(formPrev => ({
                ...formPrev,
                requiredSkills: newSelected.map(s => s.name) // Rebuild requiredSkills from remaining selected names
            }));
            return newSelected;
        });
    };

    // --- Equipment handling ---
    const handleEquipmentSearchChange = (e) => {
        const term = e.target.value;
        setEquipmentSearchTerm(term);
        // Filter instantly
        const filtered = allEquipment.filter(
            eq => eq.name.toLowerCase().includes(term.toLowerCase()) &&
                  !selectedEquipmentObjects.some(s => s.id === eq.id) // Filter out already selected by ID
        );
        setFilteredEquipment(filtered);
    };

    const handleEquipmentSelect = (equipment) => {
        // Only add if not already selected by ID
        if (!selectedEquipmentObjects.some(s => s.id === equipment.id)) {
            setFormData(prev => ({
                ...prev,
                equipmentIds: [...prev.equipmentIds, equipment.id] // Store just the ID for formData
            }));
            setSelectedEquipmentObjects(prev => ([
                ...prev,
                { id: equipment.id, name: equipment.name } // Store object for display
            ]));
            setEquipmentSearchTerm('');
            setFilteredEquipment([]); // Clear suggestions after selection
        }
    };

    const handleRemoveEquipment = (equipmentIdToRemove) => {
        setFormData(prev => ({
            ...prev,
            equipmentIds: prev.equipmentIds.filter(id => id !== equipmentIdToRemove)
        }));
        setSelectedEquipmentObjects(prev => prev.filter(eq => eq.id !== equipmentIdToRemove));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', content: '' }); // Clear previous messages

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }

            const payload = {
                title: formData.title,
                description: formData.description,
                plannedStart: formData.plannedStart,
                plannedEnd: formData.plannedEnd,
                estimatedHours: formData.estimatedHours,
                requiredWorkers: formData.requiredWorkers,
                priority: formData.priority,
                equipmentRequestNotes: formData.equipmentRequestNotes,
                equipmentIds: formData.equipmentIds, // This now contains numerical IDs
                requiredSkills: formData.requiredSkills, // This now contains string names
            };

            const res = await fetch(`http://localhost:8080/api/site-supervisor/main-tasks/${mainTaskId}/subtasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Failed to create subtask.');
            }

            const data = await res.json();
            if (data.success) {
                setMessage({ type: 'success', content: 'Subtask created successfully!' });
                setFormData({ // Reset form
                    title: '',
                    description: '',
                    plannedStart: '',
                    plannedEnd: '',
                    estimatedHours: 0,
                    requiredWorkers: 0,
                    priority: 1,
                    requiredSkills: [],
                    equipmentIds: [],
                    equipmentRequestNotes: ''
                });
                setSelectedSkillObjects([]); // Also clear selected skills for display
                setSelectedEquipmentObjects([]); // Also clear selected equipment for display
                onSubtaskCreated(); // Notify parent to refresh list
            } else {
                throw new Error(data.message || 'Failed to create subtask. Unknown error.');
            }
        } catch (error) {
            console.error("Create subtask error:", error);
            setMessage({ type: 'error', content: error.message || 'An unexpected error occurred while creating subtask.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
            <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Create New Subtask</h3>
            {message.content && (
                <div className={`mb-4 p-3 rounded text-sm ${
                    message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                    {message.content}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title <span className="text-red-500">*</span></label>
                    <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows="3" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"></textarea>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="plannedStart" className="block text-sm font-medium text-gray-700">Planned Start <span className="text-red-500">*</span></label>
                        <input type="datetime-local" name="plannedStart" id="plannedStart" value={formData.plannedStart} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                    </div>
                    <div>
                        <label htmlFor="plannedEnd" className="block text-sm font-medium text-gray-700">Planned End <span className="text-red-500">*</span></label>
                        <input type="datetime-local" name="plannedEnd" id="plannedEnd" value={formData.plannedEnd} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="estimatedHours" className="block text-sm font-medium text-gray-700">Estimated Hours <span className="text-red-500">*</span></label>
                        <input type="number" name="estimatedHours" id="estimatedHours" value={formData.estimatedHours} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required min="0" />
                    </div>
                    <div>
                        <label htmlFor="requiredWorkers" className="block text-sm font-medium text-gray-700">Required Workers <span className="text-red-500">*</span></label>
                        <input type="number" name="requiredWorkers" id="requiredWorkers" value={formData.requiredWorkers} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required min="0" />
                    </div>
                    <div>
                        <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Priority <span className="text-red-500">*</span></label>
                        <input type="number" name="priority" id="priority" value={formData.priority} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required min="1" max="4" />
                    </div>
                </div>
                <div>
                    <label htmlFor="equipmentRequestNotes" className="block text-sm font-medium text-gray-700">Equipment Request Notes</label>
                    <textarea name="equipmentRequestNotes" id="equipmentRequestNotes" value={formData.equipmentRequestNotes} onChange={handleChange} rows="2" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"></textarea>
                </div>

                {/* --- Required Skills Input with Suggestions --- */}
                <div className="relative" ref={skillsSuggestionsRef}>
                    <label htmlFor="skillSearch" className="block text-sm font-medium text-gray-700">Required Skills</label>
                    <input
                        type="text"
                        id="skillSearch"
                        value={skillSearchTerm}
                        onChange={handleSkillSearchChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        placeholder="Type to search skills..."
                    />
                    {filteredSkills.length > 0 && ( // Show suggestions even if term is empty but skills are filtered
                        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto mt-1">
                            {filteredSkills.map((skill) => ( // Skill is an object {id, name}
                                <li
                                    key={skill.id}
                                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                    onClick={() => handleSkillSelect(skill)}
                                >
                                    {skill.name}
                                </li>
                            ))}
                        </ul>
                    )}
                    <div className="mt-2 flex flex-wrap gap-2">
                        {selectedSkillObjects.map((skill) => ( // Iterate over selectedSkillObjects for display
                            <span key={skill.id} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                                {skill.name}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveSkill(skill.id)}
                                    className="ml-2 -mr-0.5 h-4 w-4 rounded-full flex items-center justify-center text-indigo-600 hover:bg-indigo-200 hover:text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    &times;
                                </button>
                            </span>
                        ))}
                    </div>
                </div>

                {/* --- Equipment IDs Input with Suggestions --- */}
                <div className="relative" ref={equipmentSuggestionsRef}>
                    <label htmlFor="equipmentSearch" className="block text-sm font-medium text-gray-700">Equipment Needed</label>
                    <input
                        type="text"
                        id="equipmentSearch"
                        value={equipmentSearchTerm}
                        onChange={handleEquipmentSearchChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        placeholder="Type to search equipment..."
                    />
                    {filteredEquipment.length > 0 && ( // Show suggestions even if term is empty but equipment is filtered
                        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto mt-1">
                            {filteredEquipment.map((eq) => (
                                <li
                                    key={eq.id}
                                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                    onClick={() => handleEquipmentSelect(eq)}
                                >
                                    {eq.name} ({eq.model || 'N/A'})
                                </li>
                            ))}
                        </ul>
                    )}
                    <div className="mt-2 flex flex-wrap gap-2">
                        {selectedEquipmentObjects.map((eq) => (
                            <span key={eq.id} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                                {eq.name}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveEquipment(eq.id)}
                                    className="ml-2 -mr-0.5 h-4 w-4 rounded-full flex items-center justify-center text-purple-600 hover:bg-purple-200 hover:text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                    &times;
                                </button>
                            </span>
                        ))}
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                    disabled={loading}
                >
                    {loading ? 'Creating...' : 'Create Subtask'}
                </button>
            </form>
        </div>
    );
};

export default CreateSubtaskForm;