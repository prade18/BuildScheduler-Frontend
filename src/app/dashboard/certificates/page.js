// 'use client'

// import { useState, useEffect } from 'react'

// export default function CertificatesPage() {
//   const [certificates, setCertificates] = useState([])
//   const [newCert, setNewCert] = useState('')

//   useEffect(() => {
//     const stored = JSON.parse(localStorage.getItem('certificates')) || []
//     setCertificates(stored)
//   }, [])

//   const handleAdd = () => {
//     if (!newCert.trim()) return
//     const updated = [...certificates, newCert.trim()]
//     setCertificates(updated)
//     localStorage.setItem('certificates', JSON.stringify(updated))
//     setNewCert('')
//   }

//   const handleDelete = (index) => {
//     const updated = certificates.filter((_, i) => i !== index)
//     setCertificates(updated)
//     localStorage.setItem('certificates', JSON.stringify(updated))
//   }

//   return (
//     <div className="space-y-6">
//       <h2 className="text-2xl font-bold">My Certificates</h2>

//       <div className="flex gap-4">
//         <input
//           type="text"
//           value={newCert}
//           onChange={(e) => setNewCert(e.target.value)}
//           placeholder="Enter certificate name"
//           className="border px-3 py-2 rounded w-full"
//         />
//         <button
//           onClick={handleAdd}
//           className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
//         >
//           Add
//         </button>
//       </div>

//       <ul className="space-y-2">
//         {certificates.length === 0 ? (
//           <li className="text-gray-500">No certificates added yet.</li>
//         ) : (
//           certificates.map((cert, index) => (
//             <li
//               key={index}
//               className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded"
//             >
//               <span>{cert}</span>
//               <button
//                 onClick={() => handleDelete(index)}
//                 className="text-red-500 hover:text-red-700 text-sm"
//               >
//                 Delete
//               </button>
//             </li>
//           ))
//         )}
//       </ul>
//     </div>
//   )
// }



'use client'

import { useState, useEffect } from 'react'

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState([])
  const [newCert, setNewCert] = useState('')
  const [loading, setLoading] = useState(true)

  // Fetch certificates from backend
  useEffect(() => {
    const fetchCertifications = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/worker/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })

        const data = await res.json()
        if (res.ok) {
          setCertificates(data.data.certifications || [])
        } else {
          console.error('Failed to fetch certifications:', data.message)
        }
      } catch (err) {
        console.error('Error fetching certifications:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCertifications()
  }, [])

  // Add new certificate
  const handleAdd = async () => {
    if (!newCert.trim()) return
    try {
      const res = await fetch(
        'http://localhost:8080/api/worker/profile/certifications',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(newCert.trim()),
        }
      )

      const data = await res.json()
      if (res.ok) {
        setCertificates([...certificates, newCert.trim()])
        setNewCert('')
      } else {
        alert(data.message || 'Failed to add certificate')
      }
    } catch (err) {
      console.error('Error adding certificate:', err)
    }
  }

  // Delete certificate
  const handleDelete = async (cert) => {
    try {
      const encodedCert = encodeURIComponent(cert)
      const res = await fetch(
        `http://localhost:8080/api/worker/profile/certifications/${encodedCert}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )

      const data = await res.json()
      if (res.ok) {
        setCertificates(certificates.filter((c) => c !== cert))
      } else {
        alert(data.message || 'Failed to delete certificate')
      }
    } catch (err) {
      console.error('Error deleting certificate:', err)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">My Certificates</h2>

      <div className="flex gap-4">
        <input
          type="text"
          value={newCert}
          onChange={(e) => setNewCert(e.target.value)}
          placeholder="Enter certificate name"
          className="border px-3 py-2 rounded w-full"
        />
        <button
          onClick={handleAdd}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Add
        </button>
      </div>

      <ul className="space-y-2">
        {loading ? (
          <li className="text-gray-500">Loading certificates...</li>
        ) : certificates.length === 0 ? (
          <li className="text-gray-500">No certificates added yet.</li>
        ) : (
          certificates.map((cert, index) => (
            <li
              key={index}
              className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded"
            >
              <span>{cert}</span>
              <button
                onClick={() => handleDelete(cert)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Delete
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}

