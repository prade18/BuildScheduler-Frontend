// // frontend/components/AssignEquipmentToSubtaskModal.jsx
// 'use client';

// import { useState, useEffect, useCallback } from 'react';
// import axios from 'axios';

// export default function AssignEquipmentToSubtaskModal({ equipmentId, projectId, onClose, onAssignmentSuccess }) {
//   // Assignment form states
//   const [selectedMainTask, setSelectedMainTask] = useState(null);
//   const [selectedSubtask, setSelectedSubtask] = useState(null);
//   const [assignmentStart, setAssignmentStart] = useState('');
//   const [assignmentEnd, setAssignmentEnd] = useState('');
//   const [equipmentNotes, setEquipmentNotes] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [errorMsg, setErrorMsg] = useState('');

//   // Main Task Selection States
//   const [mainTaskResults, setMainTaskResults] = useState([]);
//   const [fetchingMainTasks, setFetchingMainTasks] = useState(false);
//   const [mainTaskError, setMainTaskError] = useState('');

//   // Subtask Selection/Filtering States
//   const [allSubtasksForSelectedMainTask, setAllSubtasksForSelectedMainTask] = useState([]); // Stores all fetched subtasks for the selected main task
//   const [filteredSubtasks, setFilteredSubtasks] = useState([]); // Stores client-side filtered subtasks
//   const [subtaskSearchQuery, setSubtaskSearchQuery] = useState(''); // Query for client-side filtering
//   const [fetchingSubtasks, setFetchingSubtasks] = useState(false);
//   const [subtaskError, setSubtaskError] = useState('');

//   // --- Step 1: Fetch Main Tasks when projectId is available ---
//   useEffect(() => {
//     if (projectId) {
//       fetchMainTasks(projectId);
//     } else {
//       setMainTaskError("Project ID is missing. Cannot load main tasks.");
//     }
//   }, [projectId]);

//   const fetchMainTasks = async (projId) => {
//     setFetchingMainTasks(true);
//     setMainTaskError('');
//     setSelectedMainTask(null); // Reset selection if project ID changes
//     setMainTaskResults([]);
//     setAllSubtasksForSelectedMainTask([]); // Clear subtasks
//     setFilteredSubtasks([]); // Clear filtered subtasks
//     setSelectedSubtask(null); // Clear subtask selection
//     setSubtaskSearchQuery(''); // Clear subtask search query

//     try {
//       const token = localStorage.getItem('token');
//       if (!token) throw new Error("Authentication required.");

//       // URL: http://localhost:8080/api/pm/projects/1/main-tasks?page=0&size=10
//       // Using projectId from props. Fetching a reasonable number of tasks.
//       const response = await axios.get(`http://localhost:8080/api/pm/projects/${projId}/main-tasks`, {
//         headers: { Authorization: `Bearer ${token}` },
//         params: { page: 0, size: 100 } // Fetch first 100 main tasks, adjust size as needed
//       });

//       if (response.data.success) {
//         // Assuming response.data.data might be a Page object or direct List
//         const fetchedTasks = response.data.data.content || response.data.data;
//         if (fetchedTasks && fetchedTasks.length > 0) {
//           setMainTaskResults(fetchedTasks);
//         } else {
//           setMainTaskError("No main tasks found for this project.");
//         }
//       } else {
//         setMainTaskResults([]);
//         setMainTaskError(response.data.message || 'Failed to fetch main tasks.');
//       }
//     } catch (err) {
//       console.error('Error fetching main tasks:', err);
//       setMainTaskResults([]);
//       setMainTaskError(`Error fetching main tasks: ${err.response?.data?.message || err.message}.`);
//     } finally {
//       setFetchingMainTasks(false);
//     }
//   };

//   const handleSelectMainTask = (e) => {
//     const taskId = parseInt(e.target.value);
//     const task = mainTaskResults.find(t => t.id === taskId);
//     setSelectedMainTask(task);
//     setSelectedSubtask(null); // Reset subtask selection when main task changes
//     setSubtaskSearchQuery(''); // Clear subtask search query
//     setAllSubtasksForSelectedMainTask([]); // Clear previous subtasks
//     setFilteredSubtasks([]); // Clear previous filtered subtasks
//     setSubtaskError(''); // Clear previous subtask error

//     if (task) {
//       // --- Step 2: Fetch Subtasks for the Selected Main Task ---
//       fetchSubtasksForMainTask(task.id);
//     }
//   };

