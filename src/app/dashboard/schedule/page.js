//   useEffect(() => {
//     fetchSlots()
//   }, [currentWeekStart])

//   return (
//     <div className="p-6 w-full h-[calc(100vh-4rem)] overflow-y-auto bg-gray-50">
//       <div className="flex justify-between items-center mb-4">
//         <button onClick={prevWeek} className="text-xl p-2 hover:bg-gray-200 rounded">←</button>
//         <h1 className="text-2xl font-bold">2-Week Schedule</h1>
//         <button onClick={nextWeek} className="text-xl p-2 hover:bg-gray-200 rounded">→</button>
//       </div>

//       <div className="space-y-6 bg-white p-4 rounded shadow">
//         {[0, 7].map((offset) => (
//           <div key={offset} className="grid grid-cols-7 gap-2">
//             {Array.from({ length: 7 }, (_, i) => {
//               const date = addDays(currentWeekStart, offset + i)
//               const dateLabel = format(date, 'EEE dd MMM')
//               const dateStr = format(date, 'yyyy-MM-dd')

//               return (
//                 <div
//                   key={dateStr}
//                   className="border p-2 rounded hover:bg-blue-50 cursor-pointer"
//                   onClick={() => openModal(date)}
//                 >
//                   <div className="text-center font-semibold text-sm mb-2">{dateLabel}</div>
//                   <div className="bg-gray-100 rounded border border-dashed border-gray-300 p-2 flex items-center justify-center text-sm">
//                     {renderSlot(dateStr)}
//                   </div>
//                 </div>
//               )
//             })}
//           </div>
//         ))}
//       </div>

//       {/* Modal */}
//       <Transition appear show={isOpen} as={Fragment}>
//         <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
//           <Transition.Child
//             as={Fragment}
//             enter="ease-out duration-300" leave="ease-in duration-200"
//             enterFrom="opacity-0" enterTo="opacity-100"
//             leaveFrom="opacity-100" leaveTo="opacity-0"
//           >
//             <div className="fixed inset-0 bg-black bg-opacity-30" />
//           </Transition.Child>

//           <div className="fixed inset-0 overflow-y-auto flex items-center justify-center">
//             <Dialog.Panel className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
//               <Dialog.Title className="text-xl font-bold mb-4">
//                 Set Availability: {selectedDate && format(selectedDate, 'PPP')}
//               </Dialog.Title>

//               {errorMessage && (
//                 <div className="text-red-600 text-sm mb-3">{errorMessage}</div>
//               )}

//               <div className="mb-4">
//                 <label className="block text-sm font-medium mb-1">Start Time</label>
//                 <input
//                   type="time"
//                   value={startTime}
//                   onChange={(e) => setStartTime(e.target.value)}
//                   className="w-full border px-3 py-2 rounded"
//                 />
//               </div>

//               <div className="mb-4">
//                 <label className="block text-sm font-medium mb-1">End Time</label>
//                 <input
//                   type="time"
//                   value={endTime}
//                   onChange={(e) => setEndTime(e.target.value)}
//                   className="w-full border px-3 py-2 rounded"
//                 />
//               </div>

//               <div className="flex justify-end gap-3">
//                 <button onClick={() => setIsOpen(false)} className="px-4 py-2 rounded bg-gray-200">Cancel</button>
//                 <button onClick={saveSlot} className="px-4 py-2 rounded bg-blue-600 text-white">Save</button>
//               </div>
//             </Dialog.Panel>
//           </div>
//         </Dialog>
//       </Transition>
//     </div>
//   )
// }




'use client'

import { useState, useEffect } from 'react'
import { addDays, format, startOfWeek } from 'date-fns'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'

