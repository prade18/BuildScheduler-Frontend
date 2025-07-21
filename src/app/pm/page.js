'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function PMRegisterPage() {
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
          phone,
          role: 'Project Manager',  // 🔒 No underscores or prefix
        }),
      })

      const data = await res.json()
      if (res.ok) {
        alert('Project Manager registered successfully!')
        //router.push('/login')
        router.push('/')
      } else {
        console.warn('Registration failed:', data)
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
        <h1 className="text-2xl font-bold mb-6 text-center">Register as Project Manager</h1>

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
          className="w-full p-3 border mb-4 rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Register as PM
        </button>
      </form>
    </div>
  )
}