//   const fetchSubtasksForMainTask = async (mainTaskId) => {
//     setFetchingSubtasks(true);
//     setSubtaskError('');
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) throw new Error("Authentication required.");

//       // URL: http://localhost:8080/api/site-supervisor/main-tasks/1/subtasks
//       const response = await axios.get(`http://localhost:8080/api/site-supervisor/main-tasks/${mainTaskId}/subtasks`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (response.data.success) {
//         if (response.data.data && response.data.data.length > 0) {
//           setAllSubtasksForSelectedMainTask(response.data.data);
//           setFilteredSubtasks(response.data.data); // Initially, filtered list is all subtasks
//         } else {
//           setSubtaskError("No subtasks found for this Main Task.");
//         }
//       } else {
//         setAllSubtasksForSelectedMainTask([]);
//         setFilteredSubtasks([]);
//         setSubtaskError(response.data.message || 'Failed to fetch subtasks for this main task.');
//       }
//     } catch (err) {
//       console.error('Error fetching subtasks for main task:', err);
//       setAllSubtasksForSelectedMainTask([]);
//       setFilteredSubtasks([]);
//       setSubtaskError(`Error fetching subtasks: ${err.response?.data?.message || err.message}.`);
//     } finally {
//       setFetchingSubtasks(false);
//     }
//   };

//   // --- Step 3: Client-side filtering of subtasks ---
//   useEffect(() => {
//     if (subtaskSearchQuery && allSubtasksForSelectedMainTask.length > 0) {
//       const lowerCaseQuery = subtaskSearchQuery.toLowerCase();
//       const filtered = allSubtasksForSelectedMainTask.filter(subtask =>
//         (subtask.title && subtask.title.toLowerCase().includes(lowerCaseQuery)) ||
//         (subtask.id && String(subtask.id).includes(lowerCaseQuery)) ||
//         (subtask.description && subtask.description.toLowerCase().includes(lowerCaseQuery))
//       );
//       setFilteredSubtasks(filtered);
//     } else {
//       setFilteredSubtasks(allSubtasksForSelectedMainTask); // Show all if query is empty
//     }
//   }, [subtaskSearchQuery, allSubtasksForSelectedMainTask]);

//   const handleSelectSubtask = (subtask) => {
//     setSelectedSubtask(subtask);
//     setSubtaskSearchQuery(subtask.title || `ID: ${subtask.id}`); // Display selected subtask's title
//     setFilteredSubtasks([]); // Clear filtered results after selection
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setErrorMsg('');

//     // Final validation before submitting
//     if (!selectedSubtask || !assignmentStart || !assignmentEnd) {
//       setErrorMsg('Please select a subtask, and provide start and end times.');
//       setLoading(false);
//       return;
//     }

//     if (new Date(assignmentStart) >= new Date(assignmentEnd)) {
//       setErrorMsg('Assignment start time must be before end time.');
//       setLoading(false);
//       return;
//     }

//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         console.error("No access token found. Please log in.");
//         setErrorMsg("Authentication required. Please log in.");
//         setLoading(false);
//         return;
//       }

//       const payload = {
//         subtaskId: selectedSubtask.id,
//         assignmentStart,
//         assignmentEnd,
//         equipmentNotes,
//       };

//       // URL: http://localhost:8080/api/equipment/1/assignments
//       const response = await axios.post(
//         `http://localhost:8080/api/equipment/${equipmentId}/assignments`,
//         payload,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       if (response.data.success) {
//         alert('Equipment assigned to subtask successfully!');
//         onAssignmentSuccess();
//         onClose();
//       } else {
//         setErrorMsg(response.data.message || 'Failed to assign equipment.');
//       }
//     } catch (err) {
//       console.error('Error assigning equipment:', err);
//       if (err.response && err.response.data && err.response.data.message) {
//         setErrorMsg(err.response.data.message);
//       } else if (err.response?.status === 409) {
//         setErrorMsg("Assignment conflicts with an existing non-available slot or another assignment.");
//       } else {
//         setErrorMsg('Error assigning equipment. Please try again.');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
//       <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl">
//         <h3 className="text-lg font-semibold mb-4 text-gray-800">Assign Equipment to Subtask</h3>

//         {errorMsg && <p className="text-red-600 mb-2 text-sm">{errorMsg}</p>}

