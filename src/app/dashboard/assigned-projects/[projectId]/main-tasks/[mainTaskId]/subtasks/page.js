// "use client";

// import { useState, useEffect } from "react";
// import { useParams } from "next/navigation";
// import axios from "axios";

// export default function SubtaskPanel() {
//   const { projectId, mainTaskId } = useParams();

//   const [subtasks, setSubtasks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showForm, setShowForm] = useState(false);
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     plannedStart: "",
//     plannedEnd: "",
//     estimatedHours: "",
//     requiredWorkers: "",
//     priority: "",
//     requiredSkills: "",
//     equipmentIds: "",
//     equipmentRequestNotes: "",
//   });

//   const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

//   useEffect(() => {
//     const fetchSubtasks = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:8080/api/site-supervisor/main-tasks/${mainTaskId}/subtasks`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         if (response.data.success) {
//           setSubtasks(response.data.data);
//         } else {
//           setSubtasks([]);
//         }
//       } catch (error) {
//         console.error("Error fetching subtasks:", error);
//         setSubtasks([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (token) fetchSubtasks();
//   }, [mainTaskId, token]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const payload = {
//         title: formData.title,
//         description: formData.description,
//         plannedStart: formData.plannedStart,
//         plannedEnd: formData.plannedEnd,
//         estimatedHours: parseInt(formData.estimatedHours),
//         requiredWorkers: parseInt(formData.requiredWorkers),
//         priority: parseInt(formData.priority),
//         requiredSkills: formData.requiredSkills.split(",").map((s) => s.trim()),
//         equipmentIds: formData.equipmentIds.split(",").map((id) => parseInt(id)),
//         equipmentRequestNotes: formData.equipmentRequestNotes,
//       };

//       const response = await axios.post(
//         `http://localhost:8080/api/site-supervisor/main-tasks/${mainTaskId}/subtasks`,
//         payload,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response.data.success) {
//         alert("Subtask created!");
//         setSubtasks([...subtasks, response.data.data]);
//         setShowForm(false);
//       } else {
//         alert("Failed to create subtask.");
//       }
//     } catch (error) {
//       console.error("Error creating subtask:", error);
//       alert("Failed to create subtask.");
//     }
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-semibold mb-4">Subtasks</h1>

//       {loading ? (
//         <p>Loading subtasks...</p>
//       ) : subtasks.length === 0 ? (
//         <p className="text-gray-500 mb-4">No subtasks created yet.</p>
//       ) : (
//         <div className="space-y-3 mb-4">
//           {subtasks.map((subtask) => (
//             <div key={subtask.id} className="border p-3 rounded bg-white shadow">
//               <p className="font-bold">{subtask.title}</p>
//               <p>{subtask.description}</p>
//             </div>
//           ))}
//         </div>
//       )}

//       <button
//         onClick={() => setShowForm(!showForm)}
//         className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 mb-4"
//       >
//         {showForm ? "Cancel" : "Create Subtask"}
//       </button>

//       {showForm && (
//         <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 p-6 rounded shadow">
//           <input
//             type="text"
//             name="title"
//             placeholder="Title"
//             value={formData.title}
//             onChange={handleChange}
//             required
//             className="w-full border p-2 rounded"
//           />

//           <textarea
//             name="description"
//             placeholder="Description"
//             value={formData.description}
//             onChange={handleChange}
//             required
//             className="w-full border p-2 rounded"
//           />

//           <input
//             type="datetime-local"
//             name="plannedStart"
//             value={formData.plannedStart}
//             onChange={handleChange}
//             required
//             className="w-full border p-2 rounded"
//           />

//           <input
//             type="datetime-local"
//             name="plannedEnd"
//             value={formData.plannedEnd}
//             onChange={handleChange}
//             required
//             className="w-full border p-2 rounded"
//           />

//           <input
//             type="number"
//             name="estimatedHours"
//             placeholder="Estimated Hours"
//             value={formData.estimatedHours}
//             onChange={handleChange}
//             required
//             className="w-full border p-2 rounded"
//           />

//           <input
//             type="number"
//             name="requiredWorkers"
//             placeholder="Required Workers"
//             value={formData.requiredWorkers}
//             onChange={handleChange}
//             required
//             className="w-full border p-2 rounded"
//           />

//           <input
//             type="number"
//             name="priority"
//             placeholder="Priority (1-5)"
//             value={formData.priority}
//             onChange={handleChange}
//             required
//             className="w-full border p-2 rounded"
//           />

//           <input
//             type="text"
//             name="requiredSkills"
//             placeholder="Required Skills (comma separated)"
//             value={formData.requiredSkills}
//             onChange={handleChange}
//             required
//             className="w-full border p-2 rounded"
//           />

//           <input
//             type="text"
//             name="equipmentIds"
//             placeholder="Equipment IDs (comma separated)"
//             value={formData.equipmentIds}
//             onChange={handleChange}
//             required
//             className="w-full border p-2 rounded"
//           />

//           <textarea
//             name="equipmentRequestNotes"
//             placeholder="Equipment Request Notes"
//             value={formData.equipmentRequestNotes}
//             onChange={handleChange}
//             required
//             className="w-full border p-2 rounded"
//           />

//           <button
//             type="submit"
//             className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
//           >
//             Submit
//           </button>
//         </form>
//       )}
//     </div>
//   );
// }

// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import axios from "axios";

// export default function SubtasksPage() {
//   const { projectId, mainTaskId } = useParams();

//   const [subtasks, setSubtasks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showForm, setShowForm] = useState(false);
//   const [editingSubtaskId, setEditingSubtaskId] = useState(null);
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     plannedStart: "",
//     plannedEnd: "",
//     estimatedHours: "",
//     requiredWorkers: "",
//     priority: "",
//     requiredSkills: "",
//     equipmentIds: "",
//     equipmentRequestNotes: ""
//   });

//   useEffect(() => {
//     fetchSubtasks();
//   }, []);

//   const fetchSubtasks = async () => {
//     try {
//       const accessToken = localStorage.getItem("token");
//       const response = await axios.get(
//         `http://localhost:8080/api/site-supervisor/main-tasks/${mainTaskId}/subtasks`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         }
//       );
//       setSubtasks(response.data.data || []);
//     } catch (error) {
//       console.error("Failed to fetch subtasks:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const accessToken = localStorage.getItem("token");

//     const payload = {
//       title: formData.title,
//       description: formData.description,
//       plannedStart: formData.plannedStart,
//       plannedEnd: formData.plannedEnd,
//       estimatedHours: parseInt(formData.estimatedHours),
//       requiredWorkers: parseInt(formData.requiredWorkers),
//       priority: parseInt(formData.priority),
//       requiredSkills: formData.requiredSkills.split(",").map((s) => s.trim()),
//       equipmentIds: formData.equipmentIds.split(",").map((id) => parseInt(id)),
//       equipmentRequestNotes: formData.equipmentRequestNotes
//     };

//     try {
//       if (editingSubtaskId) {
//         await axios.put(
//           `http://localhost:8080/api/site-supervisor/subtasks/${editingSubtaskId}`,
//           payload,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`
//             }
//           }
//         );
//       } else {
//         await axios.post(
//           `http://localhost:8080/api/site-supervisor/main-tasks/${mainTaskId}/subtasks`,
//           payload,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//       }

//       setFormData({
//         title: "",
//         description: "",
//         plannedStart: "",
//         plannedEnd: "",
//         estimatedHours: "",
//         requiredWorkers: "",
//         priority: "",
//         requiredSkills: "",
//         equipmentIds: "",
//         equipmentRequestNotes: ""
//       });
//       setShowForm(false);
//       setEditingSubtaskId(null);
//       fetchSubtasks();
//     } catch (error) {
//       console.error("Failed to submit subtask:", error);
//       alert("Failed to create or update subtask.");
//     }
//   };

