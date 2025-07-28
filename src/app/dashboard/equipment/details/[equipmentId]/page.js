// 'use client';

// import { useEffect, useState } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import axios from 'axios';
// import AvailabilityCalendar from "../../../../../components/AvailabilityCalendar";
// // import AddNonAvailabilityModal from "../../../../../components/AddNonAvailabilityModal"; // REMOVE THIS IMPORT if only calendar adds slots

// export default function EquipmentDetailsPage() {
//   const { equipmentId } = useParams();
//   const router = useRouter();

//   const [equipment, setEquipment] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [formData, setFormData] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   const [nonAvailabilitySlots, setNonAvailabilitySlots] = useState([]);
//   const [slotsLoading, setSlotsLoading] = useState(false);
//   const [slotsError, setSlotsError] = useState('');

//   const statusOptions = ['AVAILABLE', 'IN_USE', 'UNDER_MAINTENANCE', 'DECOMMISSIONED'];

//   // Refactor fetchSlots to be callable from outside useEffect if needed for refresh after modal close
//   const fetchSlots = async () => {
//     setSlotsLoading(true);
//     try {
//       const token = localStorage.getItem('token');
//       const res = await axios.get(`http://localhost:8080/api/equipment/${equipmentId}/non-available-slots`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (res.data.success) {
//         setNonAvailabilitySlots(res.data.data);
//       } else {
//         setSlotsError('No slots found');
//       }
//     } catch (error) {
//       console.error(error);
//       setSlotsError('Failed to fetch non-availability slots');
//     } finally {
//       setSlotsLoading(false);
//     }
//   };


//   useEffect(() => {
//     const fetchDetails = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const response = await axios.get(`http://localhost:8080/api/equipment/${equipmentId}/details`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         if (response.data.success) {
//           setEquipment(response.data.data);
//           setFormData(response.data.data);
//         } else {
//           setError('Equipment not found');
//         }
//       } catch (err) {
//         console.error(err);
//         setError('Error fetching equipment details');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDetails();
//     fetchSlots(); // Initial fetch for slots
//   }, [equipmentId]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: name === 'purchasePrice' ? parseFloat(value) : value,
//     }));
//   };

//   const handleUpdate = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       await axios.put(`http://localhost:8080/api/equipment/${equipmentId}`, formData, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       alert('Equipment updated successfully!');
//       setEquipment(formData);
//       setIsEditing(false);
//     } catch (err) {
//       console.error(err);
//       alert('Update failed');
//     }
//   };

//   const handleDelete = async () => {
//     const confirm = window.confirm('Are you sure you want to delete this equipment?');
//     if (!confirm) return;

//     try {
//       const token = localStorage.getItem('token');
//       await axios.delete(`http://localhost:8080/api/equipment/${equipmentId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       alert('Equipment deleted');
//       router.push('/dashboard/equipment');
//     } catch (err) {
//       console.error(err);
//       alert('Delete failed');
//     }
//   };

//   if (loading) return <div className="p-4">Loading...</div>;
//   if (error) return <div className="p-4 text-red-500">{error}</div>;

//   return (
//     <div className="p-6 max-w-3xl mx-auto bg-white shadow-md rounded-md">
//       <h1 className="text-2xl font-bold mb-4">Equipment Details</h1>

//       {isEditing ? (
//         <div className="grid grid-cols-1 gap-4">
//           <input className="border p-2" name="name" value={formData.name || ''} onChange={handleChange} placeholder="Name" />
//           <input className="border p-2" name="model" value={formData.model || ''} onChange={handleChange} placeholder="Model" />
//           <input className="border p-2" name="serialNumber" value={formData.serialNumber || ''} onChange={handleChange} placeholder="Serial Number" />
//           <input className="border p-2" name="type" value={formData.type || ''} onChange={handleChange} placeholder="Type" />
//           <select className="border p-2" name="status" value={formData.status || ''} onChange={handleChange}>
//             <option value="">Select Status</option>
//             {statusOptions.map((s) => (
//               <option key={s} value={s}>{s}</option>
//             ))}
//           </select>
//           <input className="border p-2" name="purchasePrice" type="number" value={formData.purchasePrice || ''} onChange={handleChange} placeholder="Purchase Price" />
//           <input className="border p-2" name="warrantyMonths" type="number" value={formData.warrantyMonths || ''} onChange={handleChange} placeholder="Warranty (Months)" />
//           <input className="border p-2" name="maintenanceIntervalDays" type="number" value={formData.maintenanceIntervalDays || ''} onChange={handleChange} placeholder="Maintenance Interval (Days)" />
//           <input className="border p-2" name="lastMaintenanceDate" type="date" value={formData.lastMaintenanceDate || ''} onChange={handleChange} />
//           <input className="border p-2" name="location" value={formData.location || ''} onChange={handleChange} placeholder="Location" />
//           <textarea className="border p-2" name="notes" value={formData.notes || ''} onChange={handleChange} placeholder="Notes" />

//           <div className="flex gap-4 mt-4">
//             <button onClick={handleUpdate} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Save Changes</button>
//             <button onClick={() => setIsEditing(false)} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Cancel</button>
//           </div>
//         </div>
//       ) : (
//         <div className="space-y-2">
//           <p><strong>Name:</strong> {equipment.name}</p>
//           <p><strong>Model:</strong> {equipment.model}</p>
//           <p><strong>Serial Number:</strong> {equipment.serialNumber}</p>
//           <p><strong>Type:</strong> {equipment.type}</p>
//           <p><strong>Status:</strong> {equipment.status || equipment.currentOperationalStatus}</p>
//           <p><strong>Purchase Price:</strong> ₹{equipment.purchasePrice}</p>
//           <p><strong>Warranty Months:</strong> {equipment.warrantyMonths}</p>
//           <p><strong>Maintenance Interval:</strong> {equipment.maintenanceIntervalDays} days</p>
//           <p><strong>Last Maintenance:</strong> {equipment.lastMaintenanceDate}</p>
//           <p><strong>Location:</strong> {equipment.location}</p>
//           <p><strong>Notes:</strong> {equipment.notes}</p>

//           <div className="flex gap-4 mt-4">
//             <button onClick={() => setIsEditing(true)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Edit</button>
//             <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Delete</button>
//           </div>
//         </div>
//       )}

//       {/* REMOVED: No longer directly rendering AddNonAvailabilityModal here */}
//       {/* <div className="mt-10">
//         <AddNonAvailabilityModal equipmentId={equipmentId} onSuccess={() => {}} />
//       </div> */}