//         <form onSubmit={handleSubmit} className="space-y-4">
//           {/* Main Task Selection Section */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700" htmlFor="mainTaskSelect">
//               Select Main Task (from Project ID: {projectId || 'N/A'})
//             </label>
//             {fetchingMainTasks ? (
//               <p className="text-gray-500 text-sm mt-1">Loading main tasks...</p>
//             ) : mainTaskError ? (
//               <p className="text-red-500 text-sm mt-1">{mainTaskError}</p>
//             ) : mainTaskResults.length === 0 && !selectedMainTask ? (
//               <p className="text-gray-500 text-sm mt-1">No main tasks found for this project. Ensure Project ID is correct.</p>
//             ) : (
//               <>
//                 {!selectedMainTask ? (
//                   <select
//                     id="mainTaskSelect"
//                     className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//                     value={selectedMainTask ? selectedMainTask.id : ''}
//                     onChange={handleSelectMainTask}
//                     required
//                   >
//                     <option value="">-- Select a Main Task --</option>
//                     {mainTaskResults.map((task) => (
//                       <option key={task.id} value={task.id}>
//                         {task.title || `ID: ${task.id}`}
//                       </option>
//                     ))}
//                   </select>
//                 ) : (
//                   <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md flex justify-between items-center text-sm">
//                     <p className="text-blue-700">
//                       Selected Main Task: <strong>{selectedMainTask.title || `ID: ${selectedMainTask.id}`}</strong>
//                     </p>
//                     <button
//                       type="button"
//                       onClick={() => {
//                         setSelectedMainTask(null);
//                         setSelectedSubtask(null); // Reset subtask if main task changes
//                         setAllSubtasksForSelectedMainTask([]);
//                         setFilteredSubtasks([]);
//                         setSubtaskSearchQuery('');
//                         setSubtaskError(''); // Clear subtask error
//                       }}
//                       className="text-blue-600 hover:text-blue-800 font-medium ml-4 focus:outline-none"
//                     >
//                       Change
//                     </button>
//                   </div>
//                 )}
//               </>
//             )}
//           </div>

//           {/* Subtask Search/Selection Section (only if Main Task is selected) */}
//           {selectedMainTask && (
//             <div>
//               <label className="block text-sm font-medium text-gray-700" htmlFor="subtaskSearch">Filter Subtasks</label>
//               <input
//                 type="text"
//                 id="subtaskSearch"
//                 value={subtaskSearchQuery}
//                 onChange={(e) => {
//                   setSubtaskSearchQuery(e.target.value);
//                   if (selectedSubtask && (e.target.value !== selectedSubtask.title && e.target.value !== `ID: ${selectedSubtask.id}`)) {
//                       setSelectedSubtask(null); // Clear selected subtask if user types again
//                   }
//                 }}
//                 placeholder="Filter by subtask title, description, or ID"
//                 className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//                 disabled={fetchingSubtasks || selectedSubtask !== null} // Disable while fetching or if subtask selected
//               />
//               {fetchingSubtasks ? (
//                 <p className="text-gray-500 text-sm mt-1">Loading subtasks...</p>
//               ) : subtaskError ? (
//                 <p className="text-red-500 text-sm mt-1">{subtaskError}</p>
//               ) : filteredSubtasks.length > 0 && !selectedSubtask ? (
//                 <ul className="border border-gray-300 mt-2 max-h-48 overflow-y-auto bg-white rounded-md shadow-sm">
//                   {filteredSubtasks.map((subtask) => (
//                     <li
//                       key={subtask.id}
//                       className="p-2 cursor-pointer hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
//                       onClick={() => handleSelectSubtask(subtask)}
//                     >
//                       {`ID: ${subtask.id} - ${subtask.title || 'No Title'} (Status: ${subtask.status || 'N/A'})`}
//                     </li>
//                   ))}
//                 </ul>
//               ) : selectedSubtask ? (
//                 <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md flex justify-between items-center text-sm">
//                   <p className="text-blue-700">
//                     Selected Subtask: <strong>{selectedSubtask.title || `ID: ${selectedSubtask.id}`}</strong>
//                   </p>
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setSelectedSubtask(null);
//                       setSubtaskSearchQuery(''); // Clear query to re-show all for the main task
//                     }}
//                     className="text-blue-600 hover:text-blue-800 font-medium ml-4 focus:outline-none"
//                   >
//                     Change
//                   </button>
//                 </div>
//               ) : (
//                 <p className="text-gray-500 text-sm mt-1">
//                   {subtaskSearchQuery.length > 0 ? "No subtasks match your filter." : "Select a Main Task to load subtasks."}
//                 </p>
//               )}
//             </div>
//           )}