//   const handleEdit = (subtask) => {
//     setFormData({
//       title: subtask.title,
//       description: subtask.description,
//       plannedStart: subtask.plannedStart,
//       plannedEnd: subtask.plannedEnd,
//       estimatedHours: subtask.estimatedHours.toString(),
//       requiredWorkers: subtask.requiredWorkers.toString(),
//       priority: subtask.priority.toString(),
//       requiredSkills: subtask.requiredSkills.join(", "),
//       equipmentIds: subtask.equipmentIds.join(", "),
//       equipmentRequestNotes: subtask.equipmentRequestNotes || ""
//     });
//     setEditingSubtaskId(subtask.id);
//     setShowForm(true);
//   };

//   const handleDelete = async (subtaskId) => {
//     const accessToken = localStorage.getItem("token");
//     try {
//       await axios.delete(
//         `http://localhost:8080/api/site-supervisor/subtasks/${subtaskId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         }
//       );
//       fetchSubtasks();
//     } catch (error) {
//       console.error("Failed to delete subtask:", error);
//     }
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Subtasks</h1>

//       {loading ? (
//         <p>Loading subtasks...</p>
//       ) : subtasks.length === 0 ? (
//         <p className="text-gray-500">No subtasks created yet.</p>
//       ) : (
//         <ul className="space-y-4">
//           {subtasks.map((subtask) => (
//             <li
//               key={subtask.id}
//               className="border rounded p-4 flex justify-between items-start bg-white shadow"
//             >
//               <div>
//                 <h2 className="text-lg font-semibold">{subtask.title}</h2>
//                 <p className="text-sm text-gray-600">{subtask.description}</p>
//                 <p className="text-sm text-gray-500">
//                   {subtask.plannedStart} → {subtask.plannedEnd}
//                 </p>
//               </div>
//               <div className="space-x-2">
//                 <button
//                   className="text-sm px-3 py-1 bg-blue-500 text-white rounded"
//                   onClick={() => handleEdit(subtask)}
//                 >
//                   Edit
//                 </button>
//                 <button
//                   className="text-sm px-3 py-1 bg-red-500 text-white rounded"
//                   onClick={() => handleDelete(subtask.id)}
//                 >
//                   Delete
//                 </button>
//               </div>
//             </li>
//           ))}
//         </ul>
//       )}

//       <div className="mt-6">
//         <button
//           className="px-4 py-2 bg-green-600 text-white rounded"
//           onClick={() => {
//             setShowForm(true);
//             setFormData({
//               title: "",
//               description: "",
//               plannedStart: "",
//               plannedEnd: "",
//               estimatedHours: "",
//               requiredWorkers: "",
//               priority: "",
//               requiredSkills: "",
//               equipmentIds: "",
//               equipmentRequestNotes: ""
//             });
//             setEditingSubtaskId(null);
//           }}
//         >
//           Create Subtask
//         </button>
//       </div>

//       {showForm && (
//         <form
//           onSubmit={handleSubmit}
//           className="mt-6 bg-gray-50 p-6 rounded-lg border"
//         >
//           <div className="grid grid-cols-2 gap-4">
//             <input
//               name="title"
//               value={formData.title}
//               onChange={handleInputChange}
//               placeholder="Title"
//               className="p-2 border rounded"
//               required
//             />
//             <input
//               name="description"
//               value={formData.description}
//               onChange={handleInputChange}
//               placeholder="Description"
//               className="p-2 border rounded"
//               required
//             />
//             <input
//               name="plannedStart"
//               value={formData.plannedStart}
//               onChange={handleInputChange}
//               type="datetime-local"
//               className="p-2 border rounded"
//               required
//             />
//             <input
//               name="plannedEnd"
//               value={formData.plannedEnd}
//               onChange={handleInputChange}
//               type="datetime-local"
//               className="p-2 border rounded"
//               required
//             />
//             <input
//               name="estimatedHours"
//               value={formData.estimatedHours}
//               onChange={handleInputChange}
//               placeholder="Estimated Hours"
//               type="number"
//               className="p-2 border rounded"
//               required
//             />
//             <input
//               name="requiredWorkers"
//               value={formData.requiredWorkers}
//               onChange={handleInputChange}
//               placeholder="Required Workers"
//               type="number"
//               className="p-2 border rounded"
//               required
//             />
//             <input
//               name="priority"
//               value={formData.priority}
//               onChange={handleInputChange}
//               placeholder="Priority (1-5)"
//               type="number"
//               className="p-2 border rounded"
//               required
//             />
//             <input
//               name="requiredSkills"
//               value={formData.requiredSkills}
//               onChange={handleInputChange}
//               placeholder='Skills (e.g., "masonry, Welding")'
//               className="p-2 border rounded"
//               required
//             />
//             <input
//               name="equipmentIds"
//               value={formData.equipmentIds}
//               onChange={handleInputChange}
//               placeholder='Equipment IDs (e.g., "1,2")'
//               className="p-2 border rounded"
//               required
//             />
//             <input
//               name="equipmentRequestNotes"
//               value={formData.equipmentRequestNotes}
//               onChange={handleInputChange}
//               placeholder="Equipment Notes"
//               className="p-2 border rounded"
//             />
//           </div>
//           <div className="mt-4 flex gap-2">
//             <button
//               type="submit"
//               className="px-4 py-2 bg-blue-600 text-white rounded"
//             >
//               {editingSubtaskId ? "Update" : "Create"}
//             </button>
//             <button
//               type="button"
//               className="px-4 py-2 bg-gray-300 rounded"
//               onClick={() => setShowForm(false)}
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       )}
//     </div>
//   );
// }
































// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import axios from "axios";

// export default function SubtasksPage() {
//   const { projectId, mainTaskId } = useParams();

//   const [subtasks, setSubtasks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showForm, setShowForm] = useState(false);
//   const [editingSubtaskId, setEditingSubtaskId] = useState(null);
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     plannedStart: "",
//     plannedEnd: "",
//     estimatedHours: "",
//     requiredWorkers: "",
//     priority: "",
//     requiredSkills: "",
//     equipmentIds: "", // Storing as comma-separated string for input
//     equipmentRequestNotes: "",
//   });

//   // State for worker assignment modal/section
//   const [showWorkerAssignmentModal, setShowWorkerAssignmentModal] = useState(false);
//   const [selectedSubtaskForWorkerAssignment, setSelectedSubtaskForWorkerAssignment] = useState(null);
//   const [availableWorkers, setAvailableWorkers] = useState([]);
//   const [workerSearchTerm, setWorkerSearchTerm] = useState("");
//   const [workerAssignmentFormData, setWorkerAssignmentFormData] = useState({
//     workerId: "",
//     assignmentStart: "",
//     assignmentEnd: "",
//     workerNotes: "",
//   });

//   useEffect(() => {
//     fetchSubtasks();
//   }, []);

//   const fetchSubtasks = async () => {
//     try {
//       const token = localStorage.getItem("token"); // Correct: Using 'token'
//       if (!token) {
//         console.error("No access token found. Please log in.");
//         // Consider redirecting to login page here
//         return;
//       }
//       const response = await axios.get(
//         `http://localhost:8080/api/site-supervisor/main-tasks/${mainTaskId}/subtasks`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`, // Correct: Using 'token'
//           },
//         }
//       );
//       setSubtasks(response.data.data || []);
//     } catch (error) {
//       console.error("Failed to fetch subtasks:", error);
//       if (error.response && error.response.status === 403) {
//         alert("You do not have permission to view these subtasks.");
//       } else {
//         alert("Failed to fetch subtasks. Please try again.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleWorkerAssignmentInputChange = (e) => {
//     const { name, value } = e.target;
//     setWorkerAssignmentFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const token = localStorage.getItem("token"); // Correct: Using 'token'
//     if (!token) {
//       console.error("No access token found. Please log in.");
//       return;
//     }

