// 'use client';

// import { useEffect, useState } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import axios from 'axios';

// export default function EditEquipmentPage() {
//   const { equipmentId } = useParams();
//   const router = useRouter();

//   const [equipment, setEquipment] = useState({
//     name: '',
//     model: '',
//     serialNumber: '',
//     type: '',
//     purchasePrice: '',
//     warrantyMonths: '',
//     maintenanceIntervalDays: '',
//     location: '',
//     notes: '',
//   });

//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchEquipment = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const res = await axios.get(`http://localhost:8080/api/equipment/${equipmentId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         if (res.data.success) {
//           setEquipment(res.data.data);
//         } else {
//           setError('Equipment not found');
//         }
//       } catch (err) {
//         setError('Error loading equipment data');
//       }
//     };

//     fetchEquipment();
//   }, [equipmentId]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setEquipment((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleUpdate = async (e) => {
//     e.preventDefault();

//     try {
//       const token = localStorage.getItem('token');
//       const res = await axios.put(`http://localhost:8080/api/equipment/${equipmentId}`, equipment, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (res.data.success) {
//         alert('Equipment updated successfully');
//         router.push(`/dashboard/equipment/details/${equipmentId}`);
//       } else {
//         alert(res.data.message || 'Failed to update equipment');
//       }
//     } catch (err) {
//       alert('Error updating equipment');
//     }
//   };

//   if (error) {
//     return <div className="text-red-600 mt-10 text-center">{error}</div>;
//   }

//   return (
//     <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow rounded-xl">
//       <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Equipment</h2>
//       <form onSubmit={handleUpdate} className="space-y-4">
//         <Input label="Name" name="name" value={equipment.name} onChange={handleChange} />
//         <Input label="Model" name="model" value={equipment.model} onChange={handleChange} />
//         <Input label="Serial Number" name="serialNumber" value={equipment.serialNumber} onChange={handleChange} />
//         <Input label="Type" name="type" value={equipment.type} onChange={handleChange} />
//         <Input label="Purchase Price" name="purchasePrice" type="number" value={equipment.purchasePrice} onChange={handleChange} />
//         <Input label="Warranty (Months)" name="warrantyMonths" type="number" value={equipment.warrantyMonths} onChange={handleChange} />
//         <Input label="Maintenance Interval (Days)" name="maintenanceIntervalDays" type="number" value={equipment.maintenanceIntervalDays} onChange={handleChange} />
//         <Input label="Location" name="location" value={equipment.location} onChange={handleChange} />
//         <TextArea label="Notes" name="notes" value={equipment.notes} onChange={handleChange} />

//         <div className="flex justify-end">
//           <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
//             Save Changes
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

// function Input({ label, name, type = 'text', value, onChange }) {
//   return (
//     <div>
//       <label className="block font-medium text-gray-700 mb-1">{label}</label>
//       <input
//         type={type}
//         name={name}
//         value={value || ''}
//         onChange={onChange}
//         required
//         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//       />
//     </div>
//   );
// }

// function TextArea({ label, name, value, onChange }) {
//   return (
//     <div>
//       <label className="block font-medium text-gray-700 mb-1">{label}</label>
//       <textarea
//         name={name}
//         value={value || ''}
//         onChange={onChange}
//         rows={4}
//         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//       />
//     </div>
//   );
// }

// 'use client';

// import { useEffect, useState } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import axios from 'axios';

// export default function EditEquipmentPage() {
//   const { equipmentId } = useParams();
//   const router = useRouter();

//   const [equipment, setEquipment] = useState({
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
//     notes: ''
//   });

//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchEquipment = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const res = await axios.get(`http://localhost:8080/api/equipment/${equipmentId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         if (res.data.success) {
//           setEquipment(res.data.data);
//         } else {
//           setError('Equipment not found');
//         }
//       } catch (err) {
//         setError('Error loading equipment data');
//       }
//     };

//     fetchEquipment();
//   }, [equipmentId]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setEquipment((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleUpdate = async (e) => {
//     e.preventDefault();

//     try {
//       const token = localStorage.getItem('token');
//       const res = await axios.put(`http://localhost:8080/api/equipment/${equipmentId}`, equipment, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (res.data.success) {
//         alert('✅ Equipment updated successfully');
//         router.push(`/dashboard/equipment/details/${equipmentId}`);
//       } else {
//         alert(res.data.message || 'Failed to update equipment');
//       }
//     } catch (err) {
//       alert('Error updating equipment');
//     }
//   };

//   if (error) {
//     return <div className="text-red-600 mt-10 text-center">{error}</div>;
//   }

//   return (
//     <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow rounded-xl">
//       <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Equipment</h2>

