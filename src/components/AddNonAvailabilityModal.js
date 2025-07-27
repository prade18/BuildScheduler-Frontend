// "use client";
// import { useState } from "react";
// import axios from "axios";

// export default function AddNonAvailabilityModal({ equipmentId, onClose }) {
//   const [startTime, setStartTime] = useState("");
//   const [endTime, setEndTime] = useState("");
//   const [notes, setNotes] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [errorMsg, setErrorMsg] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setErrorMsg("");

//     try {
//       const token = localStorage.getItem("token");
//       await axios.post(
//         `http://localhost:8080/api/equipment/${equipmentId}/non-available-slots`,
//         {
//           startTime,
//           endTime,
//           type: "MAINTENANCE",
//           notes,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       // Call onClose even on success to close the modal and trigger parent refresh
//       if (onClose) {
//         onClose();
//       }
//     } catch (err) {
//       if (err.response?.status === 409) {
//         setErrorMsg("Time slot already conflicts with an existing one.");
//       } else {
//         setErrorMsg("Failed to add slot. Try again.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
//       <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl">
//         <h3 className="text-lg font-semibold mb-4">Add Maintenance Slot</h3>

//         {errorMsg && <p className="text-red-600 mb-2">{errorMsg}</p>}

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium">Start Time</label>
//             <input
//               type="datetime-local"
//               value={startTime}
//               onChange={(e) => setStartTime(e.target.value)}
//               required
//               className="w-full mt-1 p-2 border rounded"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium">End Time</label>
//             <input
//               type="datetime-local"
//               value={endTime}
//               onChange={(e) => setEndTime(e.target.value)}
//               required
//               className="w-full mt-1 p-2 border rounded"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium">Notes (optional)</label>
//             <textarea
//               value={notes}
//               onChange={(e) => setNotes(e.target.value)}
//               className="w-full mt-1 p-2 border rounded"
//               rows={2}
//             />
//           </div>

//           <div className="flex justify-end space-x-2">
//             <button
//               type="button"
//               className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
//               onClick={onClose} // This calls the onClose prop received from the parent
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//               disabled={loading}
//             >
//               {loading ? "Adding..." : "Add Slot"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

"use client";
import { useState, useEffect } from "react"; // Import useEffect
import axios from "axios";

// New prop 'slot' for editing (optional)
export default function AddNonAvailabilityModal({ equipmentId, slot, onClose }) {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Use useEffect to populate form fields if a slot is passed for editing
  useEffect(() => {
    if (slot) {
      // Format dates for datetime-local input
      // Convert ISO string to a format suitable for input type="datetime-local" (YYYY-MM-DDTHH:mm)
      const formatDateTimeLocal = (isoString) => {
        if (!isoString) return '';
        const date = new Date(isoString);
        date.setMinutes(date.getMinutes() - date.getTimezoneOffset()); // Adjust for local timezone
        return date.toISOString().slice(0, 16);
      };

      setStartTime(formatDateTimeLocal(slot.startTime));
      setEndTime(formatDateTimeLocal(slot.endTime));
      setNotes(slot.notes || "");
    } else {
      // Clear fields if no slot is provided (for adding new)
      setStartTime("");
      setEndTime("");
      setNotes("");
    }
  }, [slot]); // Re-run when 'slot' prop changes

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const payload = {
      startTime,
      endTime,
      type: "MAINTENANCE", // Assuming type is always MAINTENANCE for these slots
      notes,
    };

    try {
      const token = localStorage.getItem("token");
      if (slot && slot.id) {
        // If slot.id exists, it's an update operation (PUT)
        await axios.put(
          `http://localhost:8080/api/equipment/${equipmentId}/non-available-slots/${slot.id}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        alert("Non-availability slot updated successfully!");
      } else {
        // Otherwise, it's a new slot creation (POST)
        await axios.post(
          `http://localhost:8080/api/equipment/${equipmentId}/non-available-slots`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        alert("Non-availability slot added successfully!");
      }

      if (onClose) {
        onClose(); // Close the modal and trigger parent refresh
      }
    } catch (err) {
      console.error(err);
      if (err.response?.status === 409) {
        setErrorMsg("Time slot already conflicts with an existing one.");
      } else {
        setErrorMsg(`Failed to ${slot ? 'update' : 'add'} slot. Try again.`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl">
        <h3 className="text-lg font-semibold mb-4">
          {slot ? "Edit Maintenance Slot" : "Add Maintenance Slot"}
        </h3>

        {errorMsg && <p className="text-red-600 mb-2">{errorMsg}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Start Time</label>
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
              className="w-full mt-1 p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">End Time</label>
            <input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
              className="w-full mt-1 p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full mt-1 p-2 border rounded"
              rows={2}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? (slot ? "Updating..." : "Adding...") : (slot ? "Update Slot" : "Add Slot")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}