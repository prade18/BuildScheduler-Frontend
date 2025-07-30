'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaPlus, FaTools, FaExclamationCircle, FaSpinner } from 'react-icons/fa';

// Helper for status badges
const getStatusBadge = (status) => {
  let bgColor, textColor;
  switch (status) {
    case 'AVAILABLE':
      bgColor = 'bg-green-100';
      textColor = 'text-green-800';
      break;
    case 'MAINTENANCE':
      bgColor = 'bg-yellow-100';
      textColor = 'text-yellow-800';
      break;
    case 'ASSIGNED':
      bgColor = 'bg-blue-100';
      textColor = 'text-blue-800';
      break;
    case 'DECOMMISSIONED':
      bgColor = 'bg-red-100';
      textColor = 'text-red-800';
      break;
    default:
      bgColor = 'bg-gray-100';
      textColor = 'text-gray-800';
      break;
  }
  return (
    <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${bgColor} ${textColor}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );
};

export default function MyManagedEquipmentPage() {
  const router = useRouter();
  const [equipmentList, setEquipmentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchManagedEquipment();
  }, []);

  const fetchManagedEquipment = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const res = await fetch('http://localhost:8080/api/equipment/my-managed', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        localStorage.removeItem('token');
        router.push('/login');
        return;
      }

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to fetch managed equipment.');
      }

      const data = await res.json();
      if (data.success) {
        setEquipmentList(data.data);
      } else {
        throw new Error(data.message || 'Fetch failed.');
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
        <FaSpinner className="animate-spin text-4xl text-indigo-600" />
        <p className="mt-4 text-xl font-semibold text-indigo-600">Loading your managed equipment...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 p-6">
        <div className="bg-white p-8 rounded-xl shadow-md text-center">
          <p className="text-xl text-red-500 font-semibold mb-4">Error: {error}</p>
          <button
            onClick={fetchManagedEquipment}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <FaTools className="text-4xl text-indigo-600 mr-4" />
            <h1 className="text-3xl font-extrabold text-gray-900">My Managed Equipment</h1>
          </div>
        </div>

        {equipmentList.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow-md text-center border border-gray-200">
            <p className="text-lg font-semibold text-gray-700">You are not currently managing any equipment.</p>
            <p className="text-gray-500 mt-2">Add new equipment to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {equipmentList.map((equipment) => (
              <div
                key={equipment.id}
                className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{equipment.name}</h2>
                    <p className="text-sm text-gray-500">Model: {equipment.model}</p>
                  </div>
                  {getStatusBadge(equipment.currentOperationalStatus)}
                </div>
                
                <div className="text-sm text-gray-700 space-y-2">
                  <p>
                    <span className="font-semibold text-gray-600">Serial Number:</span> {equipment.serialNumber}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-600">Type:</span> {equipment.type.replace(/_/g, ' ')}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-600">Location:</span> {equipment.location || 'N/A'}
                  </p>
                </div>
                
                <div className="mt-6 border-t pt-4 flex justify-between items-center">
                  <button
                    onClick={() => router.push(`/dashboard/equipment/details/${equipment.id}`)}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => router.push(`/dashboard/non-availability/equip/${equipment.id}`)}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    <div className="flex items-center">
                      <FaPlus className="mr-2" />
                      Add Non-Availability
                    </div>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}