//     const payload = {
//       title: formData.title,
//       description: formData.description,
//       plannedStart: formData.plannedStart,
//       plannedEnd: formData.plannedEnd,
//       estimatedHours: parseInt(formData.estimatedHours),
//       requiredWorkers: parseInt(formData.requiredWorkers),
//       priority: parseInt(formData.priority),
//       requiredSkills: formData.requiredSkills.split(",").map((s) => s.trim()),
//       equipmentIds: formData.equipmentIds
//         .split(",")
//         .filter(Boolean) // Filter out empty strings from split
//         .map((id) => parseInt(id.trim())),
//       equipmentRequestNotes: formData.equipmentRequestNotes,
//     };

//     try {
//       if (editingSubtaskId) {
//         await axios.put(
//           `http://localhost:8080/api/site-supervisor/subtasks/${editingSubtaskId}`,
//           payload,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`, // Correct: Using 'token'
//             },
//           }
//         );
//       } else {
//         await axios.post(
//           `http://localhost:8080/api/site-supervisor/main-tasks/${mainTaskId}/subtasks`,
//           payload,
//           {
//             headers: { Authorization: `Bearer ${token}` }, // Correct: Using 'token'
//           }
//         );
//       }

//       // Reset form and UI state
//       setFormData({
//         title: "",
//         description: "",
//         plannedStart: "",
//         plannedEnd: "",
//         estimatedHours: "",
//         requiredWorkers: "",
//         priority: "",
//         requiredSkills: "",
//         equipmentIds: "",
//         equipmentRequestNotes: "",
//       });
//       setShowForm(false);
//       setEditingSubtaskId(null);
//       fetchSubtasks(); // Refresh the list after successful submission
//     } catch (error) {
//       console.error("Failed to submit subtask:", error);
//       if (error.response) {
//         console.error("Error response data:", error.response.data);
//         console.error("Error response status:", error.response.status);
//         alert(`Failed to create or update subtask: ${error.response.data.message || error.message}. Status: ${error.response.status}`);
//       } else {
//         alert("Failed to create or update subtask. Network error or server unreachable.");
//       }
//     }
//   };

//   const handleEdit = (subtask) => {
//     setFormData({
//       title: subtask.title,
//       description: subtask.description,
//       // Format dates for datetime-local input
//       plannedStart: subtask.plannedStart ? new Date(subtask.plannedStart).toISOString().slice(0, 16) : "",
//       plannedEnd: subtask.plannedEnd ? new Date(subtask.plannedEnd).toISOString().slice(0, 16) : "",
//       estimatedHours: subtask.estimatedHours.toString(),
//       requiredWorkers: subtask.requiredWorkers.toString(),
//       priority: subtask.priority.toString(),
//       requiredSkills: subtask.requiredSkills?.join(", ") || "",
//       equipmentIds: subtask.equipmentIds?.join(", ") || "", // Handle null/empty array
//       equipmentRequestNotes: subtask.equipmentRequestNotes || "",
//     });
//     setEditingSubtaskId(subtask.id);
//     setShowForm(true);
//   };

//   const handleDelete = async (subtaskId) => {
//     if (!confirm("Are you sure you want to delete this subtask?")) {
//       return;
//     }
//     const token = localStorage.getItem("token"); // Correct: Using 'token'
//     if (!token) {
//       console.error("No access token found. Please log in.");
//       return;
//     }
//     try {
//       await axios.delete(
//         `http://localhost:8080/api/site-supervisor/subtasks/${subtaskId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`, // Correct: Using 'token'
//           },
//         }
//       );
//       fetchSubtasks(); // Refresh the list
//       alert("Subtask deleted successfully!");
//     } catch (error) {
//       console.error("Failed to delete subtask:", error);
//       if (error.response) {
//         alert(`Failed to delete subtask: ${error.response.data.message || error.message}. Status: ${error.response.status}`);
//       } else {
//         alert("Failed to delete subtask. Network error or server unreachable.");
//       }
//     }
//   };

//   const handleUpdateStatus = async (subtaskId, newStatus) => {
//     const token = localStorage.getItem("token"); // Correct: Using 'token'
//     if (!token) {
//       console.error("No access token found. Please log in.");
//       return;
//     }
//     try {
//       await axios.patch(
//         `http://localhost:8080/api/site-supervisor/subtasks/${subtaskId}/status`,
//         { status: newStatus },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`, // Correct: Using 'token'
//           },
//         }
//       );
//       fetchSubtasks(); // Refresh the list to show updated status
//       alert(`Subtask status updated to ${newStatus}`);
//     } catch (error) {
//       console.error("Failed to update subtask status:", error);
//       if (error.response) {
//         alert(`Failed to update status: ${error.response.data.message || error.message}. Status: ${error.response.status}`);
//       } else {
//         alert("Failed to update status. Network error or server unreachable.");
//       }
//     }
//   };

//   // --- Worker Assignment Functions ---
//   const fetchWorkersForAssignment = async (subtaskId, searchTerm) => {
//     const token = localStorage.getItem("token"); // Correct: Using 'token'
//     if (!token) {
//       console.error("No access token found. Please log in.");
//       return;
//     }
//     try {
//       const response = await axios.get(
//         `http://localhost:8080/api/site-supervisor/subtasks/${subtaskId}/workers/search`,
//         {
//           params: { query: searchTerm }, // Send search term as a query parameter
//           headers: {
//             Authorization: `Bearer ${token}`, // Correct: Using 'token'
//           },
//         }
//       );
//       setAvailableWorkers(response.data.data || []);
//     } catch (error) {
//       console.error("Failed to fetch workers:", error);
//       alert("Failed to fetch worker suggestions.");
//     }
//   };

//   const handleSearchAndAssignWorkerClick = (subtask) => {
//     setSelectedSubtaskForWorkerAssignment(subtask);
//     setShowWorkerAssignmentModal(true);
//     setWorkerSearchTerm(""); // Clear previous search
//     setAvailableWorkers([]); // Clear previous results
//     // Pre-fill assignment dates with subtask planned dates
//     setWorkerAssignmentFormData({
//       workerId: "",
//       assignmentStart: subtask.plannedStart ? new Date(subtask.plannedStart).toISOString().slice(0, 16) : "",
//       assignmentEnd: subtask.plannedEnd ? new Date(subtask.plannedEnd).toISOString().slice(0, 16) : "",
//       workerNotes: "",
//     });
//   };

//   const handleAssignWorker = async (e) => {
//     e.preventDefault();
//     const token = localStorage.getItem("token"); // Correct: Using 'token'
//     if (!token || !selectedSubtaskForWorkerAssignment || !workerAssignmentFormData.workerId) {
//       console.error("Missing token, subtask, or worker ID for assignment.");
//       alert("Please ensure a worker is selected and all fields are filled.");
//       return;
//     }

//     const payload = {
//       workerId: parseInt(workerAssignmentFormData.workerId),
//       assignmentStart: workerAssignmentFormData.assignmentStart,
//       assignmentEnd: workerAssignmentFormData.assignmentEnd,
//       workerNotes: workerAssignmentFormData.workerNotes,
//     };