//       {/* ✅ Availability Calendar */}
//       <div className="mt-6">
//         <h2 className="text-xl font-semibold mb-4">Availability Calendar</h2>
//         {/* Pass fetchSlots as a prop to AvailabilityCalendar so it can trigger a refresh */}
//         <AvailabilityCalendar equipmentId={equipmentId} onSlotAdded={fetchSlots} />
//       </div>

//       {/* ✅ All Non-Availability Slots */}
//       <div className="mt-8">
//         <h2 className="text-xl font-semibold mb-4">All Non‑Availability Slots</h2>
//         {slotsLoading ? (
//           <p className="text-gray-500">Loading slots...</p>
//         ) : slotsError ? (
//           <p className="text-red-500">{slotsError}</p>
//         ) : nonAvailabilitySlots.length === 0 ? (
//           <p className="text-gray-600">No non-availability slots found.</p>
//         ) : (
//           <ul className="space-y-2">
//             {nonAvailabilitySlots.map((slot) => (
//               <li key={slot.id} className="border border-gray-300 rounded-md p-3 bg-gray-50">
//                 <div className="font-medium">{slot.type || "UNAVAILABLE"}</div>
//                 <div className="text-sm text-gray-700">
//                   {new Date(slot.startTime).toLocaleString()} — {new Date(slot.endTime).toLocaleString()}
//                 </div>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// }


// 'use client';

// import { useEffect, useState, useCallback } from 'react'; // Import useCallback
// import { useParams, useRouter } from 'next/navigation';
// import axios from 'axios';
// import AvailabilityCalendar from "../../../../../components/AvailabilityCalendar";
// import AssignToSubtaskModal from "../../../../../components/AssignEquipmentToSubtaskModal"; // NEW IMPORT

// export default function EquipmentDetailsPage() {
//   const { equipmentId } = useParams();
//   const router = useRouter();

//   const [equipment, setEquipment] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [formData, setFormData] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   // States for Non-Availability Slots (already existing, but good to keep track)
//   const [nonAvailabilitySlots, setNonAvailabilitySlots] = useState([]);
//   const [slotsLoading, setSlotsLoading] = useState(false);
//   const [slotsError, setSlotsError] = useState('');

//   // NEW: State for Assign to Subtask Modal
//   const [showAssignModal, setShowAssignModal] = useState(false);

//   const statusOptions = ['AVAILABLE', 'IN_USE', 'UNDER_MAINTENANCE', 'DECOMMISSIONED'];

//   // Refactor fetchDetails and fetchSlots into useCallback for better memoization and reusability
//   const fetchDetails = useCallback(async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.get(`http://localhost:8080/api/equipment/${equipmentId}/details`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (response.data.success) {
//         setEquipment(response.data.data);
//         setFormData(response.data.data);
//       } else {
//         setError('Equipment not found');
//       }
//     } catch (err) {
//       console.error(err);
//       setError('Error fetching equipment details');
//     } finally {
//       setLoading(false);
//     }
//   }, [equipmentId]); // Dependencies for useCallback

//   const fetchSlots = useCallback(async () => {
//     setSlotsLoading(true);
//     try {
//       const token = localStorage.getItem('token');
//       const res = await axios.get(`http://localhost:8080/api/equipment/${equipmentId}/non-available-slots`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (res.data.success) {
//         setNonAvailabilitySlots(res.data.data);
//       } else {
//         setSlotsError('No slots found');
//       }
//     } catch (error) {
//       console.error(error);
//       setSlotsError('Failed to fetch non-availability slots');
//     } finally {
//       setSlotsLoading(false);
//     }
//   }, [equipmentId]); // Dependencies for useCallback

//   useEffect(() => {
//     fetchDetails();
//     fetchSlots();
//   }, [equipmentId, fetchDetails, fetchSlots]); // Add fetchDetails, fetchSlots to dependencies

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: name === 'purchasePrice' ? parseFloat(value) : value,
//     }));
//   };

//   const handleUpdate = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       await axios.put(`http://localhost:8080/api/equipment/${equipmentId}`, formData, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       alert('Equipment updated successfully!');
//       setEquipment(formData);
//       setIsEditing(false);
//       fetchDetails(); // Refresh details to show any updates
//     } catch (err) {
//       console.error(err);
//       alert('Update failed');
//     }
//   };

//   const handleDelete = async () => {
//     const confirm = window.confirm('Are you sure you want to delete this equipment?');
//     if (!confirm) return;

//     try {
//       const token = localStorage.getItem('token');
//       await axios.delete(`http://localhost:8080/api/equipment/${equipmentId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       alert('Equipment deleted');
//       router.push('/dashboard/equipment');
//     } catch (err) {
//       console.error(err);
//       alert('Delete failed');
//     }
//   };

//   // Handler for successful assignment
//   const handleAssignmentSuccess = () => {
//     setShowAssignModal(false);
//     fetchDetails(); // Refresh equipment details to get updated assignments
//     fetchSlots(); // Refresh slots as assignment creates an 'ASSIGNED' non-availability slot
//   };

//   // Handler for recording maintenance (Phase 3 will be implemented here)
//   const handleRecordMaintenance = async () => {
//     const confirmMaintenance = window.confirm("Are you sure you want to record maintenance for this equipment?");
//     if (!confirmMaintenance) return;

//     try {
//         const token = localStorage.getItem('token');
//         await axios.patch(
//             `http://localhost:8080/api/equipment-manager/equipment/${equipmentId}/record-maintenance`,
//             {}, // No body needed for this PATCH request
//             {
//                 headers: { Authorization: `Bearer ${token}` },
//             }
//         );
//         alert('Maintenance recorded successfully!');
//         fetchDetails(); // Refresh equipment details to show updated maintenance info
//     } catch (err) {
//         console.error('Error recording maintenance:', err);
//         alert('Failed to record maintenance. Please try again.');
//     }
//   };


//   if (loading) return <div className="p-4">Loading...</div>;
//   if (error) return <div className="p-4 text-red-500">{error}</div>;

//   return (
//     <div className="p-6 max-w-3xl mx-auto bg-white shadow-md rounded-md">
//       <h1 className="text-2xl font-bold mb-4">Equipment Details</h1>

