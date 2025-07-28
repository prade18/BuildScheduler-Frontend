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

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import AvailabilityCalendar from "../../../../../components/AvailabilityCalendar";
// import AddNonAvailabilityModal from "../../../../../components/AddNonAvailabilityModal"; // REMOVE THIS IMPORT if only calendar adds slots

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

  const statusOptions = ['AVAILABLE', 'IN_USE', 'UNDER_MAINTENANCE', 'DECOMMISSIONED'];

  // Refactor fetchSlots to be callable from outside useEffect if needed for refresh after modal close
  const fetchSlots = async () => {
    setSlotsLoading(true);
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
      console.error(error);
      setSlotsError('Failed to fetch non-availability slots');
    } finally {
      setSlotsLoading(false);
    }
  };


  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:8080/api/equipment/${equipmentId}/details`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          setEquipment(response.data.data);
          setFormData(response.data.data);
        } else {
          setError('Equipment not found');
        }
      } catch (err) {
        console.error(err);
        setError('Error fetching equipment details');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
    fetchSlots(); // Initial fetch for slots
  }, [equipmentId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'purchasePrice' ? parseFloat(value) : value,
    }));
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:8080/api/equipment/${equipmentId}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert('Equipment updated successfully!');
      setEquipment(formData);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert('Update failed');
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
      alert('Delete failed');
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4">Equipment Details</h1>

      {isEditing ? (
        <div className="grid grid-cols-1 gap-4">
          <input className="border p-2" name="name" value={formData.name || ''} onChange={handleChange} placeholder="Name" />
          <input className="border p-2" name="model" value={formData.model || ''} onChange={handleChange} placeholder="Model" />
          <input className="border p-2" name="serialNumber" value={formData.serialNumber || ''} onChange={handleChange} placeholder="Serial Number" />
          <input className="border p-2" name="type" value={formData.type || ''} onChange={handleChange} placeholder="Type" />
          <select className="border p-2" name="status" value={formData.status || ''} onChange={handleChange}>
            <option value="">Select Status</option>
            {statusOptions.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <input className="border p-2" name="purchasePrice" type="number" value={formData.purchasePrice || ''} onChange={handleChange} placeholder="Purchase Price" />
          <input className="border p-2" name="warrantyMonths" type="number" value={formData.warrantyMonths || ''} onChange={handleChange} placeholder="Warranty (Months)" />
          <input className="border p-2" name="maintenanceIntervalDays" type="number" value={formData.maintenanceIntervalDays || ''} onChange={handleChange} placeholder="Maintenance Interval (Days)" />
          <input className="border p-2" name="lastMaintenanceDate" type="date" value={formData.lastMaintenanceDate || ''} onChange={handleChange} />
          <input className="border p-2" name="location" value={formData.location || ''} onChange={handleChange} placeholder="Location" />
          <textarea className="border p-2" name="notes" value={formData.notes || ''} onChange={handleChange} placeholder="Notes" />

          <div className="flex gap-4 mt-4">
            <button onClick={handleUpdate} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Save Changes</button>
            <button onClick={() => setIsEditing(false)} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Cancel</button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <p><strong>Name:</strong> {equipment.name}</p>
          <p><strong>Model:</strong> {equipment.model}</p>
          <p><strong>Serial Number:</strong> {equipment.serialNumber}</p>
          <p><strong>Type:</strong> {equipment.type}</p>
          <p><strong>Status:</strong> {equipment.status || equipment.currentOperationalStatus}</p>
          <p><strong>Purchase Price:</strong> ₹{equipment.purchasePrice}</p>
          <p><strong>Warranty Months:</strong> {equipment.warrantyMonths}</p>
          <p><strong>Maintenance Interval:</strong> {equipment.maintenanceIntervalDays} days</p>
          <p><strong>Last Maintenance:</strong> {equipment.lastMaintenanceDate}</p>
          <p><strong>Location:</strong> {equipment.location}</p>
          <p><strong>Notes:</strong> {equipment.notes}</p>

          <div className="flex gap-4 mt-4">
            <button onClick={() => setIsEditing(true)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Edit</button>
            <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Delete</button>
          </div>
        </div>
      )}

      {/* REMOVED: No longer directly rendering AddNonAvailabilityModal here */}
      {/* <div className="mt-10">
        <AddNonAvailabilityModal equipmentId={equipmentId} onSuccess={() => {}} />
      </div> */}

      {/* ✅ Availability Calendar */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Availability Calendar</h2>
        {/* Pass fetchSlots as a prop to AvailabilityCalendar so it can trigger a refresh */}
        <AvailabilityCalendar equipmentId={equipmentId} onSlotAdded={fetchSlots} />
      </div>

      {/* ✅ All Non-Availability Slots */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">All Non‑Availability Slots</h2>
        {slotsLoading ? (
          <p className="text-gray-500">Loading slots...</p>
        ) : slotsError ? (
          <p className="text-red-500">{slotsError}</p>
        ) : nonAvailabilitySlots.length === 0 ? (
          <p className="text-gray-600">No non-availability slots found.</p>
        ) : (
          <ul className="space-y-2">
            {nonAvailabilitySlots.map((slot) => (
              <li key={slot.id} className="border border-gray-300 rounded-md p-3 bg-gray-50">
                <div className="font-medium">{slot.type || "UNAVAILABLE"}</div>
                <div className="text-sm text-gray-700">
                  {new Date(slot.startTime).toLocaleString()} — {new Date(slot.endTime).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}




















