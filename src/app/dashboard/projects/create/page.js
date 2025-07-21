'use client'

import { useState } from 'react'
import axios from 'axios'

export default function CreateProjectPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    estimatedBudget: '',
    location: '',
    priority: ''
  })
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    setLoading(true)

    try {
      await axios.post(
        'http://localhost:8080/api/pm/projects',
        {
          ...formData,
          estimatedBudget: parseFloat(formData.estimatedBudget),
          priority: parseInt(formData.priority)
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setMessage('✅ Project created successfully!')

      // ✅ Clear the form after success
      setFormData({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        estimatedBudget: '',
        location: '',
        priority: ''
      })
    } catch (error) {
      console.error('❌ Error:', error.response?.data || error.message)
      setMessage('❌ Failed to create project.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-5 px-4">
      <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-md border border-gray-200 shadow-xl rounded-2xl p-10">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Create New Project</h1>
        <p className="text-gray-500 mb-8">Define your project details for better planning & scheduling.</p>

        {message && (
          <div
            className={`mb-6 px-4 py-3 rounded-md text-sm font-medium ${
              message.startsWith('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Project Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Eg. Office Building Construction"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Eg. 10-story commercial office space in the downtown area."
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            ></textarea>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Estimated Budget ($)</label>
              <input
                type="number"
                name="estimatedBudget"
                value={formData.estimatedBudget}
                onChange={handleChange}
                placeholder="Eg. 2500000"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Priority (1-4)</label>
              <input
                type="number"
                name="priority"
                min="1"
                max="4"
                value={formData.priority}
                onChange={handleChange}
                placeholder="Eg. 3"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Eg. Downtown Business District"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="pt-4 text-right">
            <button
              type="submit"
              disabled={loading}
              className={`inline-block bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-md ${
                loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
              }`}
            >
              {loading ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}