//       {isEditing ? (
//         <div className="grid grid-cols-1 gap-4">
//           <input className="border p-2" name="name" value={formData.name || ''} onChange={handleChange} placeholder="Name" />
//           <input className="border p-2" name="model" value={formData.model || ''} onChange={handleChange} placeholder="Model" />
//           <input className="border p-2" name="serialNumber" value={formData.serialNumber || ''} onChange={handleChange} placeholder="Serial Number" />
//           <input className="border p-2" name="type" value={formData.type || ''} onChange={handleChange} placeholder="Type" />
//           <select className="border p-2" name="status" value={formData.status || ''} onChange={handleChange}>
//             <option value="">Select Status</option>
//             {statusOptions.map((s) => (
//               <option key={s} value={s}>{s}</option>
//             ))}
//           </select>
//           <input className="border p-2" name="purchasePrice" type="number" value={formData.purchasePrice || ''} onChange={handleChange} placeholder="Purchase Price" />
//           <input className="border p-2" name="warrantyMonths" type="number" value={formData.warrantyMonths || ''} onChange={handleChange} placeholder="Warranty (Months)" />
//           <input className="border p-2" name="maintenanceIntervalDays" type="number" value={formData.maintenanceIntervalDays || ''} onChange={handleChange} placeholder="Maintenance Interval (Days)" />
//           <input className="border p-2" name="lastMaintenanceDate" type="date" value={formData.lastMaintenanceDate || ''} onChange={handleChange} />
//           <input className="border p-2" name="location" value={formData.location || ''} onChange={handleChange} placeholder="Location" />
//           <textarea className="border p-2" name="notes" value={formData.notes || ''} onChange={handleChange} placeholder="Notes" />

//           <div className="flex gap-4 mt-4">
//             <button onClick={handleUpdate} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Save Changes</button>
//             <button onClick={() => setIsEditing(false)} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Cancel</button>
//           </div>
//         </div>
//       ) : (
//         <div className="space-y-2">
//           <p><strong>Name:</strong> {equipment.name}</p>
//           <p><strong>Model:</strong> {equipment.model}</p>
//           <p><strong>Serial Number:</strong> {equipment.serialNumber}</p>
//           <p><strong>Type:</strong> {equipment.type}</p>
//           <p><strong>Status:</strong> {equipment.status || equipment.currentOperationalStatus}</p>
//           <p><strong>Purchase Price:</strong> ₹{equipment.purchasePrice}</p>
//           <p><strong>Warranty Months:</strong> {equipment.warrantyMonths}</p>
//           <p><strong>Maintenance Interval:</strong> {equipment.maintenanceIntervalDays} days</p>
//           <p><strong>Last Maintenance:</strong> {equipment.lastMaintenanceDate}</p>
//           <p><strong>Next Maintenance Due:</strong> {equipment.nextMaintenanceDueDate || 'N/A'}</p> {/* Display next maintenance due */}
//           <p><strong>Location:</strong> {equipment.location}</p>
//           <p><strong>Notes:</strong> {equipment.notes}</p>

//           <div className="flex gap-4 mt-4">
//             <button onClick={() => setIsEditing(true)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Edit</button>
//             <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Delete</button>
//           </div>
//         </div>
//       )}

//       {/* NEW: Buttons for Assign and Record Maintenance */}
//       <div className="mt-8 flex gap-4">
//         <button
//           onClick={() => setShowAssignModal(true)}
//           className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
//         >
//           Assign to Subtask
//         </button>
//         <button
//           onClick={handleRecordMaintenance}
//           className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
//         >
//           Record Maintenance
//         </button>
//       </div>

//       {/* NEW: Display Assignments and Delete Button (Phase 2) */}
//       <div className="mt-8">
//         <h2 className="text-xl font-semibold mb-4">Current Assignments</h2>
//         {equipment.assignments && equipment.assignments.length > 0 ? (
//           <ul className="space-y-2">
//             {equipment.assignments.map((assignment) => (
//               <li key={assignment.id} className="border border-gray-300 rounded-md p-3 bg-gray-50 flex justify-between items-center">
//                 <div>
//                   <div className="font-medium">Subtask ID: {assignment.subtaskId}</div>
//                   <div className="text-sm text-gray-700">
//                     {new Date(assignment.startTime).toLocaleString()} — {new Date(assignment.endTime).toLocaleString()}
//                   </div>
//                   {assignment.equipmentNotes && <div className="text-sm text-gray-600 italic">Notes: {assignment.equipmentNotes}</div>}
//                 </div>
//                 <button
//                   onClick={async () => { // Direct inline handler for deletion
//                     const confirmDelete = window.confirm(`Are you sure you want to delete assignment ${assignment.id}? This will also delete the associated non-availability slot.`);
//                     if (!confirmDelete) return;

//                     try {
//                       const token = localStorage.getItem('token');
//                       await axios.delete(
//                         `http://localhost:8080/api/equipment/${equipmentId}/assignments/${assignment.id}`,
//                         {
//                           headers: { Authorization: `Bearer ${token}` },
//                         }
//                       );
//                       alert('Assignment deleted successfully!');
//                       fetchDetails(); // Refresh details to remove assignment
//                       fetchSlots();   // Refresh slots as well (since ASSIGNED slot is removed)
//                     } catch (err) {
//                       console.error('Error deleting assignment:', err);
//                       alert('Failed to delete assignment. Please try again.');
//                     }
//                   }}
//                   className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
//                 >
//                   Delete Assignment
//                 </button>
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p className="text-gray-600">No current assignments.</p>
//         )}
//       </div>

//       {/* ✅ Availability Calendar */}
//       <div className="mt-6">
//         <h2 className="text-xl font-semibold mb-4">Availability Calendar</h2>
//         {/* Pass fetchSlots as a prop to AvailabilityCalendar so it can trigger a refresh */}
//         <AvailabilityCalendar equipmentId={equipmentId} onSlotAdded={fetchSlots} />
//       </div>

//       {/* ✅ All Non-Availability Slots */}
//       <div className="mt-8">
//         <h2 className="text-xl font-semibold mb-4">All Non‑Availability Slots</h2>
//         {slotsLoading ? (
//           <p className="text-gray-500">Loading slots...</p>
//         ) : slotsError ? (
//           <p className="text-red-500">{slotsError}</p>
//         ) : nonAvailabilitySlots.length === 0 ? (
//           <p className="text-gray-600">No non-availability slots found.</p>
//         ) : (
//           <ul className="space-y-2">
//             {nonAvailabilitySlots.map((slot) => (
//               <li key={slot.id} className="border border-gray-300 rounded-md p-3 bg-gray-50">
//                 <div className="font-medium">{slot.type || "UNAVAILABLE"}</div>
//                 <div className="text-sm text-gray-700">
//                   {new Date(slot.startTime).toLocaleString()} — {new Date(slot.endTime).toLocaleString()}
//                 </div>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>

