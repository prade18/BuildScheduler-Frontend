// 'use client';
// import { useEffect, useState } from 'react';
// import axios from 'axios';

// export default function AssignRolesPage() {
//   const [users, setUsers] = useState([]);
//   const [filteredUsers, setFilteredUsers] = useState([]);
//   const [selectedRoles, setSelectedRoles] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [message, setMessage] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const usersPerPage = 10;

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   useEffect(() => {
//     filterUsers();
//   }, [searchTerm, users]);

//   const fetchUsers = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         setMessage('❌ No token found. Please log in.');
//         return;
//       }

//       const response = await axios.get('http://localhost:8080/api/pm/users', {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const usersData = Array.isArray(response.data?.data) ? response.data.data : [];
//       setUsers(usersData);
//     } catch (error) {
//       console.error('Error fetching users:', error);
//       setMessage('❌ Failed to fetch users.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filterUsers = () => {
//     const filtered = users.filter((user) =>
//       user.email.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//     setFilteredUsers(filtered);
//     setCurrentPage(1); // Reset to first page when searching
//   };

//   const handleRoleChange = (email, role) => {
//     setSelectedRoles((prev) => ({ ...prev, [email]: role }));
//   };

//   const assignRole = async (email) => {
//     try {
//       const role = selectedRoles[email];
//       if (!role) {
//         setMessage('❌ Please select a role before assigning.');
//         return;
//       }

//       const token = localStorage.getItem('token');
//       if (!token) {
//         setMessage('❌ No token found. Please log in.');
//         return;
//       }

//       await axios.post(
//         'http://localhost:8080/api/pm/update-role',
//         { email, role },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       setMessage(`✅ Assigned ${role} to ${email}`);
//       fetchUsers();
//     } catch (error) {
//       console.error('Error assigning role:', error);
//       setMessage('❌ Failed to assign role.');
//     }
//   };

//   // Pagination logic
//   const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
//   const indexOfLast = currentPage * usersPerPage;
//   const indexOfFirst = indexOfLast - usersPerPage;
//   const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);

//   return (
//     <div className="p-6 bg-blue-50 min-h-screen">
//       <h1 className="text-2xl font-semibold mb-4 text-blue-900">Assign Roles</h1>

//       {message && (
//         <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 rounded text-sm text-gray-800">
//           {message}
//         </div>
//       )}

//       <div className="mb-4">
//         <input
//           type="text"
//           placeholder="Search by email..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="border px-3 py-2 rounded w-full md:w-1/3 shadow-sm"
//         />
//       </div>

//       {loading ? (
//         <p>Loading users...</p>
//       ) : currentUsers.length === 0 ? (
//         <p>No users found.</p>
//       ) : (
//         <div className="overflow-auto rounded-lg shadow">
//           <table className="min-w-full text-sm text-left bg-white border border-gray-200">
//             <thead className="bg-blue-100 text-blue-800">
//               <tr>
//                 <th className="px-4 py-2 border-b">Email</th>
//                 <th className="px-4 py-2 border-b">Current Role</th>
//                 <th className="px-4 py-2 border-b">Select Role</th>
//                 <th className="px-4 py-2 border-b">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {currentUsers.map((user) => (
//                 <tr key={user.email} className="hover:bg-blue-50">
//                   <td className="px-4 py-2">{user.email}</td>
//                   <td className="px-4 py-2">
//                     <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded text-xs">
//                       {user.role?.replace('ROLE_', '').replaceAll('_', ' ')}
//                     </span>
//                   </td>
//                   <td className="px-4 py-2">
//                     <select
//                       className="border rounded px-2 py-1"
//                       value={selectedRoles[user.email] || ''}
//                       onChange={(e) => handleRoleChange(user.email, e.target.value)}
//                     >
//                       <option value="">-- Select Role --</option>
//                       <option value="SITE_SUPERVISOR">Site Supervisor</option>
//                       <option value="EQUIPMENT_MANAGER">Equipment Manager</option>
//                     </select>
//                   </td>
//                   <td className="px-4 py-2">
//                     <button
//                       onClick={() => assignRole(user.email)}
//                       className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:bg-gray-300"
//                       disabled={!selectedRoles[user.email]}
//                     >
//                       Assign Role
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div className="flex justify-center items-center gap-2 mt-4">
//           <button
//             onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//             className="px-3 py-1 bg-blue-100 rounded hover:bg-blue-200"
//             disabled={currentPage === 1}
//           >
//             ← Prev
//           </button>
//           <span className="text-blue-900 text-sm">
//             Page {currentPage} of {totalPages}
//           </span>
//           <button
//             onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
//             className="px-3 py-1 bg-blue-100 rounded hover:bg-blue-200"
//             disabled={currentPage === totalPages}
//           >
//             Next →
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }



'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AssignRolesPage() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(6);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [selectedRoles, setSelectedRoles] = useState({});

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('❌ No token found. Please log in.');
        return;
      }

      const response = await axios.get('http://localhost:8080/api/pm/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const usersData = Array.isArray(response.data?.data) ? response.data.data : [];
      setUsers(usersData);
      setFilteredUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
      setMessage('❌ Failed to fetch users.');
    } finally {
      setLoading(false);
    }
  };

  const assignRole = async (email) => {
    try {
      const role = selectedRoles[email];
      if (!role) {
        setMessage('❌ Please select a role before assigning.');
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('❌ No token found. Please log in.');
        return;
      }

      await axios.post(
        'http://localhost:8080/api/pm/update-role',
        { email, role },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(`✅ Assigned ${role} to ${email}`);
      fetchUsers();
    } catch (error) {
      console.error('Error assigning role:', error);
      setMessage('❌ Failed to assign role.');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = (email, role) => {
    setSelectedRoles((prev) => ({
      ...prev,
      [email]: role,
    }));
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearch(query);
    setCurrentPage(1);
    setFilteredUsers(users.filter((user) => user.email.toLowerCase().includes(query)));
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <div className="p-6 bg-blue-50 min-h-screen text-gray-800">
      <h1 className="text-3xl font-semibold mb-4 text-blue-800">Assign Roles</h1>

      {message && (
        <div className="mb-4 p-3 rounded border border-yellow-300 bg-yellow-100 text-sm">
          {message}
        </div>
      )}

      <input
        type="text"
        value={search}
        onChange={handleSearch}
        placeholder="Search by email..."
        className="mb-4 px-4 py-2 w-full border border-gray-300 rounded-md bg-white shadow-sm"
      />

      {loading ? (
        <p>Loading users...</p>
      ) : currentUsers.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <>
          <div className="overflow-x-auto bg-white rounded shadow">
            <table className="min-w-full text-sm border">
              <thead className="bg-blue-100">
                <tr>
                  <th className="px-4 py-2 border-b text-left">Email</th>
                  <th className="px-4 py-2 border-b text-left">Current Role</th>
                  <th className="px-4 py-2 border-b text-left">Select Role</th>
                  <th className="px-4 py-2 border-b text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user) => (
                  <tr key={user.email} className="hover:bg-blue-50">
                    <td className="px-4 py-2 border-b">{user.email}</td>
                    <td className="px-4 py-2 border-b">
                      <span className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-700">
                        {user.role?.replace('ROLE_', '').replaceAll('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-2 border-b">
                      <select
                        className="px-3 py-2 rounded-md border border-gray-300 bg-blue-50 text-sm text-gray-700 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                        value={selectedRoles[user.email] || ''}
                        onChange={(e) => handleRoleChange(user.email, e.target.value)}
                      >
                        <option value="">-- Select Role --</option>
                        <option value="SITE_SUPERVISOR">Site Supervisor</option>
                        <option value="EQUIPMENT_MANAGER">Equipment Manager</option>
                      </select>
                    </td>
                    <td className="px-4 py-2 border-b">
                      <button
                        onClick={() => assignRole(user.email)}
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:bg-gray-300"
                        disabled={!selectedRoles[user.email]}
                      >
                        Assign Role
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-6 flex justify-center gap-4 text-sm">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-1 rounded bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
            >
              Prev
            </button>
            <span className="px-2 text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-1 rounded bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}


















