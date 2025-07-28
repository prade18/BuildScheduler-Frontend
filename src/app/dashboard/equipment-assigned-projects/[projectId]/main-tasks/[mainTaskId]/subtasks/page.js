// app/dashboard/equipment-assigned-projects/[projectId]/main-tasks/[mainTaskId]/subtasks/page.js
'use client'; // This component must be a Client Component

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { format } from 'date-fns'; // Make sure you have date-fns installed: npm install date-fns or yarn add date-fns

export default function SubtasksPage() {
    const params = useParams();
    const router = useRouter();
    // Destructure both dynamic parameters from the URL
    const { projectId, mainTaskId } = params;

    const [subtasks, setSubtasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSubtasks = async () => {
            setLoading(true);
            setError(null); // Clear previous errors
            try {
                const token = localStorage.getItem('token');
                const accessToken = localStorage.getItem('accessToken');
                const authHeader = accessToken || token; // Use either token or accessToken

                if (!authHeader) {
                    router.push('/login'); // Redirect to login if no token is found
                    return;
                }

                // API call to fetch subtasks for the specific mainTaskId
                const res = await fetch(`http://localhost:8080/api/site-supervisor/main-tasks/${mainTaskId}/subtasks`, {
                    headers: {
                        'Authorization': `Bearer ${authHeader}`
                    }
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.message || `Failed to fetch subtasks (Status: ${res.status})`);
                }

                const data = await res.json();
                if (data.success) {
                    setSubtasks(data.data); // Assuming 'data' directly holds the array of subtasks
                } else {
                    throw new Error(data.message || 'Failed to fetch subtasks successfully. Unknown error.');
                }

            } catch (err) {
                console.error("Fetch subtasks error:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        // Only fetch if mainTaskId is available from the URL
        if (mainTaskId) {
            fetchSubtasks();
        }
    }, [mainTaskId, router]); // Depend on mainTaskId and router

    // --- Loading and Error States ---
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-100">
                <p className="text-xl font-semibold text-indigo-600 animate-pulse">Loading subtasks...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-100">
                <p className="text-xl font-semibold text-red-500">
                    Error loading subtasks: {error}
                </p>
            </div>
        );
    }

    // --- Main Component Render ---
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
            <div className="max-w-6xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">
                    Subtasks for Main Task ID: <span className="text-indigo-700">{mainTaskId}</span> (Project ID: <span className="text-indigo-700">{projectId}</span>)
                </h1>
                <button
                    onClick={() => router.back()} // Go back to the previous page (main tasks list)
                    className="mb-6 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-200 flex items-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Main Tasks
                </button>

                {subtasks.length === 0 ? (
                    <p className="text-gray-600 italic text-lg text-center py-8">No subtasks found for this main task.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {subtasks.map(subtask => (
                            <div key={subtask.id} className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200">
                                <h2 className="text-2xl font-semibold text-indigo-800 mb-2">{subtask.title}</h2>
                                <p className="text-gray-700 mb-3 text-sm italic">{subtask.description}</p>

                                <div className="space-y-2 text-sm text-gray-700">
                                    <p><span className="font-medium">Status:</span> <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                        subtask.status === 'PLANNED' ? 'bg-blue-100 text-blue-800' :
                                        subtask.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-800' :
                                        subtask.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                        'bg-gray-100 text-gray-800'
                                    }`}>{subtask.status}</span></p>
                                    <p><span className="font-medium">Priority:</span> {subtask.priority}</p>
                                    <p><span className="font-medium">Estimated Hours:</span> {subtask.estimatedHours}h</p>
                                    <p><span className="font-medium">Required Workers:</span> {subtask.requiredWorkers}</p>
                                    <p>
                                        <span className="font-medium">Planned Start:</span> {subtask.plannedStart ? format(new Date(subtask.plannedStart), 'MMM dd, yyyy HH:mm') : 'N/A'}
                                    </p>
                                    <p>
                                        <span className="font-medium">Planned End:</span> {subtask.plannedEnd ? format(new Date(subtask.plannedEnd), 'MMM dd, yyyy HH:mm') : 'N/A'}
                                    </p>

                                    {subtask.requiredSkills && subtask.requiredSkills.length > 0 && (
                                        <div>
                                            <span className="font-medium">Required Skills:</span>
                                            <ul className="list-disc list-inside ml-4 mt-1 text-gray-600">
                                                {subtask.requiredSkills.map((skill, index) => (
                                                    <li key={index}>{skill}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {subtask.equipmentRequestNotes && subtask.equipmentRequestNotes.trim() !== '' && ( // Check for empty string too
                                        <p><span className="font-medium">Equipment Request Notes:</span> {subtask.equipmentRequestNotes}</p>
                                    )}

                                    {subtask.equipmentNeeds && subtask.equipmentNeeds.length > 0 && (
                                        <div>
                                            <span className="font-medium">Equipment Needs:</span>
                                            <ul className="list-disc list-inside ml-4 mt-1 text-gray-600">
                                                {subtask.equipmentNeeds.map(eq => (
                                                    <li key={eq.id}>
                                                        {eq.name} ({eq.type}, SN: {eq.serialNumber}, Status: {eq.status})
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {subtask.workerAssignments && subtask.workerAssignments.length > 0 && (
                                        <div>
                                            <span className="font-medium">Worker Assignments:</span>
                                            <ul className="list-disc list-inside ml-4 mt-1 text-gray-600">
                                                {subtask.workerAssignments.map(assignment => (
                                                    <li key={assignment.id}>
                                                        <span className="font-medium">{assignment.worker.username}</span> (
                                                        Assigned by: {assignment.assignedBy.username},
                                                        Start: {format(new Date(assignment.assignmentStart), 'MMM dd, yyyy HH:mm')},
                                                        End: {format(new Date(assignment.assignmentEnd), 'MMM dd, yyyy HH:mm')}
                                                        )
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {subtask.equipmentAssignments && subtask.equipmentAssignments.length > 0 && (
                                        <div>
                                            <span className="font-medium">Assigned Equipment:</span>
                                            <ul className="list-disc list-inside ml-4 mt-1 text-gray-600">
                                                {subtask.equipmentAssignments.map(assignment => (
                                                    <li key={assignment.id}>
                                                        <span className="font-medium">{assignment.equipment.name}</span> (
                                                        Assigned to: {assignment.assignedTo.username},
                                                        Start: {format(new Date(assignment.assignmentStart), 'MMM dd, yyyy HH:mm')},
                                                        End: {format(new Date(assignment.assignmentEnd), 'MMM dd, yyyy HH:mm')}
                                                        )
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}