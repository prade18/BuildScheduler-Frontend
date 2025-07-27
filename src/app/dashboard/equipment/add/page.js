// 'use client';

// import { useState } from 'react';
// import axios from 'axios';

// const AddEquipmentPage = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     model: '',
//     serialNumber: '',
//     type: '',
//     purchasePrice: '',
//     warrantyMonths: '',
//     maintenanceIntervalDays: '',
//     lastMaintenanceDate: '',
//     location: '',
//     notes: '',
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const token = localStorage.getItem('token');

//     try {
//       await axios.post('http://localhost:8080/api/equipment', formData, {
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       alert('✅ Equipment added successfully!');
//       setFormData({
//         name: '',
//         model: '',
//         serialNumber: '',
//         type: '',
//         purchasePrice: '',
//         warrantyMonths: '',
//         maintenanceIntervalDays: '',
//         lastMaintenanceDate: '',
//         location: '',
//         notes: '',
//       });
//     } catch (error) {
//       console.error('Failed to add equipment:', error);
//       alert('❌ Failed to add equipment. Please try again.');
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto p-6 mt-10 bg-white shadow-md rounded-lg">
//       <h1 className="text-2xl font-bold mb-6">Add Equipment</h1>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         {[
//           ['name', 'Equipment Name'],
//           ['model', 'Model'],
//           ['serialNumber', 'Serial Number'],
//           ['type', 'Type'],
//           ['purchasePrice', 'Purchase Price'],
//           ['warrantyMonths', 'Warranty (months)'],
//           ['maintenanceIntervalDays', 'Maintenance Interval (days)'],
//           ['lastMaintenanceDate', 'Last Maintenance Date'],
//           ['location', 'Location'],
//           ['notes', 'Notes'],
//         ].map(([field, label]) => (
//           <div key={field}>
//             <label htmlFor={field} className="block text-sm font-medium text-gray-700">
//               {label}
//             </label>
//             <input
//               type={
//                 field.includes('Date')
//                   ? 'date'
//                   : ['purchasePrice', 'warrantyMonths', 'maintenanceIntervalDays'].includes(field)
//                   ? 'number'
//                   : 'text'
//               }
//               id={field}
//               name={field}
//               value={formData[field]}
//               onChange={handleChange}
//               required={field !== 'notes'}
//               className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//             />
//           </div>
//         ))}

//         <button
//           type="submit"
//           className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
//         >
//           Add Equipment
//         </button>
//       </form>
//     </div>
//   );
// };

// export default AddEquipmentPage;


// 'use client';

// import { useState } from 'react';
// import axios from 'axios';

// const AddEquipmentPage = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     model: '',
//     serialNumber: '',
//     type: '',
//     status: '',
//     purchasePrice: '',
//     warrantyMonths: '',
//     maintenanceIntervalDays: '',
//     lastMaintenanceDate: '',
//     location: '',
//     notes: '',
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const token = localStorage.getItem('token');

//     try {
//       await axios.post('http://localhost:8080/api/equipment', formData, {
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       alert('✅ Equipment added successfully!');
//       setFormData({
//         name: '',
//         model: '',
//         serialNumber: '',
//         type: '',
//         status: '',
//         purchasePrice: '',
//         warrantyMonths: '',
//         maintenanceIntervalDays: '',
//         lastMaintenanceDate: '',
//         location: '',
//         notes: '',
//       });
//     } catch (error) {
//       console.error('Failed to add equipment:', error);
//       alert('❌ Failed to add equipment. Please try again.');
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto p-6 mt-10 bg-white shadow-md rounded-lg">
//       <h1 className="text-2xl font-bold mb-6">Add Equipment</h1>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         {/* Dynamic fields */}
//         {[
//           ['name', 'Equipment Name'],
//           ['model', 'Model'],
//           ['serialNumber', 'Serial Number'],
//           ['type', 'Type'],
//           ['purchasePrice', 'Purchase Price'],
//           ['warrantyMonths', 'Warranty (months)'],
//           ['maintenanceIntervalDays', 'Maintenance Interval (days)'],
//           ['lastMaintenanceDate', 'Last Maintenance Date'],
//           ['location', 'Location'],
//           ['notes', 'Notes'],
//         ].map(([field, label]) => (
//           <div key={field}>
//             <label htmlFor={field} className="block text-sm font-medium text-gray-700">
//               {label}
//             </label>
//             <input
//               type={
//                 field.includes('Date')
//                   ? 'date'
//                   : ['purchasePrice', 'warrantyMonths', 'maintenanceIntervalDays'].includes(field)
//                   ? 'number'
//                   : 'text'
//               }
//               id={field}
//               name={field}
//               value={formData[field]}
//               onChange={handleChange}
//               required={field !== 'notes'}
//               className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//             />
//           </div>
//         ))}

//         {/* Status dropdown */}
//         <div>
//           <label htmlFor="status" className="block text-sm font-medium text-gray-700">
//             Status
//           </label>
//           <select
//             id="status"
//             name="status"
//             value={formData.status}
//             onChange={handleChange}
//             className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//             required
//           >
//             <option value="AVAILABLE">Available</option>
//             <option value="IN_USE">In Use</option>
//             <option value="UNDER_MAINTENANCE">Under Maintenance</option>
//             <option value="DECOMMISSIONED">Decommissioned</option>
//           </select>
//         </div>

//         <button
//           type="submit"
//           className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
//         >
//           Add Equipment
//         </button>
//       </form>
//     </div>
//   );
// };

// export default AddEquipmentPage;


'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function AddEquipmentPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    model: '',
    serialNumber: '',
    type: '',
    purchasePrice: '',
    warrantyMonths: '',
    maintenanceIntervalDays: '',
    location: '',
    notes: '',
    // Do NOT set status initially
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:8080/api/equipment', form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        router.push('/dashboard/equipment');
      } else {
        setError(res.data.message || 'Failed to add equipment');
      }
    } catch (err) {
      setError('Error adding equipment');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Equipment</h2>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Name" name="name" value={form.name} onChange={handleChange} required />
        <Input label="Model" name="model" value={form.model} onChange={handleChange} required />
        <Input label="Serial Number" name="serialNumber" value={form.serialNumber} onChange={handleChange} required />
        <Input label="Type" name="type" value={form.type} onChange={handleChange} />
        <Input label="Purchase Price" name="purchasePrice" type="number" value={form.purchasePrice} onChange={handleChange} />
        <Input label="Warranty (Months)" name="warrantyMonths" type="number" value={form.warrantyMonths} onChange={handleChange} />
        <Input label="Maintenance Interval (Days)" name="maintenanceIntervalDays" type="number" value={form.maintenanceIntervalDays} onChange={handleChange} />
        <Input label="Location" name="location" value={form.location} onChange={handleChange} />
        <Input label="Notes" name="notes" value={form.notes} onChange={handleChange} />

        <div className="flex justify-end">
          <button type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
            Add Equipment
          </button>
        </div>
      </form>
    </div>
  );
}

function Input({ label, name, value, onChange, type = 'text', required = false }) {
  return (
    <div>
      <label className="block text-gray-700 font-medium mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        required={required}
        onChange={onChange}
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
