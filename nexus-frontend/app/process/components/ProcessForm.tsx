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
    <form onSubmit={handleCreate} className="space-y-4 mb-6 border p-4 rounded">
      {error && <p className="text-red-500">{error}</p>}

      <div>
        <label className="block font-medium">Process:</label>
        <input
          type="text"
          value={processName}
          onChange={e => setProcessName(e.target.value)}
          required
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label className="block font-medium">Category:</label>
        <input
          type="text"
          value={category}
          onChange={e => setCategory(e.target.value)}
          required
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label className="block font-medium">Start Date:</label>
        <input
          type="date"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
          required
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label className="block font-medium">Tasks:</label>
        {tasks.map((t, i) => (
          <div key={i} className="flex items-center gap-2 my-2">
            <input
              placeholder="Task name"
              value={t.name}
              onChange={e => updateTask(i, 'name', e.target.value)}
              required
              className="flex-1 border p-2 rounded"
            />
            <input
              type="number"
              placeholder="Days"
              value={t.days}
              onChange={e => updateTask(i, 'days', e.target.value)}
              required
              className="w-20 border p-2 rounded"
            />
            {tasks.length > 1 && (
              <button
                type="button"
                onClick={() => removeTask(i)}
                className="text-red-500"
              >
                ×
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addTask}
          className="text-blue-600 hover:underline"
        >
          + Add Task
        </button>
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {onSubmit ? 'Update Progress' : 'Create Progress'}
      </button>
    </form>
  )
}