//     try {
//       await axios.post(
//         `http://localhost:8080/api/site-supervisor/subtasks/${selectedSubtaskForWorkerAssignment.id}/workers/assign`,
//         payload,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`, // Correct: Using 'token'
//           },
//         }
//       );
//       alert("Worker assigned successfully!");
//       setShowWorkerAssignmentModal(false);
//       setSelectedSubtaskForWorkerAssignment(null);
//       fetchSubtasks(); // Refresh to show new assignment
//     } catch (error) {
//       console.error("Failed to assign worker:", error);
//       if (error.response) {
//         alert(`Failed to assign worker: ${error.response.data.message || error.message}. Status: ${error.response.status}`);
//       } else {
//         alert("Failed to assign worker. Network error or server unreachable.");
//       }
//     }
//   };

//   const handleRemoveWorkerAssignment = async (assignmentId) => {
//     if (!confirm("Are you sure you want to remove this worker assignment?")) {
//       return;
//     }
//     const token = localStorage.getItem("token"); // Correct: Using 'token'
//     if (!token) {
//       console.error("No access token found. Please log in.");
//       return;
//     }
//     try {
//       // NOTE: Your spec mentions /api/supervisor/assignments/{assignmentId} for DELETE.
//       // Ensure your backend matches this, or adjust the path if it's under site-supervisor.
//       await axios.delete(
//         `http://localhost:8080/api/supervisor/assignments/${assignmentId}`, // **Verify this exact API path on your backend!**
//         {
//           headers: {
//             Authorization: `Bearer ${token}`, // Correct: Using 'token'
//           },
//         }
//       );
//       alert("Worker assignment removed.");
//       fetchSubtasks(); // Refresh list
//     } catch (error) {
//       console.error("Failed to remove worker assignment:", error);
//       if (error.response) {
//         alert(`Failed to remove assignment: ${error.response.data.message || error.message}. Status: ${error.response.status}`);
//       } else {
//         alert("Failed to remove assignment. Network error or server unreachable.");
//       }
//     }
//   };

//   const subtaskStatusOptions = ["PLANNED", "ASSIGNED", "IN_PROGRESS", "COMPLETED", "ON_HOLD", "DELAYED"];

//   return (
//     <div className="p-6">
//       <h1 className="text-3xl font-bold mb-6 text-gray-800">Subtasks for Main Task: {mainTaskId}</h1>

//       {loading ? (
//         <p className="text-gray-600">Loading subtasks...</p>
//       ) : subtasks.length === 0 ? (
//         <p className="text-gray-500 text-lg">No subtasks created yet for this main task.</p>
//       ) : (
//         <ul className="space-y-6">
//           {subtasks.map((subtask) => (
//             <li
//               key={subtask.id}
//               className="border border-gray-200 rounded-lg p-6 bg-white shadow-md hover:shadow-lg transition-shadow duration-200"
//             >
//               <div className="flex justify-between items-start mb-4">
//                 <div>
//                   <h2 className="text-xl font-semibold text-gray-900 mb-1">{subtask.title}</h2>
//                   <p className="text-sm text-gray-700 mb-2">{subtask.description}</p>
//                   <div className="text-sm text-gray-600 space-y-1">
//                     <p>
//                       <span className="font-medium">Planned Period:</span>{" "}
//                       {new Date(subtask.plannedStart).toLocaleString()} →{" "}
//                       {new Date(subtask.plannedEnd).toLocaleString()}
//                     </p>
//                     <p>
//                       <span className="font-medium">Status:</span>{" "}
//                       <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
//                           subtask.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
//                           subtask.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
//                           subtask.status === 'ON_HOLD' || subtask.status === 'DELAYED' ? 'bg-yellow-100 text-yellow-800' :
//                           'bg-gray-100 text-gray-800'
//                         }`}>
//                         {subtask.status || "N/A"}
//                       </span>
//                     </p>
//                     <p>
//                       <span className="font-medium">Estimated Hours:</span> {subtask.estimatedHours}
//                     </p>
//                     <p>
//                       <span className="font-medium">Required Workers:</span>{" "}
//                       {subtask.requiredWorkers}
//                     </p>
//                     <p>
//                       <span className="font-medium">Priority:</span> {subtask.priority}
//                     </p>
//                     <p>
//                       <span className="font-medium">Required Skills:</span>{" "}
//                       {subtask.requiredSkills?.join(", ") || "N/A"}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="flex flex-col space-y-2">
//                   <button
//                     className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
//                     onClick={() => handleEdit(subtask)}
//                   >
//                     Update Subtask
//                   </button>
//                   <div className="relative">
//                     <select
//                       value={subtask.status}
//                       onChange={(e) => handleUpdateStatus(subtask.id, e.target.value)}
//                       className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     >
//                       {subtaskStatusOptions.map(status => (
//                         <option key={status} value={status}>{status.replace(/_/g, ' ')}</option>
//                       ))}
//                     </select>
//                     <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
//                       <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
//                     </div>
//                   </div>
//                   <button
//                     className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
//                     onClick={() => handleDelete(subtask.id)}
//                   >
//                     Delete Subtask
//                   </button>
//                 </div>
//               </div>

//               {/* Worker Assignments Section */}
//               <div className="mt-4 pt-4 border-t border-gray-200">
//                 <h3 className="text-md font-semibold text-gray-800 mb-2">Worker Assignments:</h3>
//                 {subtask.workerAssignments && subtask.workerAssignments.length > 0 ? (
//                   <ul className="space-y-2">
//                     {subtask.workerAssignments.map((assignment) => (
//                       <li key={assignment.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-md border border-gray-100">
//                         <div>
//                           <p className="font-medium">
//                             {assignment.worker ? `${assignment.worker.firstName || ''} ${assignment.worker.lastName || ''}`.trim() || assignment.worker.username || "Unknown Worker" : "Unknown Worker"}{" "}
//                             <span className="text-gray-500 text-sm">
//                               ({new Date(assignment.assignmentStart).toLocaleDateString()} -{" "}
//                               {new Date(assignment.assignmentEnd).toLocaleDateString()})
//                             </span>
//                           </p>
//                           {assignment.workerNotes && (
//                             <p className="text-sm text-gray-600 italic">Notes: {assignment.workerNotes}</p>
//                           )}
//                         </div>
//                         <button
//                           className="text-xs px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
//                           onClick={() => handleRemoveWorkerAssignment(assignment.id)}
//                         >
//                           Remove
//                         </button>
//                       </li>
//                     ))}
//                   </ul>
//                 ) : (
//                   <p className="text-gray-500 text-sm">No workers currently assigned.</p>
//                 )}
//                 <button
//                   className="mt-3 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors duration-200 text-sm"
//                   onClick={() => handleSearchAndAssignWorkerClick(subtask)}
//                 >
//                   Search & Assign Worker
//                 </button>
//               </div>

//               {/* Equipment Needs Section */}
//               <div className="mt-4 pt-4 border-t border-gray-200">
//                 <h3 className="text-md font-semibold text-gray-800 mb-2">Equipment Needs:</h3>
//                 <p className="text-sm text-gray-700">
//                   <span className="font-medium">Equipment IDs:</span>{" "}
//                   {subtask.equipmentIds?.join(", ") || "N/A"}
//                 </p>
//                 <p className="text-sm text-gray-700">
//                   <span className="font-medium">Request Notes:</span>{" "}
//                   {subtask.equipmentRequestNotes || "None"}
//                 </p>
//               </div>
//             </li>
//           ))}
//         </ul>
//       )}