//       {/* NEW: Assign to Subtask Modal */}
//       {showAssignModal && (
//         <AssignToSubtaskModal
//           equipmentId={equipmentId}
//           onClose={() => setShowAssignModal(false)}
//           onSuccess={handleAssignmentSuccess}
//         />
//       )}
//     </div>
//   );
// }

// 'use client';

// import { useEffect, useState } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import axios from 'axios';
// import AvailabilityCalendar from "../../../../../components/AvailabilityCalendar";
// // import AddNonAvailabilityModal from "../../../../../components/AddNonAvailabilityModal"; // REMOVE THIS IMPORT if only calendar adds slots

// export default function EquipmentDetailsPage() {
//   const { equipmentId } = useParams();
//   const router = useRouter();

//   const [equipment, setEquipment] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [formData, setFormData] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   const [nonAvailabilitySlots, setNonAvailabilitySlots] = useState([]);
//   const [slotsLoading, setSlotsLoading] = useState(false);
//   const [slotsError, setSlotsError] = useState('');

//   const statusOptions = ['AVAILABLE', 'IN_USE', 'UNDER_MAINTENANCE', 'DECOMMISSIONED'];

//   // Refactor fetchSlots to be callable from outside useEffect if needed for refresh after modal close
//   const fetchSlots = async () => {
//     setSlotsLoading(true);
//     try {
//       const token = localStorage.getItem('token');
//       const res = await axios.get(`http://localhost:8080/api/equipment/${equipmentId}/non-available-slots`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (res.data.success) {
//         setNonAvailabilitySlots(res.data.data);
//       } else {
//         setSlotsError('No slots found');
//       }
//     } catch (error) {
//       console.error(error);
//       setSlotsError('Failed to fetch non-availability slots');
//     } finally {
//       setSlotsLoading(false);
//     }
//   };


//   useEffect(() => {
//     const fetchDetails = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const response = await axios.get(`http://localhost:8080/api/equipment/${equipmentId}/details`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         if (response.data.success) {
//           setEquipment(response.data.data);
//           setFormData(response.data.data);
//         } else {
//           setError('Equipment not found');
//         }
//       } catch (err) {
//         console.error(err);
//         setError('Error fetching equipment details');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDetails();
//     fetchSlots(); // Initial fetch for slots
//   }, [equipmentId]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: name === 'purchasePrice' ? parseFloat(value) : value,
//     }));
//   };

//   const handleUpdate = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       await axios.put(`http://localhost:8080/api/equipment/${equipmentId}`, formData, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       alert('Equipment updated successfully!');
//       setEquipment(formData);
//       setIsEditing(false);
//     } catch (err) {
//       console.error(err);
//       alert('Update failed');
//     }
//   };

//   const handleDelete = async () => {
//     const confirm = window.confirm('Are you sure you want to delete this equipment?');
//     if (!confirm) return;

//     try {
//       const token = localStorage.getItem('token');
//       await axios.delete(`http://localhost:8080/api/equipment/${equipmentId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       alert('Equipment deleted');
//       router.push('/dashboard/equipment');
//     } catch (err) {
//       console.error(err);
//       alert('Delete failed');
//     }
//   };

//   if (loading) return <div className="p-4">Loading...</div>;
//   if (error) return <div className="p-4 text-red-500">{error}</div>;

//   return (
//     <div className="p-6 max-w-3xl mx-auto bg-white shadow-md rounded-md">
//       <h1 className="text-2xl font-bold mb-4">Equipment Details</h1>

//       {isEditing ? (
//         <div className="grid grid-cols-1 gap-4">
//           <input className="border p-2" name="name" value={formData.name || ''} onChange={handleChange} placeholder="Name" />
//           <input className="border p-2" name="model" value={formData.model || ''} onChange={handleChange} placeholder="Model" />
//           <input className="border p-2" name="serialNumber" value={formData.serialNumber || ''} onChange={handleChange} placeholder="Serial Number" />
//           <input className="border p-2" name="type" value={formData.type || ''} onChange={handleChange} placeholder="Type" />
//           <select className="border p-2" name="status" value={formData.status || ''} onChange={handleChange}>
//             <option value="">Select Status</option>
//             {statusOptions.map((s) => (
//               <option key={s} value={s}>{s}</option>
//             ))}
//           </select>
//           <input className="border p-2" name="purchasePrice" type="number" value={formData.purchasePrice || ''} onChange={handleChange} placeholder="Purchase Price" />
//           <input className="border p-2" name="warrantyMonths" type="number" value={formData.warrantyMonths || ''} onChange={handleChange} placeholder="Warranty (Months)" />
//           <input className="border p-2" name="maintenanceIntervalDays" type="number" value={formData.maintenanceIntervalDays || ''} onChange={handleChange} placeholder="Maintenance Interval (Days)" />
//           <input className="border p-2" name="lastMaintenanceDate" type="date" value={formData.lastMaintenanceDate || ''} onChange={handleChange} />
//           <input className="border p-2" name="location" value={formData.location || ''} onChange={handleChange} placeholder="Location" />
//           <textarea className="border p-2" name="notes" value={formData.notes || ''} onChange={handleChange} placeholder="Notes" />

//           <div className="flex gap-4 mt-4">
//             <button onClick={handleUpdate} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Save Changes</button>
//             <button onClick={() => setIsEditing(false)} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Cancel</button>
//           </div>
//         </div>
//       ) : (
//         <div className="space-y-2">
//           <p><strong>Name:</strong> {equipment.name}</p>
//           <p><strong>Model:</strong> {equipment.model}</p>
//           <p><strong>Serial Number:</strong> {equipment.serialNumber}</p>
//           <p><strong>Type:</strong> {equipment.type}</p>
//           <p><strong>Status:</strong> {equipment.status || equipment.currentOperationalStatus}</p>
//           <p><strong>Purchase Price:</strong> ₹{equipment.purchasePrice}</p>
//           <p><strong>Warranty Months:</strong> {equipment.warrantyMonths}</p>
//           <p><strong>Maintenance Interval:</strong> {equipment.maintenanceIntervalDays} days</p>
//           <p><strong>Last Maintenance:</strong> {equipment.lastMaintenanceDate}</p>
//           <p><strong>Location:</strong> {equipment.location}</p>
//           <p><strong>Notes:</strong> {equipment.notes}</p>

