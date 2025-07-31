'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { format, parseISO, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import {
  FaUserCircle,
  FaProjectDiagram,
  FaCalendarCheck,
  FaTools,
  FaCertificate,
  FaUserTie,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaCalendarAlt,
  FaExclamationCircle,
} from 'react-icons/fa';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

// --- Reusable Components ---
// Reusable Circular Progress component
const CircularProgress = ({ percentage }) => {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-28 h-28">
      <svg className="w-full h-full transform -rotate-90">
        <circle
          className="text-gray-200"
          strokeWidth="8"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="60"
          cy="60"
        />
        <circle
          className="text-indigo-500"
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="60"
          cy="60"
          style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
        />
      </svg>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
        <span className="text-xl font-bold text-gray-800">{percentage}%</span>
      </div>
    </div>
  );
};

// Reusable DetailItem component
const DetailItem = ({ icon, label, value }) => (
  <div className="flex items-center text-sm text-gray-700">
    <div className="flex items-center justify-center w-6 h-6 mr-2 text-indigo-500 rounded-full bg-indigo-50">
      {icon}
    </div>
    <span className="font-medium mr-1.5">{label}:</span>
    <p>{value || '-'}</p>
  </div>
);

// --- Main Dashboard Component ---
export default function WorkerDashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Chart data state
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Upcoming Tasks This Week', font: { size: 16, weight: 'bold' } },
    },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true, max: 10, ticks: { precision: 0 } },
    },
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }
        const headers = { Authorization: `Bearer ${token}` };
        const [profileRes, projectsRes, assignmentsRes] = await Promise.all([
          axios.get('http://localhost:8080/api/user/my-profile', { headers }),
          axios.get('http://localhost:8080/api/worker/profile/projects', { headers }),
          axios.get('http://localhost:8080/api/worker/profile/assignments', { headers }),
        ]);

        if (profileRes.data.success && projectsRes.data.success && assignmentsRes.data.success) {
          setProfile(profileRes.data.data);
          setProjects(projectsRes.data.data);
          setAssignments(assignmentsRes.data.data);

          // Process data for the bar chart
          const today = new Date();
          const start = startOfWeek(today, { weekStartsOn: 1 });
          const end = endOfWeek(today, { weekStartsOn: 1 });
          const daysOfWeek = eachDayOfInterval({ start, end });
          const labels = daysOfWeek.map((day) => format(day, 'EEE d'));

          const taskCounts = new Array(7).fill(0);
          assignmentsRes.data.data.forEach((assignment) => {
            const assignmentDate = parseISO(assignment.assignmentStart);
            if (assignmentDate >= start && assignmentDate <= end) {
              const dayIndex = daysOfWeek.findIndex((day) => format(day, 'd') === format(assignmentDate, 'd'));
              if (dayIndex !== -1) {
                taskCounts[dayIndex] += 1;
              }
            }
          });

          setChartData({
            labels,
            datasets: [
              {
                label: 'Tasks',
                data: taskCounts,
                backgroundColor: 'rgba(99, 102, 241, 0.6)',
                borderColor: 'rgba(99, 102, 241, 1)',
                borderWidth: 1,
              },
            ],
          });
        } else {
          throw new Error('Failed to fetch dashboard data.');
        }
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          router.push('/login');
        }
        setError(err.response?.data?.message || err.message || 'An error occurred while fetching data.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mb-4"></div>
        <p className="text-xl font-semibold text-indigo-600">Loading your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
        <div className="bg-white p-8 rounded-xl shadow-md text-center">
          <FaExclamationCircle className="text-red-500 text-4xl mb-4" />
          <p className="text-xl text-red-500 font-semibold mb-4">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center md:text-left mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Welcome, {profile?.username || 'Worker'}!
          </h1>
          <p className="mt-2 text-lg text-gray-600">Here's a quick look at your current assignments and projects.</p>
        </div>

        {/* --- */}
        
        {/* Main Grid for Profile, Projects, and Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Profile Card */}
          <div className="lg:col-span-1 bg-white rounded-2xl shadow-xl p-6 border border-gray-200 transform transition-all hover:scale-[1.01] duration-300">
            <div className="flex items-center space-x-4 mb-4 pb-4 border-b border-gray-200">
              <div className="text-5xl text-indigo-600">
                <FaUserCircle />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{profile?.username}</h3>
                <p className="text-sm text-gray-500">{profile?.roles?.[0]?.name.replace('ROLE_', '')}</p>
              </div>
            </div>
            <div className="space-y-3">
              <DetailItem icon={<FaEnvelope />} label="Email" value={profile?.email} />
              <DetailItem icon={<FaPhone />} label="Phone" value={profile?.phone} />
              <div className="flex items-start text-sm text-gray-700">
                <div className="flex items-center justify-center w-6 h-6 mr-2 text-indigo-500 rounded-full bg-indigo-50">
                  <FaTools />
                </div>
                <span className="font-medium mr-1.5 min-w-max">Skills:</span>
                <div className="flex flex-wrap gap-2">
                  {profile?.skills?.length > 0 ? (
                    profile.skills.map((skill, index) => (
                      <span key={index} className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500">-</p>
                  )}
                </div>
              </div>
              <div className="flex items-start text-sm text-gray-700">
                <div className="flex items-center justify-center w-6 h-6 mr-2 text-indigo-500 rounded-full bg-indigo-50">
                  <FaCertificate />
                </div>
                <span className="font-medium mr-1.5 min-w-max">Certifications:</span>
                <div className="flex flex-wrap gap-2">
                  {profile?.certifications?.length > 0 ? (
                    profile.certifications.map((cert, index) => (
                      <span key={index} className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                        {cert}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500">-</p>
                  )}
                </div>
              </div>
              <div className="flex items-start text-sm text-gray-700">
                <div className="flex items-center justify-center w-6 h-6 mr-2 text-indigo-500 rounded-full bg-indigo-50">
                  <FaUserTie />
                </div>
                <span className="font-medium mr-1.5 min-w-max">Managers:</span>
                <div className="flex flex-col gap-2 w-full mt-2">
                  {profile?.worksUnder?.length > 0 ? (
                    profile.worksUnder.map((manager, index) => (
                      <div key={index} className="bg-gray-100 p-2 rounded-md shadow-sm border border-gray-200">
                        <p className="font-semibold text-gray-900">{manager.username}</p>
                        <p className="text-xs text-gray-600">{manager.email}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {manager.roles.map((role, idx) => (
                            <span key={idx} className="bg-gray-200 text-gray-700 text-xs font-medium px-2 py-0.5 rounded-full">
                              {role.replace('ROLE_', '')}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">-</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bar Chart for Weekly Tasks */}
          <div className="md:col-span-2 bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              <FaCalendarCheck className="inline-block mr-2 text-indigo-600" />
              Weekly Task Overview
            </h3>
            <Bar options={chartOptions} data={chartData} />
          </div>
        </div>

        {/* --- */}

        {/* Projects and Assignments Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Assigned Projects Section */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              <FaProjectDiagram className="inline-block mr-2 text-indigo-600" />
              Assigned Projects
            </h3>
            <div className="space-y-4">
              {projects.length > 0 ? (
                projects.map((project) => (
                  <div
                    key={project.id}
                    onClick={() => router.push(`/dashboard/assignedprojectsforworker/${project.id}`)}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors duration-200 cursor-pointer shadow-sm flex items-center justify-between"
                  >
                    <div>
                      <h4 className="text-lg font-bold text-indigo-700">{project.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                    </div>
                    <CircularProgress percentage={project.completionPercentage} />
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <p>You are not currently assigned to any projects.</p>
                </div>
              )}
            </div>
          </div>

          {/* Current Assignments Section */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              <FaCalendarCheck className="inline-block mr-2 text-indigo-600" />
              My Upcoming Assignments
            </h3>
            <div className="max-h-96 overflow-y-auto space-y-4 pr-2">
              {assignments.length > 0 ? (
                assignments.map((assignment) => (
                  <div key={assignment.assignmentId} className="bg-indigo-50 rounded-xl p-5 border border-indigo-200 shadow-md transition-all duration-300 hover:shadow-lg">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-indigo-600 bg-indigo-100 rounded-full px-3 py-1">
                        Subtask: {assignment.subtaskId}
                      </span>
                      <span className="text-xs text-gray-500">
                        Assigned by: {assignment.assignedByName}
                      </span>
                    </div>
                    <h4 className="text-lg font-bold text-indigo-800">{assignment.subtaskTitle}</h4>
                    <p className="text-sm text-gray-700 mt-1">{assignment.subtaskDescription}</p>
                    <div className="mt-4 space-y-2 text-sm">
                      <div className="flex items-center text-gray-600">
                        <FaProjectDiagram className="mr-2 text-indigo-500" />
                        Project: <span className="font-medium ml-1.5">{assignment.projectTitle}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <FaCalendarAlt className="mr-2 text-indigo-500" />
                        <span className="font-medium">
                          {format(parseISO(assignment.assignmentStart), 'dd MMM yyyy')}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <FaClock className="mr-2 text-indigo-500" />
                        <span className="font-medium">
                          {format(parseISO(assignment.assignmentStart), 'HH:mm')} - {format(parseISO(assignment.assignmentEnd), 'HH:mm')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-6 text-gray-500">
                  <p>You have no current assignments.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}