//           {/* Assignment form fields (only if Subtask is selected) */}
//           {selectedSubtask && (
//             <>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700" htmlFor="assignmentStart">Assignment Start</label>
//                 <input
//                   type="datetime-local"
//                   id="assignmentStart"
//                   name="assignmentStart"
//                   value={assignmentStart}
//                   onChange={(e) => setAssignmentStart(e.target.value)}
//                   required
//                   className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700" htmlFor="assignmentEnd">Assignment End</label>
//                 <input
//                   type="datetime-local"
//                   id="assignmentEnd"
//                   name="assignmentEnd"
//                   value={assignmentEnd}
//                   onChange={(e) => setAssignmentEnd(e.target.value)}
//                   required
//                   className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700" htmlFor="equipmentNotes">Equipment Notes (optional)</label>
//                 <textarea
//                   id="equipmentNotes"
//                   name="equipmentNotes"
//                   value={equipmentNotes}
//                   onChange={(e) => setEquipmentNotes(e.target.value)}
//                   placeholder="Add any specific notes about this equipment assignment..."
//                   className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//                   rows={2}
//                 />
//               </div>
//             </>
//           )}

//           <div className="flex justify-end space-x-3 mt-6">
//             <button
//               type="button"
//               className="px-5 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors duration-200"
//               onClick={onClose}
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
//               disabled={loading || !selectedSubtask || !assignmentStart || !assignmentEnd}
//             >
//               {loading ? "Assigning..." : "Assign Equipment"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

