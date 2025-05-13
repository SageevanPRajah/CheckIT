'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authFetch } from '@/lib/api'
import { Edit2, Trash2 } from 'lucide-react'

interface Task {
  id: number
  name: string
  days: number
  completed: boolean
}

interface Progress {
  id: number
  processName: string
  category: string
  startDate: string
  tasks: Task[]
}

export default function ProcessFeed() {
  const router = useRouter()
  const [items, setItems] = useState<Progress[]>([])

  useEffect(() => {
    async function load() {
      try {
        const data = await authFetch<Progress[]>('/progress')
        setItems(data)
      } catch (err) {
        console.error('Failed to load progress', err)
      }
    }
    load()
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Really delete this process?')) return
    try {
      await authFetch(`/progress/${id}`, { method: 'DELETE' })
      setItems(prev => prev.filter(p => p.id !== id))
    } catch (err) {
      console.error('Failed to delete process', err)
      alert('Failed to delete process')
    }
  }

  return (
    <div className="space-y-4">
      {items.map(p => (
        <div key={p.id} className="p-4 border rounded shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">{p.processName}</h3>
              <p className="text-sm text-gray-600">Category: {p.category}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => router.push(`/process/${p.id}/edit`)}
                className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
              >
                <Edit2 size={16} />
                <span>Edit</span>
              </button>
              <button
                onClick={() => handleDelete(p.id)}
                className="flex items-center gap-1 text-red-600 hover:text-red-800"
              >
                <Trash2 size={16} />
                <span>Delete</span>
              </button>
            </div>
          </div>

          <p className="mt-1 text-sm">
            Start Date: {new Date(p.startDate).toLocaleDateString()}
          </p>

          <ul className="mt-2 list-disc list-inside">
            {p.tasks.map(t => (
              <li key={t.id} className="text-sm">
                {t.name} — {t.days} day{t.days !== 1 ? 's' : ''} —{' '}
                {t.completed ? 'Complete' : 'Pending'}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