//           <div className="flex gap-4 mt-4">
//             <button onClick={() => setIsEditing(true)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Edit</button>
//             <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Delete</button>
//           </div>
//         </div>
//       )}

//       {/* REMOVED: No longer directly rendering AddNonAvailabilityModal here */}
//       {/* <div className="mt-10">
//         <AddNonAvailabilityModal equipmentId={equipmentId} onSuccess={() => {}} />
//       </div> */}

//       {/* ✅ Availability Calendar */}
//       <div className="mt-6">
//         <h2 className="text-xl font-semibold mb-4">Availability Calendar</h2>
//         {/* Pass fetchSlots as a prop to AvailabilityCalendar so it can trigger a refresh */}
//         <AvailabilityCalendar equipmentId={equipmentId} onSlotAdded={fetchSlots} />
//       </div>

//       {/* ✅ All Non-Availability Slots */}
//       <div className="mt-8">
//         <h2 className="text-xl font-semibold mb-4">All Non‑Availability Slots</h2>
//         {slotsLoading ? (
//           <p className="text-gray-500">Loading slots...</p>
//         ) : slotsError ? (
//           <p className="text-red-500">{slotsError}</p>
//         ) : nonAvailabilitySlots.length === 0 ? (
//           <p className="text-gray-600">No non-availability slots found.</p>
//         ) : (
//           <ul className="space-y-2">
//             {nonAvailabilitySlots.map((slot) => (
//               <li key={slot.id} className="border border-gray-300 rounded-md p-3 bg-gray-50">
//                 <div className="font-medium">{slot.type || "UNAVAILABLE"}</div>
//                 <div className="text-sm text-gray-700">
//                   {new Date(slot.startTime).toLocaleString()} — {new Date(slot.endTime).toLocaleString()}
//                 </div>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// }

'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { format } from 'date-fns';
import AvailabilityCalendar from "../../../../../components/AvailabilityCalendar";
import AssignToSubtaskModal from "../../../../../components/AssignEquipmentToSubtaskModal"; // Use the correct component name and path