export default function AssignEquipmentToSubtaskModal({ equipmentId, projectId, onClose, onSuccess }) {
    // State to hold form data for the assignment
    const [assignmentData, setAssignmentData] = useState({
        subtaskId: '',
        startTime: '', // Will store value from datetime-local input
        endTime: '',   // Will store value from datetime-local input
        equipmentNotes: ''
    });

    // State for fetching main tasks and subtasks (no projects dropdown needed)
    const [mainTasks, setMainTasks] = useState([]);
    const [selectedMainTaskId, setSelectedMainTaskId] = useState('');
    const [subtasks, setSubtasks] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch main tasks directly using the projectId prop
    useEffect(() => {
        const fetchMainTasks = async () => {
            if (!projectId) { // Ensure projectId is provided
                setError('Project ID not provided to the assignment modal.');
                setLoading(false);
                setMainTasks([]);
                setSelectedMainTaskId('');
                setSubtasks([]);
                return;
            }

            setLoading(true);
            setError(''); // Clear previous errors
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('Authentication token not found. Please log in.');
                    setLoading(false);
                    return;
                }
                const response = await axios.get(`http://localhost:8080/api/pm/projects/${projectId}/main-tasks`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.data.success) {
                    setMainTasks(response.data.data.content || response.data.data);
                    setSelectedMainTaskId(''); // Reset selected main task when project changes
                    setSubtasks([]); // Reset subtasks as well
                } else {
                    setError('Failed to fetch main tasks for the given project.');
                }
            } catch (err) {
                console.error('Error fetching main tasks:', err);
                setError(`Error fetching main tasks: ${err.response?.data?.message || err.message}`);
            } finally {
                setLoading(false);
            }
        };
        fetchMainTasks();
    }, [projectId]); // Depend on projectId to fetch main tasks when it's available or changes

    // Fetch subtasks when selectedMainTaskId changes
    useEffect(() => {
        const fetchSubtasks = async () => {
            if (!selectedMainTaskId) {
                setSubtasks([]);
                return;
            }
            setLoading(true);
            setError(''); // Clear previous errors
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('Authentication token not found. Please log in.');
                    setLoading(false);
                    return;
                }
                const response = await axios.get(`http://localhost:8080/api/site-supervisor/main-tasks/${selectedMainTaskId}/subtasks`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.data.success) {
                    setSubtasks(response.data.data);
                    // Optionally, if there's only one subtask, pre-select it
                    if (response.data.data.length === 1) {
                        setAssignmentData(prev => ({ ...prev, subtaskId: response.data.data[0].id }));
                    } else {
                        setAssignmentData(prev => ({ ...prev, subtaskId: '' })); // Reset if multiple or none
                    }
                } else {
                    setError('Failed to fetch subtasks.');
                }
            } catch (err) {
                console.error('Error fetching subtasks:', err);
                setError(`Error fetching subtasks: ${err.response?.data?.message || err.message}`);
            } finally {
                setLoading(false);
            }
        };
        fetchSubtasks();
    }, [selectedMainTaskId]); // Depend on selectedMainTaskId


    // Handle input changes for the assignment form
    const handleChange = (e) => {
        const { name, value } = e.target;
        setAssignmentData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle main task selection change
    const handleMainTaskChange = (e) => {
        setSelectedMainTaskId(e.target.value);
        setAssignmentData(prev => ({ ...prev, subtaskId: '' })); // Reset subtask selection
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors

        // Basic client-side validation
        if (!assignmentData.subtaskId || !assignmentData.startTime || !assignmentData.endTime) {
            setError('Please select a subtask and provide valid start and end times.');
            return;
        }

        // Optional: Validate start time is before end time
        if (new Date(assignmentData.startTime) >= new Date(assignmentData.endTime)) {
            setError('Start time must be before end time.');
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const payload = {
                subtaskId: assignmentData.subtaskId,
                startTime: assignmentData.startTime, // Ensure these are ISO strings (datetime-local provides this)
                endTime: assignmentData.endTime,     // Ensure these are ISO strings
                equipmentNotes: assignmentData.equipmentNotes
            };

            await axios.post(
                `http://localhost:8080/api/equipment/${equipmentId}/assignments`,
                payload,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            alert('Equipment assigned to subtask successfully!');
            onSuccess(); // Call the parent's success handler
        } catch (err) {
            console.error('Error assigning equipment:', err);
            setError(`Failed to assign equipment: ${err.response?.data?.message || err.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Modal structure using Tailwind CSS classes for basic styling
    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Assign Equipment (ID: {equipmentId}) to Subtask</h2>
                {loading && <p className="text-blue-600 mb-2">Loading data...</p>}
                {error && <p className="text-red-500 mb-2">{error}</p>}

                {/* Main Task Selection */}
                <div>
                    <label htmlFor="mainTaskId" className="block text-sm font-medium text-gray-700">
                        Select Main Task (for Project ID: {projectId}):
                    </label>
                    <select
                        id="mainTaskId"
                        value={selectedMainTaskId}
                        onChange={handleMainTaskChange}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        disabled={!projectId || mainTasks.length === 0}
                        required
                    >
                        <option value="">-- Select Main Task --</option>
                        {mainTasks.map((task) => (
                            <option key={task.id} value={task.id}>
                                {task.title} (ID: {task.id})
                            </option>
                        ))}
                    </select>
                </div>

                {/* Subtask Selection */}
                <div>
                    <label htmlFor="subtaskId" className="block text-sm font-medium text-gray-700">
                        Select Subtask:
                    </label>
                    <select
                        id="subtaskId"
                        name="subtaskId"
                        value={assignmentData.subtaskId}
                        onChange={handleChange}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        disabled={!selectedMainTaskId || subtasks.length === 0}
                        required
                    >
                        <option value="">-- Select Subtask --</option>
                        {subtasks.map((subtask) => (
                            <option key={subtask.id} value={subtask.id}>
                                {subtask.title} (ID: {subtask.id}) - Status: {subtask.status.replace(/_/g, ' ')}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Start Time Input */}
                <div>
                    <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
                        Start Time:
                    </label>
                    <input
                        type="datetime-local"
                        id="startTime"
                        name="startTime"
                        value={assignmentData.startTime}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                    />
                </div>

                {/* End Time Input */}
                <div>
                    <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
                        End Time:
                    </label>
                    <input
                        type="datetime-local"
                        id="endTime"
                        name="endTime"
                        value={assignmentData.endTime}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                    />
                </div>

                {/* Equipment Notes */}
                <div>
                    <label htmlFor="equipmentNotes" className="block text-sm font-medium text-gray-700">
                        Equipment Notes: (Optional)
                    </label>
                    <textarea
                        id="equipmentNotes"
                        name="equipmentNotes"
                        value={assignmentData.equipmentNotes}
                        onChange={handleChange}
                        rows="3"
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Add any specific notes for this assignment..."
                    ></textarea>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 mt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        disabled={loading}
                    >
                        {loading ? 'Assigning...' : 'Assign Equipment'}
                    </button>
                </div>
            </div>
        </div>
    );
}