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
    priority: '1' // Initialize priority as a string matching the default value
  })
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  // Define priority options for the dropdown
  const priorityOptions = [
    { value: '1', label: 'Low' },
    { value: '2', label: 'Medium' },
    { value: '3', label: 'High' },
    { value: '4', label: 'Critical' },
  ]

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
    setMessage('') // Clear previous messages

    // Basic validation for dates
    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      setMessage('❌ End Date cannot be before Start Date.')
      setLoading(false)
      return
    }

    try {
      await axios.post(
        'http://localhost:8080/api/pm/projects',
        {
          ...formData,
          estimatedBudget: parseFloat(formData.estimatedBudget),
          priority: parseInt(formData.priority) // Ensure priority is sent as an integer
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setMessage('✅ Project created successfully!')

      // Clear the form after success
      setFormData({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        estimatedBudget: '',
        location: '',
        priority: '1' // Reset to default priority
      })
    } catch (error) {
      console.error('❌ Error creating project:', error.response?.data || error.message)
      setMessage('❌ Failed to create project. ' + (error.response?.data?.message || 'Please try again.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-md border border-gray-200 shadow-xl rounded-2xl p-8 sm:p-10">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-2 text-center">Create New Project</h1>
        <p className="text-gray-500 mb-8 text-center text-lg">Define your project details for better planning & scheduling.</p>

        {message && (
          <div
            className={`mb-6 px-5 py-3 rounded-lg text-base font-medium transition-all duration-300 ${
              message.startsWith('✅') ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-red-100 text-red-600 border border-red-300'
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-1">Project Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Eg. Office Building Construction"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Eg. 10-story commercial office space in the downtown area."
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              required
            ></textarea>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="startDate" className="block text-sm font-semibold text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                required
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-semibold text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="estimatedBudget" className="block text-sm font-semibold text-gray-700 mb-1">Estimated Budget ($)</label>
              <input
                type="number"
                id="estimatedBudget"
                name="estimatedBudget"
                value={formData.estimatedBudget}
                onChange={handleChange}
                placeholder="Eg. 2500000"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                required
              />
            </div>
            <div>
              <label htmlFor="priority" className="block text-sm font-semibold text-gray-700 mb-1">Priority</label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none pr-8" // appearance-none to remove default arrow, pr-8 for custom arrow space
                required
              >
                {priorityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {/* Optional: Custom arrow for select input for better cross-browser consistency */}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Eg. Downtown Business District"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              required
            />
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`inline-flex items-center justify-center px-8 py-3 rounded-lg font-semibold text-white shadow-lg transition-all duration-300
                ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 transform hover:-translate-y-0.5'}
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </>
              ) : (
                'Create Project'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}