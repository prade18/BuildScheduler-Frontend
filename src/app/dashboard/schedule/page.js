'use client'

import { useState, useEffect, Fragment } from 'react'
import {
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  format,
  isSameMonth,
  isSameDay,
} from 'date-fns'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline' // Importing an icon for closing the modal

export default function SchedulePage() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [slots, setSlots] = useState([]) // Stores available slots from the API
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false) // New loading state for fetching slots

  // Helper function to get token (can be replaced with Redux/Context if available)
  const getToken = () => {
    // Assuming token is stored in localStorage
    return localStorage.getItem('token')
  }

  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))

  const openModal = (date) => {
    setSelectedDate(date)
    setStartTime('')
    setEndTime('')
    setErrorMessage('')
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
    setSelectedDate(null) // Clear selected date on close
  }

  // Fetching all availability slots for the worker
  const fetchSlots = async () => {
    setLoading(true) // Start loading
    try {
      const token = getToken()
      if (!token) {
        console.error('No authentication token found.')
        setErrorMessage('You are not authenticated. Please log in.')
        setLoading(false)
        return
      }

      const res = await fetch(`http://localhost:8080/api/worker/profile/availability/all`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include' // Important for sending cookies if your backend uses them
      })

      const data = await res.json() // Directly parse as JSON, check for errors

      if (res.ok && data.success) {
        setSlots(data.data || [])
      } else {
        const message = data?.message || res.statusText || 'Failed to fetch slots: Unknown error'
        setErrorMessage(message)
        console.warn('Failed to fetch slots:', message)
      }
    } catch (err) {
      setErrorMessage(err.message || 'Error fetching slots.')
      console.error('Error fetching slots:', err)
    } finally {
      setLoading(false) // End loading
    }
  }

  // Function to save a new availability slot
  const saveSlot = async () => {
    if (!startTime || !endTime) {
      setErrorMessage('Please select both start and end times.')
      return
    }

    const payload = {
      date: format(selectedDate, 'yyyy-MM-dd'),
      startTime,
      endTime
    }

    try {
      const token = getToken()
      if (!token) {
        setErrorMessage('Authentication token missing. Please log in.')
        return
      }

      const res = await fetch('http://localhost:8080/api/worker/profile/availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
        credentials: 'include'
      })

      const data = await res.json() // Directly parse as JSON

      if (res.ok && data.success) {
        fetchSlots() // Refresh slots after successful save
        closeModal() // Close modal on success
      } else {
        const message = data?.message || res.statusText || 'Failed to add slot: Unknown error'
        if (res.status === 409) {
          setErrorMessage('This slot overlaps with an existing availability.')
        } else {
          setErrorMessage(message)
        }
      }
    } catch (err) {
      setErrorMessage(err.message || 'Something went wrong while saving.')
      console.error('Error saving slot:', err)
    }
  }

  // Function to delete an availability slot by its ID
  const deleteSlot = async (slotId) => {
    if (!confirm('Are you sure you want to delete this availability slot?')) {
      return
    }
    try {
      const token = getToken()
      if (!token) {
        console.error('No authentication token found for deletion.')
        return
      }

      // Correct API call with slotId in the path
      const res = await fetch(`http://localhost:8080/api/worker/profile/availability/${slotId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
        credentials: 'include'
      })

      if (res.ok) {
        fetchSlots() // Refresh slots after successful deletion
      } else {
        const data = await res.json(); // Try to get error message from response body
        console.warn('Failed to delete slot:', data?.message || res.statusText);
        alert(data?.message || 'Failed to delete slot.');
      }
    } catch (err) {
      console.error('Error deleting slot:', err);
      alert('An error occurred while deleting the slot.');
    }
  }

  // --- Calendar Rendering Logic ---
  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center mb-6 px-4 py-2 bg-white rounded-lg shadow-md">
        <button onClick={prevMonth} className="p-2 text-gray-700 hover:bg-gray-100 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-3xl font-bold text-gray-800">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <button onClick={nextMonth} className="p-2 text-gray-700 hover:bg-gray-100 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    )
  }

  const renderDays = () => {
    const days = []
    const dateFormat = 'EEE' // Mon, Tue, Wed
    let startDate = startOfWeek(currentMonth, { weekStartsOn: 1 }) // Monday as start of week

    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="text-sm font-medium text-gray-600 text-center py-2" key={i}>
          {format(addDays(startDate, i), dateFormat)}
        </div>
      )
    }
    return <div className="grid grid-cols-7 border-b border-gray-200">{days}</div>
  }

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 })
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 })

    const rows = []
    let days = []
    let day = startDate
    let formattedDate = ''

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, 'd')
        const dateStr = format(day, 'yyyy-MM-dd')
        const slotForThisDay = slots.find((s) => s.date === dateStr)
        const dayToRender = day // Capture day for closure

        days.push(
          <div
            key={dayToRender.toISOString()}
            className={`
              p-2 h-32 flex flex-col cursor-pointer transition-colors duration-200
              ${!isSameMonth(dayToRender, currentMonth) ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-900'}
              ${isSameDay(dayToRender, new Date()) ? 'border-2 border-blue-500 rounded-lg' : 'border border-gray-200'}
              hover:bg-blue-50
            `}
            onClick={() => openModal(dayToRender)}
          >
            <span className="font-bold text-lg text-right">{formattedDate}</span>
            <div className="flex-grow flex items-center justify-center p-1 overflow-hidden">
              {loading ? (
                <span className="text-gray-400 text-sm">Loading...</span>
              ) : slotForThisDay ? (
                <div className="text-center w-full">
                  <div className="text-blue-700 font-semibold text-sm">
                    {slotForThisDay.startTime} - {slotForThisDay.endTime}
                  </div>
                  <div className="text-green-600 text-xs mt-1">Available</div>
                  {/* Styled Delete Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation() // Prevent opening modal when deleting
                      deleteSlot(slotForThisDay.id) // Use slot ID for deletion
                    }}
                    className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
                  >
                    Delete
                  </button>
                </div>
              ) : (
                <div className="text-gray-400 text-sm text-center">Click to set</div>
              )}
            </div>
          </div>
        )
        day = addDays(day, 1)
      }
      rows.push(
        <div className="grid grid-cols-7 w-full" key={day.toISOString()}>
          {days}
        </div>
      )
      days = []
    }
    return <div className="w-full border-t border-l border-r border-gray-200 rounded-lg overflow-hidden shadow-xl">{rows}</div>
  }

  // Fetch slots on component mount and when currentMonth changes
  useEffect(() => {
    fetchSlots()
  }, [currentMonth]) // Dependency on currentMonth to re-fetch when month changes

  return (
    <div className="p-6 w-full min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 font-sans">
      <div className="max-w-4xl mx-auto">
        {renderHeader()}
        {renderDays()}
        {renderCells()}
      </div>

      {/* Availability Modal */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            leave="ease-in duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-40" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto flex items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="bg-white p-7 rounded-2xl shadow-2xl w-full max-w-md transform transition-all relative">
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
                <Dialog.Title className="text-2xl font-bold text-gray-800 mb-5">
                  Set Availability for: {selectedDate && format(selectedDate, 'PPP')}
                </Dialog.Title>

                {errorMessage && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-sm">{errorMessage}</div>}

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                    <input
                      type="time"
                      id="startTime"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                    <input
                      type="time"
                      id="endTime"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={closeModal}
                    className="px-5 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  {/* Styled Save Button */}
                  <button
                    onClick={saveSlot}
                    className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 font-medium"
                  >
                    Save Availability
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  )
}