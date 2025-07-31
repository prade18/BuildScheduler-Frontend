'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaUserCircle, FaBuilding, FaTools, FaBell, FaSpinner, FaChartPie, FaChartBar, FaExclamationTriangle } from 'react-icons/fa';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { format, isPast, parseISO } from 'date-fns';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A442FF'];

const DashboardCard = ({ title, value, icon, bgColor, textColor }) => (
  <div className={`p-6 rounded-2xl shadow-xl flex items-center justify-between transition-transform transform hover:scale-105 ${bgColor} ${textColor}`}>
    <div className="flex items-center space-x-4">
      <div className={`p-3 rounded-full ${bgColor} bg-opacity-20`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium opacity-80">{title}</p>
        <p className="text-3xl font-bold">{value}</p>
      </div>
    </div>
  </div>
);

const MaintenanceChart = ({ data }) => {
  const chartData = Object.entries(data).map(([name, value]) => ({ name, value }));

  return (
    <div className="p-6 bg-white rounded-2xl shadow-xl">
      <div className="flex items-center mb-4">
        <FaChartPie className="text-2xl text-blue-600 mr-3" />
        <h2 className="text-xl font-bold text-gray-900">Equipment Operational Status</h2>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

const ProjectProgressChart = ({ data }) => {
  const chartData = data.map(project => ({
    name: project.title,
    progress: project.completionPercentage,
  }));

  return (
    <div className="p-6 bg-white rounded-2xl shadow-xl">
      <div className="flex items-center mb-4">
        <FaChartBar className="text-2xl text-green-600 mr-3" />
        <h2 className="text-xl font-bold text-gray-900">Project Completion Progress</h2>
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
          <Tooltip formatter={(value) => `${value}%`} />
          <Bar dataKey="progress" fill="#82ca9d" barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [equipment, setEquipment] = useState([]);
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

        const [profileRes, projectsRes, equipmentRes] = await Promise.all([
          fetch('http://localhost:8080/api/user/my-profile', { headers }),
          fetch('http://localhost:8080/api/equipment-manager/projects', { headers }),
          fetch('http://localhost:8080/api/equipment/my-managed', { headers }),
        ]);

        const [profileData, projectsData, equipmentData] = await Promise.all([
          profileRes.json(),
          projectsRes.json(),
          equipmentRes.json(),
        ]);

        if (!profileRes.ok || !projectsRes.ok || !equipmentRes.ok) {
          if (profileRes.status === 401 || projectsRes.status === 401 || equipmentRes.status === 401) {
            localStorage.removeItem('token');
            router.push('/login');
          }
          throw new Error('Failed to fetch dashboard data.');
        }

        setProfile(profileData.data);
        setProjects(projectsData.data);
        setEquipment(equipmentData.data);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
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
        <p className="mt-4 text-2xl font-semibold text-indigo-600">Loading your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 p-6">
        <div className="bg-white p-8 rounded-xl shadow-md text-center">
          <p className="text-xl text-red-500 font-semibold mb-4">Error: {error}</p>
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

  const equipmentStatusCounts = equipment.reduce((acc, eq) => {
    const status = eq.currentOperationalStatus || 'UNKNOWN';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const maintenanceDueEquipment = equipment.filter(eq => eq.maintenanceDue);
  const projectsCount = projects.length;
  const equipmentCount = equipment.length;
  const userRole = profile?.roles[0]?.name.split('_').slice(1).join(' ');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header and User Profile */}
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 space-y-4 md:space-y-0">
          <div className="flex flex-col">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              Welcome, {profile?.username}!
            </h1>
            <p className="text-lg text-indigo-700 font-medium capitalize">
              {userRole?.toLowerCase() || 'Equipment Manager'} Dashboard
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900">Your Project Manager</h3>
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
            title="Managed Equipment"
            value={equipmentCount}
            icon={<FaTools className="text-2xl" />}
            bgColor="bg-indigo-600"
            textColor="text-white"
          />
          <DashboardCard
            title="Maintenance Alerts"
            value={maintenanceDueEquipment.length}
            icon={<FaBell className="text-2xl" />}
            bgColor="bg-yellow-500"
            textColor="text-white"
          />
          <DashboardCard
            title="Active Projects"
            value={projects.length}
            icon={<FaBuilding className="text-2xl" />}
            bgColor="bg-green-600"
            textColor="text-white"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MaintenanceChart data={equipmentStatusCounts} />
          <ProjectProgressChart data={projects} />
        </div>

        {/* Maintenance Alerts Table */}
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200">
          <div className="flex items-center mb-4">
            <FaExclamationTriangle className="text-2xl text-red-600 mr-3" />
            <h2 className="text-xl font-bold text-gray-900">Urgent Maintenance Alerts</h2>
          </div>
          {maintenanceDueEquipment.length === 0 ? (
            <div className="text-center p-4 text-gray-500">
              No equipment requires maintenance at this time.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Equipment Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Serial Number
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Maintenance
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Due In (Days)
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {maintenanceDueEquipment.map((eq) => (
                    <tr key={eq.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {eq.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {eq.serialNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {eq.lastMaintenanceDate ? format(parseISO(eq.lastMaintenanceDate), 'dd MMM yyyy') : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-semibold">
                        Overdue
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