//       <div className="mt-8">
//         <button
//           className="px-6 py-3 bg-green-700 text-white rounded-md hover:bg-green-800 transition-colors duration-200 text-lg shadow-lg"
//           onClick={() => {
//             setShowForm(true);
//             setFormData({
//               title: "",
//               description: "",
//               plannedStart: "",
//               plannedEnd: "",
//               estimatedHours: "",
//               requiredWorkers: "",
//               priority: "",
//               requiredSkills: "",
//               equipmentIds: "",
//               equipmentRequestNotes: "",
//             });
//             setEditingSubtaskId(null);
//           }}
//         >
//           Create New Subtask
//         </button>
//       </div>

//       {showForm && (
//         <form
//           onSubmit={handleSubmit}
//           className="mt-8 bg-gray-50 p-8 rounded-lg border border-gray-200 shadow-inner"
//         >
//           <h2 className="text-xl font-bold mb-6 text-gray-800">
//             {editingSubtaskId ? "Edit Subtask" : "Create New Subtask"}
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
//               <input
//                 id="title"
//                 name="title"
//                 value={formData.title}
//                 onChange={handleInputChange}
//                 placeholder="Subtask Title"
//                 className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//                 required
//               />
//             </div>
//             <div>
//               <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
//               <textarea
//                 id="description"
//                 name="description"
//                 value={formData.description}
//                 onChange={handleInputChange}
//                 placeholder="Subtask Description"
//                 rows="3"
//                 className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//                 required
//               ></textarea>
//             </div>
//             <div>
//               <label htmlFor="plannedStart" className="block text-sm font-medium text-gray-700">Planned Start</label>
//               <input
//                 id="plannedStart"
//                 name="plannedStart"
//                 value={formData.plannedStart}
//                 onChange={handleInputChange}
//                 type="datetime-local"
//                 className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//                 required
//               />
//             </div>
//             <div>
//               <label htmlFor="plannedEnd" className="block text-sm font-medium text-gray-700">Planned End</label>
//               <input
//                 id="plannedEnd"
//                 name="plannedEnd"
//                 value={formData.plannedEnd}
//                 onChange={handleInputChange}
//                 type="datetime-local"
//                 className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//                 required
//               />
//             </div>
//             <div>
//               <label htmlFor="estimatedHours" className="block text-sm font-medium text-gray-700">Estimated Hours</label>
//               <input
//                 id="estimatedHours"
//                 name="estimatedHours"
//                 value={formData.estimatedHours}
//                 onChange={handleInputChange}
//                 placeholder="Estimated Hours"
//                 type="number"
//                 className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//                 required
//               />
//             </div>
//             <div>
//               <label htmlFor="requiredWorkers" className="block text-sm font-medium text-gray-700">Required Workers</label>
//               <input
//                 id="requiredWorkers"
//                 name="requiredWorkers"
//                 value={formData.requiredWorkers}
//                 onChange={handleInputChange}
//                 placeholder="Number of Workers"
//                 type="number"
//                 className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//                 required
//               />
//             </div>
//             <div>
//               <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Priority (1-5)</label>
//               <input
//                 id="priority"
//                 name="priority"
//                 value={formData.priority}
//                 onChange={handleInputChange}
//                 placeholder="Priority (1-5)"
//                 type="number"
//                 min="1"
//                 max="5"
//                 className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//                 required
//               />
//             </div>
//             <div>
//               <label htmlFor="requiredSkills" className="block text-sm font-medium text-gray-700">Required Skills (comma-separated)</label>
//               <input
//                 id="requiredSkills"
//                 name="requiredSkills"
//                 value={formData.requiredSkills}
//                 onChange={handleInputChange}
//                 placeholder='e.g., "Masonry, Welding, Plumbing"'
//                 className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//                 required
//               />
//             </div>
//             <div>
//               <label htmlFor="equipmentIds" className="block text-sm font-medium text-gray-700">Equipment IDs (comma-separated)</label>
//               <input
//                 id="equipmentIds"
//                 name="equipmentIds"
//                 value={formData.equipmentIds}
//                 onChange={handleInputChange}
//                 placeholder='e.g., "1, 5, 8" (IDs of required equipment)'
//                 className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//               />
//             </div>
//             <div>
//               <label htmlFor="equipmentRequestNotes" className="block text-sm font-medium text-gray-700">Equipment Request Notes</label>
//               <textarea
//                 id="equipmentRequestNotes"
//                 name="equipmentRequestNotes"
//                 value={formData.equipmentRequestNotes}
//                 onChange={handleInputChange}
//                 placeholder="Any specific notes for equipment request..."
//                 rows="3"
//                 className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//               ></textarea>
//             </div>
//           </div>
//           <div className="mt-8 flex gap-4">
//             <button
//               type="submit"
//               className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 text-lg shadow-md"
//             >
//               {editingSubtaskId ? "Update Subtask" : "Create Subtask"}
//             </button>
//             <button
//               type="button"
//               className="px-6 py-3 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors duration-200 text-lg shadow-md"
//               onClick={() => {
//                 setShowForm(false);
//                 setEditingSubtaskId(null); // Clear editing state
//               }}
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       )}

//       {/* Worker Assignment Modal */}
//       {showWorkerAssignmentModal && selectedSubtaskForWorkerAssignment && (
//         <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-lg p-8 shadow-xl w-full max-w-2xl">
//             <h2 className="text-2xl font-bold mb-6 text-gray-800">
//               Assign Worker to: {selectedSubtaskForWorkerAssignment.title}
//             </h2>
//             <div className="mb-4">
//               <label htmlFor="workerSearch" className="block text-sm font-medium text-gray-700">Search Workers by Skills, Name, Email:</label>
//               <div className="flex gap-2 mt-1">
//                 <input
//                   id="workerSearch"
//                   type="text"
//                   value={workerSearchTerm}
//                   onChange={(e) => setWorkerSearchTerm(e.target.value)}
//                   placeholder="e.g., 'welding', 'john doe', 'john@example.com'"
//                   className="flex-grow p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => fetchWorkersForAssignment(selectedSubtaskForWorkerAssignment.id, workerSearchTerm)}
//                   className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
//                 >
//                   Search
//                 </button>
//               </div>
//             </div>

//             {availableWorkers.length > 0 && (
//               <div className="mb-6 max-h-48 overflow-y-auto border border-gray-200 rounded-md p-2">
//                 <p className="text-sm font-medium text-gray-700 mb-2">Select a Worker:</p>
//                 <div className="space-y-2">
//                   {availableWorkers.map((worker) => (
//                     <label key={worker.id} className="flex items-center p-2 border border-gray-100 rounded-md bg-white hover:bg-gray-50 cursor-pointer">
//                       <input
//                         type="radio"
//                         name="workerId"
//                         value={worker.id}
//                         checked={workerAssignmentFormData.workerId === worker.id.toString()}
//                         onChange={handleWorkerAssignmentInputChange}
//                         className="form-radio h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
//                       />
//                       <span className="ml-3 text-sm font-medium text-gray-800">
//                         {worker.username} ({worker.email}) - Skills: {worker.skills?.join(", ") || "N/A"}
//                       </span>
//                     </label>
//                   ))}
//                 </div>
//               </div>
//             )}
//             {workerSearchTerm && availableWorkers.length === 0 && (
//                  <p className="text-gray-500 text-sm mb-4">No workers found matching your search.</p>
//             )}