export default function EquipmentDetailsPage() {
    const { equipmentId } = useParams();
    const router = useRouter();

    const [equipment, setEquipment] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [nonAvailabilitySlots, setNonAvailabilitySlots] = useState([]);
    const [slotsLoading, setSlotsLoading] = useState(false);
    const [slotsError, setSlotsError] = useState('');

    const [allMainTasks, setAllMainTasks] = useState([]);
    const [allSubtasks, setAllSubtasks] = useState([]);
    const [tasksLoading, setTasksLoading] = useState(false);
    const [tasksError, setTasksError] = useState('');

    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

    const statusOptions = ['AVAILABLE', 'IN_USE', 'UNDER_MAINTENANCE', 'DECOMMISSIONED'];

    // --- Core Data Fetching Functions (using useCallback) ---

    // Fetches non-availability slots for the equipment
    const fetchSlots = useCallback(async () => {
        setSlotsLoading(true);
        setSlotsError('');
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`http://localhost:8080/api/equipment/${equipmentId}/non-available-slots`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.data.success) {
                setNonAvailabilitySlots(res.data.data);
            } else {
                setSlotsError('No slots found');
            }
        } catch (error) {
            console.error("Failed to fetch non-availability slots:", error);
            setSlotsError('Failed to fetch non-availability slots');
        } finally {
            setSlotsLoading(false);
        }
    }, [equipmentId]);

    // Fetches main tasks and their subtasks for a specific project
    // This function itself does NOT depend on 'equipment' state, only on 'projectId' param
    const fetchTasksForProject = useCallback(async (projectId) => {
        if (!projectId) {
            setTasksError('No project ID provided to fetch tasks. Cannot display project-specific tasks.');
            setAllMainTasks([]);
            setAllSubtasks([]);
            return;
        }

        setTasksLoading(true);
        setTasksError('');
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }

            const mainTasksRes = await axios.get(`http://localhost:8080/api/pm/projects/${projectId}/main-tasks`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { page: 0, size: 100 }
            });

            if (mainTasksRes.data.success) {
                const fetchedMainTasks = mainTasksRes.data.data.content || mainTasksRes.data.data;
                setAllMainTasks(fetchedMainTasks);

                const allFetchedSubtasks = [];
                for (const mainTask of fetchedMainTasks) {
                    try {
                        const subtasksForMainTaskRes = await axios.get(`http://localhost:8080/api/site-supervisor/main-tasks/${mainTask.id}/subtasks`, {
                            headers: { Authorization: `Bearer ${token}` },
                        });
                        if (subtasksForMainTaskRes.data.success) {
                            const subtasksWithContext = subtasksForMainTaskRes.data.data.map(sub => ({
                                ...sub,
                                mainTask: {
                                    id: mainTask.id,
                                    projectId: projectId
                                }
                            }));
                            allFetchedSubtasks.push(...subtasksWithContext);
                        }
                    } catch (subtaskError) {
                        console.warn(`Could not fetch subtasks for Main Task ID ${mainTask.id}:`, subtaskError);
                        if (subtaskError.response && subtaskError.response.data && subtaskError.response.data.message) {
                            console.warn(`Backend message for subtask error: ${subtaskError.response.data.message}`);
                        }
                    }
                }
                setAllSubtasks(allFetchedSubtasks);
            } else {
                throw new Error(mainTasksRes.data.message || `Failed to fetch main tasks for project ${projectId}.`);
            }

        } catch (err) {
            console.error("Error fetching tasks for project:", err);
            setTasksError(`Error fetching tasks: ${err.response?.data?.message || err.message}`);
        } finally {
            setTasksLoading(false);
        }
    }, [router]);


    // --- useEffect for Initial Data Loading ---
    useEffect(() => {
        const loadEquipmentAndRelatedData = async () => {
            setLoading(true);
            setError('');
            let currentEquipmentData = null; // Store fetched equipment data here to use immediately

            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    router.push('/login');
                    return;
                }

                // --- 1. Fetch Equipment Details First ---
                const response = await axios.get(`http://localhost:8080/api/equipment/${equipmentId}/details`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.data.success) {
                    currentEquipmentData = response.data.data;
                    setEquipment(currentEquipmentData); // Update state
                    setFormData(currentEquipmentData); // Update form data
                } else {
                    setError('Equipment not found');
                    setLoading(false); // Stop loading if equipment not found
                    return; // Exit early if equipment is not found
                }

                // --- 2. Fetch Slots (can be done in parallel or immediately after equipment) ---
                await fetchSlots(); // This function uses equipmentId from params, already memoized

                // --- 3. Determine projectId for tasks based on the JUST FETCHED equipmentData ---
                let determinedProjectId = null;
                if (currentEquipmentData.projectId) {
                    determinedProjectId = currentEquipmentData.projectId;
                } else if (currentEquipmentData.assignments && currentEquipmentData.assignments.length > 0) {
                    const firstAssignment = currentEquipmentData.assignments[0];
                    if (firstAssignment.subtask && firstAssignment.subtask.mainTask && firstAssignment.subtask.mainTask.projectId) {
                        determinedProjectId = firstAssignment.subtask.mainTask.projectId;
                    }
                }

                // Fallback to a default project ID
                if (!determinedProjectId) {
                    console.warn("No projectId found on equipment or its assignments. Using fallback Project ID 1.");
                    determinedProjectId = 1; // --- ADJUST THIS FALLBACK ID AS NEEDED ---
                }

                // --- 4. Fetch Tasks using the determined Project ID ---
                if (determinedProjectId) {
                    await fetchTasksForProject(determinedProjectId);
                } else {
                    setTasksError('Could not determine a project ID to fetch tasks.');
                }

            } catch (err) {
                console.error("Error in loadEquipmentAndRelatedData:", err);
                setError(`Error fetching initial data: ${err.response?.data?.message || err.message}`);
            } finally {
                setLoading(false);
            }
        };

        loadEquipmentAndRelatedData();

    }, [equipmentId, router, fetchSlots, fetchTasksForProject]); // Dependencies: only external values and memoized functions. 'equipment' removed.


    // --- Form Handling ---
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'purchasePrice' || name === 'warrantyMonths' || name === 'maintenanceIntervalDays' ? parseFloat(value) : value,
        }));
    };

    const handleUpdate = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:8080/api/equipment/${equipmentId}`, formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert('Equipment updated successfully!');
            setIsEditing(false);
            // After update, re-fetch all data to ensure consistency across all sections
            // This will trigger the main useEffect which will re-run fetchDetails, fetchSlots, fetchTasksForProject
            setEquipment(null); // Force re-fetch by nulling equipment state, which is a useEffect dependency for `loadEquipmentAndRelatedData` now
        } catch (err) {
            console.error(err);
            alert(`Update failed: ${err.response?.data?.message || err.message}`);
        }
    };

    const handleDelete = async () => {
        const confirm = window.confirm('Are you sure you want to delete this equipment?');
        if (!confirm) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:8080/api/equipment/${equipmentId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert('Equipment deleted');
            router.push('/dashboard/equipment');
        } catch (err) {
            console.error(err);
            alert(`Delete failed: ${err.response?.data?.message || err.message}`);
        }
    };

    // --- Assignment and Maintenance Handlers ---

    const handleAssignmentSuccess = useCallback(() => {
        setIsAssignModalOpen(false);
        // After successful assignment, trigger a full re-fetch of all data
        // This will ensure updated assignments and non-availability slots are reflected
        setEquipment(null); // Force re-fetch
    }, []); // No dependencies needed as it just triggers a full refresh

    const handleDeleteAssignment = useCallback(async (assignmentId) => {
        const confirmDelete = window.confirm(`Are you sure you want to delete assignment ${assignmentId}? This will also delete the associated non-availability slot.`);
        if (!confirmDelete) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(
                `http://localhost:8080/api/equipment/${equipmentId}/assignments/${assignmentId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            alert('Assignment deleted successfully!');
            // After deletion, trigger a full re-fetch of all data
            setEquipment(null); // Force re-fetch
        } catch (err) {
            console.error('Error deleting assignment:', err);
            alert(`Failed to delete assignment: ${err.response?.data?.message || err.message}. Please try again.`);
        }
    }, [equipmentId]); // Only equipmentId is needed as a dependency for the deletion API call

    const handleRecordMaintenance = async () => {
        const confirmMaintenance = window.confirm("Are you sure you want to record maintenance for this equipment? This will update its last maintenance date.");
        if (!confirmMaintenance) return;

        try {
            const token = localStorage.getItem('token');
            await axios.patch(
                `http://localhost:8080/api/equipment-manager/equipment/${equipmentId}/record-maintenance`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            alert('Maintenance recorded successfully!');
            // After recording maintenance, trigger a full re-fetch of all data
            setEquipment(null); // Force re-fetch
        } catch (err) {
            console.error('Error recording maintenance:', err);
            alert(`Failed to record maintenance: ${err.response?.data?.message || err.message}. Please try again.`);
        }
    };

    // --- Render Logic ---

    if (loading) return <div className="p-4 text-center text-lg text-indigo-600">Loading equipment details...</div>;
    if (error) return <div className="p-4 text-red-500 text-center">{error}</div>;
    if (!equipment) return <div className="p-4 text-gray-500 text-center">Equipment not found or no data.</div>;

    // Determine the projectId to pass to the AssignToSubtaskModal and for task display titles
    // This should now correctly use the `equipment` state which is guaranteed to be up-to-date
    const modalProjectId = equipment?.projectId
        || (equipment?.assignments && equipment.assignments.length > 0 && equipment.assignments[0].subtask?.mainTask?.projectId)
        || (allMainTasks.length > 0 && allMainTasks[0].projectId)
        || 1; // Fallback project ID (adjust as per your needs)


    return (
        <div className="p-6 max-w-5xl mx-auto bg-white shadow-md rounded-md">
            <h1 className="text-3xl font-bold mb-2 text-gray-800">
                Equipment Details: {equipment?.name || 'N/A'}
            </h1>
            <p className="text-gray-600 mb-6">
                ID: <strong>{equipmentId}</strong>
            </p>

            {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <input className="border p-2 rounded" name="name" value={formData.name || ''} onChange={handleChange} placeholder="Name" />
                    <input className="border p-2 rounded" name="model" value={formData.model || ''} onChange={handleChange} placeholder="Model" />
                    <input className="border p-2 rounded" name="serialNumber" value={formData.serialNumber || ''} onChange={handleChange} placeholder="Serial Number" />
                    <input className="border p-2 rounded" name="type" value={formData.type || ''} onChange={handleChange} placeholder="Type" />
                    <select className="border p-2 rounded" name="status" value={formData.status || ''} onChange={handleChange}>
                        <option value="">Select Status</option>
                        {statusOptions.map((s) => (
                            <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                        ))}
                    </select>
                    <input className="border p-2 rounded" name="purchasePrice" type="number" value={formData.purchasePrice || ''} onChange={handleChange} placeholder="Purchase Price" />
                    <input className="border p-2 rounded" name="warrantyMonths" type="number" value={formData.warrantyMonths || ''} onChange={handleChange} placeholder="Warranty (Months)" />
                    <input className="border p-2 rounded" name="maintenanceIntervalDays" type="number" value={formData.maintenanceIntervalDays || ''} onChange={handleChange} placeholder="Maintenance Interval (Days)" />
                    <label className="block text-sm font-medium text-gray-700 mt-2">Last Maintenance Date</label>
                    <input className="border p-2 rounded" name="lastMaintenanceDate" type="date" value={formData.lastMaintenanceDate ? format(new Date(formData.lastMaintenanceDate), 'yyyy-MM-dd') : ''} onChange={handleChange} />
                    <input className="border p-2 rounded" name="location" value={formData.location || ''} onChange={handleChange} placeholder="Location" />
                    <textarea className="border p-2 rounded md:col-span-2" name="notes" value={formData.notes || ''} onChange={handleChange} placeholder="Notes" rows="3" />

                    <div className="flex gap-4 mt-4 md:col-span-2">
                        <button onClick={handleUpdate} className="bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700 transition duration-200">Save Changes</button>
                        <button onClick={() => setIsEditing(false)} className="bg-gray-500 text-white px-5 py-2 rounded-md hover:bg-gray-600 transition duration-200">Cancel</button>
                    </div>
                </div>
            ) : (
                <div className="space-y-3 mb-8 text-gray-700">
                    <p><strong>Name:</strong> {equipment.name}</p>
                    <p><strong>Model:</strong> {equipment.model}</p>
                    <p><strong>Serial Number:</strong> {equipment.serialNumber}</p>
                    <p><strong>Type:</strong> {equipment.type}</p>
                    <p><strong>Status:</strong> {equipment.status || equipment.currentOperationalStatus}</p>
                    <p><strong>Purchase Price:</strong> ₹{equipment.purchasePrice?.toLocaleString('en-IN')}</p>
                    <p><strong>Warranty Months:</strong> {equipment.warrantyMonths} months</p>
                    <p><strong>Maintenance Interval:</strong> {equipment.maintenanceIntervalDays} days</p>
                    <p><strong>Last Maintenance:</strong> {equipment.lastMaintenanceDate ? format(new Date(equipment.lastMaintenanceDate), 'MMM dd, yyyy') : 'N/A'}</p>
                    <p><strong>Next Maintenance Due:</strong> {equipment.nextMaintenanceDueDate ? format(new Date(equipment.nextMaintenanceDueDate), 'MMM dd, yyyy') : 'N/A'}</p>
                    <p><strong>Location:</strong> {equipment.location}</p>
                    <p><strong>Notes:</strong> {equipment.notes || 'N/A'}</p>

                    <div className="flex gap-4 mt-4">
                        <button onClick={() => setIsEditing(true)} className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition duration-200">Edit</button>
                        <button onClick={handleDelete} className="bg-red-600 text-white px-5 py-2 rounded-md hover:bg-red-700 transition duration-200">Delete</button>
                    </div>
                </div>
            )}

            <div className="mt-8 flex gap-4">
                <button
                    onClick={() => setIsAssignModalOpen(true)}
                    className="bg-purple-600 text-white px-5 py-2 rounded-md hover:bg-purple-700 transition duration-200"
                    disabled={!modalProjectId}
                >
                    Assign to Subtask
                </button>
                <button
                    onClick={handleRecordMaintenance}
                    className="bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700 transition duration-200"
                >
                    Record Maintenance
                </button>
            </div>

            <hr className="my-8 border-gray-200" />

            <div className="mt-8">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Current Assignments</h2>
                {/* Use equipment.assignments directly after equipment is loaded */}
                {equipment.assignments && equipment.assignments.length > 0 ? (
                    <ul className="space-y-3">
                        {equipment.assignments.map((assignment) => (
                            <li key={assignment.id} className="border border-blue-200 rounded-md p-4 bg-blue-50 shadow-sm flex justify-between items-center">
                                <div>
                                    <p className="font-medium text-blue-800">
                                        Assigned to: {assignment.subtask?.title || 'N/A'}
                                    </p>
                                    <p className="text-sm text-gray-700">
                                        Subtask ID: {assignment.subtask?.id || 'N/A'}
                                    </p>
                                    {assignment.subtask?.id && assignment.subtask?.mainTask?.projectId && assignment.subtask?.mainTask?.id && (
                                        <p className="text-sm">
                                            <a
                                                href={`/dashboard/equipment-assigned-projects/${assignment.subtask.mainTask.projectId}/main-tasks/${assignment.subtask.mainTask.id}/subtasks/${assignment.subtask.id}`}
                                                className="text-indigo-600 hover:underline"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                View Subtask Details (ID: {assignment.subtask.id})
                                            </a>
                                        </p>
                                    )}
                                    <p className="text-sm text-gray-700">
                                        Start: {assignment.startTime ? format(new Date(assignment.startTime), 'MMM dd, yyyy HH:mm') : 'N/A'}
                                    </p>
                                    <p className="text-sm text-gray-700">
                                        End: {assignment.endTime ? format(new Date(assignment.endTime), 'MMM dd, yyyy HH:mm') : 'N/A'}
                                    </p>
                                    {assignment.equipmentNotes && (
                                        <p className="text-sm text-gray-700">Notes: {assignment.equipmentNotes}</p>
                                    )}
                                </div>
                                <button
                                    onClick={() => handleDeleteAssignment(assignment.id)}
                                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                                >
                                    Delete Assignment
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-600">No current assignments.</p>
                )}
            </div>

            <hr className="my-8 border-gray-200" />

            <div className="mt-6">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Availability Calendar</h2>
                <AvailabilityCalendar equipmentId={equipmentId} onSlotAdded={fetchSlots} />
            </div>

            <div className="mt-8">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">All Non‑Availability Slots</h2>
                {slotsLoading ? (
                    <p className="text-gray-500">Loading slots...</p>
                ) : slotsError ? (
                    <p className="text-red-500">{slotsError}</p>
                ) : nonAvailabilitySlots.length === 0 ? (
                    <p className="text-gray-600">No non-availability slots found.</p>
                ) : (
                    <ul className="space-y-2">
                        {nonAvailabilitySlots.map((slot) => (
                            <li key={slot.id} className="border border-gray-300 rounded-md p-3 bg-gray-50 shadow-sm">
                                <div className="font-medium text-indigo-700">{slot.type || "UNAVAILABLE"}</div>
                                <div className="text-sm text-gray-700">
                                    {new Date(slot.startTime).toLocaleString()} — {new Date(slot.endTime).toLocaleString()}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <hr className="my-8 border-gray-200" />

            <div className="mt-8">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Main Tasks for Project (ID: {modalProjectId || 'N/A'})</h2>
                {tasksLoading ? (
                    <p className="text-gray-500">Loading main tasks...</p>
                ) : tasksError ? (
                    <p className="text-red-500">{tasksError}</p>
                ) : allMainTasks.length === 0 ? (
                    <p className="text-gray-600">No main tasks found for this project in the system.</p>
                ) : (
                    <ul className="space-y-3">
                        {allMainTasks.map((task) => (
                            <li key={task.id} className="border border-indigo-200 rounded-md p-4 bg-indigo-50 shadow-sm">
                                <h3 className="text-xl font-medium text-indigo-800">{task.title}</h3>
                                <p className="text-gray-700 text-sm">{task.description}</p>
                                <p className="text-xs text-gray-600 mt-1">Status: <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                    task.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                    task.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-800' :
                                    task.status === 'PLANNING' ? 'bg-blue-100 text-blue-800' :
                                    'bg-gray-100 text-gray-800'
                                }`}>{task.status?.replace(/_/g, ' ')}</span></p>
                                <p className="text-xs text-gray-600">Planned Start: {task.plannedStartDate ? format(new Date(task.plannedStartDate), 'MMM dd, yyyy') : 'N/A'}</p>
                                <p className="text-xs text-gray-600">Planned End: {task.plannedEndDate ? format(new Date(task.plannedEndDate), 'MMM dd, yyyy') : 'N/A'}</p>
                                {task.projectId && (
                                    <p className="text-sm mt-2">
                                        <a
                                            href={`/dashboard/equipment-assigned-projects/${task.projectId}/main-tasks/${task.id}`}
                                            className="text-blue-600 hover:underline"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            View Main Task Details (ID: {task.id})
                                        </a>
                                    </p>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <hr className="my-8 border-gray-200" />

            <div className="mt-8">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Subtasks for Project (ID: {modalProjectId || 'N/A'})</h2>
                {tasksLoading ? (
                    <p className="text-gray-500">Loading subtasks...</p>
                ) : tasksError ? (
                    <p className="text-red-500">{tasksError}</p>
                ) : allSubtasks.length === 0 ? (
                    <p className="text-gray-600">No subtasks found for this project's main tasks.</p>
                ) : (
                    <ul className="space-y-3">
                        {allSubtasks.map((subtask) => (
                            <li key={subtask.id} className="border border-green-200 rounded-md p-4 bg-green-50 shadow-sm">
                                <h3 className="text-xl font-medium text-green-800">{subtask.title}</h3>
                                <p className="text-gray-700 text-sm">{subtask.description}</p>
                                <p className="text-xs text-gray-600 mt-1">Status: <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                        subtask.status === 'PLANNED' ? 'bg-blue-100 text-blue-800' :
                                        subtask.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-800' :
                                        subtask.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                        'bg-gray-100 text-gray-800'
                                    }`}>{subtask.status?.replace(/_/g, ' ')}</span></p>
                                <p className="text-xs text-gray-600">Priority: {subtask.priority}</p>
                                <p className="text-xs text-gray-600">Estimated Hours: {subtask.estimatedHours}h</p>
                                <p className="text-xs text-gray-600">Required Workers: {subtask.requiredWorkers}</p>
                                <p className="text-xs text-gray-600">Planned Start: {subtask.plannedStart ? format(new Date(subtask.plannedStart), 'MMM dd, yyyy HH:mm') : 'N/A'}</p>
                                <p className="text-xs text-gray-600">Planned End: {subtask.plannedEnd ? format(new Date(subtask.plannedEnd), 'MMM dd, yyyy HH:mm') : 'N/A'}</p>

                                {subtask.mainTask?.projectId && subtask.mainTask?.id && (
                                    <p className="text-sm mt-2">
                                        <a
                                            href={`/dashboard/equipment-assigned-projects/${subtask.mainTask.projectId}/main-tasks/${subtask.mainTask.id}/subtasks/${subtask.id}`}
                                            className="text-blue-600 hover:underline"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            View Subtask Details (ID: {subtask.id})
                                        </a>
                                    </p>
                                )}

                                {subtask.requiredSkills && subtask.requiredSkills.length > 0 && (
                                    <p className="text-xs text-gray-600 mt-1">Required Skills: {subtask.requiredSkills.join(', ')}</p>
                                )}
                                {subtask.equipmentRequestNotes && subtask.equipmentRequestNotes.trim() !== '' && (
                                    <p className="text-xs text-gray-600 mt-1">Equipment Notes: {subtask.equipmentRequestNotes}</p>
                                )}
                                {subtask.equipmentNeeds && subtask.equipmentNeeds.length > 0 && (
                                    <div className="text-xs text-gray-600 mt-1">
                                        Equipment Needed:
                                        <ul className="list-disc list-inside ml-2">
                                            {subtask.equipmentNeeds.map(eq => (
                                                <li key={eq.id}>{eq.name} ({eq.type})</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {subtask.workerAssignments && subtask.workerAssignments.length > 0 && (
                                    <div className="text-xs text-gray-600 mt-1">
                                        Assigned Workers:
                                        <ul className="list-disc list-inside ml-2">
                                            {subtask.workerAssignments.map(wa => (
                                                <li key={wa.id}>{wa.worker.username} (Assigned by: {wa.assignedBy.username})</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {subtask.equipmentAssignments && subtask.equipmentAssignments.length > 0 && (
                                    <div className="text-xs text-gray-600 mt-1">
                                        Assigned Equipment:
                                        <ul className="list-disc list-inside ml-2">
                                            {subtask.equipmentAssignments.map(ea => (
                                                <li key={ea.id}>{ea.equipment.name} (Assigned to: {ea.assignedTo.username})</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {isAssignModalOpen && (
                <AssignToSubtaskModal
                    equipmentId={equipmentId}
                    projectId={modalProjectId}
                    onClose={() => setIsAssignModalOpen(false)}
                    onSuccess={handleAssignmentSuccess}
                />
            )}
        </div>
    );
}




















