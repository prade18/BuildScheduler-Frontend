'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { format, parseISO, differenceInDays } from 'date-fns';
import {
  FaWrench,
  FaCalendarCheck,
  FaTag,
  FaUserTie,
  FaMapMarkerAlt,
  FaFileAlt,
  FaExclamationTriangle,
  FaChartLine,
  FaCalendarAlt, // ✅ Corrected: was FaCalendarTimes
  FaCheckCircle,
} from 'react-icons/fa';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';

// Reusable DetailItem component for key-value pairs
const DetailItem = ({ icon, label, value }) => (
  <div className="flex items-start text-sm">
    <div className="flex-shrink-0 text-indigo-500 mt-1 mr-3">{icon}</div>
    <div>
      <h3 className="font-semibold text-gray-700 text-sm">{label}:</h3>
      <p className="text-gray-800 font-medium">{value || 'N/A'}</p>
    </div>
  </div>
);

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
    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${bgColor} ${textColor}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );
};

// Availability Chart Component
const AvailabilityChart = ({ assignments }) => {
  if (!assignments || assignments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl">
        <FaChartLine className="mx-auto text-4xl opacity-30" />
        <p className="mt-2 text-sm">No assignment data to display.</p>
      </div>
    );
  }

  const data = assignments.map((assign) => ({
    name: `#${assign.subtask.id}`,
    'Duration (Days)': differenceInDays(parseISO(assign.endTime), parseISO(assign.startTime)),
    fill: '#6366f1',
  }));

  return (
    <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <FaChartLine /> Assignment Duration
      </h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 30 }}>
          <CartesianGrid strokeDasharray="6 6" opacity={0.2} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12 }}
            angle={-20}
            textAnchor="end"
            height={60}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            label={{ value: 'Days', angle: -90, position: 'insideLeft', offset: -10 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
            }}
          />
          <Bar dataKey="Duration (Days)" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default function EquipmentDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { equipmentId } = params;

  const [equipmentDetails, setEquipmentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (equipmentId) {
      fetchEquipmentDetails();
    }
  }, [equipmentId]);

  const fetchEquipmentDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const res = await fetch(`http://localhost:8080/api/equipment/${equipmentId}/details`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        localStorage.removeItem('token');
        router.push('/login');
        return;
      }

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to fetch equipment details.');
      }

      const data = await res.json();
      if (data.success) {
        setEquipmentDetails(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch equipment details.');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-indigo-600">Loading equipment details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 p-6">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md">
          <FaExclamationTriangle className="text-red-500 text-5xl mx-auto mb-4" />
          <p className="text-xl text-red-500 font-semibold mb-4">Error: {error}</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition shadow-md"
          >
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!equipmentDetails) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-xl text-gray-500">No equipment details found.</p>
      </div>
    );
  }

  const {
    name,
    model,
    serialNumber,
    type,
    currentOperationalStatus,
    equipmentManager,
    purchasePrice,
    warrantyMonths,
    maintenanceIntervalDays,
    lastMaintenanceDate,
    location,
    notes,
    maintenanceDue,
    nonAvailableSlots = [],
    assignments = [],
  } = equipmentDetails;

  // Calculate maintenance status
  const lastMaintDate = lastMaintenanceDate ? parseISO(lastMaintenanceDate) : null;
  const nextMaintenance = lastMaintDate
    ? new Date(lastMaintDate.getTime() + maintenanceIntervalDays * 24 * 60 * 60 * 1000)
    : null;
  const daysUntil = nextMaintenance ? differenceInDays(nextMaintenance, new Date()) : null;

  const isDueSoon = daysUntil !== null && daysUntil <= 15 && daysUntil > 0;
  const isOverdue = daysUntil !== null && daysUntil < 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">{name}</h1>
              <p className="text-lg text-gray-600 mt-1">
                <strong>Model:</strong> {model} | <strong>Serial:</strong> {serialNumber}
              </p>
            </div>
            <div className="flex flex-col items-end space-y-3">
              {(maintenanceDue || isOverdue) && (
                <div className="flex items-center space-x-2 bg-red-100 text-red-800 px-4 py-2 rounded-full font-semibold text-sm">
                  <FaExclamationTriangle />
                  <span>Maintenance Overdue!</span>
                </div>
              )}
              {isDueSoon && !maintenanceDue && !isOverdue && (
                <div className="flex items-center space-x-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full font-semibold text-sm">
                  <FaExclamationTriangle />
                  <span>{daysUntil} days until maintenance</span>
                </div>
              )}
              {getStatusBadge(currentOperationalStatus)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Equipment Overview */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <FaWrench /> Equipment Overview
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DetailItem icon={<FaUserTie />} label="Managed By" value={equipmentManager?.username} />
                <DetailItem icon={<FaTag />} label="Purchase Price" value={`$${purchasePrice?.toFixed(2)}`} />
                <DetailItem icon={<FaCalendarCheck />} label="Warranty Period" value={`${warrantyMonths} months`} />
                <DetailItem icon={<FaWrench />} label="Maintenance Interval" value={`${maintenanceIntervalDays} days`} />
                <DetailItem
                  icon={<FaCalendarAlt />}
                  label="Last Maintenance"
                  value={lastMaintenanceDate ? format(parseISO(lastMaintenanceDate), 'dd MMM yyyy') : 'Never'}
                />
                <DetailItem icon={<FaMapMarkerAlt />} label="Location" value={location} />
              </div>
              {notes && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <DetailItem icon={<FaFileAlt />} label="Internal Notes" value={notes} />
                </div>
              )}
            </div>

            {/* Current Assignments */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <FaCheckCircle /> Current Assignments
              </h2>
              {assignments.length > 0 ? (
                <ul className="space-y-4">
                  {assignments.map((assignment) => (
                    <li
                      key={assignment.id}
                      className="bg-indigo-50 p-5 rounded-xl border border-indigo-200 hover:shadow transition"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-bold text-indigo-800">Subtask: {assignment.subtask.title}</h3>
                        <span className="text-xs font-semibold text-gray-600">#{assignment.subtask.id}</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-600">Period:</span>{' '}
                          {format(parseISO(assignment.startTime), 'dd MMM HH:mm')} →{' '}
                          {format(parseISO(assignment.endTime), 'dd MMM HH:mm')}
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Assigned By:</span>{' '}
                          {assignment.assignedBy.username}
                        </div>
                        <div className="md:col-span-2">
                          <span className="font-medium text-gray-600">Notes:</span>{' '}
                          <em className="text-gray-700">{assignment.equipmentNotes || 'None'}</em>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-center py-6 italic">No current assignments.</p>
              )}
            </div>
          </div>

          {/* Right: Chart & Slots */}
          <div className="space-y-8">
            {/* Chart */}
            <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaChartLine /> Usage Overview
              </h3>
              <AvailabilityChart assignments={assignments} />
            </div>

            {/* Non-Available Slots */}
            <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaCalendarAlt /> Scheduled Downtime
              </h3>
              {nonAvailableSlots.length > 0 ? (
                <ul className="space-y-3">
                  {nonAvailableSlots.map((slot) => (
                    <li
                      key={slot.id}
                      className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow transition"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-800">{slot.type}</span>
                        {getStatusBadge(slot.type)}
                      </div>
                      <p className="text-xs text-gray-600 mb-1">
                        <span className="font-medium">From:</span>{' '}
                        {format(parseISO(slot.startTime), 'dd MMM HH:mm')}
                      </p>
                      <p className="text-xs text-gray-600 mb-2">
                        <span className="font-medium">To:</span>{' '}
                        {format(parseISO(slot.endTime), 'dd MMM HH:mm')}
                      </p>
                      {slot.notes && (
                        <p className="text-xs text-gray-500 italic border-t pt-1">"{slot.notes}"</p>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm italic">No scheduled downtime.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}