//       <form onSubmit={handleUpdate} className="space-y-4">
//         <Input label="Name" name="name" value={equipment.name} onChange={handleChange} />
//         <Input label="Model" name="model" value={equipment.model} onChange={handleChange} />
//         <Input label="Serial Number" name="serialNumber" value={equipment.serialNumber} onChange={handleChange} />
//         <Input label="Type" name="type" value={equipment.type} onChange={handleChange} />
//         <Input label="Purchase Price" name="purchasePrice" type="number" value={equipment.purchasePrice} onChange={handleChange} />
//         <Input label="Warranty (Months)" name="warrantyMonths" type="number" value={equipment.warrantyMonths} onChange={handleChange} />
//         <Input label="Maintenance Interval (Days)" name="maintenanceIntervalDays" type="number" value={equipment.maintenanceIntervalDays} onChange={handleChange} />
//         <Input label="Last Maintenance Date" name="lastMaintenanceDate" type="date" value={equipment.lastMaintenanceDate} onChange={handleChange} />
//         <Input label="Location" name="location" value={equipment.location} onChange={handleChange} />

//         {/* Status Dropdown */}
//         <div>
//           <label className="block font-medium text-gray-700 mb-1">Status</label>
//           <select
//             name="status"
//             value={equipment.status}
//             onChange={handleChange}
//             required
//             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="">Select Status</option>
//             <option value="AVAILABLE">Available</option>
//             <option value="IN_USE">In Use</option>
//             <option value="UNDER_MAINTENANCE">Under Maintenance</option>
//             <option value="DECOMMISSIONED">Decommissioned</option>
//           </select>
//         </div>

//         <TextArea label="Notes" name="notes" value={equipment.notes} onChange={handleChange} />

//         <div className="flex justify-end">
//           <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
//             Save Changes
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

// function Input({ label, name, type = 'text', value, onChange }) {
//   return (
//     <div>
//       <label className="block font-medium text-gray-700 mb-1">{label}</label>
//       <input
//         type={type}
//         name={name}
//         value={value || ''}
//         onChange={onChange}
//         required
//         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//       />
//     </div>
//   );
// }

// function TextArea({ label, name, value, onChange }) {
//   return (
//     <div>
//       <label className="block font-medium text-gray-700 mb-1">{label}</label>
//       <textarea
//         name={name}
//         value={value || ''}
//         onChange={onChange}
//         rows={4}
//         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//       />
//     </div>
//   );
// }

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';

const EquipmentDetailsPage = () => {
  const { equipmentId } = useParams();
  const router = useRouter();

  const [equipment, setEquipment] = useState({
    name: '',
    model: '',
    serialNumber: '',
    type: '',
    currentOperationalStatus: '',
    purchasePrice: '',
    warrantyMonths: '',
    maintenanceIntervalDays: '',
    lastMaintenanceDate: '',
    location: '',
    notes: ''
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchEquipmentDetails = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(
          `http://localhost:8080/api/equipment/${equipmentId}/details`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        if (response.data.success) {
          setEquipment(response.data.data);
        } else {
          setError('Failed to fetch equipment details');
        }
      } catch (err) {
        setError('Error fetching equipment details');
      } finally {
        setLoading(false);
      }
    };

    fetchEquipmentDetails();
  }, [equipmentId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEquipment((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:8080/api/equipment/${equipmentId}`,
        equipment,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      if (response.data.success) {
        setSuccessMessage('Equipment updated successfully!');
      } else {
        setError('Failed to update equipment.');
      }
    } catch (err) {
      setError('Error updating equipment.');
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Equipment Details</h1>

      {successMessage && (
        <div className="mb-4 text-green-600 font-semibold">{successMessage}</div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { label: 'Name', name: 'name' },
          { label: 'Model', name: 'model' },
          { label: 'Serial Number', name: 'serialNumber' },
          { label: 'Type', name: 'type' },
          { label: 'Purchase Price', name: 'purchasePrice' },
          { label: 'Warranty (Months)', name: 'warrantyMonths' },
          { label: 'Maintenance Interval (Days)', name: 'maintenanceIntervalDays' },
          { label: 'Last Maintenance Date', name: 'lastMaintenanceDate', type: 'date' },
          { label: 'Location', name: 'location' },
          { label: 'Notes', name: 'notes' }
        ].map(({ label, name, type = 'text' }) => (
          <div key={name}>
            <label className="block font-medium text-gray-700 mb-1">{label}</label>
            <input
              type={type}
              name={name}
              value={equipment[name] || ''}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}

        {/* Status Dropdown */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">Status</label>
          <select
            name="currentOperationalStatus"
            value={equipment.currentOperationalStatus}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Status</option>
            <option value="AVAILABLE">Available</option>
            <option value="IN_USE">In Use</option>
            <option value="UNDER_MAINTENANCE">Under Maintenance</option>
            <option value="DECOMMISSIONED">Decommissioned</option>
          </select>
        </div>

        <div className="md:col-span-2 flex justify-end mt-4">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Update Equipment
          </button>
        </div>
      </form>
    </div>
  );
};

export default EquipmentDetailsPage;


