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
    equipmentIds: "",
    equipmentRequestNotes: ""
  });

  useEffect(() => {
    fetchSubtasks();
  }, []);

  const fetchSubtasks = async () => {
    try {
      const accessToken = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:8080/api/site-supervisor/main-tasks/${mainTaskId}/subtasks`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setSubtasks(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch subtasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const accessToken = localStorage.getItem("token");

    const payload = {
      title: formData.title,
      description: formData.description,
      plannedStart: formData.plannedStart,
      plannedEnd: formData.plannedEnd,
      estimatedHours: parseInt(formData.estimatedHours),
      requiredWorkers: parseInt(formData.requiredWorkers),
      priority: parseInt(formData.priority),
      requiredSkills: formData.requiredSkills.split(",").map((s) => s.trim()),
      equipmentIds: formData.equipmentIds.split(",").map((id) => parseInt(id)),
      equipmentRequestNotes: formData.equipmentRequestNotes
    };

    try {
      if (editingSubtaskId) {
        await axios.put(
          `http://localhost:8080/api/site-supervisor/subtasks/${editingSubtaskId}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
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
        equipmentRequestNotes: ""
      });
      setShowForm(false);
      setEditingSubtaskId(null);
      fetchSubtasks();
    } catch (error) {
      console.error("Failed to submit subtask:", error);
      alert("Failed to create or update subtask.");
    }
  };

  const handleEdit = (subtask) => {
    setFormData({
      title: subtask.title,
      description: subtask.description,
      plannedStart: subtask.plannedStart,
      plannedEnd: subtask.plannedEnd,
      estimatedHours: subtask.estimatedHours.toString(),
      requiredWorkers: subtask.requiredWorkers.toString(),
      priority: subtask.priority.toString(),
      requiredSkills: subtask.requiredSkills.join(", "),
      equipmentIds: subtask.equipmentIds.join(", "),
      equipmentRequestNotes: subtask.equipmentRequestNotes || ""
    });
    setEditingSubtaskId(subtask.id);
    setShowForm(true);
  };

  const handleDelete = async (subtaskId) => {
    const accessToken = localStorage.getItem("token");
    try {
      await axios.delete(
        `http://localhost:8080/api/site-supervisor/subtasks/${subtaskId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      fetchSubtasks();
    } catch (error) {
      console.error("Failed to delete subtask:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Subtasks</h1>

      {loading ? (
        <p>Loading subtasks...</p>
      ) : subtasks.length === 0 ? (
        <p className="text-gray-500">No subtasks created yet.</p>
      ) : (
        <ul className="space-y-4">
          {subtasks.map((subtask) => (
            <li
              key={subtask.id}
              className="border rounded p-4 flex justify-between items-start bg-white shadow"
            >
              <div>
                <h2 className="text-lg font-semibold">{subtask.title}</h2>
                <p className="text-sm text-gray-600">{subtask.description}</p>
                <p className="text-sm text-gray-500">
                  {subtask.plannedStart} → {subtask.plannedEnd}
                </p>
              </div>
              <div className="space-x-2">
                <button
                  className="text-sm px-3 py-1 bg-blue-500 text-white rounded"
                  onClick={() => handleEdit(subtask)}
                >
                  Edit
                </button>
                <button
                  className="text-sm px-3 py-1 bg-red-500 text-white rounded"
                  onClick={() => handleDelete(subtask.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6">
        <button
          className="px-4 py-2 bg-green-600 text-white rounded"
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
              equipmentRequestNotes: ""
            });
            setEditingSubtaskId(null);
          }}
        >
          Create Subtask
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mt-6 bg-gray-50 p-6 rounded-lg border"
        >
          <div className="grid grid-cols-2 gap-4">
            <input
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Title"
              className="p-2 border rounded"
              required
            />
            <input
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Description"
              className="p-2 border rounded"
              required
            />
            <input
              name="plannedStart"
              value={formData.plannedStart}
              onChange={handleInputChange}
              type="datetime-local"
              className="p-2 border rounded"
              required
            />
            <input
              name="plannedEnd"
              value={formData.plannedEnd}
              onChange={handleInputChange}
              type="datetime-local"
              className="p-2 border rounded"
              required
            />
            <input
              name="estimatedHours"
              value={formData.estimatedHours}
              onChange={handleInputChange}
              placeholder="Estimated Hours"
              type="number"
              className="p-2 border rounded"
              required
            />
            <input
              name="requiredWorkers"
              value={formData.requiredWorkers}
              onChange={handleInputChange}
              placeholder="Required Workers"
              type="number"
              className="p-2 border rounded"
              required
            />
            <input
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
              placeholder="Priority (1-5)"
              type="number"
              className="p-2 border rounded"
              required
            />
            <input
              name="requiredSkills"
              value={formData.requiredSkills}
              onChange={handleInputChange}
              placeholder='Skills (e.g., "masonry, Welding")'
              className="p-2 border rounded"
              required
            />
            <input
              name="equipmentIds"
              value={formData.equipmentIds}
              onChange={handleInputChange}
              placeholder='Equipment IDs (e.g., "1,2")'
              className="p-2 border rounded"
              required
            />
            <input
              name="equipmentRequestNotes"
              value={formData.equipmentRequestNotes}
              onChange={handleInputChange}
              placeholder="Equipment Notes"
              className="p-2 border rounded"
            />
          </div>
          <div className="mt-4 flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              {editingSubtaskId ? "Update" : "Create"}
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 rounded"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}


