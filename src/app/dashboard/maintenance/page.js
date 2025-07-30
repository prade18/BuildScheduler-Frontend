'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { format, parseISO, isToday, isPast } from 'date-fns';
import { FaWrench, FaExclamationTriangle, FaBell, FaCheckCircle, FaCalendarTimes, FaSpinner } from 'react-icons/fa';

// Reusable component for displaying an individual alert
const MaintenanceAlertCard = ({ alert }) => {
  const router = useRouter();

  const isOverdue = isPast(parseISO(alert.nextExpectedMaintenanceDate)) && !isToday(parseISO(alert.nextExpectedMaintenanceDate));
  const isDueToday = isToday(parseISO(alert.nextExpectedMaintenanceDate));

  let alertColor, alertIcon, borderColor;
  if (isOverdue) {
    alertColor = 'text-red-700';
    borderColor = 'border-red-500';
    alertIcon = <FaExclamationTriangle />;
  } else if (isDueToday) {
    alertColor = 'text-orange-700';
    borderColor = 'border-orange-500';
    alertIcon = <FaBell />;
  } else {
    alertColor = 'text-yellow-700';
    borderColor = 'border-yellow-500';
    alertIcon = <FaBell />;
  }

  const handleNavigateToDetails = () => {
    router.push(`/dashboard/equipment/details/${alert.equipmentId}`);
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${borderColor} hover:shadow-lg transition-shadow duration-200`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <div className={`p-3 rounded-full ${alertColor} bg-gray-100`}>
            {alertIcon}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{alert.equipmentName}</h3>
            <p className="text-sm text-gray-500">Serial No: {alert.serialNumber}</p>
          </div>
        </div>
        <button
          onClick={handleNavigateToDetails}
          className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
        >
          View Details
        </button>
      </div>

      <div className="mt-4 border-t pt-4">
        <p className={`text-md font-semibold flex items-center ${alertColor}`}>
          <FaWrench className="mr-2" />
          {alert.alertMessage}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 mt-3 text-sm text-gray-700">
          <p>
            <span className="font-medium text-gray-600">Last Maintenance:</span>
            <br />
            {alert.lastMaintenanceDate ? format(parseISO(alert.lastMaintenanceDate), 'dd MMM yyyy') : 'N/A'}
          </p>
          <p>
            <span className="font-medium text-gray-600">Maintenance Interval:</span>
            <br />
            {alert.maintenanceIntervalDays} days
          </p>
          <p className="col-span-1 sm:col-span-2">
            <span className="font-medium text-gray-600">Next Expected:</span>
            <br />
            {format(parseISO(alert.nextExpectedMaintenanceDate), 'dd MMM yyyy')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default function MaintenanceAlertsPage() {
  const router = useRouter();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMaintenanceAlerts();
  }, []);

  const fetchMaintenanceAlerts = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const res = await fetch('http://localhost:8080/api/equipment-manager/maintenance-alerts', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        localStorage.removeItem('token');
        router.push('/login');
        return;
      }

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to fetch maintenance alerts.');
      }

      const data = await res.json();
      if (data.success) {
        setAlerts(data.data);
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
        <p className="mt-4 text-xl font-semibold text-indigo-600">Loading maintenance alerts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 p-6">
        <div className="bg-white p-8 rounded-xl shadow-md text-center">
          <p className="text-xl text-red-500 font-semibold mb-4">Error: {error}</p>
          <button
            onClick={fetchMaintenanceAlerts}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <FaBell className="text-4xl text-indigo-600 mr-4" />
          <h1 className="text-3xl font-extrabold text-gray-900">Maintenance Alerts</h1>
        </div>

        {alerts.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow-md text-center border border-gray-200">
            <FaCheckCircle className="text-5xl text-green-500 mx-auto mb-4" />
            <p className="text-lg font-semibold text-gray-700">No maintenance alerts at this time. All equipment is up to date.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {alerts.map(alert => (
              <MaintenanceAlertCard key={alert.equipmentId} alert={alert} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}