export default function SchedulePage() {
  const [currentViewStart, setCurrentViewStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }))
  const [selectedDate, setSelectedDate] = useState(null)
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [slots, setSlots] = useState([])
  const [errorMessage, setErrorMessage] = useState('')

  const nextTwoWeeks = () => setCurrentViewStart(addDays(currentViewStart, 14))
  const prevTwoWeeks = () => setCurrentViewStart(addDays(currentViewStart, -14))

  const openModal = (date) => {
    setSelectedDate(date)
    setStartTime('')
    setEndTime('')
    setErrorMessage('')
    setIsOpen(true)
  }

  const fetchSlots = async () => {
    const start = format(currentViewStart, 'yyyy-MM-dd')
    const end = format(addDays(currentViewStart, 13), 'yyyy-MM-dd')

    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`http://localhost:8080/api/worker/profile/availability?start=${start}&end=${end}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
        credentials: 'include'
      })

      const text = await res.text()
      const data = text ? JSON.parse(text) : {}

      if (res.ok) {
        setSlots(data.data || [])
      } else {
        const message = data?.message || res.statusText || 'Empty response from server'
        console.warn('Failed to fetch slots:', message)
      }
    } catch (err) {
      console.error('Error fetching slots:', err.message || err)
    }
  }

  const saveSlot = async () => {
    const payload = {
      date: format(selectedDate, 'yyyy-MM-dd'),
      startTime,
      endTime
    }

    try {
      const token = localStorage.getItem('token')
      const res = await fetch('http://localhost:8080/api/worker/profile/availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
        credentials: 'include'
      })

      const text = await res.text()
      const data = text ? JSON.parse(text) : {}

      if (res.ok) {
        fetchSlots()
        setIsOpen(false)
      } else if (res.status === 409) {
        setErrorMessage('This slot is already booked.')
      } else {
        const message = data?.message || res.statusText || 'Empty response from server'
        setErrorMessage(message)
      }
    } catch (err) {
      setErrorMessage(err.message || 'Something went wrong.')
    }
  }

  const deleteSlot = async (dateStr) => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`http://localhost:8080/api/worker/profile/availability/${dateStr}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
        credentials: 'include'
      })

      if (res.ok) {
        fetchSlots()
      } else {
        console.warn('Failed to delete slot:', res.statusText)
      }
    } catch (err) {
      console.error('Error deleting slot:', err)
    }
  }

  const renderSlot = (dateStr) => {
    const slot = slots.find((s) => s.date === dateStr)
    if (!slot) return <div className="text-gray-400 text-sm text-center">Click to set</div>

    return (
      <div className="text-center">
        <div className="text-blue-600 font-medium text-sm">{slot.startTime} - {slot.endTime}</div>
        <div className="text-green-600 text-xs mt-1">Available</div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            deleteSlot(dateStr)
          }}
          className="mt-1 text-xs text-red-500 hover:underline"
        >
          Delete
        </button>
      </div>
    )
  }

  useEffect(() => {
    fetchSlots()
  }, [currentViewStart])

  return (
    <div className="p-6 w-full h-[calc(100vh-4rem)] overflow-y-auto bg-gray-50">
      <div className="flex justify-between items-center mb-4">
        <button onClick={prevTwoWeeks} className="text-xl p-2 hover:bg-gray-200 rounded">←</button>
        <h1 className="text-2xl font-bold">Bi-Weekly Schedule</h1>
        <button onClick={nextTwoWeeks} className="text-xl p-2 hover:bg-gray-200 rounded">→</button>
      </div>

      {[0, 7].map((offset) => (
        <div key={offset} className="flex border rounded-lg shadow h-[50vh] bg-white mb-4">
          {Array.from({ length: 7 }, (_, i) => {
            const date = addDays(currentViewStart, i + offset)
            const dateLabel = format(date, 'EEE dd MMM')
            const dateStr = format(date, 'yyyy-MM-dd')

            return (
              <div
                key={i}
                className="flex-1 border-r last:border-r-0 p-2 flex flex-col items-center hover:bg-blue-50 cursor-pointer"
                onClick={() => openModal(date)}
              >
                <div className="text-center font-semibold text-sm mb-2">{dateLabel}</div>
                <div className="flex-1 w-full bg-gray-100 rounded border border-dashed border-gray-300 p-2 flex items-center justify-center text-sm">
                  {renderSlot(dateStr)}
                </div>
              </div>
            )
          })}
        </div>
      ))}

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300" leave="ease-in duration-200"
            enterFrom="opacity-0" enterTo="opacity-100"
            leaveFrom="opacity-100" leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-30" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto flex items-center justify-center">
            <Dialog.Panel className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
              <Dialog.Title className="text-xl font-bold mb-4">
                Set Availability: {selectedDate && format(selectedDate, 'PPP')}
              </Dialog.Title>

              {errorMessage && <div className="text-red-600 text-sm mb-3">{errorMessage}</div>}

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Start Time</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">End Time</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button onClick={() => setIsOpen(false)} className="px-4 py-2 rounded bg-gray-200">Cancel</button>
                <button onClick={saveSlot} className="px-4 py-2 rounded bg-blue-600 text-white">Save</button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>
    </div>
  )
}






































