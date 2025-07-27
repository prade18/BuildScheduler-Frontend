// "use client";

// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import axios from "axios";

// export default function EquipmentDetailsPage() {
//   const { equipmentId } = useParams();
//   const router = useRouter();

//   const [equipment, setEquipment] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [editMode, setEditMode] = useState(false);
//   const [formData, setFormData] = useState({});

//   useEffect(() => {
//     const fetchEquipmentDetails = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await axios.get(
//           `http://localhost:8080/api/equipment/${equipmentId}/details`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         if (response.data.success) {
//           setEquipment(response.data.data);
//           setFormData(response.data.data); // for editing
//         }
//       } catch (error) {
//         console.error("Failed to fetch equipment details:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchEquipmentDetails();
//   }, [equipmentId]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleUpdate = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.put(
//         `http://localhost:8080/api/equipment/${equipmentId}`,
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (response.data.success) {
//         setEquipment(response.data.data);
//         setEditMode(false);
//         alert("Equipment updated successfully.");
//       }
//     } catch (error) {
//       console.error("Failed to update equipment:", error);
//       alert("Update failed.");
//     }
//   };

//   const handleDelete = async () => {
//     const confirmed = window.confirm("Are you sure you want to delete this equipment?");
//     if (!confirmed) return;

//     try {
//       const token = localStorage.getItem("token");
//       await axios.delete(
//         `http://localhost:8080/api/equipment/${equipmentId}/delete`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       alert("Equipment deleted successfully.");
//       router.push("/dashboard/equipment");
//     } catch (error) {
//       console.error("Failed to delete equipment:", error);
//       alert("Delete failed.");
//     }
//   };

//   if (loading)
//     return <p className="p-6 text-center text-blue-600 text-lg font-medium">Loading equipment details...</p>;

//   if (!equipment)
//     return <p className="p-6 text-center text-red-600 text-lg font-semibold">No equipment data found.</p>;

//   return (
//     <div className="p-6 max-w-5xl mx-auto bg-white shadow-lg rounded-xl mt-10 border border-gray-200">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-3xl font-bold text-gray-800 border-b pb-2">Equipment Details</h2>
//         <div className="space-x-2">
//           {!editMode && (
//             <button
//               onClick={() => setEditMode(true)}
//               className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
//             >
//               Edit
//             </button>
//           )}
//           {editMode && (
//             <button
//               onClick={handleUpdate}
//               className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
//             >
//               Save
//             </button>
//           )}
//           <button
//             onClick={handleDelete}
//             className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
//           >
//             Delete
//           </button>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {Object.entries({
//           name: "Name",
//           model: "Model",
//           serialNumber: "Serial Number",
//           type: "Type",
//           currentOperationalStatus: "Status",
//           location: "Location",
//           purchasePrice: "Purchase Price",
//           warrantyMonths: "Warranty (Months)",
//           maintenanceIntervalDays: "Maintenance Interval (Days)",
//           lastMaintenanceDate: "Last Maintenance Date",
//           notes: "Notes",
//         }).map(([key, label]) => (
//           <div className="flex flex-col" key={key}>
//             <span className="text-sm text-gray-500">{label}</span>
//             {editMode ? (
//               <input
//                 name={key}
//                 value={formData[key] || ""}
//                 onChange={handleChange}
//                 className="mt-1 px-3 py-2 border rounded-md"
//               />
//             ) : (
//               <span className="text-base font-medium text-gray-800">
//                 {key === "purchasePrice"
//                   ? `₹${equipment[key]?.toLocaleString()}`
//                   : equipment[key] || "N/A"}
//               </span>
//             )}
//           </div>
//         ))}
//       </div>

//       <div className="mt-8 pt-4 border-t">
//         <h3 className="text-xl font-semibold text-gray-700 mb-2">Equipment Manager</h3>
//         <p className="text-gray-600">
//           <span className="font-medium">Username:</span> {equipment.equipmentManager?.username}
//         </p>
//         <p className="text-gray-600">
//           <span className="font-medium">Email:</span> {equipment.equipmentManager?.email}
//         </p>
//       </div>
//     </div>
//   );
// }


// "use client";

// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import axios from "axios";

// export default function EquipmentDetailsPage() {
//   const { equipmentId } = useParams();
//   const router = useRouter();

//   const [equipment, setEquipment] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [editMode, setEditMode] = useState(false);
//   const [formData, setFormData] = useState({});

//   useEffect(() => {
//     const fetchEquipmentDetails = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await axios.get(
//           `http://localhost:8080/api/equipment/${equipmentId}/details`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         if (response.data.success) {
//           setEquipment(response.data.data);
//           setFormData(response.data.data);
//         }
//       } catch (error) {
//         console.error("Failed to fetch equipment details:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchEquipmentDetails();
//   }, [equipmentId]);

//   const handleEditToggle = () => {
//     setEditMode(!editMode);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleUpdate = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       await axios.put(`http://localhost:8080/api/equipment/${equipmentId}`, formData, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       alert("Equipment updated successfully");
//       setEditMode(false);
//       setEquipment(formData);
//     } catch (error) {
//       console.error("Failed to update equipment:", error);
//       alert("Update failed");
//     }
//   };

//   const handleDelete = async () => {
//     const confirmed = confirm("Are you sure you want to delete this equipment?");
//     if (!confirmed) return;

//     try {
//       const token = localStorage.getItem("token");
//       await axios.delete(`http://localhost:8080/api/equipment/${equipmentId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       alert("Equipment deleted successfully");
//       router.push("/dashboard/equipment");
//     } catch (error) {
//       console.error("Failed to delete equipment:", error);
//       alert("Delete failed");
//     }
//   };

//   if (loading) return <p className="p-4 text-gray-700">Loading...</p>;
//   if (!equipment) return <p className="p-4 text-red-500">No data found.</p>;

//   return (
//     <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-md mt-6">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-2xl font-bold">Equipment Details</h2>
//         <div className="space-x-2">
//           <button
//             onClick={handleEditToggle}
//             className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//           >
//             {editMode ? "Cancel" : "Edit"}
//           </button>
//           <button
//             onClick={handleDelete}
//             className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
//           >
//             Delete
//           </button>
//         </div>
//       </div>

//       {editMode ? (
//         <div className="grid grid-cols-2 gap-4">
//           <InputField label="Name" name="name" value={formData.name} onChange={handleInputChange} />
//           <InputField label="Model" name="model" value={formData.model} onChange={handleInputChange} />
//           <InputField label="Serial Number" name="serialNumber" value={formData.serialNumber} onChange={handleInputChange} />
//           <InputField label="Type" name="type" value={formData.type} onChange={handleInputChange} />
//           <InputField label="Location" name="location" value={formData.location} onChange={handleInputChange} />
//           <InputField label="Status" name="currentOperationalStatus" value={formData.currentOperationalStatus} onChange={handleInputChange} />
//           <InputField label="Purchase Price" name="purchasePrice" value={formData.purchasePrice} onChange={handleInputChange} />
//           <InputField label="Warranty Months" name="warrantyMonths" value={formData.warrantyMonths} onChange={handleInputChange} />
//           <InputField label="Maintenance Interval Days" name="maintenanceIntervalDays" value={formData.maintenanceIntervalDays} onChange={handleInputChange} />
//           <InputField label="Last Maintenance Date" name="lastMaintenanceDate" value={formData.lastMaintenanceDate} onChange={handleInputChange} />
//           <InputField label="Notes" name="notes" value={formData.notes || ""} onChange={handleInputChange} />

//           <div className="col-span-2">
//             <button
//               onClick={handleUpdate}
//               className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
//             >
//               Save Changes
//             </button>
//           </div>
//         </div>
//       ) : (
//         <div className="grid grid-cols-2 gap-4">
//           <Detail label="ID" value={equipment.id} />
//           <Detail label="Name" value={equipment.name} />
//           <Detail label="Model" value={equipment.model} />
//           <Detail label="Serial Number" value={equipment.serialNumber} />
//           <Detail label="Type" value={equipment.type} />
//           <Detail label="Status" value={equipment.currentOperationalStatus} />
//           <Detail label="Location" value={equipment.location} />
//           <Detail label="Purchase Price" value={`₹${equipment.purchasePrice}`} />
//           <Detail label="Warranty (Months)" value={equipment.warrantyMonths} />
//           <Detail label="Maintenance Interval (Days)" value={equipment.maintenanceIntervalDays} />
//           <Detail label="Last Maintenance Date" value={equipment.lastMaintenanceDate} />
//           <Detail label="Maintenance Due" value={equipment.maintenanceDue ? "Yes" : "No"} />
//           <Detail label="Notes" value={equipment.notes || "None"} />

//           <div className="col-span-2 mt-4">
//             <h3 className="font-semibold text-lg mb-2">Equipment Manager</h3>
//             <p className="text-gray-700">Username: {equipment.equipmentManager?.username}</p>
//             <p className="text-gray-700">Email: {equipment.equipmentManager?.email}</p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// function Detail({ label, value }) {
//   return (
//     <div>
//       <p className="text-sm text-gray-500">{label}</p>
//       <p className="text-gray-800">{value}</p>
//     </div>
//   );
// }

// function InputField({ label, name, value, onChange }) {
//   return (
//     <div>
//       <label className="block text-sm font-medium text-gray-600">{label}</label>
//       <input
//         type="text"
//         name={name}
//         value={value || ""}
//         onChange={onChange}
//         className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//       />
//     </div>
//   );
// }

// "use client";

// import { useState, useEffect } from "react";
// import { useParams, useRouter } from "next/navigation";
// import axios from "axios";

// const EquipmentDetailsPage = () => {
//   const { equipmentId } = useParams();
//   const router = useRouter();
//   const [equipment, setEquipment] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [formData, setFormData] = useState({});
//   const [statusOptions] = useState(["AVAILABLE", "IN_USE", "UNDER_MAINTENANCE"]);

//   useEffect(() => {
//     const fetchEquipmentDetails = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await axios.get(
//           `http://localhost:8080/api/equipment/${equipmentId}/details`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         if (response.data.success) {
//           setEquipment(response.data.data);
//           setFormData(response.data.data);
//         }
//       } catch (error) {
//         console.error("Error fetching equipment details", error);
//       }
//     };

//     fetchEquipmentDetails();
//   }, [equipmentId]);

//   const handleEdit = () => {
//     setIsEditing(true);
//   };

//   const handleCancel = () => {
//     setIsEditing(false);
//     setFormData(equipment);
//   };

//   const handleDelete = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       await axios.delete(`http://localhost:8080/api/equipment/${equipmentId}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       alert("Equipment deleted successfully");
//       router.push("/dashboard/equipment");
//     } catch (error) {
//       console.error("Error deleting equipment", error);
//       alert("Failed to delete equipment.");
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSaveChanges = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.put(
//         `http://localhost:8080/api/equipment/${equipmentId}`,
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       if (response.data.success) {
//         alert("Equipment updated successfully");
//         setEquipment(response.data.data);
//         setIsEditing(false);
//       } else {
//         alert("Update failed");
//       }
//     } catch (error) {
//       console.error("Error updating equipment", error);
//       alert("Failed to update equipment.");
//     }
//   };

//   if (!equipment) return <p>Loading...</p>;

//   return (
//     <div style={{ padding: "20px" }}>
//       <h1>Equipment Details</h1>

//       {isEditing ? (
//         <div>
//           <label>Name:</label>
//           <input name="name" value={formData.name || ""} onChange={handleChange} />

//           <label>Model:</label>
//           <input name="model" value={formData.model || ""} onChange={handleChange} />

//           <label>Serial Number:</label>
//           <input name="serialNumber" value={formData.serialNumber || ""} onChange={handleChange} />

//           <label>Type:</label>
//           <input name="type" value={formData.type || ""} onChange={handleChange} />

//           <label>Status:</label>
//           <select name="status" value={formData.status || ""} onChange={handleChange}>
//             {statusOptions.map((status) => (
//               <option key={status} value={status}>
//                 {status}
//               </option>
//             ))}
//           </select>

//           <label>Purchase Price:</label>
//           <input
//             name="purchasePrice"
//             type="number"
//             value={formData.purchasePrice || ""}
//             onChange={handleChange}
//           />

//           <label>Warranty Months:</label>
//           <input
//             name="warrantyMonths"
//             type="number"
//             value={formData.warrantyMonths || ""}
//             onChange={handleChange}
//           />

//           <label>Maintenance Interval (Days):</label>
//           <input
//             name="maintenanceIntervalDays"
//             type="number"
//             value={formData.maintenanceIntervalDays || ""}
//             onChange={handleChange}
//           />

//           <label>Last Maintenance Date:</label>
//           <input
//             name="lastMaintenanceDate"
//             type="date"
//             value={formData.lastMaintenanceDate || ""}
//             onChange={handleChange}
//           />

//           <label>Location:</label>
//           <input name="location" value={formData.location || ""} onChange={handleChange} />

//           <label>Notes:</label>
//           <textarea name="notes" value={formData.notes || ""} onChange={handleChange} />

//           <div style={{ marginTop: "10px" }}>
//             <button onClick={handleSaveChanges}>Save Changes</button>
//             <button onClick={handleCancel}>Cancel</button>
//           </div>
//         </div>
//       ) : (
//         <div>
//           <p><strong>Name:</strong> {equipment.name}</p>
//           <p><strong>Model:</strong> {equipment.model}</p>
//           <p><strong>Serial Number:</strong> {equipment.serialNumber}</p>
//           <p><strong>Type:</strong> {equipment.type}</p>
//           <p><strong>Status:</strong> {equipment.status}</p>
//           <p><strong>Purchase Price:</strong> {equipment.purchasePrice}</p>
//           <p><strong>Warranty Months:</strong> {equipment.warrantyMonths}</p>
//           <p><strong>Maintenance Interval:</strong> {equipment.maintenanceIntervalDays} days</p>
//           <p><strong>Last Maintenance Date:</strong> {equipment.lastMaintenanceDate}</p>
//           <p><strong>Location:</strong> {equipment.location}</p>
//           <p><strong>Notes:</strong> {equipment.notes}</p>

//           {equipment.equipmentManager && (
//             <div>
//               <p><strong>Equipment Manager:</strong> {equipment.equipmentManager.username}</p>
//               <p><strong>Manager Email:</strong> {equipment.equipmentManager.email}</p>
//             </div>
//           )}

//           <div style={{ marginTop: "10px" }}>
//             <button onClick={handleEdit}>Edit</button>
//             <button onClick={handleDelete} style={{ marginLeft: "10px", color: "red" }}>
//               Delete
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default EquipmentDetailsPage;






// 'use client';

// import { useEffect, useState } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import axios from 'axios';

// export default function EquipmentDetailsPage() {
//   const { equipmentId } = useParams();
//   const router = useRouter();

//   const [equipment, setEquipment] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [formData, setFormData] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   const statusOptions = ['AVAILABLE', 'IN_USE', 'UNDER_MAINTENANCE', 'DECOMMISSIONED'];

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
//     </div>
//   );
// }





// 'use client';

// import { useEffect, useState } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import axios from 'axios';
// import AvailabilityCalendar from "../../../../../components/AvailabilityCalendar";



// export default function EquipmentDetailsPage() {
//   const { equipmentId } = useParams();
//   const router = useRouter();

//   const [equipment, setEquipment] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [formData, setFormData] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   const statusOptions = ['AVAILABLE', 'IN_USE', 'UNDER_MAINTENANCE', 'DECOMMISSIONED'];

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

//       {/* ✅ Added Calendar Component Below */}
//       <div className="mt-10">
//         <h2 className="text-xl font-semibold mb-4">Availability Calendar</h2>
//         <AvailabilityCalendar equipmentId={equipmentId} />
//       </div>
//     </div>
//   );
// }


// 'use client';

// import { useEffect, useState } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import axios from 'axios';
// import AvailabilityCalendar from "../../../../../components/AvailabilityCalendar";
// import AddNonAvailabilityModal from "../../../../../components/AddNonAvailabilityModal"; // ✅ New import

// export default function EquipmentDetailsPage() {
//   const { equipmentId } = useParams();
//   const router = useRouter();

//   const [equipment, setEquipment] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [formData, setFormData] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   const statusOptions = ['AVAILABLE', 'IN_USE', 'UNDER_MAINTENANCE', 'DECOMMISSIONED'];

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

//       {/* ✅ Add New Slot Button & Modal */}
//       <div className="mt-10">
//         <AddNonAvailabilityModal equipmentId={equipmentId} onSuccess={() => {}} />
//       </div>

//       {/* ✅ Availability Calendar */}
//       <div className="mt-6">
//         <h2 className="text-xl font-semibold mb-4">Availability Calendar</h2>
//         <AvailabilityCalendar equipmentId={equipmentId} />
//       </div>
//     </div>
//   );
// }



// 'use client';

// import { useEffect, useState } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import axios from 'axios';
// import AvailabilityCalendar from "../../../../../components/AvailabilityCalendar";
// import AddNonAvailabilityModal from "../../../../../components/AddNonAvailabilityModal";

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

//     const fetchSlots = async () => {
//       setSlotsLoading(true);
//       try {
//         const token = localStorage.getItem('token');
//         const res = await axios.get(`http://localhost:8080/api/equipment/${equipmentId}/non-available-slots`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         if (res.data.success) {
//           setNonAvailabilitySlots(res.data.data);
//         } else {
//           setSlotsError('No slots found');
//         }
//       } catch (error) {
//         console.error(error);
//         setSlotsError('Failed to fetch non-availability slots');
//       } finally {
//         setSlotsLoading(false);
//       }
//     };

//     fetchDetails();
//     fetchSlots();
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

//       {/* ✅ Add New Slot Button & Modal */}
//       <div className="mt-10">
//         <AddNonAvailabilityModal equipmentId={equipmentId} onSuccess={() => {}} />
//       </div>

//       {/* ✅ Availability Calendar */}
//       <div className="mt-6">
//         <h2 className="text-xl font-semibold mb-4">Availability Calendar</h2>
//         <AvailabilityCalendar equipmentId={equipmentId} />
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





















