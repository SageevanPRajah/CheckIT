'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authFetch } from '@/lib/api'

// the shape of the data the form works with
export type FormValues = {
    processName: string
    category:    string
    startDate:   string
    tasks:       { name: string; days: string }[]
  }
  
  interface ProcessFormProps {
    initialData?: FormValues
    onSubmit?: (formVals: FormValues) => Promise<void>
  }

  export default function ProcessForm({ initialData, onSubmit }: ProcessFormProps) {
    const router = useRouter()
    // initialize from props or empty
    const [processName, setProcessName] = useState(initialData?.processName || '')
    const [category,    setCategory]    = useState(initialData?.category || '')
    const [startDate,   setStartDate]   = useState(initialData?.startDate || '')
    const [tasks, setTasks] = useState<FormValues['tasks']>(
      initialData?.tasks || [{ name: '', days: '' }]
    )
    const [error, setError] = useState('')

  const addTask = () => setTasks(ts => [...ts, { name: '', days: '' }])
  const removeTask = (idx: number) =>
    setTasks(ts => ts.filter((_, i) => i !== idx))
  const updateTask = (idx: number, field: 'name' | 'days', value: string) => {
    setTasks(ts => {
      const copy = [...ts]
      copy[idx][field] = value
      return copy
    })
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // collect all values into formVals
   const formVals: FormValues = {
       processName,
       category,
       startDate,
       tasks,
     }

    try {
      if (onSubmit) {
                await onSubmit(formVals)
              } else {
                await authFetch('/progress', {
                  method: 'POST',
                  body: {
                    processName,
                    category,
                    startDate,
                    tasks: tasks.map(t => ({
                      name: t.name,
                      days: parseInt(t.days, 10),
                    })),
                  },
                })
                // reset after create
                setProcessName('')
                setCategory('')
                setStartDate('')
                setTasks([{ name: '', days: '' }])
                router.refresh()
              }
    } catch (err: any) {
      setError(err.message || 'Failed to create progress')
    }
  }

  return (
    <form
      onSubmit={handleCreate}
      className="space-y-6 mb-6 bg-blue-50 p-6 rounded-lg shadow-md"
    >
      {error && <p className="text-red-600 font-medium">{error}</p>}

      {/* Process & Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1">Process Name</label>
          <input
            type="text"
            value={processName}
            onChange={e => setProcessName(e.target.value)}
            required
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-200"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Category</label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            required
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-200"
          >
            <option value="">Select a category</option>
            <option value="Development">Development</option>
            <option value="Databases">Databases</option>
            <option value="Project Management">Project Management</option>
            <option value="Data Structures & Algorithms">Data Structures & Algorithms</option>
          </select>
        </div>
      </div>

      {/* Start Date */}
      <div>
        <label className="block text-sm font-semibold mb-1">Start Date</label>
        <input
          type="date"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
          required
          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-200"
        />
      </div>

      {/* Tasks Section */}
      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold">Tasks</legend>

        {tasks.map((t, i) => (
          <div
            key={i}
            className="flex flex-col md:flex-row md:items-center gap-3 bg-white p-4 rounded-lg shadow-sm"
          >
            <input
              placeholder="Task name"
              value={t.name}
              onChange={e => updateTask(i, "name", e.target.value)}
              required
              className="flex-1 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-200"
            />
            <input
              type="number"
              placeholder="Days"
              value={t.days}
              onChange={e => updateTask(i, "days", e.target.value)}
              required
              className="w-24 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-200"
            />
            {tasks.length > 1 && (
              <button
                type="button"
                onClick={() => removeTask(i)}
                className="text-red-500 hover:text-red-700 transition-colors"
                title="Remove task"
              >
                ×
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={addTask}
          className="text-blue-600 hover:underline text-sm font-medium"
        >
          + Add another task
        </button>
      </fieldset>

      {/* Submit */}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
      >
        {onSubmit ? "Update Progress" : "Create Progress"}
      </button>
    </form>
  )
}
