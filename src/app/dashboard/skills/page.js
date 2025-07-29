'use client'

import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

export default function SkillsPage() {
  const [skills, setSkills] = useState([]) // These are the user's added skills
  const [allAvailableSkills, setAllAvailableSkills] = useState([]) // New state for all skills from DB
  const [newSkill, setNewSkill] = useState('')
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const { token } = useSelector((state) => state.auth)

  // Fetch user's existing skills
  useEffect(() => {
    if (!token) return

    const fetchUserSkills = async () => {
      setLoading(true)
      try {
        const res = await fetch(
          'http://localhost:8080/api/worker/profile/my-skills', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        const data = await res.json()
        if (res.ok && data.success) {
          setSkills(data.data || [])
        } else {
          console.error('Failed to fetch user skills:', data.message)
        }
      } catch (err) {
        console.error('Error fetching user skills:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchUserSkills()
  }, [token])

  // New useEffect to fetch ALL available skills for suggestions
  useEffect(() => {
    const fetchAllAvailableSkills = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/worker/profile/skills', {
          headers: {
            Authorization: `Bearer ${token}` // Still pass token if API requires
          }
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setAllAvailableSkills(data.data || []);
        } else {
          console.error('Failed to fetch all available skills:', data.message);
        }
      } catch (err) {
        console.error('Error fetching all available skills:', err);
      }
    };

    if (token) { // Only fetch if token exists
      fetchAllAvailableSkills();
    }
  }, [token]); // Re-fetch if token changes

  const handleInputChange = (e) => {
    const value = e.target.value
    setNewSkill(value)

    if (value.length > 0) { // Only show suggestions if input is not empty
      const filtered = allAvailableSkills
        .filter((s) => s.name.toLowerCase().startsWith(value.toLowerCase()))
        .map((s) => s.name); // Get only the names for suggestions
      setSuggestions(filtered)
    } else {
      setSuggestions([]) // Clear suggestions if input is empty
    }
  }

  const handleSelectSuggestion = (name) => {
    setNewSkill(name)
    setSuggestions([])
  }

  const handleAddSkill = async () => {
    if (!newSkill.trim()) return
    // Prevent adding if skill already exists in user's skills
    if (skills.some(skill => skill.name.toLowerCase() === newSkill.trim().toLowerCase())) {
        alert('You already have this skill added.');
        setNewSkill('');
        setSuggestions([]);
        return;
    }

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
        <p className="text-gray-500">Loading your skills...</p>
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