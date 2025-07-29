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
import { XMarkIcon } from '@heroicons/react/24/outline'

export default function SchedulePage() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [slots, setSlots] = useState([]) // Stores all availability slots
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)

  // Helper to get auth token
  const getToken = () => localStorage.getItem('token')

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
    setSelectedDate(null)
  }

  // Fetch all availability slots
  const fetchSlots = async () => {
    setLoading(true)
    try {
      const token = getToken()
      if (!token) {
        setErrorMessage('You are not authenticated. Please log in.')
        return
      }

      const res = await fetch(`http://localhost:8080/api/worker/profile/availability/all`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setSlots(data.data || [])
      } else {
        setErrorMessage(data.message || 'Failed to fetch availability.')
      }
    } catch (err) {
      setErrorMessage(err.message || 'Error fetching availability.')
      console.error('Fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Save a new availability slot
  const saveSlot = async () => {
    if (!startTime || !endTime) {
      setErrorMessage('Please select both start and end times.')
      return
    }

    const payload = {
      date: format(selectedDate, 'yyyy-MM-dd'),
      startTime,
      endTime,
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
        credentials: 'include',
      })

      const data = await res.json()

      if (res.ok && data.success) {
        fetchSlots() // Refresh slots
        closeModal()
      } else {
        if (res.status === 409) {
          setErrorMessage('This slot overlaps with an existing availability.')
        } else {
          setErrorMessage(data.message || 'Failed to add slot.')
        }
      }
    } catch (err) {
      setErrorMessage(err.message || 'Something went wrong while saving.')
      console.error('Save error:', err)
    }
  }

  // Delete a specific slot by ID
  const deleteSlot = async (slotId) => {
    if (!confirm('Are you sure you want to delete this availability slot?')) return

    try {
      const token = getToken()
      if (!token) return

      const res = await fetch(`http://localhost:8080/api/worker/profile/availability/${slotId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      })

      if (res.ok) {
        fetchSlots() // Refresh after deletion
      } else {
        const data = await res.json()
        alert(data.message || 'Failed to delete slot.')
      }
    } catch (err) {
      console.error('Delete error:', err)
      alert('An error occurred while deleting the slot.')
    }
  }

  // Group slots by date for easier access
  const slotsByDate = slots.reduce((acc, slot) => {
    const dateKey = slot.date
    if (!acc[dateKey]) acc[dateKey] = []
    acc[dateKey].push(slot)
    return acc
  }, {})

  // --- Calendar Rendering ---
  const renderHeader = () => (
    <div className="flex justify-between items-center mb-6 px-4 py-2 bg-white rounded-lg shadow-md">
      <button onClick={prevMonth} className="p-2 text-gray-700 hover:bg-gray-100 rounded-full">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <h2 className="text-3xl font-bold text-gray-800">{format(currentMonth, 'MMMM yyyy')}</h2>
      <button onClick={nextMonth} className="p-2 text-gray-700 hover:bg-gray-100 rounded-full">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )

  const renderDays = () => {
    const days = []
    const dateFormat = 'EEE'
    let startDate = startOfWeek(currentMonth, { weekStartsOn: 1 })

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

    while (day <= endDate) {
      const formattedDate = format(day, 'd')
      const dateStr = format(day, 'yyyy-MM-dd')
      const dailySlots = slotsByDate[dateStr] || []

      const dayToRender = day
      days.push(
        <div
          key={dayToRender.toISOString()}
          className={`
            p-2 h-36 flex flex-col cursor-pointer transition-colors duration-200
            ${!isSameMonth(dayToRender, currentMonth) ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-900'}
            ${isSameDay(dayToRender, new Date()) ? 'border-2 border-blue-500 rounded-lg' : 'border border-gray-200'}
            hover:bg-blue-50
          `}
          onClick={() => openModal(dayToRender)}
        >
          <span className="font-bold text-lg">{formattedDate}</span>

          <div className="flex-grow flex flex-col justify-center gap-1 overflow-y-auto px-1">
            {loading ? (
              <span className="text-gray-400 text-xs">Loading...</span>
            ) : dailySlots.length > 0 ? (
              dailySlots.map((slot) => (
                <div
                  key={slot.id}
                  className="bg-blue-50 border border-blue-200 rounded-md p-1 text-xs text-center relative"
                >
                  <div className="text-blue-800 font-semibold">
                    {slot.startTime} - {slot.endTime}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteSlot(slot.id)
                    }}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center hover:bg-red-600 transition"
                  >
                    ×
                  </button>
                </div>
              ))
            ) : (
              <div className="text-gray-400 text-xs text-center">Click to set</div>
            )}
          </div>
        </div>
      )

      day = addDays(day, 1)

      // Push row every 7 days
      if (days.length === 7) {
        rows.push(
          <div className="grid grid-cols-7 w-full" key={day.toISOString()}>
            {days}
          </div>
        )
        days = []
      }
    }

    return (
      <div className="w-full border-t border-l border-r border-gray-200 rounded-lg overflow-hidden shadow-xl">
        {rows}
      </div>
    )
  }

  useEffect(() => {
    fetchSlots()
  }, [currentMonth])

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
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
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

                {errorMessage && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
                    {errorMessage}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                      Start Time
                    </label>
                    <input
                      type="time"
                      id="startTime"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
                      End Time
                    </label>
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