//             <form onSubmit={handleAssignWorker} className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label htmlFor="assignStart" className="block text-sm font-medium text-gray-700">Assignment Start</label>
//                 <input
//                   id="assignStart"
//                   name="assignmentStart"
//                   type="datetime-local"
//                   value={workerAssignmentFormData.assignmentStart}
//                   onChange={handleWorkerAssignmentInputChange}
//                   className="mt-1 block w-full p-3 border border-gray-300 rounded-md"
//                   required
//                 />
//               </div>
//               <div>
//                 <label htmlFor="assignEnd" className="block text-sm font-medium text-gray-700">Assignment End</label>
//                 <input
//                   id="assignEnd"
//                   name="assignmentEnd"
//                   type="datetime-local"
//                   value={workerAssignmentFormData.assignmentEnd}
//                   onChange={handleWorkerAssignmentInputChange}
//                   className="mt-1 block w-full p-3 border border-gray-300 rounded-md"
//                   required
//                 />
//               </div>
//               <div className="col-span-full">
//                 <label htmlFor="workerNotes" className="block text-sm font-medium text-gray-700">Worker Notes</label>
//                 <textarea
//                   id="workerNotes"
//                   name="workerNotes"
//                   value={workerAssignmentFormData.workerNotes}
//                   onChange={handleWorkerAssignmentInputChange}
//                   placeholder="Notes for this assignment (e.g., specific tasks, safety precautions)"
//                   rows="2"
//                   className="mt-1 block w-full p-3 border border-gray-300 rounded-md"
//                 ></textarea>
//               </div>

//               <div className="col-span-full flex justify-end gap-3 mt-6">
//                 <button
//                   type="button"
//                   className="px-5 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors"
//                   onClick={() => setShowWorkerAssignmentModal(false)}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
//                   disabled={!workerAssignmentFormData.workerId}
//                 >
//                   Assign Worker(s)
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

