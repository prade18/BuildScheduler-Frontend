'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { format, parseISO } from 'date-fns';
import {
  FaCalendarAlt,
  FaTimes,
  FaSpinner,
  FaEdit,
  FaTrash,
  FaPlus,
  FaCheckCircle,
  FaExclamationCircle,
} from 'react-icons/fa';

const nonAvailabilityTypes = {
  MAINTENANCE: 'Maintenance',
  ASSIGNED: 'Assigned',
};

export default function NonAvailabilityCalendarPage() {
  const router = useRouter();
  const params = useParams();
  const { equipmentId } = params;

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [equipmentName, setEquipmentName] = useState('Equipment');

  // Modal & Form States
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({
    startTime: '',
    endTime: '',
    type: 'MAINTENANCE',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (equipmentId) {
      fetchNonAvailabilitySlots();
    }
  }, [equipmentId]);

  const fetchNonAvailabilitySlots = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const res = await fetch(
        `http://localhost:8080/api/equipment/${equipmentId}/non-available-slots`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.status === 401) {
        localStorage.removeItem('token');
        router.push('/login');
        return;
      }

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to fetch non-availability slots.');
      }

      const { data } = await res.json();

      const formattedEvents = data.map((slot) => ({
        id: slot.id,
        title: slot.type.replace(/_/g, ' '),
        start: parseISO(slot.startTime),
        end: parseISO(slot.endTime),
        className: `fc-event-${slot.type.toLowerCase()}`,
        extendedProps: { ...slot },
      }));

      setEvents(formattedEvents);

      // Extract equipment name from first assignment note
      if (data.length > 0 && data[0].notes) {
        const match = data[0].notes.match(/Assigned to subtask: (.+)/);
        if (match) {
          setEquipmentName(match[1]);
        } else {
          setEquipmentName(data[0].type === 'MAINTENANCE' ? 'Maintenance' : 'Assigned Equipment');
        }
      } else {
        setEquipmentName(`Equipment #${equipmentId}`);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  // Handle clicking on a date to **add** a new slot
  const handleDateClick = (dateClickInfo) => {
    const start = new Date(dateClickInfo.date);
    const end = new Date(start.getTime() + 60 * 60 * 1000); // 1 hour later

    setModalMode('add');
    setSelectedEvent(null);
    setFormData({
      startTime: format(start, "yyyy-MM-dd'T'HH:mm"),
      endTime: format(end, "yyyy-MM-dd'T'HH:mm"),
      type: 'MAINTENANCE',
      notes: '',
    });
    setShowModal(true);
  };

  // Handle clicking on an event to **edit** it
  const handleEventClick = (clickInfo) => {
    const event = clickInfo.event;
    setModalMode('edit');
    setSelectedEvent(event);

    setFormData({
      startTime: format(event.start, "yyyy-MM-dd'T'HH:mm"),
      endTime: format(event.end, "yyyy-MM-dd'T'HH:mm"),
      type: event.extendedProps.type,
      notes: event.extendedProps.notes || '',
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
    setFormData({
      startTime: '',
      endTime: '',
      type: 'MAINTENANCE',
      notes: '',
    });
    setStatusMessage({ type: '', text: '' });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Validate form
  const validateForm = () => {
    if (!formData.startTime || !formData.endTime) {
      setStatusMessage({ type: 'error', text: 'Start and end time are required.' });
      return false;
    }
    if (new Date(formData.startTime) >= new Date(formData.endTime)) {
      setStatusMessage({ type: 'error', text: 'End time must be after start time.' });
      return false;
    }
    return true;
  };

  // ✅ Create New Non-Availability Slot
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setStatusMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('token');
      const payload = { ...formData };

      const res = await fetch(
        `http://localhost:8080/api/equipment/${equipmentId}/non-available-slots`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to create slot.');
      }

      setStatusMessage({ type: 'success', text: '✅ Slot created successfully!' });
      fetchNonAvailabilitySlots(); // Refresh

      setTimeout(closeModal, 1500);
    } catch (err) {
      console.error('Create error:', err);
      setStatusMessage({ type: 'error', text: `❌ ${err.message}` });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ Update Existing Slot
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setStatusMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('token');
      const payload = { ...formData };

      const res = await fetch(
        `http://localhost:8080/api/equipment/${equipmentId}/non-available-slots/${selectedEvent.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to update slot.');
      }

      setStatusMessage({ type: 'success', text: '✅ Slot updated successfully!' });
      fetchNonAvailabilitySlots();

      setTimeout(closeModal, 1500);
    } catch (err) {
      console.error('Update error:', err);
      setStatusMessage({ type: 'error', text: `❌ ${err.message}` });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ Delete Slot
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this non-availability slot?')) {
      return;
    }

    setIsSubmitting(true);
    setStatusMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `http://localhost:8080/api/equipment/${equipmentId}/non-available-slots/${selectedEvent.id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to delete slot.');
      }

      setStatusMessage({ type: 'success', text: '🗑️ Slot deleted successfully!' });
      fetchNonAvailabilitySlots();

      setTimeout(closeModal, 1500);
    } catch (err) {
      console.error('Delete error:', err);
      setStatusMessage({ type: 'error', text: `❌ ${err.message}` });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Custom event rendering
  const renderEventContent = (eventInfo) => {
    const isMaintenance = eventInfo.event.extendedProps.type === 'MAINTENANCE';
    const bgColor = isMaintenance ? 'bg-yellow-100' : 'bg-indigo-100';
    const textColor = isMaintenance ? 'text-yellow-800' : 'text-indigo-800';
    const borderColor = isMaintenance ? 'border-yellow-400' : 'border-indigo-400';

    return (
      <div
        className={`p-1 rounded-md text-xs font-semibold truncate ${bgColor} ${textColor} border-l-4 ${borderColor}`}
        style={{ borderLeftWidth: '3px' }}
      >
        {eventInfo.event.title}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
        <FaSpinner className="animate-spin text-4xl text-indigo-600" />
        <p className="mt-4 text-xl font-semibold text-indigo-600">Loading calendar...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 p-6">
        <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-md">
          <p className="text-xl text-red-500 font-semibold mb-4">Error: {error}</p>
          <button
            onClick={fetchNonAvailabilitySlots}
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
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <FaCalendarAlt className="text-4xl text-indigo-600" />
            <h1 className="text-3xl font-extrabold text-gray-900">
              Calendar: {equipmentName}
            </h1>
          </div>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 bg-white border border-indigo-600 rounded-lg hover:bg-indigo-50 transition"
          >
            ← Go Back
          </button>
        </div>

        {/* Calendar */}
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={events}
            eventClick={handleEventClick}
            dateClick={handleDateClick} // ✅ Click to add
            eventContent={renderEventContent}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,dayGridWeek,dayGridDay',
            }}
            height="auto"
            editable={false}
            selectable={false}
            nowIndicator
            // Enable date clicking
            selectMirror
            dayMaxEvents
          />
        </div>
      </div>

      {/* Add/Edit/Delete Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-bold text-gray-900">
                {modalMode === 'add' ? 'Add New Slot' : 'Edit Slot'}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            {statusMessage.text && (
              <div
                className={`p-3 mb-4 rounded-md text-sm flex items-center ${
                  statusMessage.type === 'success'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {statusMessage.type === 'success' ? (
                  <FaCheckCircle className="mr-2" />
                ) : (
                  <FaExclamationCircle className="mr-2" />
                )}
                {statusMessage.text}
              </div>
            )}

            <form onSubmit={modalMode === 'add' ? handleCreate : handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time
                </label>
                <input
                  type="datetime-local"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleFormChange}
                  className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Time
                </label>
                <input
                  type="datetime-local"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleFormChange}
                  className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleFormChange}
                  className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                >
                  {Object.entries(nonAvailabilityTypes).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleFormChange}
                  rows="3"
                  className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                  placeholder="e.g., Scheduled maintenance or assigned task..."
                />
              </div>

              <div className="flex justify-between pt-4 border-t">
                {modalMode === 'edit' && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-60"
                  >
                    <FaTrash /> Delete
                  </button>
                )}
                <div className="flex gap-3 ml-auto">
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={isSubmitting}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <FaSpinner className="animate-spin" /> Saving...
                      </>
                    ) : modalMode === 'add' ? (
                      <>
                        <FaPlus /> Create
                      </>
                    ) : (
                      <>
                        <FaEdit /> Update
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}