'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaPlus, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

// Enum values for the dropdown, mapped to user-friendly labels
const equipmentTypes = {
  HEAVY_MACHINERY: "Heavy Machinery",
  POWER_TOOLS: "Power Tools",
  SAFETY_EQUIPMENT: "Safety Equipment",
  VEHICLES: "Vehicles",
  MEASURING_TOOLS: "Measuring Tools",
  OTHER: "Other"
};

const EquipmentAddPage = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    model: '',
    serialNumber: '',
    type: 'OTHER', // Default value
    purchasePrice: '',
    warrantyMonths: '',
    maintenanceIntervalDays: '',
    lastMaintenanceDate: '',
    location: '',
    notes: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      // Prepare the body, converting string inputs to their correct types
      const payload = {
        ...formData,
        purchasePrice: parseFloat(formData.purchasePrice) || 0,
        warrantyMonths: parseInt(formData.warrantyMonths, 10) || 0,
        maintenanceIntervalDays: parseInt(formData.maintenanceIntervalDays, 10) || 0,
        // Ensure empty date string is sent as null if API requires it
        lastMaintenanceDate: formData.lastMaintenanceDate || null,
      };

      const response = await fetch('http://localhost:8080/api/equipment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to add equipment.');
      }

      setSuccessMessage('Equipment added successfully!');
      // Clear the form after a successful submission
      setFormData({
        name: '',
        model: '',
        serialNumber: '',
        type: 'OTHER',
        purchasePrice: '',
        warrantyMonths: '',
        maintenanceIntervalDays: '',
        lastMaintenanceDate: '',
        location: '',
        notes: '',
      });
    } catch (error) {
      console.error('Error adding equipment:', error);
      setErrorMessage(error.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
            <FaPlus className="mr-3 text-indigo-600" />
            Add New Equipment
          </h1>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 text-sm font-medium text-indigo-600 bg-white border border-indigo-600 rounded-md hover:bg-indigo-50 transition-colors"
          >
            Go Back
          </button>
        </div>

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md flex items-center mb-6" role="alert">
            <FaCheckCircle className="mr-3" />
            <span className="block sm:inline">{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md flex items-center mb-6" role="alert">
            <FaExclamationCircle className="mr-3" />
            <span className="block sm:inline">{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {/* Form Fields */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Equipment Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">Model</label>
            <input
              type="text"
              id="model"
              name="model"
              value={formData.model}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            />
          </div>
          
          <div>
            <label htmlFor="serialNumber" className="block text-sm font-medium text-gray-700 mb-1">Serial Number</label>
            <input
              type="text"
              id="serialNumber"
              name="serialNumber"
              value={formData.serialNumber}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Equipment Type</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            >
              {Object.entries(equipmentTypes).map(([key, value]) => (
                <option key={key} value={key}>{value}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="purchasePrice" className="block text-sm font-medium text-gray-700 mb-1">Purchase Price ($)</label>
            <input
              type="number"
              id="purchasePrice"
              name="purchasePrice"
              value={formData.purchasePrice}
              onChange={handleChange}
              step="0.01"
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="warrantyMonths" className="block text-sm font-medium text-gray-700 mb-1">Warranty (Months)</label>
            <input
              type="number"
              id="warrantyMonths"
              name="warrantyMonths"
              value={formData.warrantyMonths}
              onChange={handleChange}
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            />
          </div>
          
          <div>
            <label htmlFor="maintenanceIntervalDays" className="block text-sm font-medium text-gray-700 mb-1">Maintenance Interval (Days)</label>
            <input
              type="number"
              id="maintenanceIntervalDays"
              name="maintenanceIntervalDays"
              value={formData.maintenanceIntervalDays}
              onChange={handleChange}
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="lastMaintenanceDate" className="block text-sm font-medium text-gray-700 mb-1">Last Maintenance Date</label>
            <input
              type="date"
              id="lastMaintenanceDate"
              name="lastMaintenanceDate"
              value={formData.lastMaintenanceDate}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="md:col-span-2 mt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:bg-indigo-400"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding Equipment...
                </>
              ) : (
                'Add Equipment'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EquipmentAddPage;