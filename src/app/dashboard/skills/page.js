'use client'

import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

export default function SkillsPage() {
  const [skills, setSkills] = useState([])
  const [newSkill, setNewSkill] = useState('')
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const { token } = useSelector((state) => state.auth)

  useEffect(() => {
    if (!token) return

    const fetchSkills = async () => {
      setLoading(true)
      try {
        const res = await fetch('http://localhost:8080/api/worker/profile/skills', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        const data = await res.json()
        if (res.ok && data.success) {
          setSkills(data.data || [])
        } else {
          console.error('Failed to fetch skills:', data.message)
        }
      } catch (err) {
        console.error('Error fetching skills:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchSkills()
  }, [token])

  const handleInputChange = (e) => {
    const value = e.target.value
    setNewSkill(value)

    const filtered = skills
      .map((s) => s.name)
      .filter((name) => name.toLowerCase().startsWith(value.toLowerCase()))
    setSuggestions(filtered)
  }

  const handleSelectSuggestion = (name) => {
    setNewSkill(name)
    setSuggestions([])
  }

  const handleAddSkill = async () => {
    if (!newSkill.trim()) return
    try {
      const res = await fetch('http://localhost:8080/api/worker/profile/skills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name: newSkill.trim() })
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setSkills((prev) => [...prev, data.data])
        setNewSkill('')
        setSuggestions([])
      } else {
        alert(data.message || 'Failed to add skill')
      }
    } catch (err) {
      console.error('Error adding skill:', err)
    }
  }

  const handleDeleteSkill = async (skillId) => {
    try {
      const res = await fetch(`http://localhost:8080/api/worker/profile/skills/${skillId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setSkills((prev) => prev.filter((s) => s.id !== skillId))
      } else {
        alert(data.message || 'Failed to delete skill')
      }
    } catch (err) {
      console.error('Error deleting skill:', err)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">My Skills</h2>

      {/* Add Skill
      <div className="relative w-full max-w-md">
        <input
          type="text"
          value={newSkill}
          onChange={handleInputChange}
          placeholder="Enter a skill"
          className="border px-3 py-2 rounded w-full"
        />
        {suggestions.length > 0 && (
          <ul className="absolute z-10 bg-white border border-gray-300 rounded mt-1 w-full shadow-md">
            {suggestions.map((s, i) => (
              <li
                key={i}
                onClick={() => handleSelectSuggestion(s)}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              >
                {s}
              </li>
            ))}
          </ul>
        )}
        <button
          onClick={handleAddSkill}
          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
        >
          Add
        </button>
      </div> */}
        {/* Add Skill */}
<div className="relative w-full max-w-md">
  <div className="flex gap-2">
    <input
      type="text"
      value={newSkill}
      onChange={handleInputChange}
      placeholder="Enter a skill"
      className="border px-3 py-2 rounded w-full"
    />
    <button
      onClick={handleAddSkill}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    >
      Add
    </button>
  </div>

  {suggestions.length > 0 && (
    <ul className="absolute z-10 bg-white border border-gray-300 rounded mt-1 w-full shadow-md">
      {suggestions.map((s, i) => (
        <li
          key={i}
          onClick={() => handleSelectSuggestion(s)}
          className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
        >
          {s}
        </li>
      ))}
    </ul>
  )}
</div>


      {/* View Skills */}
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <ul className="space-y-2">
          {skills.length === 0 ? (
            <li className="text-gray-500">No skills added yet.</li>
          ) : (
            skills.map((skill) => (
              <li
                key={skill.id}
                className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded"
              >
                <span>{skill.name}</span>
                <button
                  onClick={() => handleDeleteSkill(skill.id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Delete
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  )
}