export default function SubtasksPage() {
  const { projectId, mainTaskId } = useParams();

  const [subtasks, setSubtasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSubtaskId, setEditingSubtaskId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    plannedStart: "",
    plannedEnd: "",
    estimatedHours: "",
    requiredWorkers: "",
    priority: "",
    requiredSkills: "",
    equipmentIds: "", // Storing as comma-separated string for input (for subtask creation/update)
    equipmentRequestNotes: "",
  });

  // State for worker assignment modal/section
  const [showWorkerAssignmentModal, setShowWorkerAssignmentModal] = useState(false);
  const [selectedSubtaskForWorkerAssignment, setSelectedSubtaskForWorkerAssignment] = useState(null);
  const [availableWorkers, setAvailableWorkers] = useState([]);
  const [workerSearchTerm, setWorkerSearchTerm] = useState("");
  const [workerAssignmentFormData, setWorkerAssignmentFormData] = useState({
    workerId: "",
    assignmentStart: "",
    assignmentEnd: "",
    workerNotes: "",
  });

  // No state for equipment assignment modal/search/form here for Site Supervisor role

  useEffect(() => {
    fetchSubtasks();
  }, []);

  const fetchSubtasks = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No access token found. Please log in.");
        return;
      }
      const response = await axios.get(
        `http://localhost:8080/api/site-supervisor/main-tasks/${mainTaskId}/subtasks`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSubtasks(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch subtasks:", error);
      if (error.response && error.response.status === 403) {
        alert("You do not have permission to view these subtasks.");
      } else {
        alert("Failed to fetch subtasks. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleWorkerAssignmentInputChange = (e) => {
    const { name, value } = e.target;
    setWorkerAssignmentFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // No handler for equipment assignment inputs here for Site Supervisor role

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No access token found. Please log in.");
      return;
    }

    const payload = {
      title: formData.title,
      description: formData.description,
      plannedStart: formData.plannedStart,
      plannedEnd: formData.plannedEnd,
      estimatedHours: parseInt(formData.estimatedHours),
      requiredWorkers: parseInt(formData.requiredWorkers),
      priority: parseInt(formData.priority),
      requiredSkills: formData.requiredSkills.split(",").map((s) => s.trim()),
      equipmentIds: formData.equipmentIds
        .split(",")
        .filter(Boolean) // Filter out empty strings from split
        .map((id) => parseInt(id.trim())),
      equipmentRequestNotes: formData.equipmentRequestNotes,
    };

    try {
      if (editingSubtaskId) {
        await axios.put(
          `http://localhost:8080/api/site-supervisor/subtasks/${editingSubtaskId}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        await axios.post(
          `http://localhost:8080/api/site-supervisor/main-tasks/${mainTaskId}/subtasks`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      // Reset form and UI state
      setFormData({
        title: "",
        description: "",
        plannedStart: "",
        plannedEnd: "",
        estimatedHours: "",
        requiredWorkers: "",
        priority: "",
        requiredSkills: "",
        equipmentIds: "",
        equipmentRequestNotes: "",
      });
      setShowForm(false);
      setEditingSubtaskId(null);
      fetchSubtasks(); // Refresh the list after successful submission
    } catch (error) {
      console.error("Failed to submit subtask:", error);
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        alert(`Failed to create or update subtask: ${error.response.data.message || error.message}. Status: ${error.response.status}`);
      } else {
        alert("Failed to create or update subtask. Network error or server unreachable.");
      }
    }
  };

  const handleEdit = (subtask) => {
    setFormData({
      title: subtask.title,
      description: subtask.description,
      // Format dates for datetime-local input
      plannedStart: subtask.plannedStart ? new Date(subtask.plannedStart).toISOString().slice(0, 16) : "",
      plannedEnd: subtask.plannedEnd ? new Date(subtask.plannedEnd).toISOString().slice(0, 16) : "",
      estimatedHours: subtask.estimatedHours.toString(),
      requiredWorkers: subtask.requiredWorkers.toString(),
      priority: subtask.priority.toString(),
      requiredSkills: subtask.requiredSkills?.join(", ") || "",
      equipmentIds: subtask.equipmentIds?.join(", ") || "", // Handle null/empty array
      equipmentRequestNotes: subtask.equipmentRequestNotes || "",
    });
    setEditingSubtaskId(subtask.id);
    setShowForm(true);
  };

  const handleDelete = async (subtaskId) => {
    if (!confirm("Are you sure you want to delete this subtask?")) {
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No access token found. Please log in.");
      return;
    }
    try {
      await axios.delete(
        `http://localhost:8080/api/site-supervisor/subtasks/${subtaskId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchSubtasks(); // Refresh the list
      alert("Subtask deleted successfully!");
    } catch (error) {
      console.error("Failed to delete subtask:", error);
      if (error.response) {
        alert(`Failed to delete subtask: ${error.response.data.message || error.message}. Status: ${error.response.status}`);
      } else {
        alert("Failed to delete subtask. Network error or server unreachable.");
      }
    }
  };

  const handleUpdateStatus = async (subtaskId, newStatus) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No access token found. Please log in.");
      return;
    }
    try {
      await axios.patch(
        `http://localhost:8080/api/site-supervisor/subtasks/${subtaskId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchSubtasks(); // Refresh the list to show updated status
      alert(`Subtask status updated to ${newStatus}`);
    } catch (error) {
      console.error("Failed to update subtask status:", error);
      if (error.response) {
        alert(`Failed to update status: ${error.response.data.message || error.message}. Status: ${error.response.status}`);
      } else {
        alert("Failed to update status. Network error or server unreachable.");
      }
    }
  };

  // --- Worker Assignment Functions ---
  const fetchWorkersForAssignment = async (subtaskId, searchTerm) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No access token found. Please log in.");
      return;
    }
    try {
      const response = await axios.get(
        `http://localhost:8080/api/site-supervisor/subtasks/${subtaskId}/workers/search`,
        {
          params: { query: searchTerm },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAvailableWorkers(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch workers:", error);
      alert("Failed to fetch worker suggestions.");
    }
  };

  const handleSearchAndAssignWorkerClick = (subtask) => {
    setSelectedSubtaskForWorkerAssignment(subtask);
    setShowWorkerAssignmentModal(true);
    setWorkerSearchTerm(""); // Clear previous search
    setAvailableWorkers([]); // Clear previous results
    // Pre-fill assignment dates with subtask planned dates
    setWorkerAssignmentFormData({
      workerId: "",
      assignmentStart: subtask.plannedStart ? new Date(subtask.plannedStart).toISOString().slice(0, 16) : "",
      assignmentEnd: subtask.plannedEnd ? new Date(subtask.plannedEnd).toISOString().slice(0, 16) : "",
      workerNotes: "",
    });
  };

  const handleAssignWorker = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token || !selectedSubtaskForWorkerAssignment || !workerAssignmentFormData.workerId) {
      console.error("Missing token, subtask, or worker ID for assignment.");
      alert("Please ensure a worker is selected and all fields are filled.");
      return;
    }

    const payload = {
      workerId: parseInt(workerAssignmentFormData.workerId),
      assignmentStart: workerAssignmentFormData.assignmentStart,
      assignmentEnd: workerAssignmentFormData.assignmentEnd,
      workerNotes: workerAssignmentFormData.workerNotes,
    };

    try {
      await axios.post(
        `http://localhost:8080/api/site-supervisor/subtasks/${selectedSubtaskForWorkerAssignment.id}/workers/assign`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Worker assigned successfully!");
      setShowWorkerAssignmentModal(false);
      setSelectedSubtaskForWorkerAssignment(null);
      fetchSubtasks(); // Refresh to show new assignment
    } catch (error) {
      console.error("Failed to assign worker:", error);
      if (error.response) {
        alert(`Failed to assign worker: ${error.response.data.message || error.message}. Status: ${error.response.status}`);
      } else {
        alert("Failed to assign worker. Network error or server unreachable.");
      }
    }
  };

  const handleRemoveWorkerAssignment = async (assignmentId) => {
    if (!confirm("Are you sure you want to remove this worker assignment?")) {
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No access token found. Please log in.");
      return;
    }
    try {
      await axios.delete(
        `http://localhost:8080/api/supervisor/assignments/${assignmentId}`, // **Verify this exact API path on your backend!**
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Worker assignment removed.");
      fetchSubtasks(); // Refresh list
    } catch (error) {
      console.error("Failed to remove worker assignment:", error);
      if (error.response) {
        alert(`Failed to remove assignment: ${error.response.data.message || error.message}. Status: ${error.response.status}`);
      } else {
        alert("Failed to remove assignment. Network error or server unreachable.");
      }
    }
  };


  // NO EQUIPMENT ASSIGNMENT FUNCTIONS OR MODAL FOR SITE SUPERVISOR ROLE HERE

  const subtaskStatusOptions = ["PLANNED", "ASSIGNED", "IN_PROGRESS", "COMPLETED", "ON_HOLD", "DELAYED"];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Subtasks for Main Task: {mainTaskId}</h1>

      {loading ? (
        <p className="text-gray-600">Loading subtasks...</p>
      ) : subtasks.length === 0 ? (
        <p className="text-gray-500 text-lg">No subtasks created yet for this main task.</p>
      ) : (
        <ul className="space-y-6">
          {subtasks.map((subtask) => (
            <li
              key={subtask.id}
              className="border border-gray-200 rounded-lg p-6 bg-white shadow-md hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">{subtask.title}</h2>
                  <p className="text-sm text-gray-700 mb-2">{subtask.description}</p>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      <span className="font-medium">Planned Period:</span>{" "}
                      {new Date(subtask.plannedStart).toLocaleString()} →{" "}
                      {new Date(subtask.plannedEnd).toLocaleString()}
                    </p>
                    <p>
                      <span className="font-medium">Status:</span>{" "}
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          subtask.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                          subtask.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                          subtask.status === 'ON_HOLD' || subtask.status === 'DELAYED' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                        {subtask.status || "N/A"}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium">Estimated Hours:</span> {subtask.estimatedHours}
                    </p>
                    <p>
                      <span className="font-medium">Required Workers:</span>{" "}
                      {subtask.requiredWorkers}
                    </p>
                    <p>
                      <span className="font-medium">Priority:</span> {subtask.priority}
                    </p>
                    <p>
                      <span className="font-medium">Required Skills:</span>{" "}
                      {subtask.requiredSkills?.join(", ") || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                    onClick={() => handleEdit(subtask)}
                  >
                    Update Subtask
                  </button>
                  <div className="relative">
                    <select
                      value={subtask.status}
                      onChange={(e) => handleUpdateStatus(subtask.id, e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {subtaskStatusOptions.map(status => (
                        <option key={status} value={status}>{status.replace(/_/g, ' ')}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                  </div>
                  <button
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
                    onClick={() => handleDelete(subtask.id)}
                  >
                    Delete Subtask
                  </button>
                </div>
              </div>

              {/* Worker Assignments Section */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h3 className="text-md font-semibold text-gray-800 mb-2">Worker Assignments:</h3>
                {subtask.workerAssignments && subtask.workerAssignments.length > 0 ? (
                  <ul className="space-y-2">
                    {subtask.workerAssignments.map((assignment) => (
                      <li key={assignment.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-md border border-gray-100">
                        <div>
                          <p className="font-medium">
                            {assignment.worker ?
        (assignment.worker.firstName && assignment.worker.lastName
            ? `${assignment.worker.firstName} ${assignment.worker.lastName}`
            : assignment.worker.username || 'Unknown Worker')
        : "Unknown Worker"}{" "}
                            <span className="text-gray-500 text-sm">
                              ({new Date(assignment.assignmentStart).toLocaleDateString()} -{" "}
                              {new Date(assignment.assignmentEnd).toLocaleDateString()})
                            </span>
                          </p>
                          {assignment.workerNotes && (
                            <p className="text-sm text-gray-600 italic">Notes: {assignment.workerNotes}</p>
                          )}
                        </div>
                        <button
                          className="text-xs px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                          onClick={() => handleRemoveWorkerAssignment(assignment.id)}
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-sm">No workers currently assigned.</p>
                )}
                <button
                  className="mt-3 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors duration-200 text-sm"
                  onClick={() => handleSearchAndAssignWorkerClick(subtask)}
                >
                  Search & Assign Worker
                </button>
              </div>

              {/* Equipment Needs & Assigned Equipment Section */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h3 className="text-md font-semibold text-gray-800 mb-2">Equipment Needs & Assignments:</h3>

                {/* Display Requested Equipment (from subtask creation) */}
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Requested Equipment IDs:</span>{" "}
                  {subtask.equipmentIds?.join(", ") || "None specified during creation."}
                </p>
                <p className="text-sm text-gray-700 mb-2">
                  <span className="font-medium">Request Notes:</span>{" "}
                  {subtask.equipmentRequestNotes || "None"}
                </p>

                {/* Display Actual Equipment Assignments (from backend, made by EM) */}
                {subtask.equipmentAssignments && subtask.equipmentAssignments.length > 0 ? (
                    <div className="mt-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-1">Assigned Equipment:</h4>
                        <ul className="space-y-2">
                            {subtask.equipmentAssignments.map((assignment) => (
                                <li key={assignment.id} className="bg-gray-50 p-3 rounded-md border border-gray-100">
                                    <p className="font-medium">
                                        {assignment.equipmentName || `Equipment ID: ${assignment.equipmentId || 'Unknown'}`}{" "}
                                        <span className="text-gray-500 text-sm">
                                            ({new Date(assignment.assignmentStart).toLocaleDateString()} -{" "}
                                            {new Date(assignment.assignmentEnd).toLocaleDateString()})
                                        </span>
                                    </p>
                                    {assignment.equipmentType && <p className="text-xs text-gray-600">Type: {assignment.equipmentType}</p>}
                                    {assignment.equipmentSerialNumber && <p className="text-xs text-gray-600">S/N: {assignment.equipmentSerialNumber}</p>}
                                    {assignment.equipmentNotes && (
                                        <p className="text-sm text-gray-600 italic mt-1">Assignment Notes: {assignment.equipmentNotes}</p>
                                    )}
                                    {/* No remove button for Site Supervisor */}
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <p className="text-gray-500 text-sm mt-2">No equipment currently assigned by Equipment Manager.</p>
                )}
                {/* No 'Search & Assign Equipment' button for Site Supervisor */}
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-8">
        <button
          className="px-6 py-3 bg-green-700 text-white rounded-md hover:bg-green-800 transition-colors duration-200 text-lg shadow-lg"
          onClick={() => {
            setShowForm(true);
            setFormData({
              title: "",
              description: "",
              plannedStart: "",
              plannedEnd: "",
              estimatedHours: "",
              requiredWorkers: "",
              priority: "",
              requiredSkills: "",
              equipmentIds: "",
              equipmentRequestNotes: "",
            });
            setEditingSubtaskId(null);
          }}
        >
          Create New Subtask
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mt-8 bg-gray-50 p-8 rounded-lg border border-gray-200 shadow-inner"
        >
          <h2 className="text-xl font-bold mb-6 text-gray-800">
            {editingSubtaskId ? "Edit Subtask" : "Create New Subtask"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
              <input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Subtask Title"
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Subtask Description"
                rows="3"
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              ></textarea>
            </div>
            <div>
              <label htmlFor="plannedStart" className="block text-sm font-medium text-gray-700">Planned Start</label>
              <input
                id="plannedStart"
                name="plannedStart"
                value={formData.plannedStart}
                onChange={handleInputChange}
                type="datetime-local"
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="plannedEnd" className="block text-sm font-medium text-gray-700">Planned End</label>
              <input
                id="plannedEnd"
                name="plannedEnd"
                value={formData.plannedEnd}
                onChange={handleInputChange}
                type="datetime-local"
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="estimatedHours" className="block text-sm font-medium text-gray-700">Estimated Hours</label>
              <input
                id="estimatedHours"
                name="estimatedHours"
                value={formData.estimatedHours}
                onChange={handleInputChange}
                placeholder="Estimated Hours"
                type="number"
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="requiredWorkers" className="block text-sm font-medium text-gray-700">Required Workers</label>
              <input
                id="requiredWorkers"
                name="requiredWorkers"
                value={formData.requiredWorkers}
                onChange={handleInputChange}
                placeholder="Number of Workers"
                type="number"
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Priority (1-5)</label>
              <input
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                placeholder="Priority (1-5)"
                type="number"
                min="1"
                max="5"
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="requiredSkills" className="block text-sm font-medium text-gray-700">Required Skills (comma-separated)</label>
              <input
                id="requiredSkills"
                name="requiredSkills"
                value={formData.requiredSkills}
                onChange={handleInputChange}
                placeholder='e.g., "Masonry, Welding, Plumbing"'
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="equipmentIds" className="block text-sm font-medium text-gray-700">Equipment IDs (comma-separated)</label>
              <input
                id="equipmentIds"
                name="equipmentIds"
                value={formData.equipmentIds}
                onChange={handleInputChange}
                placeholder='e.g., "1, 5, 8" (IDs of required equipment)'
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="equipmentRequestNotes" className="block text-sm font-medium text-gray-700">Equipment Request Notes</label>
              <textarea
                id="equipmentRequestNotes"
                name="equipmentRequestNotes"
                value={formData.equipmentRequestNotes}
                onChange={handleInputChange}
                placeholder="Any specific notes for equipment request..."
                rows="3"
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>
          </div>
          <div className="mt-8 flex gap-4">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 text-lg shadow-md"
            >
              {editingSubtaskId ? "Update Subtask" : "Create Subtask"}
            </button>
            <button
              type="button"
              className="px-6 py-3 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors duration-200 text-lg shadow-md"
              onClick={() => {
                setShowForm(false);
                setEditingSubtaskId(null); // Clear editing state
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Worker Assignment Modal (kept as is) */}
      {showWorkerAssignmentModal && selectedSubtaskForWorkerAssignment && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 shadow-xl w-full max-w-2xl">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Assign Worker to: {selectedSubtaskForWorkerAssignment.title}
            </h2>
            <div className="mb-4">
              <label htmlFor="workerSearch" className="block text-sm font-medium text-gray-700">Search Workers by Skills, Name, Email:</label>
              <div className="flex gap-2 mt-1">
                <input
                  id="workerSearch"
                  type="text"
                  value={workerSearchTerm}
                  onChange={(e) => setWorkerSearchTerm(e.target.value)}
                  placeholder="e.g., 'welding', 'john doe', 'john@example.com'"
                  className="flex-grow p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => fetchWorkersForAssignment(selectedSubtaskForWorkerAssignment.id, workerSearchTerm)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Search
                </button>
              </div>
            </div>

            {availableWorkers.length > 0 && (
              <div className="mb-6 max-h-48 overflow-y-auto border border-gray-200 rounded-md p-2">
                <p className="text-sm font-medium text-gray-700 mb-2">Select a Worker:</p>
                <div className="space-y-2">
                  {availableWorkers.map((worker) => (
                    <label key={worker.id} className="flex items-center p-2 border border-gray-100 rounded-md bg-white hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name="workerId"
                        value={worker.id}
                        checked={workerAssignmentFormData.workerId === worker.id.toString()}
                        onChange={handleWorkerAssignmentInputChange}
                        className="form-radio h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                      />
                      <span className="ml-3 text-sm font-medium text-gray-800">
                        {worker.username} ({worker.email}) - Skills: {worker.skills?.join(", ") || "N/A"}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
            {workerSearchTerm && availableWorkers.length === 0 && (
                   <p className="text-gray-500 text-sm mb-4">No workers found matching your search.</p>
            )}

            <form onSubmit={handleAssignWorker} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="assignStart" className="block text-sm font-medium text-gray-700">Assignment Start</label>
                <input
                  id="assignStart"
                  name="assignmentStart"
                  type="datetime-local"
                  value={workerAssignmentFormData.assignmentStart}
                  onChange={handleWorkerAssignmentInputChange}
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label htmlFor="assignEnd" className="block text-sm font-medium text-gray-700">Assignment End</label>
                <input
                  id="assignEnd"
                  name="assignmentEnd"
                  type="datetime-local"
                  value={workerAssignmentFormData.assignmentEnd}
                  onChange={handleWorkerAssignmentInputChange}
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="col-span-full">
                <label htmlFor="workerNotes" className="block text-sm font-medium text-gray-700">Worker Notes</label>
                <textarea
                  id="workerNotes"
                  name="workerNotes"
                  value={workerAssignmentFormData.workerNotes}
                  onChange={handleWorkerAssignmentInputChange}
                  placeholder="Notes for this assignment (e.g., specific tasks, safety precautions)"
                  rows="2"
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md"
                ></textarea>
              </div>
              <div className="col-span-full flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowWorkerAssignmentModal(false)}
                  className="px-5 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                >
                  Assign Worker
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* End Worker Assignment Modal */}

      {/* No Equipment Assignment Modal here */}
    </div>
  );
}