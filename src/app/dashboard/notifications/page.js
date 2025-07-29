'use client'

import React, { useEffect, useState } from 'react'
import { formatDistanceToNowStrict, parseISO } from 'date-fns'
import { useSelector } from 'react-redux' // Assuming you're using Redux for auth token

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { token } = useSelector((state) => state.auth) // Get token from Redux store

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!token) {
        setError("Authentication token not found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('http://localhost:8080/api/user/notifications', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await res.json();

        if (res.ok && data.success) {
          // Sort notifications by createdAt in descending order (newest first)
          const sortedNotifications = (data.data || []).sort((a, b) =>
            parseISO(b.createdAt).getTime() - parseISO(a.createdAt).getTime()
          );
          setNotifications(sortedNotifications);
        } else {
          setError(data.message || 'Failed to fetch notifications.');
          console.error('API Error:', data.message);
        }
      } catch (err) {
        setError('An error occurred while fetching notifications.');
        console.error('Fetch Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [token]); // Re-run if token changes

  // Function to determine icon based on notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'ASSIGNMENT':
        return '📅'; // Calendar for assignments
      case 'MAINTENANCE':
        return '🛠️'; // Hammer and wrench for maintenance
      case 'APPROVAL':
        return '✅'; // Checkmark for approvals
      case 'SYSTEM':
        return '💻'; // Computer for system notifications
      case 'EQUIPMENT_REQUEST':
        return '⚙️'; // Gear for equipment requests
      case 'EQUIPMENT_REMOVAL':
        return '🗑️'; // Wastebasket for equipment removal
      case 'EQUIPMENT_REQUEST_CANCELLED':
        return '❌'; // Red X for cancelled equipment requests
      default:
        return '🔔'; // Bell for general/unknown notifications
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-xl text-gray-600">Loading your notifications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-xl text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">Your Notifications</h1>

      {notifications.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-md text-center border border-gray-200">
          <p className="text-2xl text-gray-600">You have no new notifications.</p>
          <p className="text-gray-500 mt-2">Check back later for updates.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 flex items-start space-x-4 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex-shrink-0 text-3xl">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="flex-grow">
                <p className="text-gray-800 text-base leading-relaxed">
                  {notification.message}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  <span className="font-medium capitalize">
                    {/* Format type for better readability, e.g., "EQUIPMENT_REQUEST" -> "Equipment request" */}
                    {notification.type.replace(/_/g, ' ').toLowerCase()}
                  </span>{' '}
                  &bull;{' '}
                  {/* Display time relative to now */}
                  {formatDistanceToNowStrict(parseISO(notification.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;