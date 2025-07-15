// 'use client'

// import { useState, useEffect } from 'react'
// import { useRouter } from 'next/navigation'
// import { useDispatch } from 'react-redux'
// import { loginSuccess } from '../../redux/authSlice'


// export default function RegisterPage() {
//   const router = useRouter()

//   const [username, setUsername] = useState('')
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [phone, setPhone] = useState('')
//   const [roles, setRoles] = useState([])
//   const [selectedRole, setSelectedRole] = useState('')

//   useEffect(() => {
//     const fetchRoles = async () => {
//       try {
//         const res = await fetch('http://localhost:8080/api/roles')
//         const data = await res.json()
//         if (res.ok && Array.isArray(data.data)) {
//           setRoles(data.data)
//         } else {
//           console.error('Failed to fetch roles:', data.message)
//         }
//       } catch (err) {
//         console.error('Error fetching roles:', err)
//       }
//     }

//     fetchRoles()
//   }, [])

// //   const handleSubmit = async (e) => {
// //     e.preventDefault()
// //     try {
// //       const res = await fetch('http://localhost:8080/auth/register', {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify({
// //           username,
// //           email,
// //           password,
// //           phone,
// //           role: selectedRole,
// //         }),
// //       })

// //       const data = await res.json()
// //       if (res.ok) {
// //         alert('Registration successful!')
// //         //router.push('/login')
// //         router.push('/')

// //       } else {
// //         alert(data.message || 'Registration failed')
// //       }
// //     } catch (err) {
// //       alert('Something went wrong during registration')
// //     }
// //   }
//      const handleSubmit = async (e) => {
//   e.preventDefault()
//   try {
//     const res = await fetch('http://localhost:8080/auth/register', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         username,
//         email,
//         password,
//         phone,
//         role: selectedRole,
//       }),
//     })

//     const data = await res.json()
//     if (res.ok) {
//       // ✅ Save token to Redux
//       dispatch(loginSuccess(data.data.token))
//       router.push('/') // ✅ Go to Home
//     } else {
//       alert(data.message || 'Registration failed')
//     }
//   } catch (err) {
//     alert('Something went wrong during registration')
//   }
// }


//   // Helper to format ROLE_PROJECT_MANAGER → Project Manager
//   const formatRole = (roleName) => {
//     return roleName
//       .replace('ROLE_', '')
//       .split('_')
//       .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
//       .join(' ')
//   }

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-100">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
//       >
//         <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>

//         <input
//           type="text"
//           placeholder="Username"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//           required
//           className="w-full p-3 border mb-4 rounded"
//         />

//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//           className="w-full p-3 border mb-4 rounded"
//         />

//         <input
//           type="password"
//           placeholder="Password (min 8 chars)"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//           className="w-full p-3 border mb-4 rounded"
//         />

//         <input
//           type="tel"
//           placeholder="Phone (+91xxxxxxxxxx)"
//           value={phone}
//           onChange={(e) => setPhone(e.target.value)}
//           required
//           className="w-full p-3 border mb-4 rounded"
//         />

//         <select
//           value={selectedRole}
//           onChange={(e) => setSelectedRole(e.target.value)}
//           required
//           className="w-full p-3 border mb-4 rounded"
//         >
//           <option value="">Select Role</option>
//           {roles.map((role) => (
//             <option key={role.id} value={role.name}>
//               {formatRole(role.name)}
//             </option>
//           ))}
//         </select>

//         <button
//           type="submit"
//           className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
//         >
//           Register
//         </button>
//       </form>
//     </div>
//   )
// }






// 'use client'

// import { useState, useEffect } from 'react'
// import { useRouter } from 'next/navigation'

// export default function RegisterPage() {
//   const router = useRouter()

//   const [username, setUsername] = useState('')
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [phone, setPhone] = useState('')
//   const [roles, setRoles] = useState([])
//   const [selectedRole, setSelectedRole] = useState('')

//   useEffect(() => {
//     const fetchRoles = async () => {
//       try {
//         const res = await fetch('http://localhost:8080/api/roles')
//         const data = await res.json()
//         if (res.ok && Array.isArray(data.data)) {
//           setRoles(data.data)
//         } else {
//           console.error('Failed to fetch roles:', data.message)
//         }
//       } catch (err) {
//         console.error('Error fetching roles:', err)
//       }
//     }

//     fetchRoles()
//   }, [])

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     try {
//       const res = await fetch('http://localhost:8080/auth/register', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           username,
//           email,
//           password,
//           phone,
//           role: selectedRole,
//         }),
//       })

//       const data = await res.json()
//       if (res.ok) {
//         alert('Registration successful!')
//         router.push('/?registered=true')  // <-- Redirect with query param here
//       } else {
//         console.warn('Register failed:', data)
//         alert(data.message || 'Registration failed')
//       }
//     } catch (err) {
//       console.error('Error during registration:', err)
//       alert('Something went wrong during registration')
//     }
//   }

//   const formatRole = (roleName) =>
//     roleName
//       .replace('ROLE_', '')
//       .split('_')
//       .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
//       .join(' ')

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-100">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
//       >
//         <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>

//         <input
//           type="text"
//           placeholder="Username"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//           required
//           className="w-full p-3 border mb-4 rounded"
//         />

//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//           className="w-full p-3 border mb-4 rounded"
//         />

//         <input
//           type="password"
//           placeholder="Password (min 8 chars)"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//           className="w-full p-3 border mb-4 rounded"
//         />

//         <input
//           type="tel"
//           placeholder="Phone (+91xxxxxxxxxx)"
//           value={phone}
//           onChange={(e) => setPhone(e.target.value)}
//           required
//           className="w-full p-3 border mb-4 rounded"
//         />

//         <select
//           value={selectedRole}
//           onChange={(e) => setSelectedRole(e.target.value)}
//           required
//           className="w-full p-3 border mb-4 rounded"
//         >
//           <option value="">Select Role</option>
//           {roles.map((role) => (
//             <option key={role.id} value={role.name}>
//               {formatRole(role.name)}
//             </option>
//           ))}
//         </select>

//         <button
//           type="submit"
//           className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
//         >
//           Register
//         </button>
//       </form>
//     </div>
//   )
// }




'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch('http://localhost:8080/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          email,
          password,
          phone
          // No `role` field here — backend will assign 'WORKER'
        }),
      })

      const data = await res.json()
      if (res.ok) {
        alert('Registration successful!')
        router.push('/?registered=true')
      } else {
        console.warn('Register failed:', data)
        alert(data.message || 'Registration failed')
      }
    } catch (err) {
      console.error('Error during registration:', err)
      alert('Something went wrong during registration')
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full p-3 border mb-4 rounded"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-3 border mb-4 rounded"
        />

        <input
          type="password"
          placeholder="Password (min 8 chars)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-3 border mb-4 rounded"
        />

        <input
          type="tel"
          placeholder="Phone (+91xxxxxxxxxx)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          className="w-full p-3 border mb-6 rounded"
        />

        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
        >
          Register
        </button>
      </form>
    </div>
  )
}






