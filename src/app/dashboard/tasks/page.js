'use client'

import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux' // Assuming you're using Redux for auth token

const WorkerAssignmentsPage = () => {
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { token } = useSelector((state) => state.auth) // Get token from Redux store

  useEffect(() => {
    const fetchAssignments = async () => {
      if (!token) {
        setError("Authentication token not found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('http://localhost:8080/api/worker/profile/assignments', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await res.json();

        if (res.ok && data.success) {
          setAssignments(data.data || []);
        } else {
          setError(data.message || 'Failed to fetch assignments.');
          console.error('API Error:', data.message);
        }
      } catch (err) {
        setError('An error occurred while fetching assignments.');
        console.error('Fetch Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [token]); // Re-run if token changes

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-gray-600">Loading assignments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">My Assigned Tasks</h1>

      {assignments.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-2xl text-gray-600">No tasks assigned to you yet.</p>
          <p className="text-gray-500 mt-2">Check back later or contact your supervisor.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignments.map((assignment) => (
            <div key={assignment.assignmentId} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out border border-gray-200">
              <h2 className="text-2xl font-semibold text-blue-700 mb-2">{assignment.subtaskTitle}</h2>
              <p className="text-gray-700 mb-4">{assignment.subtaskDescription}</p>

              <div className="space-y-2 text-sm text-gray-800">
                <p><strong className="font-medium">Project:</strong> {assignment.projectTitle}</p>
                <p><strong className="font-medium">Main Task:</strong> {assignment.mainTaskTitle}</p>
                <p>
                  <strong className="font-medium">Assigned By:</strong> {assignment.assignedByName}
                </p>
                <p>
                  <strong className="font-medium">Start:</strong> {new Date(assignment.assignmentStart).toLocaleString()}
                </p>
                <p>
                  <strong className="font-medium">End:</strong> {new Date(assignment.assignmentEnd).toLocaleString()}
                </p>
                {assignment.workerNotes && (
                  <p className="mt-3 p-3 bg-blue-50 border-l-4 border-blue-200 text-blue-800 italic rounded">
                    <strong className="font-medium">Your Notes:</strong> {assignment.workerNotes}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default WorkerAssignmentsPage