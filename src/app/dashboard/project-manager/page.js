'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  FaUserCircle,
  FaBuilding,
  FaClipboardList,
  FaUsers,
  FaSpinner,
  FaChartBar,
  FaDollarSign,
  FaExclamationTriangle,
  FaCalendarAlt,
} from 'react-icons/fa';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { format } from 'date-fns';

// A reusable dashboard card component
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
          fetch('http://localhost:8080/api/pm/projects/manager?page=0&size=10', { headers }),
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
        const myProjects = projectsData.data.content;

        setProfile(myProfile);
        setProjects(myProjects);

        // Fetch tasks for each project
        const taskPromises = myProjects.map((project) =>
          fetch(`http://localhost:8080/api/pm/projects/${project.id}/main-tasks?page=0&size=10`, { headers })
            .then((res) => res.json())
            .then((data) => data.data.content || [])
            .catch((err) => {
              console.error(`Error fetching tasks for project ${project.id}:`, err);
              return [];
            })
        );

        const allTasks = (await Promise.all(taskPromises)).flat();
        setTasks(allTasks);
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

  const overdueProjects = projects.filter((project) => project.overdue);
  const totalTasks = tasks.length;
  const totalTeamMembers = profile?.managedTeam?.length || 0;
  const userRole = profile?.roles[0]?.name.split('_').slice(1).join(' ');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header and User Profile */}
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 space-y-4 md:space-y-0">
          <div className="flex flex-col">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              Hello, {profile?.username}!
            </h1>
            <p className="text-lg text-blue-700 font-medium capitalize">
              {userRole?.toLowerCase() || 'Project Manager'} Dashboard
            </p>
          </div>
        </header>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DashboardCard
            title="Managed Projects"
            value={projects.length}
            icon={<FaBuilding className="text-2xl" />}
            bgColor="bg-indigo-600"
            textColor="text-white"
          />
          <DashboardCard
            title="Total Team Members"
            value={totalTeamMembers}
            icon={<FaUsers className="text-2xl" />}
            bgColor="bg-green-600"
            textColor="text-white"
          />
          <DashboardCard
            title="Overdue Projects"
            value={overdueProjects.length}
            icon={<FaExclamationTriangle className="text-2xl" />}
            bgColor="bg-red-500"
            textColor="text-white"
          />
        </div>

        {/* Project Progress Chart */}
        <ProjectProgressChart data={projects} />

        {/* Managed Projects Table */}
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200">
          <div className="flex items-center mb-4">
            <FaClipboardList className="text-2xl text-indigo-600 mr-3" />
            <h2 className="text-xl font-bold text-gray-900">
              Managed Projects
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
                    Project Title
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
                    Budget
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Dates
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
                    Key Personnel
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {projects.map((project) => (
                  <tr key={project.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {project.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          project.status === 'PLANNING'
                            ? 'bg-blue-100 text-blue-800'
                            : project.status === 'IN_PROGRESS'
                            ? 'bg-yellow-100 text-yellow-800'
                            : project.status === 'COMPLETED'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {project.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="font-bold">
                        ${project.estimatedBudget?.toFixed(2) || '0.00'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(project.startDate), 'dd MMM yyyy')} -{' '}
                      {format(new Date(project.endDate), 'dd MMM yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="w-24 bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{ width: `${project.completionPercentage}%` }}
                        ></div>
                      </div>
                      <span className="text-xs ml-2">
                        {project.completionPercentage?.toFixed(0) || 0}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="block font-medium">
                        SS: {project.siteSupervisor.username}
                      </span>
                      <span className="block font-medium">
                        EQM: {project.equipmentManager.username}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Managed Team Table */}
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200">
          <div className="flex items-center mb-4">
            <FaUsers className="text-2xl text-blue-600 mr-3" />
            <h2 className="text-xl font-bold text-gray-900">Your Team</h2>
          </div>
          {totalTeamMembers === 0 ? (
            <div className="text-center p-4 text-gray-500">
              You do not have any team members.
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
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Role
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {profile.managedTeam.map((member) => (
                    <tr key={member.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {member.username}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {member.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            member.roles[0] === 'ROLE_SITE_SUPERVISOR'
                              ? 'bg-blue-100 text-blue-800'
                              : member.roles[0] === 'ROLE_EQUIPMENT_MANAGER'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {member.roles[0].split('_').slice(1).join(' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}