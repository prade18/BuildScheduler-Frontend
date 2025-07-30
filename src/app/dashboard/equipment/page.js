'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { format, parseISO } from 'date-fns';

// Reusable Detail Item (View Mode)
const DetailItem = ({ label, value }) => (
  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm">
    <span className="font-semibold text-gray-600 min-w-[140px]">{label}:</span>
    <span className="text-gray-800">{value || '–'}</span>
  </div>
);

// Delete Confirmation Modal
const DeleteModal = ({ isOpen, onClose, onConfirm, loading, equipmentName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl transform transition-all scale-100">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900">Delete Equipment?</h3>
          <p className="text-gray-600 mt-2 text-sm">
            Are you sure you want to delete <strong>"{equipmentName}"</strong>? This action cannot be undone.
          </p>
        </div>
        <div className="flex justify-end gap-3 mt-5">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition disabled:opacity-60"
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function EquipmentManagerPage() {
  const router = useRouter();
  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', content: '' });

  // Modal & Edit state
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    equipmentId: null,
    equipmentName: '',
    loading: false,
  });

  const [editingEquipment, setEditingEquipment] = useState(null);

  useEffect(() => {
    fetchManagedEquipment();
  }, []);

  const fetchManagedEquipment = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const res = await fetch('http://localhost:8080/api/equipment/my-managed', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        localStorage.removeItem('token');
        router.push('/login');
        return;
      }

      const data = await res.json();
      if (data.success) {
        setEquipments(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch equipment.');
      }
    } catch (error) {
      setMessage({ type: 'error', content: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id, name) => {
    setDeleteModal({ open: true, equipmentId: id, equipmentName: name, loading: false });
  };

  const confirmDelete = async () => {
    const { equipmentId } = deleteModal;
    setDeleteModal((prev) => ({ ...prev, loading: true }));

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:8080/api/equipment/${equipmentId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setEquipments((prev) => prev.filter((eq) => eq.id !== equipmentId));
        setMessage({ type: 'success', content: `✅ "${deleteModal.equipmentName}" deleted successfully.` });
      } else {
        throw new Error(data.message || 'Failed to delete equipment.');
      }
    } catch (error) {
      setMessage({ type: 'error', content: `❌ ${error.message}` });
    } finally {
      setDeleteModal({ open: false, equipmentId: null, equipmentName: '', loading: false });
    }
  };

  const closeDeleteModal = () => {
    setDeleteModal((prev) => ({ ...prev, open: false }));
  };

  const handleViewDetails = (id) => {
    router.push(`/dashboard/equipment/details/${id}`);
  };

  const handleEditClick = (equipment) => {
    setEditingEquipment({ ...equipment });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingEquipment((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setEditingEquipment((prev) => ({
      ...prev,
      [name]: value ? new Date(value).toISOString().split('T')[0] : null,
    }));
  };

  const handleCancelEdit = () => {
    setEditingEquipment(null);
  };

  const handleSaveEdit = async () => {
    const { id, ...updateData } = editingEquipment;

    const body = {
      name: updateData.name,
      model: updateData.model,
      serialNumber: updateData.serialNumber,
      type: updateData.type,
      status: updateData.currentOperationalStatus,
      purchasePrice: parseFloat(updateData.purchasePrice),
      warrantyMonths: parseInt(updateData.warrantyMonths, 10),
      maintenanceIntervalDays: parseInt(updateData.maintenanceIntervalDays, 10),
      lastMaintenanceDate: updateData.lastMaintenanceDate,
      location: updateData.location,
      notes: updateData.notes,
    };

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:8080/api/equipment/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setEquipments((prev) =>
          prev.map((eq) => (eq.id === id ? { ...eq, ...editingEquipment } : eq))
        );
        setEditingEquipment(null);
        setMessage({ type: 'success', content: `✅ "${editingEquipment.name}" updated successfully.` });
      } else {
        throw new Error(data.message || 'Failed to update equipment.');
      }
    } catch (error) {
      setMessage({ type: 'error', content: `❌ ${error.message}` });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-indigo-600">Loading your equipment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 p-4 md:p-8">
      {/* Toast Message */}
      {message.content && (
        <div
          className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium max-w-sm flex items-center justify-between animate-fade-in-up ${
            message.type === 'success'
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
              : 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
          }`}
        >
          {message.content}
          <button
            onClick={() => setMessage({ type: '', content: '' })}
            className="ml-3 font-bold text-lg hover:scale-110 transition"
          >
            &times;
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">🔧 Your Managed Equipment</h1>
          <p className="text-gray-600 mt-2">View, edit, or manage the equipment under your responsibility.</p>
        </div>

        {equipments.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-700">No Equipment Found</h3>
            <p className="text-gray-500 mt-2">You are not managing any equipment yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {equipments.map((eq) => (
              <div
                key={eq.id}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                <div className="p-6 flex-1">
                  {editingEquipment?.id === eq.id ? (
                    // ✏️ Edit Mode – Clean, Labeled Form
                    <div className="space-y-5">
                      <h3 className="text-2xl font-bold text-gray-900 border-b pb-2">✏️ Edit Equipment</h3>

                      {/* Name */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Equipment Name</label>
                        <input
                          name="name"
                          value={editingEquipment.name}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        />
                      </div>

                      {/* Model */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Model</label>
                        <input
                          name="model"
                          value={editingEquipment.model}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        />
                      </div>

                      {/* Serial Number */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Serial Number</label>
                        <input
                          name="serialNumber"
                          value={editingEquipment.serialNumber}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        />
                      </div>

                      {/* Type */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Type</label>
                        <select
                          name="type"
                          value={editingEquipment.type}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                        >
                          <option value="HEAVY_MACHINERY">Heavy Machinery</option>
                          <option value="LIGHT_TOOLS">Light Tools</option>
                          <option value="VEHICLE">Vehicle</option>
                          <option value="OTHER">Other</option>
                        </select>
                      </div>

                      {/* Status */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                        <select
                          name="currentOperationalStatus"
                          value={editingEquipment.currentOperationalStatus}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                        >
                          <option value="AVAILABLE">Available</option>
                          <option value="IN_USE">In Use</option>
                          <option value="UNDER_MAINTENANCE">Under Maintenance</option>
                          <option value="OUT_OF_SERVICE">Out of Service</option>
                        </select>
                      </div>

                      {/* Purchase Price */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Purchase Price ($)</label>
                        <input
                          name="purchasePrice"
                          type="number"
                          step="0.01"
                          value={editingEquipment.purchasePrice}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        />
                      </div>

                      {/* Warranty */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Warranty (Months)</label>
                        <input
                          name="warrantyMonths"
                          type="number"
                          value={editingEquipment.warrantyMonths}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        />
                      </div>

                      {/* Maintenance Interval */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Maintenance Interval (Days)</label>
                        <input
                          name="maintenanceIntervalDays"
                          type="number"
                          value={editingEquipment.maintenanceIntervalDays}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        />
                      </div>

                      {/* Last Maintenance */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Last Maintenance Date</label>
                        <input
                          name="lastMaintenanceDate"
                          type="date"
                          value={editingEquipment.lastMaintenanceDate || ''}
                          onChange={handleDateChange}
                          className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                        />
                      </div>

                      {/* Location */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
                        <input
                          name="location"
                          value={editingEquipment.location}
                          onChange={handleChange}
                          placeholder="e.g., Site A, Warehouse"
                          className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        />
                      </div>

                      {/* Notes */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Notes</label>
                        <textarea
                          name="notes"
                          value={editingEquipment.notes}
                          onChange={handleChange}
                          rows="3"
                          placeholder="Any additional information..."
                          className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition resize-none"
                        />
                      </div>

                      {/* Save & Cancel Buttons */}
                      <div className="flex gap-3 pt-4">
                        <button
                          onClick={handleSaveEdit}
                          className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-2.5 rounded-lg shadow-md transform transition active:scale-95"
                        >
                          ✅ Save Changes
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2.5 rounded-lg transition"
                        >
                          ❌ Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // 📄 View Mode – Clean & Spaced
                    <>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{eq.name}</h3>
                          <p className="text-gray-600"><strong>Model:</strong> {eq.model}</p>
                        </div>
                        {eq.maintenanceDue && (
                          <span className="px-2.5 py-1 text-xs bg-orange-100 text-orange-800 rounded-full font-medium">
                            ⚠️ Due
                          </span>
                        )}
                      </div>

                      <div className="space-y-3 mb-5">
                        <DetailItem label="Serial No." value={eq.serialNumber} />
                        <DetailItem label="Type" value={eq.type.replace(/_/g, ' ')} />
                        <DetailItem label="Status" value={eq.currentOperationalStatus} />
                        <DetailItem label="Location" value={eq.location} />
                        <DetailItem label="Warranty" value={`${eq.warrantyMonths} months`} />
                        <DetailItem label="Purchase Price" value={`$${eq.purchasePrice?.toFixed(2)}`} />
                        {eq.lastMaintenanceDate && (
                          <DetailItem label="Last Maintenance" value={format(parseISO(eq.lastMaintenanceDate), 'dd MMM yyyy')} />
                        )}
                        {eq.notes && <DetailItem label="Notes" value={eq.notes} />}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                        <button
                          onClick={() => handleViewDetails(eq.id)}
                          className="flex-1 px-4 py-2.5 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition"
                        >
                          👁️ View Details
                        </button>
                        <button
                          onClick={() => handleEditClick(eq)}
                          className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDelete(eq.id, eq.name)}
                          className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteModal.open}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        loading={deleteModal.loading}
        equipmentName={deleteModal.equipmentName}
      />
    </div>
  );
}