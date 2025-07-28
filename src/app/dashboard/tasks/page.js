'use client'; // This directive makes it a Client Component

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation'; // For navigation (e.g., if you want to click a task and go to its details)

// Import any UI components you might have for displaying tasks
// import TaskCard from '@/components/TaskCard'; // Example if you have a component for individual tasks

export default function MyTasksPage() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter(); // Initialize router

    // In a real application, you would get the workerId from your authentication context
    // For now, let's hardcode it as per your example:
    const workerId = 2; // IMPORTANT: Replace with actual logic to get logged-in user's workerId

    useEffect(() => {
        const fetchMyTasks = async () => {
            setLoading(true);
            setError(null);
            const token = localStorage.getItem('token'); // Retrieve token

            if (!token) {
                setError("Authentication token not found. Please log in.");
                setLoading(false);
                // Optionally redirect to login page
                // router.push('/login');
                return;
            }

            try {
                console.log(`Fetching tasks for worker ID: ${workerId}`);
                console.log(`Using URL: http://localhost:8080/api/worker/assignments/${workerId}`);

                const response = await axios.get(
                    `http://localhost:8080/api/worker/assignments/${workerId}`, // Your backend API endpoint
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setTasks(response.data);
                console.log("Fetched tasks:", response.data);
            } catch (err) {
                console.error("Error fetching my tasks:", err);
                if (err.response) {
                    // Server responded with a status other than 2xx
                    setError(`Failed to load tasks: ${err.response.data.message || err.response.statusText}`);
                    console.error("Backend error response:", err.response.data);
                } else if (err.request) {
                    // Request was made but no response received
                    setError("No response from server. Check network connection.");
                } else {
                    // Something else happened in setting up the request
                    setError(`Error: ${err.message}`);
                }
            } finally {
                setLoading(false);
            }
        };

        if (workerId) { // Only fetch if workerId is available
            fetchMyTasks();
        } else {
            setLoading(false);
            setError("Worker ID not available. Cannot fetch tasks.");
        }
    }, [workerId]); // Re-run if workerId changes

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <p className="text-xl text-gray-700">Loading tasks...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-red-100 text-red-700 p-4">
                <p className="text-xl">Error: {error}</p>
            </div>
        );
    }

    if (tasks.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <p className="text-xl text-gray-700">No tasks assigned to you.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">My Assigned Tasks</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tasks.map((assignment) => (
                    // This is a basic card. You might want to create a separate TaskCard component.
                    <div key={assignment.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                        <div className="p-5">
                            <h2 className="text-xl font-semibold text-indigo-700 mb-2">
                                {/* Assuming 'assignment' has a structure that leads to task name */}
                                {assignment.subtask?.name || 'N/A Subtask'}
                            </h2>
                            <p className="text-gray-600 text-sm mb-1">
                                **Main Task:** {assignment.subtask?.mainTask?.name || 'N/A Main Task'}
                            </p>
                            <p className="text-gray-600 text-sm mb-1">
                                **Project:** {assignment.subtask?.mainTask?.project?.name || 'N/A Project'}
                            </p>
                            <p className="text-gray-600 text-sm mb-1">
                                **Start Time:** {new Date(assignment.startTime).toLocaleString()}
                            </p>
                            <p className="text-gray-600 text-sm mb-4">
                                **End Time:** {new Date(assignment.endTime).toLocaleString()}
                            </p>
                            {assignment.equipmentNotes && (
                                <p className="text-gray-700 text-sm italic">
                                    Notes: {assignment.equipmentNotes}
                                </p>
                            )}
                            {/* Example: Link to detailed view of the subtask or assignment */}
                            {assignment.subtask?.id && (
                                <button
                                    onClick={() => router.push(`/dashboard/equipment-assigned-projects/${assignment.subtask.mainTask.project.id}/main-tasks/${assignment.subtask.mainTask.id}/subtasks/${assignment.subtask.id}`)}
                                    className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200 text-sm"
                                >
                                    View Subtask Details
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}