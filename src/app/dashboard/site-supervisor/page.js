'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  FaUserCircle,
  FaBuilding,
  FaClipboardList,
  FaBell,
  FaSpinner,
  FaChartPie,
  FaChartBar,
  FaExclamationTriangle,
  FaUserTie,
  FaUsers
} from 'react-icons/fa';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { format, isPast, parseISO } from 'date-fns';

// A color palette for the charts
const CHART_COLORS = {
  PLANNED: '#3B82F6', // Blue
  IN_PROGRESS: '#F59E0B', // Yellow
  COMPLETED: '#10B981', // Green
  DELAYED: '#EF4444', // Red
  OVERDUE: '#DC2626', // Darker Red
};

const DashboardCard = ({ title, value, icon, bgColor, textColor }) => (
  <div
    className={`p-6 rounded-2xl shadow-xl flex items-center justify-between transition-transform transform hover:scale-105 ${bgColor} ${textColor}`}
  >
    <div className="flex items-center space-x-4">
      <div className={`p-3 rounded-full ${bgColor} bg-opacity-20`}>{icon}</div>
      <div>
        <p className="text-sm font-medium opacity-80">{title}</p>
        <p className="text-3xl font-bold">{value}</p>
      </div>
    </div>
  </div>
);

const ProjectProgressChart = ({ data }) => {
  const chartData = data.map((project) => ({
    name: project.title,
    progress: project.completionPercentage,
  }));

  return (
    <div className="p-6 bg-white rounded-2xl shadow-xl">
      <div className="flex items-center mb-4">
        <FaChartBar className="text-2xl text-blue-600 mr-3" />
        <h2 className="text-xl font-bold text-gray-900">
          Project Completion Progress
        </h2>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          layout="vertical"
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" tickFormatter={(value) => `${value}%`} />
          <YAxis dataKey="name" type="category" width={100} />
          <Tooltip formatter={(value) => [`${value}%`, 'Progress']} />
          <Bar dataKey="progress" fill="#3B82F6" barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const TaskStatusChart = ({ data }) => {
  const statusCounts = data.reduce((acc, task) => {
    const status = task.status || 'PLANNED';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(statusCounts).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="p-6 bg-white rounded-2xl shadow-xl">
      <div className="flex items-center mb-4">
        <FaChartPie className="text-2xl text-green-600 mr-3" />
        <h2 className="text-xl font-bold text-gray-900">
          Supervised Task Status
        </h2>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={100}
            dataKey="value"
            label={({ name, percent }) =>
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={CHART_COLORS[entry.name]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const headers = { Authorization: `Bearer ${token}` };

        const [profileRes, projectsRes] = await Promise.all([
          fetch('http://localhost:8080/api/user/my-profile', { headers }),
          fetch('http://localhost:8080/api/site-supervisor/projects', {
            headers,
          }),
        ]);

        const [profileData, projectsData] = await Promise.all([
          profileRes.json(),
          projectsRes.json(),
        ]);

        if (!profileRes.ok || !projectsRes.ok) {
          if (profileRes.status === 401 || projectsRes.status === 401) {
            localStorage.removeItem('token');
            router.push('/login');
          }
          throw new Error('Failed to fetch dashboard data.');
        }

        const myProfile = profileData.data;
        const myProjects = projectsData.data;

        setProfile(myProfile);
        setProjects(myProjects);

        // Fetch tasks for each project and their subtask counts
        const allTasks = await Promise.all(
          myProjects.map(async (project) => {
            const tasksRes = await fetch(
              `http://localhost:8080/api/pm/projects/${project.id}/main-tasks?page=0&size=10`,
              { headers }
            );
            const tasksData = await tasksRes.json();
            const projectTasks = tasksData.data.content || [];

            // For each main task, fetch its subtasks to get a count
            const tasksWithSubtasks = await Promise.all(
              projectTasks.map(async (task) => {
                const subtasksRes = await fetch(
                  `http://localhost:8080/api/site-supervisor/main-tasks/${task.id}/subtasks`,
                  { headers }
                );
                const subtasksData = await subtasksRes.json();
                return {
                  ...task,
                  subtaskCount: subtasksData.data?.length || 0,
                };
              })
            );
            return tasksWithSubtasks;
          })
        );

        setTasks(allTasks.flat());
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
        <FaSpinner className="animate-spin text-5xl text-indigo-600" />
        <p className="mt-4 text-2xl font-semibold text-indigo-600">
          Loading your dashboard...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 p-6">
        <div className="bg-white p-8 rounded-xl shadow-md text-center">
          <p className="text-xl text-red-500 font-semibold mb-4">
            Error: {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const overdueTasks = tasks.filter((task) => task.overdue);
  const supervisedWorkers = profile?.supervisedWorkers || [];
  const userRole = profile?.roles[0]?.name.split('_').slice(1).join(' ');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header and User Profile */}
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 space-y-4 md:space-y-0">
          <div className="flex flex-col">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              Welcome, {profile?.username}!
            </h1>
            <p className="text-lg text-blue-700 font-medium capitalize">
              {userRole?.toLowerCase() || 'Site Supervisor'} Dashboard
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900">
              Your Project Manager
            </h3>
            {profile?.worksUnder && profile.worksUnder.length > 0 ? (
              <p className="text-sm text-gray-600 mt-1">
                {profile.worksUnder[0].username} ({profile.worksUnder[0].email})
              </p>
            ) : (
              <p className="text-sm text-gray-600 mt-1">N/A</p>
            )}
          </div>
        </header>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DashboardCard
            title="Supervised Projects"
            value={projects.length}
            icon={<FaBuilding className="text-2xl" />}
            bgColor="bg-indigo-600"
            textColor="text-white"
          />
          <DashboardCard
            title="Overdue Tasks"
            value={overdueTasks.length}
            icon={<FaExclamationTriangle className="text-2xl" />}
            bgColor="bg-red-500"
            textColor="text-white"
          />
          <DashboardCard
            title="Supervised Workers"
            value={supervisedWorkers.length}
            icon={<FaUserTie className="text-2xl" />}
            bgColor="bg-green-600"
            textColor="text-white"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ProjectProgressChart data={projects} />
          <TaskStatusChart data={tasks} />
        </div>

        {/* Supervised Workers Table */}
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200">
          <div className="flex items-center mb-4">
            <FaUsers className="text-2xl text-blue-600 mr-3" />
            <h2 className="text-xl font-bold text-gray-900">
              Supervised Workers
            </h2>
          </div>
          {supervisedWorkers.length === 0 ? (
            <div className="text-center p-4 text-gray-500">
              No workers are currently assigned to you.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Username
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Email
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {supervisedWorkers.map((worker) => (
                    <tr key={worker.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {worker.username}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {worker.email}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* All Supervised Tasks Table */}
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200">
          <div className="flex items-center mb-4">
            <FaClipboardList className="text-2xl text-indigo-600 mr-3" />
            <h2 className="text-xl font-bold text-gray-900">
              All Supervised Tasks
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Task Title
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Project
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Subtasks
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Completion
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Planned Dates
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tasks.map((task) => (
                  <tr key={task.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {task.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {projects.find((p) => p.id === task.projectId)?.title ||
                        'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          task.status === 'PLANNED'
                            ? 'bg-blue-100 text-blue-800'
                            : task.status === 'IN_PROGRESS'
                            ? 'bg-yellow-100 text-yellow-800'
                            : task.status === 'COMPLETED'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {task.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {task.subtaskCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="w-24 bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{ width: `${task.completionPercentage}%` }}
                        ></div>
                      </div>
                      <span className="text-xs ml-2">
                        {task.completionPercentage.toFixed(0)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {task.plannedStartDate
                        ? format(parseISO(task.plannedStartDate), 'dd MMM')
                        : 'N/A'}{' '}
                      -{' '}
                      {task.plannedEndDate
                        ? format(parseISO(task.plannedEndDate), 'dd MMM yyyy')
                        : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}