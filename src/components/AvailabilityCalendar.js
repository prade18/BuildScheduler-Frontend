// "use client";
// import { useState, useEffect } from "react";
// import axios from "axios";
// import AddNonAvailabilityModal from "./AddNonAvailabilityModal";

// export default function AvailabilityCalendar({ equipmentId, onSlotAdded }) { // Accept onSlotAdded prop
//   const [slots, setSlots] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);

//   const fetchSlots = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) return;

//       const res = await axios.get(
//         `http://localhost:8080/api/equipment/${equipmentId}/non-available-slots`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       if (res.data.success) {
//         setSlots(res.data.data);
//       } else {
//         setSlots([]);
//       }
//     } catch (err) {
//       console.error("Backend error:", err);
//       setSlots([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchSlots();
//   }, [equipmentId]);

//   // Handler for when a slot is successfully added via the modal
//   const handleSlotAdded = () => {
//     setShowModal(false); // Close the modal
//     fetchSlots(); // Re-fetch the slots to update the list in the calendar
//     if (onSlotAdded) { // Also call the parent's callback if provided
//       onSlotAdded();
//     }
//   };

//   return (
//     <div className="p-6 bg-white rounded-lg shadow-md">
//       <h2 className="text-xl font-semibold mb-4">Non‑Availability</h2>

//       <button
//         className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//         onClick={() => setShowModal(true)}
//       >
//         Add Maintenance Slot
//       </button>

//       {loading ? (
//         <p className="text-gray-600">Loading...</p>
//       ) : slots.length === 0 ? (
//         <p className="text-gray-500">No maintenance slots found.</p>
//       ) : (
//         <ul className="space-y-2">
//           {slots.map((s) => (
//             <li key={s.id} className="border-b pb-2">
//               <span className="font-medium">{s.type}</span>:{" "}
//               {new Date(s.startTime).toLocaleString()} –{" "}
//               {new Date(s.endTime).toLocaleString()}
//             </li>
//           ))}
//         </ul>
//       )}

//       {showModal && (
//         <AddNonAvailabilityModal
//           equipmentId={equipmentId}
//           onClose={handleSlotAdded} // Use the new handler here
//         />
//       )}
//     </div>
//   );
// }

"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import AddNonAvailabilityModal from "./AddNonAvailabilityModal"; // This modal will now handle edit too

export default function AvailabilityCalendar({ equipmentId, onSlotAdded }) {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false); // Renamed for clarity
  const [editingSlot, setEditingSlot] = useState(null); // State to hold the slot being edited

  const fetchSlots = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get(
        `http://localhost:8080/api/equipment/${equipmentId}/non-available-slots`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setSlots(res.data.data);
      } else {
        setSlots([]);
      }
    } catch (err) {
      console.error("Backend error:", err);
      setSlots([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, [equipmentId]);

  const handleSlotModalClose = () => {
    setShowAddModal(false); // Close add modal
    setEditingSlot(null); // Clear editing slot
    fetchSlots(); // Re-fetch slots to update the list
    if (onSlotAdded) {
      onSlotAdded(); // Notify parent (EquipmentDetailsPage) to refresh its list too
    }
  };

  const handleEditClick = (slot) => {
    setEditingSlot(slot); // Set the slot to be edited
    setShowAddModal(true); // Open the modal
  };

  const handleDeleteSlot = async (slotId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this non-availability slot?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:8080/api/equipment/${equipmentId}/non-available-slots/${slotId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Non-availability slot deleted successfully!");
      fetchSlots(); // Refresh the list
      if (onSlotAdded) { // Also notify parent to refresh its list
        onSlotAdded();
      }
    } catch (err) {
      console.error("Error deleting slot:", err);
      alert("Failed to delete slot. Please try again.");
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Non‑Availability</h2>

      <button
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={() => { setShowAddModal(true); setEditingSlot(null); }} // Clear editing slot when opening for add
      >
        Add Maintenance Slot
      </button>

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : slots.length === 0 ? (
        <p className="text-gray-500">No maintenance slots found.</p>
      ) : (
        <ul className="space-y-2">
          {slots.map((s) => (
            <li key={s.id} className="border border-gray-300 rounded-md p-3 bg-gray-50 flex justify-between items-center">
              <div>
                <div className="font-medium">{s.type}</div>
                <div className="text-sm text-gray-700">
                  {new Date(s.startTime).toLocaleString()} –{" "}
                  {new Date(s.endTime).toLocaleString()}
                </div>
                {s.notes && <div className="text-sm text-gray-600 italic">Notes: {s.notes}</div>}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditClick(s)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteSlot(s.id)}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {showAddModal && (
        <AddNonAvailabilityModal
          equipmentId={equipmentId}
          slot={editingSlot} // Pass the slot data if in edit mode
          onClose={handleSlotModalClose}
        />
      )}
    </div>
  );
}